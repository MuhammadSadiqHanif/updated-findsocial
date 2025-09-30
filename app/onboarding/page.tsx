"use client"
import OnboardingFlow from "@/components/onboarding-flow";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();

  useEffect(() => {
    // If onboarding already complete, redirect
    if (typeof window !== "undefined" && localStorage.getItem("onboardingComplete") === "true") {
      router.replace("/Dashboard");
    }
  }, [router]);

  const handleComplete = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("onboardingComplete", "true");
      router.replace("/Dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-2xl">
        <OnboardingFlow onComplete={handleComplete} />
      </div>
    </div>
  );
}
