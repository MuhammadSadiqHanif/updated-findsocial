"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/top-bar";
import { SearchBar } from "@/components/search-bar";
import { ActionIcons } from "@/components/action-icons";
import { ResultsLimitInput } from "@/components/results-limit-input";
import { SelectedPlatforms } from "@/components/selected-platforms";
import { PlatformDropdown } from "@/components/platform-dropdown";
import { AdvanceSearchDropdown } from "@/components/advance-search-dropdown";
import { FilterModal } from "@/components/filter-modal";
import { ImportModal } from "@/components/import-modal";
import Instagram from "@/public/platform/instagram.png";
import TikTok from "@/public/platform/tiktok.png";
import YouTube from "@/public/platform/youtube.png";
import Spotify from "@/public/platform/spotify.png";
import SoundCloud from "@/public/platform/soundcloud.png";
import Image from "next/image";
import { Menu } from "lucide-react";

export default function SearchInterface() {
  const [searchQuery, setSearchQuery] = useState("");
  const [resultsLimit, setResultsLimit] = useState("");
  const [showPlatformsDropdown, setShowPlatformsDropdown] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAdvanceSearchDropdown, setShowAdvanceSearchDropdown] =
    useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [advanceSearchSettings, setAdvanceSearchSettings] = useState({
    deepSearch: true,
    aiSemanticSearch: true,
  });
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: string;
    progress: number;
    uploading: boolean;
  } | null>(null);
  const [selectedFilterPlatform, setSelectedFilterPlatform] =
    useState("instagram");
  const [filterSettings, setFilterSettings] = useState({
    followersRange: [0, 50000000],
    followingRange: [0, 50000000],
    socialPostRange: [0, 50000000],
    accountPreference: {
      private: true,
      verified: true,
      professional: false,
    },
  });

  const [selectedPlatforms, setSelectedPlatforms] = useState({
    instagram: true,
    tiktok: true,
    youtube: true,
    spotifyArtist: false,
    spotifyPlaylist: false,
    soundcloud: false,
  });

  const platforms = [
    {
      id: "instagram",
      label: "Instagram",
      icon: <Image src={Instagram} alt="Instagram" width={20} height={20} />,
    },
    {
      id: "tiktok",
      label: "TikTok",
      icon: <Image src={TikTok} alt="TikTok" width={20} height={20} />,
    },
    {
      id: "youtube",
      label: "YouTube",
      icon: <Image src={YouTube} alt="YouTube" width={20} height={20} />,
    },
    {
      id: "spotifyArtist",
      label: "Spotify Artist",
      icon: <Image src={Spotify} alt="Spotify" width={20} height={20} />,
    },
    {
      id: "spotifyPlaylist",
      label: "Spotify Playlist",
      icon: <Image src={Spotify} alt="Spotify" width={20} height={20} />,
    },
    {
      id: "soundcloud",
      label: "SoundCloud",
      icon: <Image src={SoundCloud} alt="SoundCloud" width={20} height={20} />,
    },
  ];

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms((prev) => ({
      ...prev,
      [platformId]: !prev[platformId as keyof typeof prev],
    }));
  };

  const handleRemovePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) => ({
      ...prev,
      [platformId]: false,
    }));
  };

  const handleAdvanceSearchToggle = (
    setting: "deepSearch" | "aiSemanticSearch"
  ) => {
    setAdvanceSearchSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  return (
    <div className="flex h-screen bg-background">
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setSidebarOpen(false)}
          ></div>
          <div className="absolute top-0 left-0 h-full">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <TopBar>
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </TopBar>

        {/* Search Content */}
        <div className="flex-1 flex justify-center pt-6 md:pt-10 p-4 md:p-8">
          <div className="w-full max-w-4xl space-y-6 md:space-y-8">
            {/* Main Heading */}
            <div className="text-center">
              <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4 md:mb-8">
                Hi Olivia, What do you want to find?
              </h2>
            </div>

            <div className="rounded-lg border-2 border-input p-4 space-y-4 relative">
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />

              {/* Action Icons and Results Limit */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mx-1 md:mx-3">
                <ActionIcons
                  showPlatformsDropdown={showPlatformsDropdown}
                  setShowPlatformsDropdown={setShowPlatformsDropdown}
                  showAdvanceSearchDropdown={showAdvanceSearchDropdown}
                  setShowAdvanceSearchDropdown={setShowAdvanceSearchDropdown}
                  setShowImportModal={setShowImportModal}
                  setShowFilterModal={setShowFilterModal}
                />

                <ResultsLimitInput
                  resultsLimit={resultsLimit}
                  setResultsLimit={setResultsLimit}
                />
              </div>
              <hr />
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
  );
}
