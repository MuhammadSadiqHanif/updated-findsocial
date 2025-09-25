"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Key } from "lucide-react"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      // Store email in sessionStorage to pass to check-email page
      sessionStorage.setItem("resetEmail", email)
      router.push("/check-email")
    }
  }

  return (
    <div className="space-y-8">
      {/* Key icon */}
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
          <Key className="w-8 h-8 text-gray-600" />
        </div>
      </div>

      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-semibold text-gray-900">Forgot password?</h1>
        <p className="text-gray-600 leading-relaxed">
          Please enter your email address below to which we can send you instructions.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 border-gray-200 focus:border-[#7F56D9] focus:ring-[#7F56D9]"
            required
          />
        </div>

        <Button type="submit" className="w-full h-12 cursor-pointer bg-[#7F56D9] hover:bg-[#7F56D9] text-white">
          Send Instructions
        </Button>
      </form>

      {/* Back to login link */}
      <div className="text-center">
        <Link href="/login" className="inline-flex items-center text-gray-600 hover:text-gray-700">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to log in
        </Link>
      </div>
    </div>
  )
}
