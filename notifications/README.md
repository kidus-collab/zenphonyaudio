# Zenphony Trading Session Notifications

Multi-platform push notification system for trading session reminders.

## What is VAPID?

**VAPID** (Voluntary Application Server Identification) is a security protocol for web push notifications:

- **Identifies your server** to push services (Google, Mozilla, Apple)
- **Prevents abuse** - only you can send notifications to your subscribers
- **No registration required** - you generate keys yourself

It consists of:
- **Public Key** - shared with browsers (safe to expose in client code)
- **Private Key** - kept secret on your server (never expose!)

## Session Reminders

| Time (NY) | Notification |
|-----------|--------------|
| 8:00 AM   | 🔔 NY Session Started - Get on the charts! |
| 8:30 AM   | 📰 News Release - Economic news incoming |
| 9:30 AM   | 📈 Indices Open - US markets now open |

## Project Structure

```
notifications/
├── apps/
│   ├── desktop/          # Electron desktop app
│   │   ├── src/main/     # Main process (notifications, tray)
│   │   ├── src/preload/  # Preload scripts
│   │   └── src/renderer/ # Renderer HTML
│   │
│   └── mobile/           # React Native (Expo) mobile app
│       ├── src/App.tsx   # Main app component
│       ├── src/services/ # Notification service
│       └── src/hooks/    # useNotifications hook
│
├── packages/
│   └── shared/           # Shared types, constants, utilities
│       └── src/
│           ├── types.ts
│           ├── constants.ts
│           └── utils.ts
│
├── services/
│   └── notification-scheduler/  # Backend cron scheduler
│       └── src/
│           ├── index.ts         # Main scheduler
│           ├── database.ts      # Supabase queries
│           └── providers/       # Web Push, Expo, FCM
│
└── package.json          # Root workspace config
```

## Quick Start

### 1. Install Dependencies

```bash
cd notifications
npm install
```

### 2. Environment Variables

#### Main Web App (.env.local)
Already configured with:
```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key
```

To generate new VAPID keys:
```bash
npx web-push generate-vapid-keys
```

#### Notification Scheduler (.env)
```bash
cd services/notification-scheduler
cp .env.example .env
```

Edit `.env` with your credentials:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key
```

### 3. Run Supabase Migration

Option A - Using Supabase CLI:
```bash
# In main project root
npx supabase link --project-ref your-project-ref
npx supabase db push
```

Option B - Run SQL manually in Supabase Dashboard:
1. Go to SQL Editor in your Supabase Dashboard
2. Copy contents of `supabase/migrations/20240101000000_create_push_subscriptions.sql`
3. Run the SQL

### 4. Run Apps

#### Desktop (Electron)
```bash
npm run dev:desktop
```

#### Mobile (Expo/React Native)
```bash
npm run dev:mobile
```

#### Notification Scheduler (Backend)
```bash
npm run dev:scheduler
```

## Platform-Specific Details

### Web Push (PWA)

Already integrated in the main Next.js app.

**Key Files:**
- `/public/sw.js` - Service Worker for push notifications
- `/lib/notifications.ts` - Push subscription helpers
- `/hooks/useNotifications.ts` - React hook for components
- `/app/api/notifications/subscribe/route.ts` - Subscription API
- `/app/api/notifications/unsubscribe/route.ts` - Unsubscribe API

**Usage in components:**
```tsx
import { useNotifications } from '@/hooks/useNotifications';

function NotificationSettings() {
  const {
    isSupported,
    permission,
    subscribed,
    enableNotifications,
    disableNotifications,
    testNotification
  } = useNotifications();

  if (!isSupported) return <p>Push not supported</p>;

  return (
    <button onClick={subscribed ? disableNotifications : enableNotifications}>
      {subscribed ? 'Disable' : 'Enable'} Notifications
    </button>
  );
}
```

### Electron Desktop App

**Build for distribution:**
```bash
# Windows
npm run build:desktop:win

# macOS
npm run build:desktop:mac

# Linux
npm run --workspace=@zenphony/desktop package:linux
```

**Features:**
- Native desktop notifications
- System tray with quick actions
- Auto-start on login (optional)
- Background running
- Notification scheduling (node-schedule)

### React Native Mobile App (Expo)

**Setup:**
```bash
cd apps/mobile
npx expo login
```

**Run on device:**
```bash
npm run dev:mobile
# Press 'i' for iOS simulator
# Press 'a' for Android emulator
# Scan QR code for physical device
```

**Build for app stores:**
```bash
npx eas build:configure
npm run build:mobile:android
npm run build:mobile:ios
```

**Features:**
- Local scheduled notifications
- Expo push notifications
- Permission handling
- Background notifications

### Vercel Cron Jobs (Recommended for Production)

The main app uses **Vercel Cron Jobs** - no separate backend needed!

**How it works:**
- Vercel automatically calls `/api/cron/session-reminder` at scheduled times
- Configured in `vercel.json`
- Runs in UTC timezone

**Schedule (in vercel.json):**
```json
{
  "crons": [
    { "path": "/api/cron/session-reminder?type=session-start", "schedule": "0 13 * * 1-5" },
    { "path": "/api/cron/session-reminder?type=news-release", "schedule": "30 13 * * 1-5" },
    { "path": "/api/cron/session-reminder?type=indices-open", "schedule": "30 14 * * 1-5" }
  ]
}
```

**Times are in UTC:**
| UTC Time | NY Time (EST) | Reminder |
|----------|---------------|----------|
| 13:00 | 8:00 AM | Session Start |
| 13:30 | 8:30 AM | News Release |
| 14:30 | 9:30 AM | Indices Open |

**Test locally:**
```bash
# Call the API directly
curl "http://localhost:3000/api/cron/session-reminder?type=session-start"
```

### Backend Notification Scheduler (Optional - for Local Development)

The `services/notification-scheduler` folder is **optional**. Use it for:
- Local development testing
- Self-hosted deployments (not on Vercel)

**Test notifications:**
```bash
cd services/notification-scheduler
npm run dev -- --test
```

**Other deploy options (if not using Vercel):**
1. **Docker** - Create Dockerfile, deploy to any container service
2. **Railway/Render** - Deploy as Node.js service
3. **AWS Lambda + EventBridge** - Serverless cron
4. **Supabase Edge Functions** - Use Supabase's built-in cron

## Database Schema

```sql
-- Push subscriptions table
push_subscriptions
├── id (UUID, primary key)
├── user_id (UUID, FK → auth.users)
├── type ('web' | 'expo' | 'fcm')
├── token (TEXT) -- For Expo/FCM
├── subscription (JSONB) -- For Web Push
├── device_name (TEXT)
├── enabled (BOOLEAN)
├── created_at (TIMESTAMPTZ)
└── updated_at (TIMESTAMPTZ)

-- Notification logs table
notification_logs
├── id (UUID, primary key)
├── reminder_id (TEXT)
├── recipient_count (INTEGER)
├── success_count (INTEGER)
├── failure_count (INTEGER)
├── errors (JSONB)
└── sent_at (TIMESTAMPTZ)
```

## API Reference

### Subscribe to Push Notifications

```typescript
POST /api/notifications/subscribe

// Request body
{
  "subscription": { /* Web Push subscription object */ },
  "token": "ExponentPushToken[xxx]", // For Expo
  "type": "web" | "expo" | "fcm",
  "userId": "uuid", // Optional, auto-detected if logged in
  "deviceName": "iPhone 15"
}

// Response
{ "success": true, "created": true }
```

### Unsubscribe

```typescript
POST /api/notifications/unsubscribe

// Request body
{
  "endpoint": "https://...", // For web
  "token": "ExponentPushToken[xxx]" // For Expo/FCM
}

// Response
{ "success": true }
```

## Troubleshooting

### Web Push not working

1. **Check HTTPS** - Push requires HTTPS (localhost is exempt)
2. **Check VAPID keys** - Ensure keys are set in .env.local
3. **Check service worker** - Visit `/sw.js` to verify it loads
4. **Check permissions** - Browser must grant notification permission
5. **Check console** - Look for errors in browser dev tools

### Expo notifications not showing

1. **Use physical device** - Simulators don't support push
2. **Check permissions** - Call `registerForPushNotifications()`
3. **Check token** - Verify Expo push token is valid
4. **Check channel** - Android requires notification channel

### Electron notifications not appearing

1. **Check system settings** - OS notification permissions
2. **Check tray** - App must be running (tray icon visible)
3. **Check focus** - Some OS hide notifications if app is focused

### Scheduler not sending

1. **Check timezone** - Scheduler uses NY timezone
2. **Check subscriptions** - Verify database has active subscriptions
3. **Check logs** - Run with `DEBUG=*` for verbose output
4. **Check credentials** - Verify VAPID/Firebase credentials

## Scripts Reference

```bash
# Root commands
npm run dev              # Run all in dev mode (turbo)
npm run build            # Build all packages
npm run dev:desktop      # Run Electron app
npm run dev:mobile       # Run Expo app
npm run dev:scheduler    # Run notification scheduler

# Build commands
npm run build:desktop         # Build Electron
npm run build:desktop:win     # Package for Windows
npm run build:desktop:mac     # Package for macOS
npm run build:mobile:android  # Build Android APK
npm run build:mobile:ios      # Build iOS IPA
```

## License

MIT
