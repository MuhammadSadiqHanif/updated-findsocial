"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Instagram,
  Music,
  Search,
  CheckCircle,
  Star,
  Plus,
} from "lucide-react";
import Onboading1 from "@/public/onboading_images/onboard1.png";
import Onboading2 from "@/public/onboading_images/onboard2.png";
import Onboading3 from "@/public/onboading_images/onboard3.png";
import Image from "next/image";
interface OnboardingFlowProps {
  onComplete?: () => void;
}

const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const skipOnboarding = () => {
    onComplete?.();
  };

  const completeOnboarding = () => {
    onComplete?.();
  };

  const ProgressBar = () => (
    <div className="w-full bg-gray-100">
      <div className="flex gap-3">
        {[0, 1, 2].map((step) => (
          <div
            key={step}
            className={`h-1 flex-1 transition-colors duration-300 marign ${
              step <= currentStep - 1 ? "bg-purple-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );

  const WelcomeScreen = () => (
    <div className="text-center max-w-2xl mx-auto">
      <div className="mb-8 flex justify-center">
        <div className="w-20 h-20 bg-gradient-to-br from-[#7F56D9] via-purple-500 to-[#7F56D9] rounded-full shadow-xl"></div>
      </div>

      <h1 className="text-4xl font-bold text-[#101828] mb-6 leading-tight">
        Welcome to FindSocial — Reach the
        <br />
        Right Contacts, Fast.
      </h1>

      <p className="text-[#344054] text-l mb-8 max-s-lg mx-auto">
        Find influencers, artists, and creators with verified contact info in
        seconds.
      </p>

      <div className="flex gap-6 justify-center">
        <Button
          variant="outline"
          onClick={skipOnboarding}
          className="px-4 py-6 text-[#344054] border-[#D0D5DD] cursor-pointer hover:bg-gray-50 bg-white text-lg"
        >
          Skip for now
        </Button>
        <Button
          onClick={nextStep}
          className="px-4 py-6 bg-[#7F56D9] hover:bg-[#7F56D9] text-white text-lg cursor-pointer"
        >
          Show me how
        </Button>
      </div>
    </div>
  );

  const ExportScreen = () => (
    <div className="flex items-center justify-between max-w-6xl mx-auto">
      <div className="flex-1 pr-16">
        <p className="text-[#344054] font-medium mb-3 text-lg">Onboarding</p>
        <h2 className="text-4xl font-[500] text-[#101828] mb-8">
          Export & Save Contacts
        </h2>
        <p className="text-[#101828] text-xl font-[400] mb-12 leading-normal max-w-lg">
          Easily organize and export your contacts list in CSV or PDF format
          with detailed info, ready for outreach. Save lists to access later or
          reuse in future campaigns.
        </p>
        <Button
          onClick={completeOnboarding}
          className="bg-[#6941C6] hover:bg-[#6941C6] text-white px-8 py-4 text-md cursor-pointer"
        >
          Let's Go <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 flex justify-center">
        <div className="relative w-80 h-80">
          <Image src={Onboading3} width={350} height={300} alt="onboad1" />
        </div>
      </div>
    </div>
  );

  const FiltersScreen = () => (
    <div className="flex items-center justify-between max-w-6xl mx-auto">
      <div className="flex-1 pr-16">
        <p className="text-[#344054] font-medium mb-3 text-lg">Onboarding</p>
        <h2 className="text-4xl font-[500] text-[#101828] mb-8">
          Smart Filters & Contact
          <br />
          Accuracy
        </h2>
        <p className="text-[#101828] text-xl font-[400] mb-12 leading-normal max-w-lg">
          Find creators and contacts from platforms like Instagram, TikTok,
          Spotify, and more. Search by keywords, categories, or filters to get
          accurate results instantly.
        </p>
        <Button
          onClick={nextStep}
          className="bg-[#6941C6] hover:bg-[#6941C6] text-white px-8 py-4 text-md cursor-pointer"
        >
          Next <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 flex justify-center">
        <div className="relative w-80 h-80">
          <Image src={Onboading2} width={350} height={300} alt="onboad1" />
        </div>
      </div>
    </div>
  );

  const PlatformsScreen = () => (
    <div className="flex items-center justify-between max-w-6xl mx-auto">
      <div className="flex-1 pr-16">
        <p className="text-[#344054] font-medium mb-3 text-lg">Onboarding</p>
        <h2 className="text-4xl font-[500] text-[#101828] mb-8">
          Search Across Platforms
        </h2>
        <p className="text-[#101828] text-xl font-[400] mb-12 leading-normal max-w-lg">
          Find creators and contacts from platforms like Instagram, TikTok,
          Spotify, and more. Search by keywords, categories, or filters to get
          accurate results instantly.
        </p>
        <Button
          onClick={nextStep}
          className="bg-[#6941C6] hover:bg-[#6941C6] text-white px-8 py-4 text-md cursor-pointer"
        >
          Next <ArrowRight className="ml-1 w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 flex justify-center">
        <div className="relative w-80 h-80">
          <Image src={Onboading1} width={350} height={300} alt="onboad1" />
        </div>
      </div>
    </div>
  );

  const screens = [WelcomeScreen, PlatformsScreen, FiltersScreen, ExportScreen];
  const CurrentScreen = screens[currentStep];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {currentStep > 0 && (
        <div className="w-full">
          <div className="flex justify-center items-center px-8 py-6">
            <div className="flex-1 max-lg">
              <ProgressBar />
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col justify-center px-8 pb-16 pt-8">
        <div className="w-full">
          {currentStep > 0 && (
            <div className="w-[50%] ml-auto mr-auto flex justify-end mb-10">
              <Button
                variant="ghost"
                onClick={skipOnboarding}
                className="text-[#6941C6] hover:text-[#6941C6] hover:bg-purple-50 ml-8 text-lg cursor-pointer"
              >
                Skip
              </Button>
            </div>
          )}
          <CurrentScreen />
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
