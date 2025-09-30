import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get Auth0 Management API token
    const response = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        audience: `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/`,
        grant_type: 'client_credentials',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get management token');
    }

    const data = await response.json();
    
    return NextResponse.json({ 
      access_token: data.access_token,
      expires_in: data.expires_in 
    });
  } catch (error) {
    console.error('Error getting Auth0 management token:', error);
    return NextResponse.json(
      { error: 'Failed to get management token' },
      { status: 500 }
    );
  }
}