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
    const { endpoint, token } = body;

    if (!endpoint && !token) {
      return NextResponse.json(
        { error: 'Endpoint or token is required' },
        { status: 400 }
      );
    }

    const turso = getTursoClient();

    if (endpoint) {
      // Delete by endpoint (web push)
      await turso.execute({
        sql: `DELETE FROM push_subscriptions WHERE json_extract(subscription, '$.endpoint') = ?`,
        args: [endpoint],
      });
    } else if (token) {
      // Delete by token (Expo/FCM)
      await turso.execute({
        sql: 'DELETE FROM push_subscriptions WHERE token = ?',
        args: [token],
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
