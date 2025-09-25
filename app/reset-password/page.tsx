import type { Metadata } from "next"
import ResetPasswordForm from "@/components/auth/reset-password-form"

export const metadata: Metadata = {
  title: "Set New Password - FindSocial",
  description: "Set your new password for FindSocial account",
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Purple gradient blob */}
      {/* <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full opacity-80"></div> */}

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <ResetPasswordForm />
      </div>
    </div>
  )
}
