"use client"

import { useState } from "react"
import OnboardingFlow from "@/components/onboarding-flow"
import Dashboard from "@/components/dashboard"
import { useRouter } from "next/navigation"; 

export default function Home() {
  const [showDashboard, setShowDashboard] = useState(false)
  const router = useRouter();
  const handleOnboardingComplete = () => {
    router.push('/Dashboard');
  }

  return (
    <div className="min-h-screen bg-white">
      <OnboardingFlow onComplete={handleOnboardingComplete} />
    </div>
  )
}
