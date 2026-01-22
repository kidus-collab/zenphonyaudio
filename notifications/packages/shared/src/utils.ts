import { toZonedTime, fromZonedTime } from 'date-fns-tz';
import { format, isWeekend, setHours, setMinutes } from 'date-fns';
import { NY_TIMEZONE, SESSION_REMINDERS } from './constants';
import type { SessionReminder, NotificationPayload } from './types';

/**
 * Get current time in NY timezone
 */
export function getNYTime(): Date {
  return toZonedTime(new Date(), NY_TIMEZONE);
}

/**
 * Convert NY time to UTC
 */
export function nyToUtc(nyDate: Date): Date {
  return fromZonedTime(nyDate, NY_TIMEZONE);
}

/**
 * Check if current time is during trading hours (weekday)
 */
export function isTradingDay(date: Date = new Date()): boolean {
  const nyTime = toZonedTime(date, NY_TIMEZONE);
  return !isWeekend(nyTime);
}

/**
 * Get the next occurrence of a session reminder
 */
export function getNextReminderTime(reminder: SessionReminder): Date {
  const now = getNYTime();
  let targetDate = setHours(setMinutes(now, reminder.minute), reminder.hour);

  // If the time has passed today, move to next occurrence
  if (targetDate <= now) {
    targetDate = new Date(targetDate.getTime() + 24 * 60 * 60 * 1000);
  }

  // Skip weekends
  while (isWeekend(targetDate)) {
    targetDate = new Date(targetDate.getTime() + 24 * 60 * 60 * 1000);
  }

  return nyToUtc(targetDate);
}

/**
 * Format time for display
 */
export function formatReminderTime(reminder: SessionReminder): string {
  return `${reminder.time} NY`;
}

/**
 * Get all upcoming reminders for today
 */
export function getTodayReminders(): SessionReminder[] {
  if (!isTradingDay()) return [];

  const now = getNYTime();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  return SESSION_REMINDERS.filter((reminder) => {
    const reminderMinutes = reminder.hour * 60 + reminder.minute;
    return reminder.enabled && reminderMinutes > currentMinutes;
  });
}

/**
 * Create notification payload from reminder
 */
export function createNotificationPayload(reminder: SessionReminder): NotificationPayload {
  return {
    title: reminder.title,
    body: reminder.body,
    tag: reminder.id,
    icon: '/zenphony-icon.svg',
    badge: '/zenphony-icon.svg',
    url: '/',
    data: {
      reminderId: reminder.id,
      time: reminder.time,
      timestamp: Date.now(),
    },
  };
}

/**
 * Calculate time until next reminder
 */
export function getTimeUntilNextReminder(): { reminder: SessionReminder; milliseconds: number } | null {
  const todayReminders = getTodayReminders();
  if (todayReminders.length === 0) return null;

  const nextReminder = todayReminders[0];
  const nextTime = getNextReminderTime(nextReminder);
  const milliseconds = nextTime.getTime() - Date.now();

  return { reminder: nextReminder, milliseconds };
}

/**
 * Format milliseconds to human readable string
 */
export function formatTimeUntil(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}

/**
 * Check if notifications are within quiet hours
 */
export function isQuietHours(quietStart?: string, quietEnd?: string): boolean {
  if (!quietStart || !quietEnd) return false;

  const now = getNYTime();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [startHour, startMin] = quietStart.split(':').map(Number);
  const [endHour, endMin] = quietEnd.split(':').map(Number);

  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  if (startMinutes < endMinutes) {
    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  } else {
    // Quiet hours span midnight
    return currentMinutes >= startMinutes || currentMinutes < endMinutes;
  }
}
