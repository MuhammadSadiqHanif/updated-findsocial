"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated, getUserId, getUserInfo, getAuthHeaders } from '@/lib/auth'

export function useAuth(requireAuth = true) {
  const [userId, setUserId] = useState<string | null>(null)
  const [userInfo, setUserInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const authenticated = isAuthenticated()
    setIsLoggedIn(authenticated)

    if (!authenticated && requireAuth) {
      router.push('/login')
      return
    }

    if (authenticated) {
      // Get userId and user info
      const id = getUserId()
      const info = getUserInfo()
      
      setUserId(id)
      setUserInfo(info)
    }

    setIsLoading(false)
  }, [router, requireAuth])

  // Helper function to make API calls with userId
  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    if (!userId) {
      throw new Error('User not authenticated')
    }

    const headers = {
      ...getAuthHeaders(),
      'X-User-ID': userId,
      ...options.headers,
    }

    return fetch(endpoint, {
      ...options,
      headers,
    })
  }

  // Helper function to make API calls with userId in body
  const apiCallWithUserId = async (endpoint: string, data?: any, method = 'POST') => {
    if (!userId) {
      throw new Error('User not authenticated')
    }

    return apiCall(endpoint, {
      method,
      body: data ? JSON.stringify({
        ...data,
        userId
      }) : undefined,
    })
  }

  return {
    userId,
    userInfo,
    isLoading,
    isLoggedIn,
    apiCall,
    apiCallWithUserId,
  }
}