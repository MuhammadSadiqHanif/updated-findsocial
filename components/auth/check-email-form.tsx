"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

export default function CheckEmailForm() {
  const [email, setEmail] = useState("emma.smith@example.com")

  useEffect(() => {
    const resetEmail = sessionStorage.getItem("resetEmail")
    if (resetEmail) {
      setEmail(resetEmail)
    }
  }, [])

  const handleOpenEmailApp = () => {
    // This will attempt to open the default email client
    window.location.href = "mailto:"
  }

  const handleResendEmail = () => {
    // Handle resend email logic here
    console.log("Resending email...")
  }

  return (
    <div className="bg-white py-8 px-4 shadow-sm rounded-lg sm:px-10">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Email Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <Mail className="w-6 h-6 text-gray-600" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Check your email</h2>
          <p className="text-sm text-gray-600">
            We sent a password reset link to <span className="font-medium">{email}</span>
          </p>
        </div>

        {/* Open Email App Button */}
        <div className="space-y-6">
          <Button onClick={handleOpenEmailApp} className="w-full cursor-pointer bg-[#7F56D9] hover:bg-[#7F56D9] text-white py-2.5">
            Open email app
          </Button>
        </div>

        {/* Resend Email */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Didn't receive the email?{" "}
            <button onClick={handleResendEmail} className="cursor-pointer text-[#7F56D9] hover:text-[#7F56D9] font-medium">
              Click to resend
            </button>
          </p>
        </div>

        {/* Back to login */}
        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center space-x-1"
          >
            <span>←</span>
            <span>Back to log in</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
