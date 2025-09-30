"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated, getUserId, getUserInfo, getAuthHeaders, getUserInfoFromManagementApi } from '@/lib/auth'

export function useAuth(requireAuth = true) {
  const [userId, setUserId] = useState<string | null>(null)
  const [userInfo, setUserInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0) // Rename to avoid conflict
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
      // Get userId from JWT first
      const id = getUserId()
      setUserId(id)
      
      // Fetch complete user info from Management API (including user_metadata)
      const fetchUserInfo = async () => {
        try {
          console.log('Fetching user info from Management API for:', id)
          if (id) { // Check if id is not null
            const managementUserInfo = await getUserInfoFromManagementApi(id)
            
            if (managementUserInfo) {
              console.log('Management API user info received:', managementUserInfo)
              setUserInfo(managementUserInfo)
            } else {
              // Fallback to basic JWT info
              console.log('Falling back to basic JWT info')
              const basicInfo = getUserInfo()
              setUserInfo(basicInfo)
            }
          } else {
            // Fallback to basic JWT info
            const basicInfo = getUserInfo()
            setUserInfo(basicInfo)
          }
        } catch (error) {
          console.error('Error fetching user info:', error)
          // Fallback to basic JWT info
          const basicInfo = getUserInfo()
          setUserInfo(basicInfo)
        } finally {
          setIsLoading(false)
        }
      }

      fetchUserInfo()
    } else {
      setIsLoading(false)
    }
  }, [router, requireAuth, refreshTrigger]) // Use refreshTrigger instead of apiCall

  // Helper function to make API calls with userId
  const makeApiCall = async (endpoint: string, options: RequestInit = {}) => {
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

    return makeApiCall(endpoint, {
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
    apiCall: makeApiCall, // Rename function to avoid conflict
    apiCallWithUserId,
    refreshUserInfo: () => setRefreshTrigger(prev => prev + 1), // Add refresh function
  }
}