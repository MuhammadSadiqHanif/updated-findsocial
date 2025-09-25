"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Lock, Check } from "lucide-react"

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const hasMinLength = password.length >= 8
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (hasMinLength && hasSpecialChar && password === confirmPassword) {
      // Handle password reset logic here
      console.log("Password reset submitted")
      router.push("/password-reset-success")
    }
  }

  return (
    <div className="bg-white py-8 px-4 shadow-sm rounded-lg sm:px-10">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Lock Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <Lock className="w-6 h-6 text-gray-600" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Set new password</h2>
          <p className="text-sm text-gray-600">Your new password must be different to previously used passwords.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pr-10"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="pr-10"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center ${
                  hasMinLength ? "bg-green-100" : "bg-gray-100"
                }`}
              >
                {hasMinLength && <Check className="w-3 h-3 text-green-600" />}
              </div>
              <span className={`text-sm ${hasMinLength ? "text-green-600" : "text-gray-500"}`}>
                Must be at least 8 characters
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center ${
                  hasSpecialChar ? "bg-green-100" : "bg-gray-100"
                }`}
              >
                {hasSpecialChar && <Check className="w-3 h-3 text-green-600" />}
              </div>
              <span className={`text-sm ${hasSpecialChar ? "text-green-600" : "text-gray-500"}`}>
                Must contain one special character
              </span>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#7F56D9] hover:bg-[#7F56D9] text-white py-2.5"
            disabled={!hasMinLength || !hasSpecialChar || password !== confirmPassword}
          >
            Reset password
          </Button>
        </form>

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
