"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <div className="space-y-8">
      {/* Purple gradient blob */}
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-gradient-to-br from-[#7F56D9] to-[#7F56D9] rounded-full opacity-80" />
      </div>

      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-semibold text-gray-900">Sign up for FindSocial — free forever</h1>
        <p className="text-gray-600 leading-relaxed">
          Find and reach the right influencers with real-time data and smart filters. All in one simple, powerful
          platform — no fluff, just results.
        </p>
      </div>

      {/* Social signup buttons */}
      <div className="space-y-3">
        <Button variant="outline" className="w-full h-12 cursor-pointer border-gray-200 hover:bg-gray-50 bg-transparent" type="button">
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign up with Google
        </Button>

        <Button variant="outline" className="w-full h-12 cursor-pointer border-gray-200 hover:bg-gray-50 bg-transparent" type="button">
          <svg className="w-5 h-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          Sign up with Facebook
        </Button>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">OR</span>
        </div>
      </div>

      {/* Signup form */}
      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
              First name
            </Label>
            <Input
              id="firstName"
              type="text"
              placeholder="Emma"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="h-12 border-gray-200 focus:border-[#7F56D9] focus:ring-[#7F56D9]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
              Last name
            </Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Smith"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="h-12 border-gray-200 focus:border-[#7F56D9] focus:ring-[#7F56D9]"
            />
          </div>
        </div>

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
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 border-gray-200 focus:border-[#7F56D9] focus:ring-[#7F56D9] pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-sm text-gray-500">Use 8+ characters with a mix of letters, numbers, and symbols.</p>
        </div>

        <Button type="submit" className="w-full cursor-pointer h-12 bg-[#7F56D9] hover:bg-[#7F56D9] text-white">
          Sign up for free
        </Button>
      </form>

      {/* Login link */}
      <div className="text-center">
        <span className="text-gray-600">Already have an account? </span>
        <Link href="/login" className="text-[#7F56D9] hover:text-[#7F56D9]">
          Log In
        </Link>
      </div>
    </div>
  )
}
