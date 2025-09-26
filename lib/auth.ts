// Authentication utility functions

// Function to decode JWT token (simple base64 decode for the payload)
const decodeJWT = (token: string) => {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format')
    }
    
    const payload = parts[1]
    // Add padding if needed
    const padded = payload + '='.repeat((4 - payload.length % 4) % 4)
    const decoded = JSON.parse(atob(padded))
    return decoded
  } catch (error) {
    console.error('Error decoding JWT:', error)
    return null
  }
}

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false
  
  const token = localStorage.getItem('access_token')
  const expiresIn = localStorage.getItem('expires_in')
  const loginTimestamp = localStorage.getItem('login_timestamp')
  
  if (!token || !expiresIn || !loginTimestamp) {
    return false
  }
  
  // Check if token has expired
  const tokenExpirationTime = parseInt(loginTimestamp) + (parseInt(expiresIn) * 1000)
  const currentTime = Date.now()
  
  if (currentTime > tokenExpirationTime) {
    // Token has expired, clear storage
    clearAuthData()
    return false
  }
  
  return true
}

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null
  
  if (isAuthenticated()) {
    return localStorage.getItem('access_token')
  }
  
  return null
}

// Get userId from the JWT token
export const getUserId = (): string | null => {
  const token = getAuthToken()
  if (!token) return null
  
  const decoded = decodeJWT(token)
  if (!decoded) return null
  
  // Auth0 typically stores user ID in 'sub' field
  return decoded.sub || null
}

// Get user information from the JWT token
export const getUserInfo = () => {
  const token = getAuthToken()
  if (!token) return null
  
  const decoded = decodeJWT(token)
  if (!decoded) return null
  
  return {
    userId: decoded.sub,
    email: decoded.email,
    name: decoded.name,
    picture: decoded.picture,
    nickname: decoded.nickname,
    // Add other fields as needed
    ...decoded
  }
}

export const clearAuthData = (): void => {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem('access_token')
  localStorage.removeItem('token_type')
  localStorage.removeItem('expires_in')
  localStorage.removeItem('login_timestamp')
}

export const logout = (): void => {
  clearAuthData()
  // Redirect to login page
  window.location.href = '/login'
}

export const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken()
  const tokenType = localStorage.getItem('token_type') || 'Bearer'
  
  if (token) {
    return {
      'Authorization': `${tokenType} ${token}`,
      'Content-Type': 'application/json'
    }
  }
  
  return {
    'Content-Type': 'application/json'
  }
}

// Get Auth0 Management API token
export const getManagementApiToken = async (): Promise<string | null> => {
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

// Get detailed user information from Auth0 Management API
export const getUserInfoFromManagementApi = async (userId?: string): Promise<any | null> => {
  try {
    // Get user ID from current token if not provided
    const targetUserId = userId || getUserId()
    if (!targetUserId) {
      console.error('No user ID available')
      return null
    }

    // Get management API token
    const managementToken = await getManagementApiToken()
    if (!managementToken) {
      console.error('Failed to get management API token')
      return null
    }

    // Fetch user details from Management API
    const response = await fetch(
      `https://dev-findsocial.eu.auth0.com/api/v2/users/${encodeURIComponent(targetUserId)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${managementToken}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to get user info: ${response.statusText}`)
    }

    const userInfo = await response.json()
    return userInfo
  } catch (error) {
    console.error('Error getting user info from Management API:', error)
    return null
  }
}

// Get user metadata (app_metadata and user_metadata)
export const getUserMetadata = async (userId?: string): Promise<{ app_metadata?: any, user_metadata?: any } | null> => {
  try {
    const userInfo = await getUserInfoFromManagementApi(userId)
    if (!userInfo) return null

    return {
      app_metadata: userInfo.app_metadata || {},
      user_metadata: userInfo.user_metadata || {}
    }
  } catch (error) {
    console.error('Error getting user metadata:', error)
    return null
  }
}