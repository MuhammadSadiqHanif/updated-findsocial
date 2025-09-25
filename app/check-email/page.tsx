import type { Metadata } from "next"
import CheckEmailForm from "@/components/auth/check-email-form"

export const metadata: Metadata = {
  title: "Check Your Email - FindSocial",
  description: "Check your email for password reset instructions",
}

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <CheckEmailForm />
      </div>
    </div>
  )
}
