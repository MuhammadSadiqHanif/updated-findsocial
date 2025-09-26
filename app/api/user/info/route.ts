import { NextRequest, NextResponse } from 'next/server'

// Get Auth0 Management API token
async function getManagementApiToken(): Promise<string | null> {
  try {
    const options = {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        client_id: "19DdM9Nu3LZbqb7zVluXi3JEF6keVFRn",
        client_secret: "ejl_50g8DlOCGLPcqdTjGEhIfG7H4fsBG5M9OQ-wZ95BPEckCnfixvsSZUO-046Q",
        audience: `https://dev-findsocial.eu.auth0.com/api/v2/`,
        grant_type: 'client_credentials'
      })
    }

    const response = await fetch(`https://dev-findsocial.eu.auth0.com/oauth/token`, options)
    
    if (!response.ok) {
      throw new Error(`Failed to get management token: ${response.statusText}`)
    }

    const data = await response.json()
    return data.access_token
  } catch (error) {
    console.error('Error getting management API token:', error)
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get management API token
    const managementToken = await getManagementApiToken()
    if (!managementToken) {
      return NextResponse.json(
        { error: 'Failed to get management API token' },
        { status: 500 }
      )
    }

    // Fetch user details from Management API
    const response = await fetch(
      `https://dev-findsocial.eu.auth0.com/api/v2/users/${encodeURIComponent(userId)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${managementToken}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to get user info: ${response.statusText}` },
        { status: response.status }
      )
    }

    const userInfo = await response.json()
    
    // Return user info with sensitive data filtered out
    const filteredUserInfo = {
      user_id: userInfo.user_id,
      email: userInfo.email,
      name: userInfo.name,
      nickname: userInfo.nickname,
      picture: userInfo.picture,
      email_verified: userInfo.email_verified,
      created_at: userInfo.created_at,
      updated_at: userInfo.updated_at,
      last_login: userInfo.last_login,
      login_count: userInfo.login_count,
      app_metadata: userInfo.app_metadata || {},
      user_metadata: userInfo.user_metadata || {},
      identities: userInfo.identities?.map((identity: any) => ({
        provider: identity.provider,
        user_id: identity.user_id,
        connection: identity.connection,
        isSocial: identity.isSocial
      }))
    }

    return NextResponse.json(filteredUserInfo)
  } catch (error) {
    console.error('Error in user info API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get management API token
    const managementToken = await getManagementApiToken()
    if (!managementToken) {
      return NextResponse.json(
        { error: 'Failed to get management API token' },
        { status: 500 }
      )
    }

    // Fetch user details from Management API
    const response = await fetch(
      `https://dev-findsocial.eu.auth0.com/api/v2/users/${encodeURIComponent(userId)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${managementToken}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to get user info: ${response.statusText}` },
        { status: response.status }
      )
    }

    const userInfo = await response.json()
    return NextResponse.json(userInfo)
  } catch (error) {
    console.error('Error in user info API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}