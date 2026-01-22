export interface SessionReminder {
  id: string;
  time: string; // "08:00", "08:30", "09:30" in NY timezone
  hour: number;
  minute: number;
  title: string;
  body: string;
  cronExpression: string;
  enabled: boolean;
}

export interface PushSubscription {
  id: string;
  userId: string;
  type: 'web' | 'expo' | 'fcm';
  token?: string;
  subscription?: WebPushSubscription;
  deviceName?: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WebPushSubscription {
  endpoint: string;
  expirationTime?: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  url?: string;
  data?: Record<string, unknown>;
}

export interface NotificationSettings {
  sessionReminders: boolean;
  newsAlerts: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
}

export type NotificationType = 'session_start' | 'news_release' | 'indices_open' | 'custom';

export interface ScheduledNotification {
  id: string;
  type: NotificationType;
  payload: NotificationPayload;
  scheduledTime: Date;
  sent: boolean;
  sentAt?: Date;
}
