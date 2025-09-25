import type { Metadata } from "next"
import PasswordResetSuccessForm from "@/components/auth/password-reset-success-form"

export const metadata: Metadata = {
  title: "Password Reset - FindSocial",
  description: "Your password has been successfully reset",
}

export default function PasswordResetSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <PasswordResetSuccessForm />
      </div>
    </div>
  )
}
