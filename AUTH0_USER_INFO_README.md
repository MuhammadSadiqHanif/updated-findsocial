# Auth0 User Information Extraction

This documentation explains how to use the Auth0 Management API to extract user information using the exact configuration you provided.

## Overview

Your original code:
```javascript
var options = {
  method: 'post',
  url: `https://dev-findsocial.eu.auth0.com/oauth/token`,
  headers: { 'content-type': 'application/json' },
  data: `{"client_id":"${"19DdM9Nu3LZbqb7zVluXi3JEF6keVFRn"}","client_secret":"${"ejl_50g8DlOCGLPcqdTjGEhIfG7H4fsBG5M9OQ-wZ95BPEckCnfixvsSZUO-046Q"}","audience":"https://dev-findsocial.eu.auth0.com/api/v2/","grant_type":"client_credentials"}`,
};
```

## Implementation

I've created several files to help you extract user information:

### 1. Direct API Implementation (`lib/auth0-direct-api.ts`)
This file contains the exact implementation of your API call:
- `getUserInfoUsingYourExample()` - Uses your exact configuration to get management token
- `getUserInfoWithToken()` - Uses the token to get user information
- `completeUserInfoWorkflow()` - Complete workflow combining both steps

### 2. Enhanced Auth Library (`lib/auth.ts`)
Extended your existing auth library with:
- `getManagementApiToken()` - Get Auth0 Management API token
- `getUserInfoFromManagementApi()` - Get detailed user info from Management API
- `getUserMetadata()` - Get user metadata specifically

### 3. React Hooks (`hooks/use-user-info.ts`)
Easy-to-use React hooks:
- `useUserInfo()` - Hook for getting user information
- `useUserMetadata()` - Hook for getting user metadata

### 4. UI Components
- `components/direct-auth0-demo.tsx` - Demo of your exact API implementation
- `components/user-info-display.tsx` - Display user information nicely
- `components/auth0-management-demo.tsx` - Full management API demo

### 5. API Routes (`app/api/user/info/route.ts`)
Server-side implementation for getting user information

## Environment Variables Required

Make sure these environment variables are set in your `.env.local`:

```bash
# Auth0 Configuration (Already in your .env.local)
REACT_APP_AUTH0_API_DOMAIN=https://dev-findsocial.eu.auth0.com
REACT_APP_AUTH0_API_CLIENT_ID=QUsIRHYksftvz2DWIR2H7a0RRQc5AW1x
REACT_APP_AUTH0_API_CLIENT_SECRET=HLfl2J55vkAycVVhlkKvQxVL4-E5NSHFdlw0Bo2EJb2Z5WYxCLVB5IsETHXhvk6X
```

## Usage Examples

### Simple Usage (Direct API)
```typescript
import { completeUserInfoWorkflow } from '@/lib/auth0-direct-api'
import { getUserId } from '@/lib/auth'

const userId = getUserId() // Get current user's ID
const result = await completeUserInfoWorkflow(userId)

if (result.success) {
  console.log('User Info:', result.userInfo)
} else {
  console.error('Error:', result.error)
}
```

### Using React Hook
```typescript
import { useUserInfo } from '@/hooks/use-user-info'

function MyComponent() {
  const { userInfo, loading, error, refetch } = useUserInfo()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  
  return (
    <div>
      <h2>{userInfo?.name}</h2>
      <p>{userInfo?.email}</p>
    </div>
  )
}
```

### Using Enhanced Auth Functions
```typescript
import { getUserInfoFromManagementApi } from '@/lib/auth'

const userInfo = await getUserInfoFromManagementApi()
console.log('User Info:', userInfo)
```

## Available User Data

The Auth0 Management API returns comprehensive user information:

```typescript
interface UserInfo {
  user_id: string
  email: string
  name?: string
  nickname?: string
  picture?: string
  email_verified: boolean
  created_at: string
  updated_at: string
  last_login?: string
  login_count?: number
  app_metadata?: any
  user_metadata?: any
  identities?: Array<{
    provider: string
    user_id: string
    connection: string
    isSocial: boolean
  }>
}
```

## Testing the Implementation

1. **Navigate to Profile page** (`/Profile`) to see the demo tabs
2. **Direct Auth0 API tab** - Test your exact implementation
3. **Auth0 Management tab** - Test enhanced management functions
4. **Dashboard page** - See user info display in action

## API Endpoints

The implementation also includes:
- `GET /api/user/info?userId=USER_ID` - Get user info by ID
- `POST /api/user/info` - Get user info via POST body

## Error Handling

All functions include comprehensive error handling:
- Token acquisition failures
- API request failures
- Invalid user IDs
- Network issues

## Security Notes

- Management API credentials are used server-side only
- User data is filtered to remove sensitive information
- Tokens are not stored in localStorage
- All API calls include proper authentication headers

## Next Steps

You can now:
1. Extract any user's information using their user ID
2. Update user metadata
3. Search through users
4. Get authentication statistics
5. Manage user accounts programmatically

The implementation provides both simple utility functions and complete React components for immediate use.