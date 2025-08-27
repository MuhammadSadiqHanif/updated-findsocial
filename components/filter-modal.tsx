"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { X, Check, ChevronDown } from "lucide-react"

interface Platform {
  id: string
  label: string
  icon: React.ReactNode
}

interface FilterSettings {
  followersRange: [number, number]
  followingRange: [number, number]
  socialPostRange: [number, number]
  accountPreference: {
    private: boolean
    verified: boolean
    professional: boolean
  }
}

interface FilterModalProps {
  show: boolean
  platforms: Platform[]
  selectedFilterPlatform: string
  setSelectedFilterPlatform: (platform: string) => void
  filterSettings: FilterSettings
  setFilterSettings: React.Dispatch<React.SetStateAction<FilterSettings>>
  onClose: () => void
}

export function FilterModal({
  show,
  platforms,
  selectedFilterPlatform,
  setSelectedFilterPlatform,
  filterSettings,
  setFilterSettings,
  onClose,
}: FilterModalProps) {
  if (!show) return null

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(".0", "") + "M"
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(".0", "") + "K"
    }
    return num.toString()
  }

  const handleRangeChange = (
    rangeType: "followersRange" | "followingRange" | "socialPostRange",
    values: [number, number],
  ) => {
    setFilterSettings((prev) => ({
      ...prev,
      [rangeType]: values,
    }))
  }

  const handleSliderMouseDown = (
    rangeType: "followersRange" | "followingRange" | "socialPostRange",
    handleIndex: 0 | 1,
    event: React.MouseEvent,
  ) => {
    event.preventDefault()
    const slider = event.currentTarget.parentElement as HTMLElement
    const rect = slider.getBoundingClientRect()
    const maxValue = 50000000

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX - rect.left
      const percentage = Math.max(0, Math.min(1, x / rect.width))
      const newValue = Math.round(percentage * maxValue)

      const currentRange = filterSettings[rangeType]
      let newRange: [number, number]

      if (handleIndex === 0) {
        newRange = [Math.min(newValue, currentRange[1]), currentRange[1]]
      } else {
        newRange = [currentRange[0], Math.max(newValue, currentRange[0])]
      }

      handleRangeChange(rangeType, newRange)
    }

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  const getSliderPosition = (value: number, maxValue = 50000000) => {
    return (value / maxValue) * 100
  }

  const handleAccountPreferenceToggle = (preference: string) => {
    setFilterSettings((prev) => ({
      ...prev,
      accountPreference: {
        ...prev.accountPreference,
        [preference]: !prev.accountPreference[preference as keyof typeof prev.accountPreference],
      },
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl h-[600px] flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
          <div className="space-y-2">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => setSelectedFilterPlatform(platform.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                  selectedFilterPlatform === platform.id
                    ? "bg-white shadow-sm border border-gray-200"
                    : "hover:bg-gray-100"
                } cursor-pointer`}
              >
                {platform.icon}
                <span className="text-sm font-medium">{platform.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Data Filters</h2>
              <p className="text-sm text-gray-600 mt-1">
                Filter your data to target the right influencers and make smarter outreach decisions.
              </p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center cursor-pointer">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Filter Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-8">
              {/* Platform Title */}
              <div className="flex items-center gap-3">
                {platforms.find((p) => p.id === selectedFilterPlatform)?.icon}
                <h3 className="text-lg font-semibold capitalize">{selectedFilterPlatform}</h3>
              </div>

              {/* Followers Range */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Followers Range</label>
                  <span className="text-sm text-gray-500">
                    {formatNumber(filterSettings.followersRange[0])} - {formatNumber(filterSettings.followersRange[1])}
                  </span>
                </div>
                <div className="relative cursor-pointer" style={{ height: "20px" }}>
                  <div className="absolute top-1/2 transform -translate-y-1/2 w-full h-2 bg-gray-200 rounded-full"></div>
                  <div
                    className="absolute top-1/2 transform -translate-y-1/2 h-2 bg-[#7F56D9] rounded-full"
                    style={{
                      left: `${getSliderPosition(filterSettings.followersRange[0])}%`,
                      width: `${getSliderPosition(filterSettings.followersRange[1]) - getSliderPosition(filterSettings.followersRange[0])}%`,
                    }}
                  ></div>
                  <div
                    className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-[#7F56D9] rounded-full cursor-grab active:cursor-grabbing shadow-md hover:scale-110 transition-transform"
                    style={{
                      left: `${getSliderPosition(filterSettings.followersRange[0])}%`,
                      marginLeft: "-8px",
                    }}
                    onMouseDown={(e) => handleSliderMouseDown("followersRange", 0, e)}
                  ></div>
                  <div
                    className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-[#7F56D9] rounded-full cursor-grab active:cursor-grabbing shadow-md hover:scale-110 transition-transform"
                    style={{
                      left: `${getSliderPosition(filterSettings.followersRange[1])}%`,
                      marginLeft: "-8px",
                    }}
                    onMouseDown={(e) => handleSliderMouseDown("followersRange", 1, e)}
                  ></div>
                </div>
              </div>

              {/* Following Range */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Following Range</label>
                  <span className="text-sm text-gray-500">
                    {formatNumber(filterSettings.followingRange[0])} - {formatNumber(filterSettings.followingRange[1])}
                  </span>
                </div>
                <div className="relative cursor-pointer" style={{ height: "20px" }}>
                  <div className="absolute top-1/2 transform -translate-y-1/2 w-full h-2 bg-gray-200 rounded-full"></div>
                  <div
                    className="absolute top-1/2 transform -translate-y-1/2 h-2 bg-[#7F56D9] rounded-full"
                    style={{
                      left: `${getSliderPosition(filterSettings.followingRange[0])}%`,
                      width: `${getSliderPosition(filterSettings.followingRange[1]) - getSliderPosition(filterSettings.followingRange[0])}%`,
                    }}
                  ></div>
                  <div
                    className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-[#7F56D9] rounded-full cursor-grab active:cursor-grabbing shadow-md hover:scale-110 transition-transform"
                    style={{
                      left: `${getSliderPosition(filterSettings.followingRange[0])}%`,
                      marginLeft: "-8px",
                    }}
                    onMouseDown={(e) => handleSliderMouseDown("followingRange", 0, e)}
                  ></div>
                  <div
                    className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-[#7F56D9] rounded-full cursor-grab active:cursor-grabbing shadow-md hover:scale-110 transition-transform"
                    style={{
                      left: `${getSliderPosition(filterSettings.followingRange[1])}%`,
                      marginLeft: "-8px",
                    }}
                    onMouseDown={(e) => handleSliderMouseDown("followingRange", 1, e)}
                  ></div>
                </div>
              </div>

              {/* Social Post Range */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Social Post Range</label>
                  <span className="text-sm text-gray-500">
                    {formatNumber(filterSettings.socialPostRange[0])} -{" "}
                    {formatNumber(filterSettings.socialPostRange[1])}
                  </span>
                </div>
                <div className="relative cursor-pointer" style={{ height: "20px" }}>
                  <div className="absolute top-1/2 transform -translate-y-1/2 w-full h-2 bg-gray-200 rounded-full"></div>
                  <div
                    className="absolute top-1/2 transform -translate-y-1/2 h-2 bg-[#7F56D9] rounded-full"
                    style={{
                      left: `${getSliderPosition(filterSettings.socialPostRange[0])}%`,
                      width: `${getSliderPosition(filterSettings.socialPostRange[1]) - getSliderPosition(filterSettings.socialPostRange[0])}%`,
                    }}
                  ></div>
                  <div
                    className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-[#7F56D9] rounded-full cursor-grab active:cursor-grabbing shadow-md hover:scale-110 transition-transform"
                    style={{
                      left: `${getSliderPosition(filterSettings.socialPostRange[0])}%`,
                      marginLeft: "-8px",
                    }}
                    onMouseDown={(e) => handleSliderMouseDown("socialPostRange", 0, e)}
                  ></div>
                  <div
                    className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-[#7F56D9] rounded-full cursor-grab active:cursor-grabbing shadow-md hover:scale-110 transition-transform"
                    style={{
                      left: `${getSliderPosition(filterSettings.socialPostRange[1])}%`,
                      marginLeft: "-8px",
                    }}
                    onMouseDown={(e) => handleSliderMouseDown("socialPostRange", 1, e)}
                  ></div>
                </div>
              </div>

              {/* Account Preference */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-700">Account Preference</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAccountPreferenceToggle("private")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                      filterSettings.accountPreference.private
                        ? "bg-[#7F56D9] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    } cursor-pointer`}
                  >
                    Private
                    {filterSettings.accountPreference.private && <Check className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleAccountPreferenceToggle("verified")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                      filterSettings.accountPreference.verified
                        ? "bg-[#7F56D9] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    } cursor-pointer `}
                  >
                    Verified
                    {filterSettings.accountPreference.verified && <Check className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleAccountPreferenceToggle("professional")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                      filterSettings.accountPreference.professional
                        ? "bg-[#7F56D9] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    } cursor-pointer`}
                  >
                    Professional
                    {filterSettings.accountPreference.professional && <Check className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 flex items-center justify-between">
            <Button variant="outline" className="text-gray-700 bg-transparent cursor-pointer">
              Reset
            </Button>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="flex items-center gap-2 bg-transparent cursor-pointer">
                Save/Load Template
                <ChevronDown className="w-4 h-4" />
              </Button>
              <Button className="bg-[#7F56D9] hover:bg-purple-700 text-white cursor-pointer" onClick={onClose}>
                Apply
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
