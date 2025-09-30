"use client";

import { ActionIcons } from "@/components/action-icons";
import { AdvanceSearchDropdown } from "@/components/advance-search-dropdown";
import { FilterModal } from "@/components/filter-modal";
import { ImportModal } from "@/components/import-modal";
import { PlatformDropdown } from "@/components/platform-dropdown";
import { ResultsLimitInput } from "@/components/results-limit-input";
import { SearchBar } from "@/components/search-bar";
import { SelectedPlatforms } from "@/components/selected-platforms";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/top-bar";
import { useAuth } from "@/hooks/use-auth";
import { useUserInfo } from "@/hooks/use-user-info";
import { toast } from "@/hooks/use-toast";
import Instagram from "@/public/platform/instagram.png";
import SoundCloud from "@/public/platform/soundcloud.png";
import Spotify from "@/public/platform/spotify.png";
import TikTok from "@/public/platform/tiktok.png";
import YouTube from "@/public/platform/youtube.png";
import { Menu } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

// Platform-specific filter settings type
type PlatformFilterSettings = {
  followersRange: [number, number];
  followingRange: [number, number];
  postsRange: [number, number];
  likesRange: [number, number];
  accountPreference: {
    verified: boolean;
    email: boolean;
    private: boolean;
    commerce: boolean;
  };
};

type AllPlatformFilters = {
  [platform: string]: PlatformFilterSettings;
};

export default function SearchInterface() {
  const { userId, isLoading, apiCallWithUserId } = useAuth();
  const { userInfo, loading, error, refetch } = useUserInfo(
    userId || undefined
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [resultsLimit, setResultsLimit] = useState("50");
  const [showPlatformsDropdown, setShowPlatformsDropdown] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAdvanceSearchDropdown, setShowAdvanceSearchDropdown] =
    useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
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
  const [saveTemplate, setSaveTemplate] = useState(false);
  
  // Default filter settings for reset functionality
  const defaultFilterSettings = {
    instagram: {
      followersRange: [0, 50000000] as [number, number],
      postsRange: [0, 10000] as [number, number],
      country: "",
      is_private: false,
      has_clips: false,
      is_verified: false,
      is_professional_account: false,
    },
    tiktok: {
      followers: [0, 50000000] as [number, number],
      following: [0, 50000000] as [number, number],
      likes: [0, 10000000] as [number, number],
      post: [0, 10000] as [number, number],
      friendscount: [0, 50000000] as [number, number],
      verified: false,
      email: false,
      privateuser: false,
      commerceuser: false,
    },
    youtube: {
      subscribers: [0, 50000000] as [number, number],
      email: false,
      instagram: false,
      video_count: [0, 10000] as [number, number],
      views_count: [0, 1000000000] as [number, number],
    },
    spotify_playlist: {
      likes: [0, 1000000] as [number, number],
      tracks: [0, 10000] as [number, number],
      collaborative: false,
      public: false,
      private: false,
    },
    spotify_artist: {
      followers: [0, 50000000] as [number, number],
      listens: [0, 100000000] as [number, number],
      verified: false,
    },
    soundcloud: {
      followers: [0, 10000000] as [number, number],
      following: [0, 10000] as [number, number],
      likes: [0, 1000000] as [number, number],
      creator_subscription: false,
      created_at: "",
      city: "",
      country_code: "",
    },
  };
  const [filterSettings, setFilterSettings] = useState<any>({
    instagram: {
      followersRange: [0, 50000000] as [number, number],
      postsRange: [0, 10000] as [number, number],
      country: "",
      is_private: false,
      has_clips: false,
      is_verified: false,
      is_professional_account: false,
    },
    tiktok: {
      followers: [0, 50000000] as [number, number],
      following: [0, 50000000] as [number, number],
      likes: [0, 10000000] as [number, number],
      post: [0, 10000] as [number, number],
      friendscount: [0, 50000000] as [number, number],
      verified: false,
      email: false,
      privateuser: false,
      commerceuser: false,
    },
    youtube: {
      subscribers: [0, 50000000] as [number, number],
      email: false,
      instagram: false,
      video_count: [0, 10000] as [number, number],
      views_count: [0, 1000000000] as [number, number],
    },
    spotify_playlist: {
      likes: [0, 1000000] as [number, number],
      tracks: [0, 10000] as [number, number],
      collaborative: false,
      public: false,
      private: false,
    },
    spotify_artist: {
      followers: [0, 50000000] as [number, number],
      listens: [0, 100000000] as [number, number],
      verified: false,
    },
    soundcloud: {
      followers: [0, 10000000] as [number, number],
      following: [0, 10000] as [number, number],
      likes: [0, 1000000] as [number, number],
      creator_subscription: false,
      created_at: "",
      city: "",
      country_code: "",
    },
  });

  const [selectedPlatforms, setSelectedPlatforms] = useState({
    instagram: true,
    tiktok: false,
    youtube: false,
    spotify_playlist: false,
    spotify_artist: false,
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
      id: "spotify_artist",
      label: "Spotify Artist",
      icon: <Image src={Spotify} alt="Spotify" width={20} height={20} />,
    },
    {
      id: "spotify_playlist",
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

  // Reset filters to default state
  const handleResetFilters = () => {
    setFilterSettings(defaultFilterSettings);
  };

  // Toggle save template functionality
  const handleToggleSaveTemplate = () => {
    setSaveTemplate(!saveTemplate);
  };

  // API call function for multi-platform search
  const handleSearch = async () => {
    if (!searchQuery || !userId) {
      console.log("Search query or userId missing");
      toast({
        title: "Search Required",
        description: "Please enter a search query",
        variant: "destructive",
      });
      return;
    }

    // Set loading state to true
    setIsSearching(true);

    console.log("Starting search with:", {
      searchQuery,
      userId,
      selectedPlatforms,
      advanceSearchSettings,
    });

    try {
      // Build platforms array with filters for selected platforms
      const platformsData = Object.keys(selectedPlatforms)
        .filter(
          (key) => selectedPlatforms[key as keyof typeof selectedPlatforms]
        )
        .map((platformKey) => {
          const platformSettings = filterSettings[platformKey];
          let platformName = platformKey;

          // Map platform keys to correct names
          if (platformKey === "spotify_artist") platformName = "Spotify Artist";
          else if (platformKey === "spotify_playlist")
            platformName = "Spotify Playlist";
          else
            platformName =
              platformKey.charAt(0).toUpperCase() + platformKey.slice(1);

          // Build filters object based on platform
          const filters: any = {
            llm_generated: advanceSearchSettings.aiSemanticSearch,
          };

          // Add platform-specific filters
          if (platformKey === "instagram") {
            if (platformSettings.country)
              filters.country = platformSettings.country;
            if (platformSettings.is_private)
              filters.is_private = platformSettings.is_private;
            if (platformSettings.has_clips)
              filters.has_clips = platformSettings.has_clips;
            if (platformSettings.is_verified)
              filters.is_verified = platformSettings.is_verified;
            if (platformSettings.is_professional_account)
              filters.is_professional_account =
                platformSettings.is_professional_account;
            filters.min_followers = platformSettings.followersRange[0];
            filters.max_followers = platformSettings.followersRange[1];
            filters.min_posts = platformSettings.postsRange[0];
            filters.max_posts = platformSettings.postsRange[1];
          } else if (platformKey === "tiktok") {
            platformName="TikTok";
            if (platformSettings.verified)
              filters.verified = platformSettings.verified;
            if (platformSettings.email) filters.email = platformSettings.email;
            if (platformSettings.privateuser)
              filters.privateuser = platformSettings.privateuser;
            if (platformSettings.commerceuser)
              filters.commerceuser = platformSettings.commerceuser;
            filters.min_followers = platformSettings.followers[0];
            filters.max_followers = platformSettings.followers[1];
            filters.min_following = platformSettings.following[0];
            filters.max_following = platformSettings.following[1];
            filters.min_likes = platformSettings.likes[0];
            filters.max_likes = platformSettings.likes[1];
            filters.min_posts = platformSettings.post[0];
            filters.max_posts = platformSettings.post[1];
            filters.min_friendscount = platformSettings.friendscount[0];
            filters.max_friendscount = platformSettings.friendscount[1];
          } else if (platformKey === "youtube") {
            platformName="YouTube";
            if (platformSettings.email) filters.email = platformSettings.email;
            if (platformSettings.instagram)
              filters.instagram = platformSettings.instagram;
            filters.min_subscribers = platformSettings.subscribers[0];
            filters.max_subscribers = platformSettings.subscribers[1];
            filters.min_video_count = platformSettings.video_count[0];
            filters.max_video_count = platformSettings.video_count[1];
            filters.min_views_count = platformSettings.views_count[0];
            filters.max_views_count = platformSettings.views_count[1];
          } else if (platformKey === "spotify_playlist") {
            platformName="Spotify_Playlists";
            if (platformSettings.collaborative)
              filters.collaborative = platformSettings.collaborative;
            if (platformSettings.public)
              filters.public = platformSettings.public;
            if (platformSettings.private)
              filters.private = platformSettings.private;
            filters.min_likes = platformSettings.likes[0];
            filters.max_likes = platformSettings.likes[1];
            filters.min_tracks = platformSettings.tracks[0];
            filters.max_tracks = platformSettings.tracks[1];
          } else if (platformKey === "spotify_artist") {
            platformName="Spotify_Artists";
            if (platformSettings.verified)
              filters.verified = platformSettings.verified;
            filters.min_followers = platformSettings.followers[0];
            filters.max_followers = platformSettings.followers[1];
            filters.min_listens = platformSettings.listens[0];
            filters.max_listens = platformSettings.listens[1];
          } else if (platformKey === "soundcloud") {
            platformName="SoundCloud";
            if (platformSettings.creator_subscription)
              filters.creator_subscription =
                platformSettings.creator_subscription;
            if (platformSettings.city) filters.city = platformSettings.city;
            if (platformSettings.country_code)
              filters.country_code = platformSettings.country_code;
            if (platformSettings.created_at)
              filters.created_at = platformSettings.created_at;
            filters.min_followers = platformSettings.followers[0];
            filters.max_followers = platformSettings.followers[1];
            filters.min_following = platformSettings.following[0];
            filters.max_following = platformSettings.following[1];
            filters.min_likes = platformSettings.likes[0];
            filters.max_likes = platformSettings.likes[1];
          }

          return {
            name: platformName,
            filters,
          };
        });

      const searchData = {
        user: userId,
        search: searchQuery,
        platforms: platformsData,
        deep_search: advanceSearchSettings.deepSearch,
        credits: parseInt(resultsLimit) || 50,
        save_template: saveTemplate,
        existing_template: "",
      };

      console.log("API Request:", JSON.stringify(searchData, null, 2));
      console.log("Save Template Status:", saveTemplate ? "ON" : "OFF");

      // Make API call to the correct endpoint
      const response = await fetch(
        "https://dev-api.findsocial.io/multi-search-multi-platform",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(searchData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText}`
        );
      }

      const results = await response.json();
      console.log("Search results:", results);

      // Reset search input to initial state
      setSearchQuery("");

      // Handle the results here
      // You can add result handling logic here
      toast({
        title: "Search Completed",
        description: "Search completed successfully! Check console for results.",
        variant: "success",
      });
    } catch (error) {
      console.error("Search failed:", error);
      toast({
        title: "Search Failed",
        description: `Search failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        variant: "destructive",
      });
    } finally {
      // Always set loading state to false when done
      setIsSearching(false);
    }
  };

  // Show loading if authentication is still being checked
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7F56D9] mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

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
      <div className="flex-1 flex flex-col lg:ml-72">
        <TopBar title="Search">
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
                Hi {userInfo?.name || userInfo?.email || "User"}, What do you
                want to find?
              </h2>
            </div>

            <div className="rounded-lg border-2 border-input p-4 space-y-4 relative">
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSearch={handleSearch}
                isLoading={isSearching}
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
                  searchQuery={searchQuery}
                  onSearch={handleSearch}
                  isLoading={isSearching}
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
          selectedPlatforms={selectedPlatforms}
          selectedFilterPlatform={selectedFilterPlatform}
          setSelectedFilterPlatform={setSelectedFilterPlatform}
          filterSettings={filterSettings}
          setFilterSettings={setFilterSettings}
          onClose={() => setShowFilterModal(false)}
          onReset={handleResetFilters}
          saveTemplate={saveTemplate}
          onToggleSaveTemplate={handleToggleSaveTemplate}
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
