import {persistReducer} from '@lib/storage/redux-storage';
import {storeKey} from '@redux-store/store-key';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface AndroidNotification {
  // Identity
  packageName: string;
  notificationId: number;
  tag: string;
  key: string;
  groupKey: string;
  isOngoing: boolean;
  isClearable: boolean;
  postTime: number;
  when: number;
  // Aliases kept for convenience
  time: string; // string form of postTime
  app: string; // alias for packageName
  // Text content
  title: string | null;
  titleBig: string | null;
  text: string | null;
  bigText: string | null;
  subText: string | null;
  summaryText: string | null;
  infoText: string | null;
  template: string | null;
  // Progress
  progress: number;
  progressMax: number;
  progressIndeterminate: boolean;
  // Notification metadata
  category: string | null;
  group: string | null;
  sortKey: string | null;
  color: number;
  number: number;
  visibility: number;
  channelId: string | null;
  badgeIconType: number;
  actions: string[];
  // Legacy fields (kept for backward compat)
  audioContentsURI: string | null;
  imageBackgroundURI: string | null;
  extraInfoText: string | null;
  groupedMessages: Array<{title: string; text: string}>;
  icon: string | null;
  image: string | null;
}

interface NotificationState {
  permissionStatus: 'authorized' | 'denied' | 'unknown';
  notifications: AndroidNotification[];
  isListening: boolean;
}

const initialState: NotificationState = {
  permissionStatus: 'unknown',
  notifications: [],
  isListening: false,
};

const slice = createSlice({
  name: storeKey.Notification,
  initialState,
  reducers: {
    setPermissionStatus: (state, {payload}: PayloadAction<NotificationState['permissionStatus']>) => {
      state.permissionStatus = payload;
    },
    addNotification: (state, {payload}: PayloadAction<AndroidNotification>) => {
      state.notifications.unshift(payload);
    },
    clearNotifications: state => {
      state.notifications = [];
    },
    setIsListening: (state, {payload}: PayloadAction<boolean>) => {
      state.isListening = payload;
    },
    onReset: () => initialState,
  },
});

export const notification_action = slice.actions;
export const NotificationReducer = persistReducer({key: storeKey.Notification}, slice.reducer);
