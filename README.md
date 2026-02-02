# Zenphony Audio Website

A modern, full-stack audio technology platform built with Next.js 16, featuring Supabase authentication and Stripe subscription payments.

> **Last Updated:** January 2026

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Deployment](#deployment)
- [Folder Structure](#folder-structure)
- [Architecture Overview](#architecture-overview)
- [Authentication System](#authentication-system)
- [Stripe Integration](#stripe-integration)
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
│   │   ├── checkout/             # Stripe checkout session creation
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
│   └── utils.ts                  # General utilities (cn function)
│
├── public/                       # Static assets
│   └── (images, icons, etc.)
│
├── styles/                       # Global styles
│
├── supabase/                     # Supabase configuration
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
