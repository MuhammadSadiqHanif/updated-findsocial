"use client"

import type React from "react"

import { X } from "lucide-react"

interface Platform {
  id: string
  label: string
  icon: React.ReactNode
}

interface SelectedPlatformsProps {
  platforms: Platform[]
  selectedPlatforms: Record<string, boolean>
  onRemovePlatform: (platformId: string) => void
}

export function SelectedPlatforms({ platforms, selectedPlatforms, onRemovePlatform }: SelectedPlatformsProps) {
  const getSelectedPlatforms = () => {
    return platforms.filter((platform) => selectedPlatforms[platform.id])
  }

  const selectedPlatformsList = getSelectedPlatforms()

  if (selectedPlatformsList.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4 ml-4">
      {selectedPlatformsList.map((platform) => (
        <div
          key={platform.id}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1.5 text-sm transition-colors"
        >
          {platform.icon}
          <span className="text-gray-700">{platform.label}</span>
          <button
            onClick={() => onRemovePlatform(platform.id)}
            className="w-4 h-4 rounded-full hover:bg-gray-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-3 h-3 text-gray-500" />
          </button>
        </div>
      ))}
    </div>
  )
}
