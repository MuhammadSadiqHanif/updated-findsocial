"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AuthenticationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    // Check for error from login page
    const loginError = searchParams.get('error')
    if (loginError) {
      setStatus('error')
      setErrorMessage('Authentication failed. Please try again.')
      setTimeout(() => {
        router.push('/login')
      }, 3000)
      return
    }

    // Parse the URL fragment to get the access token
    const hash = window.location.hash
    
    if (hash.includes('access_token')) {
      // Extract the access token from the URL
      const urlParams = new URLSearchParams(hash.substring(1))
      const accessToken = urlParams.get('access_token')
      const expiresIn = urlParams.get('expires_in')
      const tokenType = urlParams.get('token_type')
      
      if (accessToken) {
        // Store the token in localStorage
        localStorage.setItem('access_token', accessToken)
        localStorage.setItem('token_type', tokenType || 'Bearer')
        localStorage.setItem('expires_in', expiresIn || '7200')
        localStorage.setItem('login_timestamp', Date.now().toString())
        
        console.log('Authentication successful')
        setStatus('success')
        
        // Redirect to dashboard after a brief success message
        setTimeout(() => {
          router.push('/Dashboard')
        }, 1500)
      } else {
        // Handle authentication error
        setStatus('error')
        setErrorMessage('Authentication failed - no access token found')
        setTimeout(() => {
          router.push('/login?error=authentication_failed')
        }, 3000)
      }
    } else if (hash.includes('error')) {
      // Handle authentication error
      const urlParams = new URLSearchParams(hash.substring(1))
      const error = urlParams.get('error')
      const errorDescription = urlParams.get('error_description')
      
      setStatus('error')
      setErrorMessage(errorDescription || error || 'Authentication failed')
      
      setTimeout(() => {
        router.push('/login?error=' + encodeURIComponent(error || 'authentication_failed'))
      }, 3000)
    } else {
      // No hash parameters found, redirect to login
      setTimeout(() => {
        router.push('/login')
      }, 1000)
    }
  }, [router, searchParams])

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Login Successful!</h2>
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-4">{errorMessage}</p>
          <p className="text-sm text-gray-500">Redirecting to login page...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7F56D9] mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Authenticating...</h2>
        <p className="text-gray-600">Please wait while we log you in.</p>
      </div>
    </div>
  )
}