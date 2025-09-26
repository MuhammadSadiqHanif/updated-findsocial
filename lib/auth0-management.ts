// Example utility to demonstrate Auth0 Management API usage
// This shows how to use the Auth0 API as mentioned in your request

/**
 * Get Auth0 Management API Access Token
 * Uses the configuration from your original request
 */
export async function getAuth0ManagementToken(): Promise<string | null> {
  const options = {
    method: 'POST',
    url: `https://dev-findsocial.eu.auth0.com/oauth/token`,
    headers: { 'content-type': 'application/json' },
    data: JSON.stringify({
      client_id: "19DdM9Nu3LZbqb7zVluXi3JEF6keVFRn",
      client_secret: "ejl_50g8DlOCGLPcqdTjGEhIfG7H4fsBG5M9OQ-wZ95BPEckCnfixvsSZUO-046Q",
      audience: `https://dev-findsocial.eu.auth0.com/api/v2/`,
      grant_type: 'client_credentials'
    })
  };

  try {
    const response = await fetch(options.url, {
      method: options.method,
      headers: options.headers,
      body: options.data
    });

    if (!response.ok) {
      throw new Error(`Auth0 Token Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Failed to get Auth0 management token:', error);
    return null;
  }
}

/**
 * Fetch user information from Auth0 Management API
 * @param userId - The Auth0 user ID (e.g., "auth0|60...")
 * @param managementToken - The management API access token
 */
export async function fetchAuth0UserInfo(userId: string, managementToken?: string): Promise<any> {
  try {
    // Get management token if not provided
    const token = managementToken || await getAuth0ManagementToken();
    if (!token) {
      throw new Error('Failed to get management API token');
    }

    const response = await fetch(
      `https://dev-findsocial.eu.auth0.com/api/v2/users/${encodeURIComponent(userId)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch user info: ${response.statusText}`);
    }

    const userInfo = await response.json();
    return userInfo;
  } catch (error) {
    console.error('Error fetching Auth0 user info:', error);
    throw error;
  }
}

/**
 * Update user metadata in Auth0
 * @param userId - The Auth0 user ID
 * @param metadata - The metadata to update (user_metadata or app_metadata)
 * @param type - Type of metadata ('user' or 'app')
 */
export async function updateAuth0UserMetadata(
  userId: string, 
  metadata: any, 
  type: 'user' | 'app' = 'user'
): Promise<any> {
  try {
    const token = await getAuth0ManagementToken();
    if (!token) {
      throw new Error('Failed to get management API token');
    }

    const body = type === 'user' 
      ? { user_metadata: metadata }
      : { app_metadata: metadata };

    const response = await fetch(
      `https://dev-findsocial.eu.auth0.com/api/v2/users/${encodeURIComponent(userId)}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update user metadata: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating Auth0 user metadata:', error);
    throw error;
  }
}

/**
 * Get all users from Auth0 (with pagination)
 * @param page - Page number (0-based)
 * @param perPage - Results per page (max 100)
 * @param searchQuery - Optional search query
 */
export async function fetchAuth0Users(
  page: number = 0, 
  perPage: number = 25, 
  searchQuery?: string
): Promise<any> {
  try {
    const token = await getAuth0ManagementToken();
    if (!token) {
      throw new Error('Failed to get management API token');
    }

    const params = new URLSearchParams({
      page: page.toString(),
      per_page: Math.min(perPage, 100).toString(),
      include_totals: 'true'
    });

    if (searchQuery) {
      params.append('q', searchQuery);
    }

    const response = await fetch(
      `https://dev-findsocial.eu.auth0.com/api/v2/users?${params}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching Auth0 users:', error);
    throw error;
  }
}

// Example usage:
/*
// Get management token
const token = await getAuth0ManagementToken();

// Get user info
const userInfo = await fetchAuth0UserInfo('auth0|60...', token);
console.log('User info:', userInfo);

// Update user metadata
await updateAuth0UserMetadata('auth0|60...', { 
  preferences: { theme: 'dark' },
  lastActivity: new Date().toISOString()
}, 'user');

// Search users
const users = await fetchAuth0Users(0, 10, 'email:john@example.com');
console.log('Users:', users);
*/