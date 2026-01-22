import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Settings
  getSettings: () => ipcRenderer.invoke('get-settings'),
  setSetting: (key: string, value: unknown) => ipcRenderer.invoke('set-setting', key, value),

  // Notifications
  testNotification: () => ipcRenderer.invoke('test-notification'),

  // App info
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),

  // Event listeners
  onNotificationClicked: (callback: (reminderId: string) => void) => {
    ipcRenderer.on('notification-clicked', (_, reminderId) => callback(reminderId));
  },

  onSettingsChanged: (callback: (key: string, value: unknown) => void) => {
    ipcRenderer.on('settings-changed', (_, key, value) => callback(key, value));
  },

  // Platform info
  platform: process.platform,
  isElectron: true,
});

// Type definitions for the exposed API
declare global {
  interface Window {
    electronAPI: {
      getSettings: () => Promise<{
        notificationsEnabled: boolean;
        launchAtStartup: boolean;
        minimizeToTray: boolean;
      }>;
      setSetting: (key: string, value: unknown) => Promise<boolean>;
      testNotification: () => Promise<boolean>;
      getAppVersion: () => Promise<string>;
      onNotificationClicked: (callback: (reminderId: string) => void) => void;
      onSettingsChanged: (callback: (key: string, value: unknown) => void) => void;
      platform: NodeJS.Platform;
      isElectron: boolean;
    };
  }
}
