import {DeviceEventEmitter, NativeModules, Platform} from 'react-native';

export type NotificationPermissionStatus = 'authorized' | 'denied' | 'unknown';

const {NotificationModule} = NativeModules;

/**
 * Check current notification listener permission status.
 * Android only — always returns 'unknown' on other platforms.
 */
export async function getNotificationPermissionStatus(): Promise<NotificationPermissionStatus> {
  if (Platform.OS !== 'android') {
    return 'unknown';
  }
  return NotificationModule.checkPermissionStatus();
}

/**
 * Opens Android Notification Access settings page.
 */
export function requestNotificationPermission(): void {
  if (Platform.OS !== 'android') {
    return;
  }
  NotificationModule.openNotificationAccess();
}

/**
 * Subscribe to incoming notifications via the native NotificationListener service.
 * Returns an unsubscribe function.
 */
export function subscribeToNotifications(callback: (notification: Record<string, unknown>) => void): () => void {
  if (Platform.OS !== 'android') {
    return () => {};
  }

  const subscription = DeviceEventEmitter.addListener('NotificationReceived', callback);

  return () => subscription.remove();
}
