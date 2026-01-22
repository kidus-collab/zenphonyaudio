import { Notification, app, BrowserWindow } from 'electron';
import schedule from 'node-schedule';
import path from 'path';
import { SESSION_REMINDERS, NY_TIMEZONE } from '@zenphony/shared';
import type { SessionReminder } from '@zenphony/shared';

// Store scheduled jobs
const scheduledJobs: Map<string, schedule.Job> = new Map();

/**
 * Initialize notification scheduler for all session reminders
 */
export function initNotificationScheduler(mainWindow: BrowserWindow): void {
  // Cancel any existing schedules
  cancelAllSchedules();

  SESSION_REMINDERS.forEach((reminder) => {
    if (!reminder.enabled) return;

    const [hour, minute] = reminder.time.split(':').map(Number);

    // Create schedule rule for NY timezone
    const rule = new schedule.RecurrenceRule();
    rule.hour = hour;
    rule.minute = minute;
    rule.tz = NY_TIMEZONE;
    rule.dayOfWeek = [1, 2, 3, 4, 5]; // Monday-Friday only

    const job = schedule.scheduleJob(reminder.id, rule, () => {
      showNotification(reminder, mainWindow);
    });

    if (job) {
      scheduledJobs.set(reminder.id, job);
      console.log(`[Notifications] Scheduled: ${reminder.title} at ${reminder.time} NY time`);
    }
  });

  console.log(`[Notifications] Initialized ${scheduledJobs.size} scheduled notifications`);
}

/**
 * Show a native desktop notification
 */
function showNotification(reminder: SessionReminder, mainWindow: BrowserWindow): void {
  const iconPath = app.isPackaged
    ? path.join(process.resourcesPath, 'assets', 'icon.png')
    : path.join(__dirname, '../../src/renderer/assets/icon.png');

  const notification = new Notification({
    title: reminder.title,
    body: reminder.body,
    icon: iconPath,
    urgency: 'critical',
    silent: false,
    timeoutType: 'default',
  });

  notification.on('click', () => {
    // Show and focus the main window
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
      // Optionally navigate to a specific page
      mainWindow.webContents.send('notification-clicked', reminder.id);
    }
  });

  notification.on('close', () => {
    console.log(`[Notifications] Notification closed: ${reminder.id}`);
  });

  notification.show();
  console.log(`[Notifications] Sent: ${reminder.title}`);
}

/**
 * Send a test notification
 */
export function sendTestNotification(): void {
  const iconPath = app.isPackaged
    ? path.join(process.resourcesPath, 'assets', 'icon.png')
    : path.join(__dirname, '../../src/renderer/assets/icon.png');

  const notification = new Notification({
    title: '✅ Notifications Enabled',
    body: 'You will receive trading session reminders at 8:00, 8:30, and 9:30 AM NY time.',
    icon: iconPath,
    silent: false,
  });

  notification.show();
}

/**
 * Cancel all scheduled notifications
 */
export function cancelAllSchedules(): void {
  scheduledJobs.forEach((job, id) => {
    job.cancel();
    console.log(`[Notifications] Cancelled: ${id}`);
  });
  scheduledJobs.clear();
}

/**
 * Cancel a specific scheduled notification
 */
export function cancelSchedule(reminderId: string): void {
  const job = scheduledJobs.get(reminderId);
  if (job) {
    job.cancel();
    scheduledJobs.delete(reminderId);
    console.log(`[Notifications] Cancelled: ${reminderId}`);
  }
}

/**
 * Get all scheduled job info
 */
export function getScheduledJobs(): Array<{ id: string; nextInvocation: Date | null }> {
  return Array.from(scheduledJobs.entries()).map(([id, job]) => ({
    id,
    nextInvocation: job.nextInvocation()?.toDate() || null,
  }));
}

/**
 * Manually trigger a reminder (for testing)
 */
export function triggerReminder(reminderId: string, mainWindow: BrowserWindow): void {
  const reminder = SESSION_REMINDERS.find((r) => r.id === reminderId);
  if (reminder) {
    showNotification(reminder, mainWindow);
  }
}
