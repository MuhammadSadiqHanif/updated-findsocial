"use client";

import { FilterModal } from "@/components/filter-modal";
import { ListsContent } from "@/components/ListContent";
import MessagesContent from "@/components/messages-content";
import { Sidebar } from "@/components/sidebar";
import TemplatesContent from "@/components/templates-content";
import { TopBar } from "@/components/top-bar";
import { useAuth } from "@/hooks/use-auth";
import Instagram from "@/public/platform/instagram.png";
import SoundCloud from "@/public/platform/soundcloud.png";
import Spotify from "@/public/platform/spotify.png";
import TikTok from "@/public/platform/tiktok.png";
import YouTube from "@/public/platform/youtube.png";
import { Menu } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function Templates() {
  const { userId } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedFilterPlatform, setSelectedFilterPlatform] = useState("instagram");
  const [currentTemplate, setCurrentTemplate] = useState<any>(null);
  const [saveTemplate, setSaveTemplate] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Platform configuration (same as Dashboard)
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

  // Default filter settings
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

  const [filterSettings, setFilterSettings] = useState<any>(defaultFilterSettings);
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    instagram: false,
    tiktok: false,
    youtube: false,
    spotify_playlist: false,
    spotify_artist: false,
    soundcloud: false,
  });

  // Function to handle template edit - converts API response to filter format
  const handleTemplateEdit = (template: any) => {
    console.log("Editing template:", template);
    setCurrentTemplate(template);
    
    // Convert template data to filter settings format
    const templateFilterSettings = { ...defaultFilterSettings };
    const templateSelectedPlatforms = {
      instagram: false,
      tiktok: false,
      youtube: false,
      spotify_playlist: false,
      spotify_artist: false,
      soundcloud: false,
    };

    // Process each platform in the template
    template.platforms?.forEach((platform: any) => {
      const platformName = platform.name.toLowerCase();
      let platformKey = platformName;
      
      // Map platform names to keys
      if (platformName === "instagram") {
        platformKey = "instagram";
        templateSelectedPlatforms.instagram = true;
        
        // Map Instagram filters
        if (platform.filters) {
          templateFilterSettings.instagram = {
            followersRange: [
              platform.filters.min_followers || 0,
              platform.filters.max_followers || 50000000
            ] as [number, number],
            postsRange: [
              platform.filters.min_posts || 0,
              platform.filters.max_posts || 10000
            ] as [number, number],
            country: platform.filters.country || "",
            is_private: platform.filters.is_private || false,
            has_clips: platform.filters.has_clips || false,
            is_verified: platform.filters.is_verified || false,
            is_professional_account: platform.filters.is_professional_account || false,
          };
        }
      } else if (platformName === "tiktok") {
        platformKey = "tiktok";
        templateSelectedPlatforms.tiktok = true;
        
        if (platform.filters) {
          templateFilterSettings.tiktok = {
            followers: [
              platform.filters.min_followers || 0,
              platform.filters.max_followers || 50000000
            ] as [number, number],
            following: [
              platform.filters.min_following || 0,
              platform.filters.max_following || 50000000
            ] as [number, number],
            likes: [
              platform.filters.min_likes || 0,
              platform.filters.max_likes || 10000000
            ] as [number, number],
            post: [
              platform.filters.min_posts || 0,
              platform.filters.max_posts || 10000
            ] as [number, number],
            friendscount: [
              platform.filters.min_friendscount || 0,
              platform.filters.max_friendscount || 50000000
            ] as [number, number],
            verified: platform.filters.verified || false,
            email: platform.filters.email || false,
            privateuser: platform.filters.privateuser || false,
            commerceuser: platform.filters.commerceuser || false,
          };
        }
      } else if (platformName === "youtube") {
        platformKey = "youtube";
        templateSelectedPlatforms.youtube = true;
        
        if (platform.filters) {
          templateFilterSettings.youtube = {
            subscribers: [
              platform.filters.min_subscribers || 0,
              platform.filters.max_subscribers || 50000000
            ] as [number, number],
            video_count: [
              platform.filters.min_video_count || 0,
              platform.filters.max_video_count || 10000
            ] as [number, number],
            views_count: [
              platform.filters.min_views_count || 0,
              platform.filters.max_views_count || 1000000000
            ] as [number, number],
            email: platform.filters.email || false,
            instagram: platform.filters.instagram || false,
          };
        }
      } else if (platformName === "spotify_playlists" || platformName === "spotify playlist") {
        platformKey = "spotify_playlist";
        templateSelectedPlatforms.spotify_playlist = true;
        
        if (platform.filters) {
          templateFilterSettings.spotify_playlist = {
            likes: [
              platform.filters.min_likes || 0,
              platform.filters.max_likes || 1000000
            ] as [number, number],
            tracks: [
              platform.filters.min_tracks || 0,
              platform.filters.max_tracks || 10000
            ] as [number, number],
            collaborative: platform.filters.collaborative || false,
            public: platform.filters.public || false,
            private: platform.filters.private || false,
          };
        }
      } else if (platformName === "spotify_artists" || platformName === "spotify artist") {
        platformKey = "spotify_artist";
        templateSelectedPlatforms.spotify_artist = true;
        
        if (platform.filters) {
          templateFilterSettings.spotify_artist = {
            followers: [
              platform.filters.min_followers || 0,
              platform.filters.max_followers || 50000000
            ] as [number, number],
            listens: [
              platform.filters.min_listens || 0,
              platform.filters.max_listens || 100000000
            ] as [number, number],
            verified: platform.filters.verified || false,
          };
        }
      } else if (platformName === "soundcloud") {
        platformKey = "soundcloud";
        templateSelectedPlatforms.soundcloud = true;
        
        if (platform.filters) {
          templateFilterSettings.soundcloud = {
            followers: [
              platform.filters.min_followers || 0,
              platform.filters.max_followers || 10000000
            ] as [number, number],
            following: [
              platform.filters.min_following || 0,
              platform.filters.max_following || 10000
            ] as [number, number],
            likes: [
              platform.filters.min_likes || 0,
              platform.filters.max_likes || 1000000
            ] as [number, number],
            creator_subscription: platform.filters.creator_subscription || false,
            created_at: platform.filters.created_at || "",
            city: platform.filters.city || "",
            country_code: platform.filters.country_code || "",
          };
        }
      }
    });

    // Update states
    setFilterSettings(templateFilterSettings);
    setSelectedPlatforms(templateSelectedPlatforms);
    
    // Set the first selected platform as the filter platform
    const firstSelectedPlatform = Object.keys(templateSelectedPlatforms).find(
      key => templateSelectedPlatforms[key as keyof typeof templateSelectedPlatforms]
    );
    if (firstSelectedPlatform) {
      setSelectedFilterPlatform(firstSelectedPlatform);
    }
    
    // Open filter modal
    setShowFilterModal(true);
  };

  // Reset filters to default
  const handleResetFilters = () => {
    setFilterSettings(defaultFilterSettings);
  };

  // Toggle save template
  const handleToggleSaveTemplate = () => {
    setSaveTemplate(!saveTemplate);
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
      <div className="flex-1 flex flex-col lg:ml-72">
        <TopBar title="Templates">
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </TopBar>

        <div className="flex-1 p-6">
         <TemplatesContent 
           onEditTemplate={handleTemplateEdit} 
           refreshTrigger={refreshTrigger}
         />
        </div>
      </div>

      {/* Filter Modal */}
      <FilterModal
        show={showFilterModal}
        platforms={platforms}
        selectedPlatforms={selectedPlatforms}
        selectedFilterPlatform={selectedFilterPlatform}
        setSelectedFilterPlatform={setSelectedFilterPlatform}
        filterSettings={filterSettings}
        setFilterSettings={setFilterSettings}
        onClose={() => {
          setShowFilterModal(false);
          setRefreshTrigger(prev => prev + 1); // Trigger refresh when modal closes
        }}
        onReset={handleResetFilters}
        saveTemplate={saveTemplate}
        onToggleSaveTemplate={handleToggleSaveTemplate}
        isEditMode={true}
        templateName={currentTemplate?.template_name}
        templateId={currentTemplate?.id}
        userId={userId}
      />
    </div>
  );
}
