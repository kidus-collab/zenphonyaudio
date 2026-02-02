# Zenphony Audio Website

A modern, full-stack audio technology platform built with Next.js 16, featuring Supabase authentication and Stripe subscription payments.

> **Last Updated:** February 2026

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Deployment](#deployment)
- [Folder Structure](#folder-structure)
- [Architecture Overview](#architecture-overview)
- [Authentication System](#authentication-system)
- [Stripe Integration](#stripe-integration)
- [Subscription and Billing Analytics](#subscription-and-billing-analytics)
- [Database Schema](#database-schema)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [API Routes](#api-routes)
- [Troubleshooting](#troubleshooting)

---

## Overview

Zenphony Audio is a SaaS platform offering AI-powered audio tools, with the flagship product being **Listen Buddy** - an intelligent audio analysis tool. The platform supports user authentication, subscription-based pricing tiers, and a modern glassmorphic UI design.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16.0.10 (App Router) |
| Language | TypeScript |
| UI Components | Radix UI + shadcn/ui |
| Styling | Tailwind CSS 4.x |
| Authentication | Supabase Auth |
| Database | Supabase (PostgreSQL) |
| Payments | Stripe |
| State Management | React Context |
| 3D Graphics | Three.js / Spline |
| Forms | React Hook Form + Zod |

---

## Deployment

### Production URLs

| Service | URL |
|---------|-----|
| **Website** | https://zenphonyaudio.vercel.app |
| **Supabase** | https://supabase.com/dashboard (project: brqumrnkcevzieqfvhsm) |

### Vercel Configuration

The app is deployed on **Vercel** with the following optimizations:

```json
// vercel.json
{
  "regions": ["iad1"]  // US East - matches Supabase region
}
```

**Important:** The Vercel region (`iad1`) is set to match the Supabase region (`us-east-1`) for optimal latency.

### Supabase Configuration

**Region:** `us-east-1` (N. Virginia)

**Required URL Configuration** (Supabase Dashboard → Authentication → URL Configuration):

| Setting | Value |
|---------|-------|
| Site URL | `https://zenphonyaudio.vercel.app` |
| Redirect URLs | `https://zenphonyaudio.vercel.app/**` |

### Vercel Environment Variables

Set these in Vercel Dashboard → Project Settings → Environment Variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://brqumrnkcevzieqfvhsm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_BASE_URL=https://zenphonyaudio.vercel.app
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ECONOMY=price_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_MASTER=price_...
```

### Performance Optimizations

1. **Edge Runtime** - Auth callback uses Edge runtime for faster cold starts (~50ms vs 1-3s)
   - File: `app/auth/callback/route.ts`

2. **Region Matching** - Vercel deployed to same region as Supabase (us-east-1 / iad1)

---

## Folder Structure

```
zenphony-audio-website/
├── app/                          # Next.js App Router pages
│   ├── api/                      # API route handlers
│   │   ├── billing-history/      # Billing event history endpoint
│   │   │   └── route.ts
│   │   ├── checkout/             # Stripe checkout session creation
│   │   │   └── route.ts
│   │   ├── cron/                 # Scheduled jobs
│   │   │   └── usage-snapshot/   # Daily usage snapshot cron
│   │   │       └── route.ts
│   │   ├── plan-recommendation/  # AI plan recommendation endpoint
│   │   │   └── route.ts
│   │   ├── subscription-details/ # Subscription details endpoint
│   │   │   └── route.ts
│   │   ├── usage-history/        # Usage history over time endpoint
│   │   │   └── route.ts
│   │   └── stripe-webhook/       # Stripe webhook handler
│   │       └── route.ts
│   ├── auth/                     # Auth-related pages
│   │   ├── auth-code-error/      # Auth error display page
│   │   │   └── page.tsx
│   │   └── callback/             # OAuth & email verification callback
│   │       └── route.ts
│   ├── about/                    # About page
│   ├── backstory/                # Company backstory page
│   ├── checkout/                 # Checkout flow
│   │   ├── page.tsx              # Checkout page
│   │   └── success/              # Post-payment success page
│   │       └── page.tsx
│   ├── contact/                  # Contact page
│   ├── forgot-password/          # Password reset request page
│   │   └── page.tsx
│   ├── login/                    # User login page
│   │   └── page.tsx
│   ├── pricing/                  # Pricing page
│   ├── products/                 # Products pages
│   │   ├── page.tsx              # Products listing
│   │   ├── listen-buddy/         # Listen Buddy product page
│   │   │   └── page.tsx
│   │   └── [id]/                 # Dynamic product page
│   │       └── page.tsx
│   ├── profile/                  # User profile/dashboard
│   │   └── page.tsx
│   ├── reset-password/           # Set new password page
│   │   └── page.tsx
│   ├── signup/                   # User registration
│   │   ├── page.tsx
│   │   └── success/              # Email confirmation sent page
│   │       └── page.tsx
│   ├── solutions/                # Solutions page
│   ├── layout.tsx                # Root layout with providers
│   └── page.tsx                  # Homepage
│
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components (60+ components)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   └── ... (and many more)
│   ├── profile/                  # Profile page components
│   │   ├── subscription-details-card.tsx  # Subscription info card
│   │   ├── profile-charts.tsx             # Charts container
│   │   ├── usage-over-time-chart.tsx      # Usage analytics chart
│   │   ├── billing-history-chart.tsx      # Billing history chart
│   │   ├── plan-comparison-chart.tsx      # Plan comparison chart
│   │   └── plan-recommendation-card.tsx   # Plan recommendation card
│   ├── aurora.tsx                # Animated background effect
│   ├── circular-waveform.tsx     # Audio waveform visualization
│   ├── color-bends.tsx           # Color gradient effects
│   ├── cta-section.tsx           # Call-to-action section
│   ├── features-section.tsx      # Features display section
│   ├── footer.tsx                # Site footer
│   ├── hero-section.tsx          # Homepage hero
│   ├── login-popup.tsx           # Login modal component
│   ├── marquee-section.tsx       # Scrolling marquee
│   ├── navigation.tsx            # Main navigation bar
│   ├── page-transition.tsx       # Page transition animations
│   ├── products-section.tsx      # Products showcase
│   ├── search-modal.tsx          # Search functionality
│   ├── services-section.tsx      # Services display
│   ├── testimonials-section.tsx  # Customer testimonials
│   ├── theme-provider.tsx        # Dark/light theme provider
│   ├── tilt-card.tsx             # 3D tilt card effect
│   └── zenphony-logo.tsx         # Logo component
│
├── contexts/                     # React Context providers
│   └── auth-context.tsx          # Authentication context & hooks
│
├── hooks/                        # Custom React hooks
│   ├── use-mobile.ts             # Mobile detection hook
│   └── use-toast.ts              # Toast notification hook
│
├── lib/                          # Utility libraries
│   ├── supabase/                 # Supabase client configuration
│   │   ├── client.ts             # Browser client (client components)
│   │   ├── server.ts             # Server client (server components)
│   │   ├── middleware.ts         # Session refresh middleware
│   │   └── database.types.ts     # TypeScript types for database
│   ├── plan-recommendation.ts    # Plan recommendation engine
│   └── utils.ts                  # General utilities (cn function)
│
├── public/                       # Static assets
│   └── (images, icons, etc.)
│
├── styles/                       # Global styles
│
├── supabase/                     # Supabase configuration & migrations
│   └── migrations/
│       └── 005_usage_and_billing_history.sql
│
├── .env.local                    # Environment variables (not in git)
├── .env.local.example            # Example env file
├── middleware.ts                 # Next.js middleware (auth session)
├── next.config.mjs               # Next.js configuration
├── package.json                  # Dependencies
├── tailwind.config.ts            # Tailwind configuration
└── tsconfig.json                 # TypeScript configuration
```

---

## Architecture Overview

### Application Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐     │
│   │   Pages      │    │  Components  │    │   Contexts   │     │
│   │  (app/*)     │◄───│              │◄───│ AuthContext  │     │
│   └──────────────┘    └──────────────┘    └──────────────┘     │
│          │                                        │              │
│          ▼                                        ▼              │
│   ┌──────────────────────────────────────────────────────┐     │
│   │              Supabase Browser Client                  │     │
│   │              (@supabase/ssr - client.ts)              │     │
│   └──────────────────────────────────────────────────────┘     │
│                              │                                   │
└──────────────────────────────│───────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      NEXT.JS MIDDLEWARE                          │
│                    (Session Refresh)                             │
│   ┌──────────────────────────────────────────────────────┐     │
│   │              middleware.ts                            │     │
│   │              lib/supabase/middleware.ts               │     │
│   └──────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                         SERVER                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐     │
│   │ API Routes   │    │  Server      │    │   Stripe     │     │
│   │ /api/*       │    │  Components  │    │   Webhooks   │     │
│   └──────────────┘    └──────────────┘    └──────────────┘     │
│          │                    │                    │             │
│          ▼                    ▼                    ▼             │
│   ┌──────────────────────────────────────────────────────┐     │
│   │              Supabase Server Client                   │     │
│   │              (@supabase/ssr - server.ts)              │     │
│   └──────────────────────────────────────────────────────┘     │
│                              │                                   │
└──────────────────────────────│───────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                     EXTERNAL SERVICES                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐     │
│   │   Supabase   │    │   Stripe     │    │   Resend     │     │
│   │   Auth       │    │   Payments   │    │   Email      │     │
│   │   Database   │    │              │    │   (SMTP)     │     │
│   └──────────────┘    └──────────────┘    └──────────────┘     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Key Architectural Decisions

1. **App Router**: Uses Next.js 16 App Router for file-based routing
2. **Server Components**: Default server components with `"use client"` for interactive parts
3. **Cookie-based Auth**: Supabase SSR uses cookies (not localStorage) for secure auth
4. **Middleware Session Refresh**: Auto-refreshes expired sessions on every request
5. **Context Provider Pattern**: Auth state managed via React Context at the root layout

---

## Authentication System

### Overview

The authentication system uses **Supabase Auth** with the `@supabase/ssr` package for secure, cookie-based authentication that works with both server and client components.

### Auth Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     SIGN UP FLOW                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  User enters email/password ──► Supabase creates user           │
│           │                              │                       │
│           ▼                              ▼                       │
│  Redirect to /signup/success    Email sent via Resend SMTP      │
│           │                              │                       │
│           │                              ▼                       │
│           │                     User clicks email link           │
│           │                              │                       │
│           │                              ▼                       │
│           │                     /auth/callback?token_hash=xxx    │
│           │                              │                       │
│           │                              ▼                       │
│           │                     verifyOtp() validates token      │
│           │                              │                       │
│           └──────────────────────────────┴──► User logged in     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     SIGN IN FLOW                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  User enters email/password ──► signInWithPassword()            │
│                                          │                       │
│                                          ▼                       │
│                                 Session cookie set               │
│                                          │                       │
│                                          ▼                       │
│                                 Redirect to /profile             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                  PASSWORD RESET FLOW                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  /forgot-password                                                │
│       │                                                          │
│       ▼                                                          │
│  User enters email ──► resetPasswordForEmail()                  │
│       │                         │                                │
│       ▼                         ▼                                │
│  Success message        Email with reset link sent               │
│                                 │                                │
│                                 ▼                                │
│                         User clicks link                         │
│                                 │                                │
│                                 ▼                                │
│                  /auth/callback?type=recovery&token_hash=xxx     │
│                                 │                                │
│                                 ▼                                │
│                         verifyOtp(type: 'recovery')              │
│                                 │                                │
│                                 ▼                                │
│                         Redirect to /reset-password              │
│                                 │                                │
│                                 ▼                                │
│                  User enters new password                        │
│                                 │                                │
│                                 ▼                                │
│                         updateUser({ password })                 │
│                                 │                                │
│                                 ▼                                │
│                 Password updated ──► Redirect to /login          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Auth Files Structure

| File | Purpose |
|------|---------|
| `lib/supabase/client.ts` | Browser client for client components |
| `lib/supabase/server.ts` | Server client for server components/API routes |
| `lib/supabase/middleware.ts` | Session refresh logic |
| `middleware.ts` | Next.js middleware entry point |
| `contexts/auth-context.tsx` | React context with auth methods |
| `app/auth/callback/route.ts` | Handles OAuth & email verification callbacks |

### Auth Context Methods

```typescript
interface AuthContextType {
  user: User | null              // Current Supabase user
  profile: Profile | null        // User profile from profiles table
  session: Session | null        // Current session
  loading: boolean               // Auth state loading
  signUp(email, password, name?) // Register new user
  signIn(email, password)        // Login with credentials
  signInWithGoogle()             // OAuth with Google
  signOut()                      // Logout user
  updateProfile(updates)         // Update profile data
  refreshProfile()               // Refresh profile from DB
}
```

### Password Storage

Passwords are stored securely in Supabase Auth:
- **Location**: `auth.users` table (managed by Supabase)
- **Hashing**: bcrypt with salt
- **Access**: Cannot be queried directly - managed by Supabase Auth service

### Cookies vs onAuthStateChange vs React State

Understanding how these three pieces relate is critical for debugging auth issues:

- **Cookies (`sb-*`)** are the **source of truth**. Supabase stores access and refresh tokens in `sb-*` cookies managed by `@supabase/ssr`. The middleware reads these on every request to refresh expired sessions. Everything else is derived from cookies.

- **`onAuthStateChange`** is a **listener, not a controller**. It fires events (`SIGNED_IN`, `SIGNED_OUT`, `TOKEN_REFRESHED`, `PASSWORD_RECOVERY`) in reaction to auth state changes. It does not create, destroy, or manage sessions. Think of it as an event emitter that the AuthContext subscribes to in order to keep React state in sync.

- **React state** (`user`, `session`, `profile` in AuthContext) is a **mirror of the cookie-based session** for UI rendering. It's set on mount via `getSession()` and updated via the `onAuthStateChange` listener. Clearing React state alone does not sign the user out — the cookies must also be cleared.

### Sign-Out Flow (Detailed)

1. User clicks "Sign Out" in the avatar dropdown or profile page
2. `signOut()` in AuthContext immediately clears React state (`user`, `session`, `profile` set to `null`) so the UI updates instantly
3. `supabase.auth.signOut({ scope: 'local' })` is called, raced against a 2-second timeout to protect against the Supabase SDK hanging
4. **All `sb-*` cookies are explicitly deleted via `document.cookie`** — this is the critical step. Without it, if the SDK call times out before clearing cookies, the middleware would find valid cookies on the next request, refresh the session, and the user would appear logged back in
5. `window.location.href = "/"` triggers a full page reload to clear all in-memory cached state
6. On reload, middleware finds no valid cookies, `getSession()` returns null, user stays logged out

**Why explicit cookie clearing matters:** The `supabase.auth.signOut()` call can hang or be slow. The 2-second timeout ensures the UI isn't blocked, but if the timeout wins the race, the cookies are never cleared by the SDK. Explicitly deleting all `sb-*` cookies after the race guarantees the session is destroyed regardless of whether the SDK completed.

### Password Reset Flow (Detailed)

The password reset flow is **completely independent of existing cookies**:

1. User requests a password reset from `/forgot-password`
2. Supabase sends an email with a link containing a one-time `code` parameter
3. User clicks the link, landing on `/reset-password?code=abc123`
4. The page calls `exchangeCodeForSession(code)` which creates a **brand new session** by exchanging the one-time code with Supabase — no existing cookies are needed
5. The `onAuthStateChange` listener on the reset-password page listens for `PASSWORD_RECOVERY` as a backup signal to show the reset form
6. User submits their new password via `updateUser({ password })`
7. On success, user is redirected to `/login`

**Key point:** Sign-out cookie clearing does not affect password reset. The reset page creates its own fresh session from the email link's code. It never depends on previously existing cookies or auth state.

### No Database Column Needed for Sign-In/Out Status

Auth state lives entirely in Supabase session cookies and the AuthContext React state. The `profiles` table stores user profile data (name, subscription, etc.), not session status. There is no need for a `signed_in` column — the presence or absence of valid `sb-*` cookies determines whether a user is authenticated.

---

## Stripe Integration

### Overview

Stripe handles subscription payments with three paid tiers plus a free tier.

### Subscription Tiers

| Plan | Price | Features |
|------|-------|----------|
| Free | $0/mo | Basic access, limited minutes |
| Economy | $7.99/mo | Extended minutes, basic features |
| Pro | $25/mo | Unlimited minutes, advanced features |
| Master | $55/mo | Everything + priority support |

### Payment Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     CHECKOUT FLOW                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  User selects plan ──► POST /api/checkout                       │
│         │                       │                                │
│         │                       ▼                                │
│         │              stripe.checkout.sessions.create()         │
│         │                       │                                │
│         │                       ▼                                │
│         │              Return Stripe Checkout URL                │
│         │                       │                                │
│         ▼                       ▼                                │
│  Redirect to Stripe Checkout page                                │
│         │                                                        │
│         ▼                                                        │
│  User enters payment info                                        │
│         │                                                        │
│         ▼                                                        │
│  Payment successful ──► Redirect to /checkout/success            │
│         │                                                        │
│         │              ┌─────────────────────────────┐           │
│         └──────────────│  WEBHOOK (async)            │           │
│                        │  POST /api/stripe-webhook   │           │
│                        │         │                   │           │
│                        │         ▼                   │           │
│                        │  Update profiles table:     │           │
│                        │  - subscription_plan        │           │
│                        │  - subscription_status      │           │
│                        │  - stripe_customer_id       │           │
│                        │  - stripe_subscription_id   │           │
│                        └─────────────────────────────┘           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Stripe API Routes

#### POST `/api/checkout`
Creates a Stripe Checkout session for subscription payments.

**Request:**
```json
{
  "planId": "pro",
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/..."
}
```

#### POST `/api/stripe-webhook`
Handles Stripe webhook events to update subscription status.

**Handled Events:**
- `checkout.session.completed` - New subscription created
- `customer.subscription.updated` - Subscription changed
- `customer.subscription.deleted` - Subscription cancelled

### Stripe Environment Variables

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ECONOMY=price_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_MASTER=price_...
```

---

## Subscription and Billing Analytics

### Overview

The profile page includes a comprehensive subscription management and analytics dashboard. Users can view their current plan details, track usage over time, review billing history, compare plans, and receive personalized plan recommendations.

### Subscription Details Card

Located on the profile page (`components/profile/subscription-details-card.tsx`), this card displays:

- **Plan badge** with color-coded tier indicator (Free, Economy, Pro, Master)
- **Billing cycle** information (next billing date, amount)
- **Payment method** display (last 4 digits of card on file)
- **Usage tracking** with progress bar showing minutes used vs. limit

### Usage Analytics Charts

Built with **Recharts**, the profile page includes three interactive charts (`components/profile/profile-charts.tsx`):

| Chart | Component | Description |
|-------|-----------|-------------|
| Usage Over Time | `usage-over-time-chart.tsx` | Line chart showing daily listening minutes over the past 90 days |
| Billing History | `billing-history-chart.tsx` | Bar chart displaying monthly billing amounts and payment events |
| Plan Comparison | `plan-comparison-chart.tsx` | Comparison chart showing features and limits across all plans |

### Plan Recommendation System

The plan recommendation engine (`lib/plan-recommendation.ts`) analyzes the user's 90-day usage history to suggest the most cost-effective plan:

- Analyzes average daily usage, peak usage, and trend direction
- Compares current plan limits against actual usage patterns
- Recommends upgrades when usage consistently exceeds 80% of the plan limit
- Recommends downgrades when usage is consistently below 30% of the plan limit
- Displayed via the `plan-recommendation-card.tsx` component on the profile page

### API Routes for Analytics

| Route | Method | Description |
|-------|--------|-------------|
| `/api/subscription-details` | GET | Returns detailed subscription info (plan, billing cycle, payment method) |
| `/api/usage-history` | GET | Returns daily usage snapshots for the past 90 days |
| `/api/billing-history` | GET | Returns billing events (payments, refunds, plan changes) |
| `/api/plan-recommendation` | GET | Returns a personalized plan recommendation based on usage analysis |
| `/api/cron/usage-snapshot` | GET | Cron endpoint that captures a daily usage snapshot for each active user |

### Daily Usage Snapshot Cron Job

The `/api/cron/usage-snapshot` endpoint is triggered daily via a Vercel cron job configured in `vercel.json`. It captures each user's current listening minutes into the `usage_daily_snapshots` table, building the historical data that powers the usage charts and plan recommendation engine.

### Stripe Webhook - Billing Events

The Stripe webhook (`/api/stripe-webhook`) now records billing events (payments, refunds, subscription changes) into the `billing_events` table, providing the data source for the billing history chart.

### Database Migration

Migration `005_usage_and_billing_history.sql` creates two new tables (see Database Schema section below for details):
- `usage_daily_snapshots` - Stores daily usage data per user
- `billing_events` - Stores Stripe billing events per user

---

## Database Schema

### Profiles Table

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  company TEXT,
  job_title TEXT,
  subscription_plan TEXT DEFAULT 'free',  -- 'free' | 'economy' | 'pro' | 'master'
  subscription_status TEXT DEFAULT 'active', -- 'active' | 'cancelled' | 'past_due'
  listening_minutes_used INTEGER DEFAULT 0,
  listening_minutes_limit INTEGER DEFAULT 60,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Usage Daily Snapshots Table

```sql
CREATE TABLE usage_daily_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  snapshot_date DATE NOT NULL,
  listening_minutes_used INTEGER NOT NULL DEFAULT 0,
  listening_minutes_limit INTEGER NOT NULL DEFAULT 60,
  subscription_plan TEXT NOT NULL DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, snapshot_date)
);
```

### Billing Events Table

```sql
CREATE TABLE billing_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,          -- 'payment' | 'refund' | 'plan_change'
  amount_cents INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'usd',
  description TEXT,
  stripe_event_id TEXT,
  stripe_invoice_id TEXT,
  plan_before TEXT,
  plan_after TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### TypeScript Types

```typescript
interface Profile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  company: string | null
  job_title: string | null
  subscription_plan: 'free' | 'economy' | 'pro' | 'master'
  subscription_status: 'active' | 'cancelled' | 'past_due'
  listening_minutes_used: number
  listening_minutes_limit: number
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  created_at: string
  updated_at: string
}
```

---

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Base URL (for email redirects)
NEXT_PUBLIC_BASE_URL=http://localhost:3005

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ECONOMY=price_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_MASTER=price_...

# Cron Job Authorization
CRON_SECRET=your-cron-secret
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Supabase account
- Stripe account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd zenphony-audio-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your credentials
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the database migrations (see `supabase/` folder)
   - Configure email templates for auth emails
   - (Optional) Set up custom SMTP with Resend

5. **Set up Stripe**
   - Create products and prices in Stripe Dashboard
   - Set up webhook endpoint pointing to `/api/stripe-webhook`
   - Add price IDs to environment variables

6. **Run the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3005`

### Scripts

```bash
npm run dev      # Start development server on port 3005
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/checkout` | POST | Create Stripe checkout session |
| `/api/stripe-webhook` | POST | Handle Stripe webhook events |
| `/api/subscription-details` | GET | Get subscription details for current user |
| `/api/usage-history` | GET | Get 90-day usage history for current user |
| `/api/billing-history` | GET | Get billing event history for current user |
| `/api/plan-recommendation` | GET | Get personalized plan recommendation |
| `/api/cron/usage-snapshot` | GET | Daily cron job to snapshot usage data |
| `/auth/callback` | GET | Handle OAuth & email verification |

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/login` | User login |
| `/signup` | User registration |
| `/signup/success` | Email confirmation sent |
| `/forgot-password` | Request password reset |
| `/reset-password` | Set new password |
| `/profile` | User dashboard |
| `/products` | Products listing |
| `/products/listen-buddy` | Listen Buddy product page |
| `/pricing` | Pricing page |
| `/checkout` | Checkout page |
| `/checkout/success` | Payment success |
| `/about` | About page |
| `/contact` | Contact page |
| `/solutions` | Solutions page |
| `/backstory` | Company backstory |

---

## Troubleshooting

### Common Issues

#### 1. Password Reset Email Not Redirecting Properly

**Symptom:** Clicking password reset link doesn't go to `/reset-password`

**Solution:**
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add `https://zenphonyaudio.vercel.app/**` to Redirect URLs
3. Ensure Site URL is `https://zenphonyaudio.vercel.app`

#### 2. "Email Rate Limit Exceeded" Error

**Symptom:** 429 error when sending password reset emails

**Details:**
- Supabase Auth allows **4 emails per hour** per user
- 60 seconds minimum between emails
- The forgot-password page shows a countdown timer when rate limited

**Solution:** Wait for the countdown or wait 1 hour for the limit to reset.

#### 3. Slow Auth on Vercel (vs localhost)

**Symptom:** Password reset and auth operations are slow on Vercel but fast on localhost

**Causes:**
- Cold starts (serverless functions take 1-3s to warm up)
- Region mismatch between Vercel and Supabase

**Solutions Applied:**
1. ✅ Edge Runtime for auth callback (reduces cold start to ~50ms)
2. ✅ Vercel region set to `iad1` (matches Supabase `us-east-1`)

#### 4. PKCE Code Exchange Fails

**Symptom:** "Invalid code" or session errors after clicking email link

**Cause:** PKCE verifier cookie missing (happens when reset requested from different domain)

**Solution:** User must request password reset from the same domain they'll use to reset (e.g., both on `zenphonyaudio.vercel.app`)

### Debug Logging

Auth flows have console logging for debugging:
- `[ForgotPassword]` - Password reset request
- `[ResetPassword]` - Password reset page
- `[Auth Callback]` - OAuth/email verification callback

Check browser DevTools console for these logs.

---

## License

Private - All rights reserved.
