"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { TopBar } from "./top-bar"
import { SearchBar } from "./search-bar"
import { ActionIcons } from "./action-icons"
import { ResultsLimitInput } from "./results-limit-input"
import { SelectedPlatforms } from "./selected-platforms"
import { PlatformDropdown } from "./platform-dropdown"
import { AdvanceSearchDropdown } from "./advance-search-dropdown"
import { FilterModal } from "./filter-modal"
import { ImportModal } from "./import-modal"

export function SearchInterface() {
  const [searchQuery, setSearchQuery] = useState("")
  const [resultsLimit, setResultsLimit] = useState("")
  const [showPlatformsDropdown, setShowPlatformsDropdown] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showAdvanceSearchDropdown, setShowAdvanceSearchDropdown] = useState(false)
  const [advanceSearchSettings, setAdvanceSearchSettings] = useState({
    deepSearch: true,
    aiSemanticSearch: true,
  })
  const [uploadedFile, setUploadedFile] = useState<{
    name: string
    size: string
    progress: number
    uploading: boolean
  } | null>(null)
  const [selectedFilterPlatform, setSelectedFilterPlatform] = useState("instagram")
  const [filterSettings, setFilterSettings] = useState({
    followersRange: [0, 50000000],
    followingRange: [0, 50000000],
    socialPostRange: [0, 50000000],
    accountPreference: {
      private: true,
      verified: true,
      professional: false,
    },
  })

  const [selectedPlatforms, setSelectedPlatforms] = useState({
    instagram: true,
    tiktok: true,
    youtube: true,
    spotifyArtist: false,
    spotifyPlaylist: false,
    soundcloud: false,
  })

  const platforms = [
    {
      id: "instagram",
      label: "Instagram",
      icon: (
        <div className="w-4 h-4 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-sm flex items-center justify-center">
          <div className="w-2 h-2 border border-white rounded-full"></div>
        </div>
      ),
    },
    {
      id: "tiktok",
      label: "TikTok",
      icon: (
        <div className="w-4 h-4 bg-black rounded-sm flex items-center justify-center text-white text-xs font-bold">
          ♪
        </div>
      ),
    },
    {
      id: "youtube",
      label: "YouTube",
      icon: (
        <div className="w-4 h-4 bg-red-600 rounded-sm flex items-center justify-center">
          <div className="w-0 h-0 border-l-[3px] border-l-white border-y-[2px] border-y-transparent ml-0.5"></div>
        </div>
      ),
    },
    {
      id: "spotifyArtist",
      label: "Spotify Artist",
      icon: (
        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      ),
    },
    {
      id: "spotifyPlaylist",
      label: "Spotify Playlist",
      icon: (
        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      ),
    },
    {
      id: "soundcloud",
      label: "SoundCloud",
      icon: (
        <div className="w-4 h-4 bg-orange-500 rounded-sm flex items-center justify-center">
          <div className="w-2 h-1 bg-white rounded-full"></div>
        </div>
      ),
    },
  ]

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms((prev) => ({
      ...prev,
      [platformId]: !prev[platformId as keyof typeof prev],
    }))
  }

  const handleRemovePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) => ({
      ...prev,
      [platformId]: false,
    }))
  }

  const handleAdvanceSearchToggle = (setting: "deepSearch" | "aiSemanticSearch") => {
    setAdvanceSearchSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }))
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <TopBar />

        {/* Search Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-4xl space-y-8">
            {/* Main Heading */}
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-foreground mb-8">Hi Olivia, What do you want to find?</h2>
            </div>

            <div className="space-y-6 relative">
              <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

              {/* Action Icons and Results Limit in same row */}
              <div className="flex items-center justify-between">
                <ActionIcons
                  showPlatformsDropdown={showPlatformsDropdown}
                  setShowPlatformsDropdown={setShowPlatformsDropdown}
                  showAdvanceSearchDropdown={showAdvanceSearchDropdown}
                  setShowAdvanceSearchDropdown={setShowAdvanceSearchDropdown}
                  setShowImportModal={setShowImportModal}
                  setShowFilterModal={setShowFilterModal}
                />

                <ResultsLimitInput resultsLimit={resultsLimit} setResultsLimit={setResultsLimit} />
              </div>

              <SelectedPlatforms
                platforms={platforms}
                selectedPlatforms={selectedPlatforms}
                onRemovePlatform={handleRemovePlatform}
              />

              <AdvanceSearchDropdown
                show={showAdvanceSearchDropdown}
                settings={advanceSearchSettings}
                onToggle={handleAdvanceSearchToggle}
              />

              <PlatformDropdown
                show={showPlatformsDropdown}
                platforms={platforms}
                selectedPlatforms={selectedPlatforms}
                onPlatformToggle={handlePlatformToggle}
                onClose={() => setShowPlatformsDropdown(false)}
              />
            </div>
          </div>
        </div>

        <FilterModal
          show={showFilterModal}
          platforms={platforms}
          selectedFilterPlatform={selectedFilterPlatform}
          setSelectedFilterPlatform={setSelectedFilterPlatform}
          filterSettings={filterSettings}
          setFilterSettings={setFilterSettings}
          onClose={() => setShowFilterModal(false)}
        />

        <ImportModal
          show={showImportModal}
          uploadedFile={uploadedFile}
          setUploadedFile={setUploadedFile}
          onClose={() => setShowImportModal(false)}
        />
      </div>
    </div>
  )
}
