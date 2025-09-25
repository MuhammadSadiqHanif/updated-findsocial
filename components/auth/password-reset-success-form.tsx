"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export default function PasswordResetSuccessForm() {
  return (
    <div className="bg-white py-8 px-4 shadow-sm rounded-lg sm:px-10">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="w-6 h-6 text-green-600" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Password reset</h2>
          <p className="text-sm text-gray-600 mb-2">Your password has been successfully reset.</p>
          <p className="text-sm text-gray-600">Click below to log in magically.</p>
        </div>

        {/* Continue Button */}
        <div className="space-y-6">
          <Link href="/login">
            <Button className="w-full bg-[#7F56D9] hover:bg-[#7F56D9] text-white py-2.5">Continue</Button>
          </Link>
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
