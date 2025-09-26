// Direct implementation of the Auth0 API call you mentioned
// This is the exact implementation using your provided options

export async function getUserInfoUsingYourExample() {
  // Your exact options configuration
  const options = {
    method: 'post',
    url: `https://dev-findsocial.eu.auth0.com/oauth/token`,
    headers: { 'content-type': 'application/json' },
    data: `{"client_id":"${"19DdM9Nu3LZbqb7zVluXi3JEF6keVFRn"}","client_secret":"${"ejl_50g8DlOCGLPcqdTjGEhIfG7H4fsBG5M9OQ-wZ95BPEckCnfixvsSZUO-046Q"}","audience":"https://dev-findsocial.eu.auth0.com/api/v2/","grant_type":"client_credentials"}`,
  };

  try {
    console.log('Making request with your exact options:', options);

    // Step 1: Get the management token using your exact configuration
    const tokenResponse = await fetch(options.url, {
      method: options.method.toUpperCase(),
      headers: options.headers,
      body: options.data
    });

    if (!tokenResponse.ok) {
      throw new Error(`Token request failed: ${tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json();
    console.log('Token response:', tokenData);

    // Step 2: Use the token to get user information
    const managementToken = tokenData.access_token;
    
    // You can now use this token to make requests to Auth0 Management API
    // Example: Get current user's info (you'll need the user ID)
    
    return {
      success: true,
      access_token: managementToken,
      token_type: tokenData.token_type,
      expires_in: tokenData.expires_in,
      message: 'Successfully obtained Auth0 Management API token using your configuration'
    };

  } catch (error) {
    console.error('Error with your Auth0 API call:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Function to get user info using the obtained token
export async function getUserInfoWithToken(userId: string, accessToken: string) {
  try {
    const userResponse = await fetch(
      `https://dev-findsocial.eu.auth0.com/api/v2/users/${encodeURIComponent(userId)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!userResponse.ok) {
      throw new Error(`User info request failed: ${userResponse.statusText}`);
    }

    const userInfo = await userResponse.json();
    return {
      success: true,
      userInfo,
      message: 'Successfully retrieved user information'
    };

  } catch (error) {
    console.error('Error getting user info:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Complete workflow function
export async function completeUserInfoWorkflow(userId: string) {
  try {
    // Step 1: Get token using your exact configuration
    const tokenResult = await getUserInfoUsingYourExample();
    
    if (!tokenResult.success) {
      return {
        success: false,
        error: 'Failed to get management token: ' + tokenResult.error
      };
    }

    console.log('Management token obtained successfully');

    // Step 2: Get user info using the token
    const userInfoResult = await getUserInfoWithToken(userId, tokenResult.access_token);
    
    return {
      success: userInfoResult.success,
      tokenInfo: tokenResult,
      userInfo: userInfoResult.userInfo,
      error: userInfoResult.error
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// React Hook to use this functionality
import { useState, useCallback } from 'react';

export function useAuth0UserInfo() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchUserInfo = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await completeUserInfoWorkflow(userId);
      
      if (result.success) {
        setData(result);
      } else {
        setError(result.error || 'Unknown error');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const getTokenOnly = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getUserInfoUsingYourExample();
      
      if (result.success) {
        setData(result);
      } else {
        setError(result.error || 'Unknown error');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    data,
    error,
    fetchUserInfo,
    getTokenOnly,
    clearData: () => setData(null),
    clearError: () => setError(null)
  };
}