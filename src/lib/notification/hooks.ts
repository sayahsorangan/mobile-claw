import {useCallback, useEffect} from 'react';

import {useAppDispatch, useAppSelector} from '@app/hooks/redux';
import {deleteAllNotifications, getAllNotifications, insertNotification} from '@lib/db/notification-repository';
import {AndroidNotification, notification_action} from '@redux-store/slice/notification';

import {getNotificationPermissionStatus, requestNotificationPermission, subscribeToNotifications} from './index';

/**
 * Hook to manage Android notification listener permission.
 *
 * Usage:
 * ```tsx
 * const {permissionStatus, checkPermission, openPermissionSettings} = useNotificationPermission();
 * ```
 */
export function useNotificationPermission() {
  const dispatch = useAppDispatch();
  const permissionStatus = useAppSelector(state => state.NotificationReducer.permissionStatus);

  const checkPermission = useCallback(async () => {
    const status = await getNotificationPermissionStatus();
    dispatch(notification_action.setPermissionStatus(status));
    return status;
  }, [dispatch]);

  const openPermissionSettings = useCallback(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return {permissionStatus, checkPermission, openPermissionSettings};
}

/**
 * Hook to listen for incoming Android notifications.
 * Automatically starts/stops the listener based on mount/unmount.
 *
 * Requires notification listener permission to be granted first.
 * Use `useNotificationPermission` to check and request permission.
 *
 * Usage:
 * ```tsx
 * const {notifications, isListening, clearNotifications} = useNotificationListener();
 * ```
 */
export function useNotificationListener() {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(state => state.NotificationReducer.notifications);
  const isListening = useAppSelector(state => state.NotificationReducer.isListening);

  useEffect(() => {
    dispatch(notification_action.setIsListening(true));

    const unsubscribe = subscribeToNotifications(raw => {
      const p = raw as Record<string, unknown>;

      const notification: AndroidNotification = {
        // Identity
        packageName: (p.packageName as string) ?? '',
        notificationId: (p.notificationId as number) ?? 0,
        tag: (p.tag as string) ?? '',
        key: (p.key as string) ?? '',
        groupKey: (p.groupKey as string) ?? '',
        isOngoing: (p.isOngoing as boolean) ?? false,
        isClearable: (p.isClearable as boolean) ?? true,
        postTime: (p.postTime as number) ?? 0,
        when: (p.when as number) ?? 0,
        // Convenience aliases
        time: p.postTime ? String(p.postTime) : '',
        app: (p.packageName as string) ?? '',
        // Text content
        title: (p.title as string) || null,
        titleBig: (p.titleBig as string) || null,
        text: (p.text as string) || null,
        bigText: (p.bigText as string) || null,
        subText: (p.subText as string) || null,
        summaryText: (p.summaryText as string) || null,
        infoText: (p.infoText as string) || null,
        template: (p.template as string) || null,
        // Progress
        progress: (p.progress as number) ?? 0,
        progressMax: (p.progressMax as number) ?? 0,
        progressIndeterminate: (p.progressIndeterminate as boolean) ?? false,
        // Notification metadata
        category: (p.category as string) || null,
        group: (p.group as string) || null,
        sortKey: (p.sortKey as string) || null,
        color: (p.color as number) ?? 0,
        number: (p.number as number) ?? 0,
        visibility: (p.visibility as number) ?? 0,
        channelId: (p.channelId as string) || null,
        badgeIconType: (p.badgeIconType as number) ?? 0,
        actions: Array.isArray(p.actions) ? (p.actions as string[]) : [],
        // Legacy
        audioContentsURI: null,
        imageBackgroundURI: null,
        extraInfoText: null,
        groupedMessages: [],
        icon: null,
        image: null,
      };
      const textContent =
        [notification.text, notification.bigText, notification.subText, notification.summaryText, notification.infoText]
          .filter(Boolean)
          .join(' ')
          .trim() || null;
      // Persist to SQLite — only the required fields
      // Using notification.key as the id deduplicates Android double-fire events
      insertNotification({
        key: notification.key || undefined,
        time: notification.time ?? '',
        app: notification.app ?? '',
        title: notification.title ?? null,
        text: textContent ?? null,
      });

      dispatch(notification_action.addNotification(notification));
    });

    return () => {
      dispatch(notification_action.setIsListening(false));
      unsubscribe();
    };
  }, [dispatch]);

  const clearNotifications = useCallback(() => {
    deleteAllNotifications();
    dispatch(notification_action.clearNotifications());
  }, [dispatch]);

  const loadFromDb = useCallback(() => {
    const rows = getAllNotifications();
    rows.forEach(row => {
      dispatch(
        notification_action.addNotification({
          // SQLite-persisted fields
          time: row.time,
          app: row.app,
          title: row.title,
          text: row.text,
          // Fields not stored in SQLite — use defaults
          packageName: row.app,
          notificationId: 0,
          tag: '',
          key: '',
          groupKey: '',
          isOngoing: false,
          isClearable: true,
          postTime: Number(row.time) || 0,
          when: 0,
          titleBig: null,
          bigText: null,
          subText: null,
          summaryText: null,
          infoText: null,
          template: null,
          progress: 0,
          progressMax: 0,
          progressIndeterminate: false,
          category: null,
          group: null,
          sortKey: null,
          color: 0,
          number: 0,
          visibility: 0,
          channelId: null,
          badgeIconType: 0,
          actions: [],
          audioContentsURI: null,
          imageBackgroundURI: null,
          extraInfoText: null,
          groupedMessages: [],
          icon: null,
          image: null,
        }),
      );
    });
  }, [dispatch]);

  return {notifications, isListening, clearNotifications, loadFromDb};
}
