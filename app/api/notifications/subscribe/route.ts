import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

// Initialize Turso client
function getTursoClient() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    throw new Error('Missing TURSO_DATABASE_URL');
  }

  return createClient({
    url,
    authToken,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subscription, userId, type, token, deviceName } = body;

    if (!subscription && !token) {
      return NextResponse.json(
        { error: 'Subscription or token is required' },
        { status: 400 }
      );
    }

    const turso = getTursoClient();
    const subscriptionType = type || 'web';

    // For web subscriptions, check by endpoint
    if (subscriptionType === 'web' && subscription?.endpoint) {
      // Check if subscription already exists
      const existing = await turso.execute({
        sql: `SELECT id FROM push_subscriptions WHERE json_extract(subscription, '$.endpoint') = ?`,
        args: [subscription.endpoint],
      });

      if (existing.rows.length > 0) {
        // Update existing subscription
        await turso.execute({
          sql: `UPDATE push_subscriptions
                SET user_id = ?, subscription = ?, device_name = ?, enabled = 1, updated_at = datetime('now')
                WHERE id = ?`,
          args: [userId || null, JSON.stringify(subscription), deviceName || null, existing.rows[0].id],
        });

        return NextResponse.json({ success: true, updated: true });
      }
    }

    // For token-based subscriptions (Expo/FCM)
    if (token) {
      const existing = await turso.execute({
        sql: 'SELECT id FROM push_subscriptions WHERE token = ?',
        args: [token],
      });

      if (existing.rows.length > 0) {
        await turso.execute({
          sql: `UPDATE push_subscriptions
                SET user_id = ?, device_name = ?, enabled = 1, updated_at = datetime('now')
                WHERE id = ?`,
          args: [userId || null, deviceName || null, existing.rows[0].id],
        });

        return NextResponse.json({ success: true, updated: true });
      }
    }

    // Create new subscription
    const id = crypto.randomUUID();
    await turso.execute({
      sql: `INSERT INTO push_subscriptions (id, user_id, type, token, subscription, device_name, enabled)
            VALUES (?, ?, ?, ?, ?, ?, 1)`,
      args: [
        id,
        userId || null,
        subscriptionType,
        token || null,
        subscription ? JSON.stringify(subscription) : null,
        deviceName || null,
      ],
    });

    return NextResponse.json({ success: true, created: true, id });
  } catch (error) {
    console.error('[API] Subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
