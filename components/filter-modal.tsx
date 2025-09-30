"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { X, Check, ChevronDown } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Platform {
  id: string
  label: string
  icon: React.ReactNode
}

interface InstagramFilters {
  followersRange: [number, number]
  postsRange: [number, number]
  country: string
  is_private: boolean
  has_clips: boolean
  is_verified: boolean
  is_professional_account: boolean
}

interface TikTokFilters {
  followers: [number, number]
  following: [number, number]
  likes: [number, number]
  post: [number, number]
  friendscount: [number, number]
  verified: boolean
  email: boolean
  privateuser: boolean
  commerceuser: boolean
}

interface YouTubeFilters {
  subscribers: [number, number]
  email: boolean
  instagram: boolean
  video_count: [number, number]
  views_count: [number, number]
}

interface SpotifyPlaylistFilters {
  likes: [number, number]
  tracks: [number, number]
  collaborative: boolean
  public: boolean
  private: boolean
}

interface SpotifyArtistFilters {
  followers: [number, number]
  listens: [number, number]
  verified: boolean
}

interface SoundCloudFilters {
  followers: [number, number]
  following: [number, number]
  likes: [number, number]
  creator_subscription: boolean
  created_at: string
  city: string
  country_code: string
}

interface FilterSettings {
  instagram: InstagramFilters
  tiktok: TikTokFilters
  youtube: YouTubeFilters
  spotify_playlist: SpotifyPlaylistFilters
  spotify_artist: SpotifyArtistFilters
  soundcloud: SoundCloudFilters
  [key: string]: any
}

interface FilterModalProps {
  show: boolean
  platforms: Platform[]
  selectedPlatforms: Record<string, boolean>
  selectedFilterPlatform: string
  setSelectedFilterPlatform: (platform: string) => void
  filterSettings: FilterSettings
  setFilterSettings: React.Dispatch<React.SetStateAction<FilterSettings>>
  onClose: () => void
  onReset: () => void
  saveTemplate: boolean
  onToggleSaveTemplate: () => void
  isEditMode?: boolean
  templateName?: string
  templateId?: string
  userId?: string | null
}

export function FilterModal({
  show,
  platforms,
  selectedPlatforms,
  selectedFilterPlatform,
  setSelectedFilterPlatform,
  filterSettings,
  setFilterSettings,
  onClose,
  onReset,
  saveTemplate,
  onToggleSaveTemplate,
  isEditMode = false,
  templateName = "",
  templateId = "",
  userId = null,
}: FilterModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  
  // Auto-switch to first available platform if current one is not selected
  useEffect(() => {
    if (!selectedPlatforms[selectedFilterPlatform]) {
      const firstSelectedPlatform = platforms.find(platform => selectedPlatforms[platform.id]);
      if (firstSelectedPlatform) {
        setSelectedFilterPlatform(firstSelectedPlatform.id);
      }
    }
  }, [selectedPlatforms, selectedFilterPlatform, platforms, setSelectedFilterPlatform]);

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
    rangeType: "followersRange" | "followingRange" | "postsRange" | "likesRange",
    values: [number, number],
  ) => {
    setFilterSettings((prev) => ({
      ...prev,
      [selectedFilterPlatform]: {
        ...prev[selectedFilterPlatform],
        [rangeType]: values,
      }
    }))
  }

  const handleSliderMouseDown = (
    rangeType: "followersRange" | "followingRange" | "postsRange" | "likesRange",
    handleIndex: 0 | 1,
    event: React.MouseEvent,
  ) => {
    event.preventDefault()
    const slider = event.currentTarget.parentElement as HTMLElement
    const rect = slider.getBoundingClientRect()
    const maxValue = rangeType === "postsRange" ? 10000 : rangeType === "likesRange" ? 10000000 : 50000000

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX - rect.left
      const percentage = Math.max(0, Math.min(1, x / rect.width))
      const newValue = Math.round(percentage * maxValue)

      const currentRange = filterSettings[selectedFilterPlatform][rangeType]
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

  const currentPlatformSettings = filterSettings[selectedFilterPlatform]

  // Instagram handlers
  const handleInstagramChange = (field: keyof InstagramFilters, value: any) => {
    setFilterSettings((prev: any) => ({
      ...prev,
      instagram: {
        ...prev.instagram,
        [field]: value,
      }
    }))
  }

  // TikTok handlers
  const handleTikTokRangeChange = (field: keyof TikTokFilters, values: [number, number]) => {
    setFilterSettings((prev: any) => ({
      ...prev,
      tiktok: {
        ...prev.tiktok,
        [field]: values,
      }
    }))
  }

  const handleTikTokBooleanChange = (field: keyof TikTokFilters, value: boolean) => {
    setFilterSettings((prev: any) => ({
      ...prev,
      tiktok: {
        ...prev.tiktok,
        [field]: value,
      }
    }))
  }

  // YouTube handlers
  const handleYouTubeRangeChange = (field: keyof YouTubeFilters, values: [number, number]) => {
    setFilterSettings((prev: any) => ({
      ...prev,
      youtube: {
        ...prev.youtube,
        [field]: values,
      }
    }))
  }

  const handleYouTubeBooleanChange = (field: keyof YouTubeFilters, value: boolean) => {
    setFilterSettings((prev: any) => ({
      ...prev,
      youtube: {
        ...prev.youtube,
        [field]: value,
      }
    }))
  }

  // Spotify Playlist handlers
  const handleSpotifyPlaylistChange = (field: keyof SpotifyPlaylistFilters, value: number | boolean) => {
    setFilterSettings((prev: any) => ({
      ...prev,
      spotify_playlist: {
        ...prev.spotify_playlist,
        [field]: value,
      }
    }))
  }
  const handleSpotifyPlaylistRangeChange = (field: keyof SpotifyPlaylistFilters, value: [number, number]) => {
    setFilterSettings((prev: any) => ({
      ...prev,
      spotify_playlist: {
        ...prev.spotify_playlist,
        [field]: value,
      }
    }))
  }

  // Spotify Artist handlers
  const handleSpotifyArtistRangeChange = (field: keyof SpotifyArtistFilters, values: [number, number]) => {
    setFilterSettings((prev: any) => ({
      ...prev,
      spotify_artist: {
        ...prev.spotify_artist,
        [field]: values,
      }
    }))
  }

  const handleSpotifyArtistBooleanChange = (field: keyof SpotifyArtistFilters, value: boolean) => {
    setFilterSettings((prev: any) => ({
      ...prev,
      spotify_artist: {
        ...prev.spotify_artist,
        [field]: value,
      }
    }))
  }

  // SoundCloud handlers
  const handleSoundCloudRangeChange = (field: keyof SoundCloudFilters, values: [number, number]) => {
    setFilterSettings((prev: any) => ({
      ...prev,
      soundcloud: {
        ...prev.soundcloud,
        [field]: values,
      }
    }))
  }

  const handleSoundCloudChange = (field: keyof SoundCloudFilters, value: boolean | string) => {
    setFilterSettings((prev: any) => ({
      ...prev,
      soundcloud: {
        ...prev.soundcloud,
        [field]: value,
      }
    }))
  }

  // Handle template save for edit mode
  const handleTemplateSave = async () => {
    if (!isEditMode || !templateId) {
      console.log("Not in edit mode or no template ID");
      return;
    }

    setIsSaving(true);
    
    try {
      // Build platforms array with filters for API
      const platformsData = Object.keys(selectedPlatforms)
        .filter(key => selectedPlatforms[key as keyof typeof selectedPlatforms])
        .map(platformKey => {
          const platformSettings = filterSettings[platformKey];
          let platformName = platformKey;

          // Map platform keys to correct names for API
          if (platformKey === "spotify_artist") platformName = "Spotify_Artists";
          else if (platformKey === "spotify_playlist") platformName = "Spotify_Playlists";
          else if (platformKey === "tiktok") platformName = "TikTok";
          else if (platformKey === "youtube") platformName = "YouTube";
          else if (platformKey === "soundcloud") platformName = "SoundCloud";
          else if (platformKey === "instagram") platformName = "Instagram";

          // Build filters object based on platform
          const filters: any = {
            llm_generated: true, // Default value
          };

          // Add platform-specific filters
          if (platformKey === "instagram") {
            if (platformSettings.country) filters.country = platformSettings.country;
            filters.is_private = platformSettings.is_private || false;
            filters.has_clips = platformSettings.has_clips || false;
            filters.is_verified = platformSettings.is_verified || false;
            filters.is_professional_account = platformSettings.is_professional_account || false;
            filters.min_followers = platformSettings.followersRange[0];
            filters.max_followers = platformSettings.followersRange[1];
            filters.min_posts = platformSettings.postsRange[0];
            filters.max_posts = platformSettings.postsRange[1];
          } else if (platformKey === "tiktok") {
            filters.verified = platformSettings.verified || false;
            filters.email = platformSettings.email || false;
            filters.privateuser = platformSettings.privateuser || false;
            filters.commerceuser = platformSettings.commerceuser || false;
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
            filters.email = platformSettings.email || false;
            filters.instagram = platformSettings.instagram || false;
            filters.min_subscribers = platformSettings.subscribers[0];
            filters.max_subscribers = platformSettings.subscribers[1];
            filters.min_video_count = platformSettings.video_count[0];
            filters.max_video_count = platformSettings.video_count[1];
            filters.min_views_count = platformSettings.views_count[0];
            filters.max_views_count = platformSettings.views_count[1];
          } else if (platformKey === "spotify_playlist") {
            filters.collaborative = platformSettings.collaborative || false;
            filters.public = platformSettings.public || false;
            filters.private = platformSettings.private || false;
            filters.min_likes = platformSettings.likes[0];
            filters.max_likes = platformSettings.likes[1];
            filters.min_tracks = platformSettings.tracks[0];
            filters.max_tracks = platformSettings.tracks[1];
          } else if (platformKey === "spotify_artist") {
            filters.verified = platformSettings.verified || false;
            filters.min_followers = platformSettings.followers[0];
            filters.max_followers = platformSettings.followers[1];
            filters.min_listens = platformSettings.listens[0];
            filters.max_listens = platformSettings.listens[1];
          } else if (platformKey === "soundcloud") {
            filters.creator_subscription = platformSettings.creator_subscription || false;
            if (platformSettings.city) filters.city = platformSettings.city;
            if (platformSettings.country_code) filters.country_code = platformSettings.country_code;
            if (platformSettings.created_at) filters.created_at = platformSettings.created_at;
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

      // Get user ID from props or fallback
      const userIdToUse = userId || window.localStorage.getItem('auth0_user_id') || 'google-oauth2|106540510453341573284'; // Fallback for testing

      const updateData = {
        user: userIdToUse,
        platforms: platformsData,
        deep_search: true, // Default value
        template_name: templateName || "Updated Template",
      };

      console.log("Saving template with data:", JSON.stringify(updateData, null, 2));

      // Make API call to update template
      const response = await fetch(
        `https://dev-api.findsocial.io/templates/${templateId}?user=${userIdToUse}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Template save error:", errorText);
        throw new Error(`Failed to save template: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log("Template saved successfully:", result);

      // Show success toast
      toast({
        title: "Template Updated",
        description: `Template "${templateName}" has been updated successfully!`,
        variant: "default",
      });

      // Close modal after successful save
      onClose();

    } catch (error) {
      console.error("Error saving template:", error);
      toast({
        title: "Save Failed",
        description: `Failed to save template: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Instagram render function
  const renderInstagramFilters = () => {
    const instagram = filterSettings.instagram as InstagramFilters
    
    return (
      <div className="space-y-6">
        {/* Followers Range */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-700">
            Followers Range: {formatNumber(instagram.followersRange[0])} - {formatNumber(instagram.followersRange[1])}
          </label>
          <Slider
            value={instagram.followersRange}
            onValueChange={(values) => handleRangeChange('followersRange', values as [number, number])}
            min={0}
            max={10000000}
            step={1000}
            className="w-full"
          />
        </div>

        {/* Posts Range */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-700">
            Posts Range: {formatNumber(instagram.postsRange[0])} - {formatNumber(instagram.postsRange[1])}
          </label>
          <Slider
            value={instagram.postsRange}
            onValueChange={(values) => handleRangeChange('postsRange', values as [number, number])}
            min={0}
            max={10000}
            step={1}
            className="w-full"
          />
        </div>

        {/* Country */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Country</label>
            <input
              type="text"
              value={instagram.country}
              onChange={(e) => handleInstagramChange('country', e.target.value)}
              placeholder="e.g., US, UK, CA"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7F56D9] focus:border-transparent"
            />
          </div>
        </div>

        {/* Account Preferences */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-700">Account Preferences</label>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleInstagramChange('is_private', !instagram.is_private)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${instagram.is_private
                  ? "bg-[#7F56D9] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } cursor-pointer`}
            >
              Private Account
              {instagram.is_private && <Check className="w-4 h-4" />}
            </button>
            <button
              onClick={() => handleInstagramChange('has_clips', !instagram.has_clips)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${instagram.has_clips
                  ? "bg-[#7F56D9] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } cursor-pointer`}
            >
              Has Videos/Reels
              {instagram.has_clips && <Check className="w-4 h-4" />}
            </button>
            <button
              onClick={() => handleInstagramChange('is_verified', !instagram.is_verified)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${instagram.is_verified
                  ? "bg-[#7F56D9] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } cursor-pointer`}
            >
              Verified Account
              {instagram.is_verified && <Check className="w-4 h-4" />}
            </button>
            <button
              onClick={() => handleInstagramChange('is_professional_account', !instagram.is_professional_account)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${instagram.is_professional_account
                  ? "bg-[#7F56D9] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } cursor-pointer`}
            >
              Professional Account
              {instagram.is_professional_account && <Check className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // TikTok render function
  const renderTikTokFilters = () => {
    const tiktok = filterSettings.tiktok as TikTokFilters
    
    return (
      <div className="space-y-6">
        {/* Followers Range */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-700">
            Followers: {formatNumber(tiktok.followers[0])} - {formatNumber(tiktok.followers[1])}
          </label>
          <Slider
            value={tiktok.followers}
            onValueChange={(values) => handleTikTokRangeChange('followers', values as [number, number])}
            min={0}
            max={50000000}
            step={1000}
            className="w-full"
          />
        </div>

        {/* Following Range */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-700">
            Following: {formatNumber(tiktok.following[0])} - {formatNumber(tiktok.following[1])}
          </label>
          <Slider
            value={tiktok.following}
            onValueChange={(values) => handleTikTokRangeChange('following', values as [number, number])}
            min={0}
            max={50000000}
            step={1000}
            className="w-full"
          />
        </div>

        {/* Likes Range */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-700">
            Likes: {formatNumber(tiktok.likes[0])} - {formatNumber(tiktok.likes[1])}
          </label>
          <Slider
            value={tiktok.likes}
            onValueChange={(values) => handleTikTokRangeChange('likes', values as [number, number])}
            min={0}
            max={10000000}
            step={1000}
            className="w-full"
          />
        </div>

        {/* Posts Range */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-700">
            Posts: {formatNumber(tiktok.post[0])} - {formatNumber(tiktok.post[1])}
          </label>
          <Slider
            value={tiktok.post}
            onValueChange={(values) => handleTikTokRangeChange('post', values as [number, number])}
            min={0}
            max={10000}
            step={1}
            className="w-full"
          />
        </div>

        {/* Friends Count Range */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-700">
            Friends Count: {formatNumber(tiktok.friendscount[0])} - {formatNumber(tiktok.friendscount[1])}
          </label>
          <Slider
            value={tiktok.friendscount}
            onValueChange={(values) => handleTikTokRangeChange('friendscount', values as [number, number])}
            min={0}
            max={50000000}
            step={1000}
            className="w-full"
          />
        </div>

        {/* Account Preferences */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-700">Account Preferences</label>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleTikTokBooleanChange('verified', !tiktok.verified)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${tiktok.verified
                  ? "bg-[#7F56D9] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } cursor-pointer`}
            >
              Verified Account
              {tiktok.verified && <Check className="w-4 h-4" />}
            </button>
            <button
              onClick={() => handleTikTokBooleanChange('email', !tiktok.email)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${tiktok.email
                  ? "bg-[#7F56D9] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } cursor-pointer`}
            >
              Email
              {tiktok.email && <Check className="w-4 h-4" />}
            </button>
            <button
              onClick={() => handleTikTokBooleanChange('privateuser', !tiktok.privateuser)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${tiktok.privateuser
                  ? "bg-[#7F56D9] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } cursor-pointer`}
            >
              Private Account
              {tiktok.privateuser && <Check className="w-4 h-4" />}
            </button>
            <button
              onClick={() => handleTikTokBooleanChange('commerceuser', !tiktok.commerceuser)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${tiktok.commerceuser
                  ? "bg-[#7F56D9] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } cursor-pointer`}
            >
              Commerce User
              {tiktok.commerceuser && <Check className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // YouTube render function
  const renderYouTubeFilters = () => {
    const youtube = filterSettings.youtube as YouTubeFilters
    
    return (
      <div className="space-y-6">
        {/* Subscribers Range */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-700">
            Subscribers: {formatNumber(youtube.subscribers[0])} - {formatNumber(youtube.subscribers[1])}
          </label>
          <Slider
            value={youtube.subscribers}
            onValueChange={(values) => handleYouTubeRangeChange('subscribers', values as [number, number])}
            min={0}
            max={50000000}
            step={1000}
            className="w-full"
          />
        </div>

        {/* Video Count Range */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-700">
            Video Count: {formatNumber(youtube.video_count[0])} - {formatNumber(youtube.video_count[1])}
          </label>
          <Slider
            value={youtube.video_count}
            onValueChange={(values) => handleYouTubeRangeChange('video_count', values as [number, number])}
            min={0}
            max={10000}
            step={1}
            className="w-full"
          />
        </div>

        {/* Views Count Range */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-700">
            Views Count: {formatNumber(youtube.views_count[0])} - {formatNumber(youtube.views_count[1])}
          </label>
          <Slider
            value={youtube.views_count}
            onValueChange={(values) => handleYouTubeRangeChange('views_count', values as [number, number])}
            min={0}
            max={1000000000}
            step={10000}
            className="w-full"
          />
        </div>

        {/* Account Preferences */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-700">Account Preferences</label>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleYouTubeBooleanChange('email', !youtube.email)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${youtube.email
                  ? "bg-[#7F56D9] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } cursor-pointer`}
            >
              Email
              {youtube.email && <Check className="w-4 h-4" />}
            </button>
            <button
              onClick={() => handleYouTubeBooleanChange('instagram', !youtube.instagram)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${youtube.instagram
                  ? "bg-[#7F56D9] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } cursor-pointer`}
            >
              Instagram
              {youtube.instagram && <Check className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Spotify Playlist render function
  const renderSpotifyPlaylistFilters = () => {
    const spotify = filterSettings.spotify_playlist as SpotifyPlaylistFilters
    
    return (
      <div className="space-y-6">
        {/* Likes Range */}
        
<div className="space-y-4">
          <label className="text-sm font-medium text-gray-700">
            Like: {formatNumber(spotify.likes[0])} - {formatNumber(spotify.likes[1])}
          </label>
          <Slider
            value={spotify.likes}
            onValueChange={(values) => handleSpotifyPlaylistRangeChange('likes', values as [number, number])}
            min={0}
            max={10000000}
            step={1000}
            className="w-full"
          />
        </div>
        {/* Playlist Type */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-700">Playlist Type</label>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleSpotifyPlaylistChange('collaborative', !spotify.collaborative)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${spotify.collaborative
                  ? "bg-[#7F56D9] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } cursor-pointer`}
            >
              Collaborative
              {spotify.collaborative && <Check className="w-4 h-4" />}
            </button>
            <button
              onClick={() => handleSpotifyPlaylistChange('public', !spotify.public)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${spotify.public
                  ? "bg-[#7F56D9] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } cursor-pointer`}
            >
              Public
              {spotify.public && <Check className="w-4 h-4" />}
            </button>
            <button
              onClick={() => handleSpotifyPlaylistChange('private', !spotify.private)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${spotify.private
                  ? "bg-[#7F56D9] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } cursor-pointer`}
            >
              Private
              {spotify.private && <Check className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Spotify Artist render function
  const renderSpotifyArtistFilters = () => {
    const spotify = filterSettings.spotify_artist as SpotifyArtistFilters
    
    return (
      <div className="space-y-6">
        {/* Followers Range */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-700">
            Followers: {formatNumber(spotify.followers[0])} - {formatNumber(spotify.followers[1])}
          </label>
          <Slider
            value={spotify.followers}
            onValueChange={(values) => handleSpotifyArtistRangeChange('followers', values as [number, number])}
            min={0}
            max={10000000}
            step={1000}
            className="w-full"
          />
        </div>

        {/* Monthly Listens Range */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-700">
            Monthly Listens: {formatNumber(spotify.listens[0])} - {formatNumber(spotify.listens[1])}
          </label>
          <Slider
            value={spotify.listens}
            onValueChange={(values) => handleSpotifyArtistRangeChange('listens', values as [number, number])}
            min={0}
            max={100000000}
            step={10000}
            className="w-full"
          />
        </div>

        {/* Verified Account */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-700">Account Status</label>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleSpotifyArtistBooleanChange('verified', !spotify.verified)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${spotify.verified
                  ? "bg-[#7F56D9] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } cursor-pointer`}
            >
              Verified Account
              {spotify.verified && <Check className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // SoundCloud render function
  const renderSoundCloudFilters = () => {
    const soundcloud = filterSettings.soundcloud as SoundCloudFilters
    
    return (
      <div className="space-y-6">
        {/* Followers Range */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-700">
            Followers: {formatNumber(soundcloud.followers[0])} - {formatNumber(soundcloud.followers[1])}
          </label>
          <Slider
            value={soundcloud.followers}
            onValueChange={(values) => handleSoundCloudRangeChange('followers', values as [number, number])}
            min={0}
            max={10000000}
            step={1000}
            className="w-full"
          />
        </div>

        {/* Following Range */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-700">
            Following: {formatNumber(soundcloud.following[0])} - {formatNumber(soundcloud.following[1])}
          </label>
          <Slider
            value={soundcloud.following}
            onValueChange={(values) => handleSoundCloudRangeChange('following', values as [number, number])}
            min={0}
            max={10000}
            step={1}
            className="w-full"
          />
        </div>

        {/* Likes Range */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-700">
            Likes: {formatNumber(soundcloud.likes[0])} - {formatNumber(soundcloud.likes[1])}
          </label>
          <Slider
            value={soundcloud.likes}
            onValueChange={(values) => handleSoundCloudRangeChange('likes', values as [number, number])}
            min={0}
            max={1000000}
            step={100}
            className="w-full"
          />
        </div>

        {/* Creator Subscription */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-700">Subscription</label>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleSoundCloudChange('creator_subscription', !soundcloud.creator_subscription)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${soundcloud.creator_subscription
                  ? "bg-[#7F56D9] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } cursor-pointer`}
            >
              Creator Subscription
              {soundcloud.creator_subscription && <Check className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                value={soundcloud.city}
                onChange={(e) => handleSoundCloudChange('city', e.target.value)}
                placeholder="e.g., New York"
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7F56D9] focus:border-transparent"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Country Code</label>
              <input
                type="text"
                value={soundcloud.country_code}
                onChange={(e) => handleSoundCloudChange('country_code', e.target.value)}
                placeholder="e.g., US, UK"
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7F56D9] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Created At */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Created At</label>
            <input
              type="date"
              value={soundcloud.created_at}
              onChange={(e) => handleSoundCloudChange('created_at', e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7F56D9] focus:border-transparent"
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/5 flex justify-center z-50 p-4 pt-12">
     <div className="bg-white rounded-2xl shadow-2xl shadow-gray-500/30 w-full max-w-md md:max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden">

        {/* Left Sidebar */}
        <div className="w-full md:w-64 bg-gray-50 border-b md:border-r border-gray-200 p-4">
          <div className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
            {platforms.map((platform) => {
              const isSelected = selectedPlatforms[platform.id];
              const isCurrentFilter = selectedFilterPlatform === platform.id;
              
              return (
                <button
                  key={platform.id}
                  onClick={isSelected ? () => setSelectedFilterPlatform(platform.id) : undefined}
                  disabled={!isSelected}
                  title={!isSelected ? "Platform not selected in search" : platform.label}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all flex-shrink-0 md:flex-shrink ${
                    !isSelected
                      ? "opacity-40 blur-[0.5px] cursor-not-allowed bg-gray-100 grayscale" 
                      : isCurrentFilter
                        ? "bg-white shadow-sm border border-gray-200"
                        : "hover:bg-gray-100 cursor-pointer"
                  }`}
                >
                  {platform.icon}
                  <span className="text-sm font-medium">{platform.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 md:p-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                  {isEditMode ? "Edit Template Filters" : "Data Filters"}
                </h2>
                {isEditMode && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    EDITING
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {isEditMode 
                  ? `Editing filters for: ${templateName || "Untitled Template"}`
                  : "Filter your data to target the right influencers and make smarter outreach decisions."
                }
              </p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center cursor-pointer">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Filter Content */}
          <div className="flex-1 p-4 md:p-6 overflow-y-auto">
            <div className="space-y-8">
              {/* Platform Title */}
              <div className="flex items-center gap-3">
                {platforms.find((p) => p.id === selectedFilterPlatform)?.icon}
                <h3 className="text-lg font-semibold capitalize">{selectedFilterPlatform.replace(/([A-Z])/g, ' $1')}</h3>
              </div>

              {/* Platform-specific filters */}
              {selectedFilterPlatform === 'instagram' && renderInstagramFilters()}
              {selectedFilterPlatform === 'tiktok' && renderTikTokFilters()}
              {selectedFilterPlatform === 'youtube' && renderYouTubeFilters()}
              {selectedFilterPlatform === 'spotify_playlist' && renderSpotifyPlaylistFilters()}
              {selectedFilterPlatform === 'spotify_artist' && renderSpotifyArtistFilters()}
              {selectedFilterPlatform === 'soundcloud' && renderSoundCloudFilters()}
              {!['instagram', 'tiktok', 'youtube', 'spotify_playlist', 'spotify_artist', 'soundcloud'].includes(selectedFilterPlatform) && (
                <div className="text-center text-gray-500 py-8">
                  Filters for {selectedFilterPlatform} are not yet configured
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 md:p-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 flex-shrink-0">
            <Button 
              variant="outline" 
              className="w-full sm:w-auto text-gray-700 bg-transparent cursor-pointer"
              onClick={onReset}
            >
              Reset
            </Button>
            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3">
              <Button 
                variant="outline" 
                className={`w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer ${
                  saveTemplate ? 'bg-[#7F56D9] text-white hover:bg-[#7F56D9]/90' : 'bg-transparent'
                }`}
                onClick={onToggleSaveTemplate}
              >
                {saveTemplate ? (
                  <>
                    <Check className="w-4 h-4" />
                    Save Template: ON
                  </>
                ) : (
                  <>
                    Save/Load Template
                    <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </Button>
              <Button className="w-full sm:w-auto bg-[#7F56D9] hover:bg-purple-700 text-white cursor-pointer" 
                onClick={isEditMode ? handleTemplateSave : onClose}
                disabled={isSaving}
              >
                {isSaving ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Saving...
                  </div>
                ) : (
                  isEditMode ? "Save Template" : "Apply"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
