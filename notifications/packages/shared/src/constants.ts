import type { SessionReminder } from './types';

export const NY_TIMEZONE = 'America/New_York';

export const SESSION_REMINDERS: SessionReminder[] = [
  {
    id: 'session_start',
    time: '08:00',
    hour: 8,
    minute: 0,
    title: '🔔 NY Session Started',
    body: 'Get on the charts! NY session is now live.',
    cronExpression: '0 8 * * 1-5', // 8:00 AM Mon-Fri
    enabled: true,
  },
  {
    id: 'news_release',
    time: '08:30',
    hour: 8,
    minute: 30,
    title: '📰 News Release',
    body: 'Economic news incoming - check the calendar!',
    cronExpression: '30 8 * * 1-5', // 8:30 AM Mon-Fri
    enabled: true,
  },
  {
    id: 'indices_open',
    time: '09:30',
    hour: 9,
    minute: 30,
    title: '📈 Indices Open',
    body: 'US indices are now open for trading.',
    cronExpression: '30 9 * * 1-5', // 9:30 AM Mon-Fri
    enabled: true,
  },
];

export const NOTIFICATION_CHANNELS = {
  TRADING: {
    id: 'trading',
    name: 'Trading Alerts',
    description: 'Session reminders and market alerts',
    importance: 'high',
  },
  NEWS: {
    id: 'news',
    name: 'News Alerts',
    description: 'Economic news and data releases',
    importance: 'high',
  },
  GENERAL: {
    id: 'general',
    name: 'General',
    description: 'General notifications',
    importance: 'default',
  },
} as const;

export const DEFAULT_NOTIFICATION_SETTINGS = {
  sessionReminders: true,
  newsAlerts: true,
  soundEnabled: true,
  vibrationEnabled: true,
  quietHoursStart: undefined,
  quietHoursEnd: undefined,
};

export const APP_CONFIG = {
  name: 'Zenphony Trader',
  bundleId: 'com.zenphony.trader',
  appStoreId: '', // Add when published
  playStoreId: '', // Add when published
  website: 'https://zenphony.audio',
};
