import { useState, useEffect } from 'react'
import { getUserInfoFromManagementApi, getUserMetadata, isAuthenticated } from '@/lib/auth'

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
  [key: string]: any
}

interface UseUserInfoReturn {
  userInfo: UserInfo | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export const useUserInfo = (userId?: string): UseUserInfoReturn => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUserInfo = async () => {
    if (!isAuthenticated()) {
      setError('User is not authenticated')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const info = await getUserInfoFromManagementApi(userId)
      if (info) {
        setUserInfo(info)
      } else {
        setError('Failed to fetch user information')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated()) {
      fetchUserInfo()
    }
  }, [userId])

  return {
    userInfo,
    loading,
    error,
    refetch: fetchUserInfo
  }
}

// Hook specifically for user metadata
export const useUserMetadata = (userId?: string) => {
  const [metadata, setMetadata] = useState<{ app_metadata?: any, user_metadata?: any } | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMetadata = async () => {
    if (!isAuthenticated()) {
      setError('User is not authenticated')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await getUserMetadata(userId)
      if (data) {
        setMetadata(data)
      } else {
        setError('Failed to fetch user metadata')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated()) {
      fetchMetadata()
    }
  }, [userId])

  return {
    metadata,
    loading,
    error,
    refetch: fetchMetadata
  }
}