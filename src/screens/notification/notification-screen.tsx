import React, {useCallback, useEffect, useRef, useState} from 'react';

import {ActivityIndicator, Alert, TouchableOpacity} from 'react-native';

import {useFocusEffect} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';

import {TAB_HEIGHT} from '@app/constan/dimensions';
import {Box, Text, useTheme} from '@app/themes';
import {Container} from '@components/container';
import {countNotifications, getNotificationsPaginated, NotificationRow} from '@lib/db/notification-repository';
import {useNotificationListener, useNotificationPermission} from '@lib/notification/hooks';
import {FlashList} from '@shopify/flash-list';

const PAGE_SIZE = 20;

// ─── Item ─────────────────────────────────────────────────────────────────────

const NotificationItem = React.memo(({item}: {item: NotificationRow}) => {
  const theme = useTheme();

  return (
    <Box flexDirection="row" paddingHorizontal="md" paddingVertical="sm" backgroundColor="white">
      <Box
        width={40}
        height={40}
        borderRadius="round"
        backgroundColor="primary_light"
        alignItems="center"
        justifyContent="center"
        marginRight="sm"
      >
        <Feather name="bell" size={18} color={theme.colors.primary} />
      </Box>
      <Box flex={1}>
        <Box flexDirection="row" justifyContent="space-between" alignItems="center">
          <Text variant="body_helper_semibold" color="primary" numberOfLines={1} flex={1}>
            {item.app}
          </Text>
          <Text variant="body_helper_regular" color="grey" marginLeft="xs">
            {item.time}
          </Text>
        </Box>
        {item.title ? (
          <Text variant="body_semibold" numberOfLines={1} marginTop="xxs">
            {item.title}
          </Text>
        ) : null}
        {item.text ? (
          <Text variant="body_helper_regular" color="grey" numberOfLines={2} marginTop="xxs">
            {item.text}
          </Text>
        ) : null}
      </Box>
    </Box>
  );
});

// ─── Separator ────────────────────────────────────────────────────────────────

const ItemSeparator = React.memo(() => <Box height={1} backgroundColor="grey_light" marginLeft="md" />);

// ─── Empty ────────────────────────────────────────────────────────────────────

const ListEmpty = React.memo(() => {
  const theme = useTheme();
  return (
    <Box flex={1} alignItems="center" justifyContent="center" paddingTop="xxl">
      <Feather name="bell-off" size={48} color={theme.colors.grey_light} />
      <Text variant="h_5_medium" color="grey" marginTop="md">
        No notifications yet
      </Text>
      <Text variant="body_helper_regular" color="grey" marginTop="xs" textAlign="center" paddingHorizontal="xl">
        Notifications from other apps will appear here
      </Text>
    </Box>
  );
});

// ─── Footer ───────────────────────────────────────────────────────────────────

const ListFooter = React.memo(({loading}: {loading: boolean}) => {
  if (!loading) return null;
  return (
    <Box paddingVertical="md" alignItems="center">
      <ActivityIndicator />
    </Box>
  );
});

// ─── Screen ───────────────────────────────────────────────────────────────────

const NotificationScreen: React.FC = () => {
  const [items, setItems] = useState<NotificationRow[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const pageRef = useRef(0);
  const hasMoreRef = useRef(true);
  const totalRef = useRef(0);

  // Permission
  const {checkPermission, openPermissionSettings} = useNotificationPermission();

  useFocusEffect(
    useCallback(() => {
      checkPermission().then(status => {
        if (status !== 'authorized') {
          Alert.alert(
            'Permission Required',
            'To read incoming notifications, please enable Notification Access for this app in your device settings.',
            [
              {text: 'Not Now', style: 'cancel'},
              {
                text: 'Open Settings',
                onPress: openPermissionSettings,
              },
            ],
          );
        }
      });
    }, [checkPermission, openPermissionSettings]),
  );

  // Start the Android notification listener while this screen is mounted
  const {notifications, clearNotifications} = useNotificationListener();
  const notifCountRef = useRef(notifications.length);

  const loadPage = useCallback((page: number, reset = false) => {
    const rows = getNotificationsPaginated(page, PAGE_SIZE);
    setItems(prev => (reset ? rows : [...prev, ...rows]));
    if (rows.length < PAGE_SIZE) {
      hasMoreRef.current = false;
    }
  }, []);

  // Reload from page 0 every time the tab is focused
  useFocusEffect(
    useCallback(() => {
      pageRef.current = 0;
      hasMoreRef.current = true;
      totalRef.current = countNotifications();
      notifCountRef.current = notifications.length;
      loadPage(0, true);
    }, [loadPage, notifications.length]),
  );

  // While on screen, prepend any new notification that arrives in real-time
  useEffect(() => {
    if (notifications.length > notifCountRef.current) {
      notifCountRef.current = notifications.length;
      pageRef.current = 0;
      hasMoreRef.current = true;
      loadPage(0, true);
    }
  }, [notifications.length, loadPage]);

  const handleEndReached = useCallback(() => {
    if (loadingMore || !hasMoreRef.current) return;
    setLoadingMore(true);
    const nextPage = pageRef.current + 1;
    pageRef.current = nextPage;
    // Use setTimeout to yield to the JS thread before the sync DB call
    setTimeout(() => {
      loadPage(nextPage);
      setLoadingMore(false);
    }, 0);
  }, [loadingMore, loadPage]);

  const handleClearAll = useCallback(() => {
    Alert.alert('Clear All', 'Remove all notifications?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => {
          clearNotifications();
          setItems([]);
          pageRef.current = 0;
          hasMoreRef.current = true;
          totalRef.current = 0;
        },
      },
    ]);
  }, [clearNotifications]);

  return (
    <Container>
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        paddingHorizontal="md"
        paddingTop="md"
        paddingBottom="xs"
      >
        <Text variant="h_5_semibold">Notifications</Text>
        {items.length > 0 ? (
          <TouchableOpacity onPress={handleClearAll}>
            <Text variant="body_helper_semibold" color="danger">
              Clear All
            </Text>
          </TouchableOpacity>
        ) : null}
      </Box>
      <FlashList
        data={items}
        keyExtractor={item => item.id}
        renderItem={({item}) => <NotificationItem item={item} />}
        ItemSeparatorComponent={ItemSeparator}
        ListEmptyComponent={ListEmpty}
        ListFooterComponent={<ListFooter loading={loadingMore} />}
        estimatedItemSize={72}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.3}
        contentContainerStyle={{paddingBottom: TAB_HEIGHT + 8}}
      />
    </Container>
  );
};

export default NotificationScreen;
