import { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain, shell } from 'electron';
import path from 'path';
import { initNotificationScheduler, sendTestNotification, cancelAllSchedules } from './notifications';
import { createTray } from './tray';
import Store from 'electron-store';

// Initialize store for settings persistence
const store = new Store({
  defaults: {
    notificationsEnabled: true,
    launchAtStartup: false,
    minimizeToTray: true,
    windowBounds: { width: 1200, height: 800 },
  },
});

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

const isDev = process.env.NODE_ENV === 'development';
const WEBAPP_URL = isDev
  ? 'http://localhost:3000'
  : 'https://zenphony.audio';

function createWindow() {
  const bounds = store.get('windowBounds') as { width: number; height: number };

  mainWindow = new BrowserWindow({
    width: bounds.width,
    height: bounds.height,
    minWidth: 800,
    minHeight: 600,
    icon: getIconPath(),
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    show: false,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#0d0b14',
  });

  // Load the web app
  mainWindow.loadURL(WEBAPP_URL);

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  // Save window bounds on resize
  mainWindow.on('resize', () => {
    if (mainWindow) {
      const { width, height } = mainWindow.getBounds();
      store.set('windowBounds', { width, height });
    }
  });

  // Handle close to tray
  mainWindow.on('close', (event) => {
    if (store.get('minimizeToTray') && !app.isQuitting) {
      event.preventDefault();
      mainWindow?.hide();
    }
  });

  // Open external links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Initialize notification scheduler
  if (store.get('notificationsEnabled')) {
    initNotificationScheduler(mainWindow);
  }

  return mainWindow;
}

function getIconPath(): string {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'assets', 'icon.png');
  }
  return path.join(__dirname, '../../src/renderer/assets/icon.png');
}

// Handle IPC messages from renderer
ipcMain.handle('get-settings', () => {
  return {
    notificationsEnabled: store.get('notificationsEnabled'),
    launchAtStartup: store.get('launchAtStartup'),
    minimizeToTray: store.get('minimizeToTray'),
  };
});

ipcMain.handle('set-setting', (_, key: string, value: unknown) => {
  store.set(key, value);

  // Handle specific settings
  if (key === 'notificationsEnabled') {
    if (value) {
      if (mainWindow) initNotificationScheduler(mainWindow);
    } else {
      cancelAllSchedules();
    }
  }

  if (key === 'launchAtStartup') {
    app.setLoginItemSettings({
      openAtLogin: value as boolean,
      openAsHidden: true,
    });
  }

  return true;
});

ipcMain.handle('test-notification', () => {
  sendTestNotification();
  return true;
});

ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

// App lifecycle
app.whenReady().then(() => {
  createWindow();
  tray = createTray(mainWindow!, store);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else {
      mainWindow?.show();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // Keep running in tray on Windows/Linux
    if (!store.get('minimizeToTray')) {
      app.quit();
    }
  }
});

// Handle app quitting
app.on('before-quit', () => {
  (app as any).isQuitting = true;
});

// Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
    }
  });
}
