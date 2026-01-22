import { Tray, Menu, app, nativeImage, BrowserWindow } from 'electron';
import path from 'path';
import Store from 'electron-store';
import { sendTestNotification, getScheduledJobs } from './notifications';
import { SESSION_REMINDERS, formatTimeUntil, getTimeUntilNextReminder } from '@zenphony/shared';

let tray: Tray | null = null;

export function createTray(mainWindow: BrowserWindow, store: Store): Tray {
  const iconPath = app.isPackaged
    ? path.join(process.resourcesPath, 'assets', 'icon.png')
    : path.join(__dirname, '../../src/renderer/assets/icon.png');

  // Create tray icon (resize for tray)
  const icon = nativeImage.createFromPath(iconPath);
  const trayIcon = icon.resize({ width: 16, height: 16 });

  tray = new Tray(trayIcon);
  tray.setToolTip('Zenphony Trader');

  // Update context menu periodically to show next reminder time
  const updateContextMenu = () => {
    const nextReminder = getTimeUntilNextReminder();
    const nextReminderText = nextReminder
      ? `Next: ${nextReminder.reminder.title} in ${formatTimeUntil(nextReminder.milliseconds)}`
      : 'No upcoming reminders today';

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Zenphony Trader',
        enabled: false,
        icon: trayIcon,
      },
      { type: 'separator' },
      {
        label: nextReminderText,
        enabled: false,
      },
      { type: 'separator' },
      {
        label: 'Open App',
        click: () => {
          mainWindow.show();
          mainWindow.focus();
        },
      },
      {
        label: 'Test Notification',
        click: sendTestNotification,
      },
      { type: 'separator' },
      {
        label: 'Session Reminders',
        submenu: SESSION_REMINDERS.map((reminder) => ({
          label: `${reminder.time} - ${reminder.title.replace(/^[^\w]+/, '')}`,
          type: 'checkbox' as const,
          checked: reminder.enabled,
          click: (menuItem: Electron.MenuItem) => {
            // Toggle reminder enabled state
            reminder.enabled = menuItem.checked;
            // Could persist to store if needed
          },
        })),
      },
      { type: 'separator' },
      {
        label: 'Settings',
        submenu: [
          {
            label: 'Enable Notifications',
            type: 'checkbox',
            checked: store.get('notificationsEnabled') as boolean,
            click: (menuItem: Electron.MenuItem) => {
              store.set('notificationsEnabled', menuItem.checked);
              mainWindow.webContents.send('settings-changed', 'notificationsEnabled', menuItem.checked);
            },
          },
          {
            label: 'Launch at Startup',
            type: 'checkbox',
            checked: store.get('launchAtStartup') as boolean,
            click: (menuItem: Electron.MenuItem) => {
              store.set('launchAtStartup', menuItem.checked);
              app.setLoginItemSettings({
                openAtLogin: menuItem.checked,
                openAsHidden: true,
              });
            },
          },
          {
            label: 'Minimize to Tray',
            type: 'checkbox',
            checked: store.get('minimizeToTray') as boolean,
            click: (menuItem: Electron.MenuItem) => {
              store.set('minimizeToTray', menuItem.checked);
            },
          },
        ],
      },
      { type: 'separator' },
      {
        label: 'Quit',
        click: () => {
          (app as any).isQuitting = true;
          app.quit();
        },
      },
    ]);

    tray?.setContextMenu(contextMenu);
  };

  // Initial menu setup
  updateContextMenu();

  // Update menu every minute to keep "Next reminder" accurate
  setInterval(updateContextMenu, 60000);

  // Double-click to open app
  tray.on('double-click', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  return tray;
}

export function destroyTray(): void {
  if (tray) {
    tray.destroy();
    tray = null;
  }
}
