"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, ExternalLink, User, Mail, MapPin, Hash, AtSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useUserInfo } from "@/hooks/use-user-info"
import Image from "next/image"
import Link from "next/link"
import Avatar1 from "@/public/Avatar.png"
import Instagram from "@/public/platform/instagram.png"
import TikTok from "@/public/platform/tiktok.png"
import YouTube from "@/public/platform/youtube.png"
import Spotify from "@/public/platform/spotify.png"
import SoundCloud from "@/public/platform/soundcloud.png"

interface LeadDetailContentProps {
  leadId: string
}

interface LeadData {
  id: string
  platform: string
  scrapper_name: string
  search: string
  data: {
    url: string
    name: string
    username: string
    email: string[]
    link?: string | string[]
    other_link?: string[]
    followers?: number
    following?: number
    subscribers?: number // YouTube specific
    description: string
    posts?: number
    post?: number // TikTok uses 'post' instead of 'posts'
    video_count?: number // YouTube specific
    views_count?: number // YouTube specific
    likes?: number // TikTok specific
    verified?: boolean
    private?: boolean
    privateuser?: boolean // TikTok uses 'privateuser' instead of 'private'
    is_family_safe?: boolean // YouTube specific
    country?: string | null
    join_date?: string // YouTube specific
    tags?: string[] // YouTube specific
    llm_generated?: boolean
    catagory_name?: string
    business?: boolean
    commerceuser?: boolean // TikTok specific
    pronouns?: string
    uid?: string // TikTok specific
    friendscount?: number // TikTok specific
    tiktok?: string
    soundcloud?: string
    spotify?: string
    youtube?: string
    instagram?: string // TikTok response includes this
    linktree?: string
    other?: string // TikTok specific
    // SoundCloud specific fields
    c_id?: number
    first_name?: string
    full_name?: string
    other_emails?: string[]
    city?: string | null
    creator_subscription?: string
    country_code?: string | null
    playlist_count?: number
    playlist_likes_count?: number
    track_count?: number
    socials?: {
      instagram?: string
      twitter?: string
      facebook?: string
      tiktok?: string
      soundcloud?: string
      linktree?: string
      spotify?: string
      other_links?: string[]
    } // YouTube specific
    deep_search?: {
      instagram?: {
        url: string
        name: string
        username: string
        email: string[]
        link: string
        description: string
        followers: number
        following: number
        posts: number
        verified: boolean
        private: boolean
        catagory_name: string
        business: boolean
        pronouns: string
        "Bio Links": Array<{
          title: string
          url: string
          link_type: string
          is_verified: boolean
          is_pinned: boolean
        }>
      }
    } // YouTube specific
  }
  timestamp: string
  created_at: string
}

export default function LeadDetailContent({ leadId }: LeadDetailContentProps) {
  const [leadData, setLeadData] = useState<LeadData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("Profile")
  const { toast } = useToast()
  const { userInfo } = useUserInfo()

  const platformTabs = ["Profile", "Links", "Additional Info"]

  // Helper functions to handle different platform response formats
  const getPostsCount = (data: LeadData['data']) => {
    if (data.track_count !== undefined) return data.track_count // SoundCloud tracks
    return data.posts || data.post || data.video_count || 0
  }

  const getFollowersCount = (data: LeadData['data']) => {
    return data.followers || data.subscribers || 0
  }

  const getIsPrivate = (data: LeadData['data']) => {
    return data.private || data.privateuser || false
  }

  const getIsBusiness = (data: LeadData['data']) => {
    return data.business || data.commerceuser || false
  }

  const getIsVerified = (data: LeadData['data']) => {
    return data.verified || false
  }

  // Helper function to get display name
  const getDisplayName = (data: LeadData['data']) => {
    return data.full_name || data.name || data.first_name || 'N/A'
  }

  // Helper function to format account creation date
  const formatCreationDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    } catch (error) {
      return 'N/A'
    }
  }

  // Function to get platform icon
  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return Instagram
      case 'tiktok':
        return TikTok
      case 'youtube':
        return YouTube
      case 'spotify':
      case 'spotify-artist':
      case 'spotify-playlist':
        return Spotify
      case 'soundcloud':
        return SoundCloud
      default:
        return null
    }
  }

  // Function to format numbers
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  // Fetch lead data from API
  const fetchLeadData = async () => {
    if (!userInfo?.user_id || !leadId) return

    setLoading(true)
    try {
      // First try to get platform from current lead data (we don't have it in URL)
      // We'll need to make a call to get the platform or pass it from the previous page
      // For now, we'll try to get the data and extract platform from response
      const response = await fetch(
        `https://dev-api.findsocial.io/leads/leads/${leadId}?auth0_id=${userInfo.user_id}&platform=instagram`
      )

      if (!response.ok) {
        // If instagram fails, try with other platforms
        const platforms = ['tiktok', 'youtube', 'spotify', 'soundcloud']
        let success = false
        
        for (const platform of platforms) {
          try {
            const altResponse = await fetch(
              `https://dev-api.findsocial.io/leads/leads/${leadId}?auth0_id=${userInfo.user_id}&platform=${platform}`
            )
            if (altResponse.ok) {
              const data = await altResponse.json()
              setLeadData(data)
              success = true
              break
            }
          } catch (error) {
            continue
          }
        }
        
        if (!success) {
          throw new Error('Failed to fetch lead data')
        }
      } else {
        const data = await response.json()
        setLeadData(data)
      }
    } catch (error) {
      console.error('Error fetching lead data:', error)
      toast({
        title: "Error",
        description: "Failed to load lead details. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeadData()
  }, [leadId, userInfo?.user_id])

  if (loading) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7f56d9]"></div>
        </div>
      </div>
    )
  }

  if (!leadData) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <p className="text-[#667085]">Lead not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center flex-wrap gap-2 mb-6">
        <Link href="/Leads" className="text-[#667085] hover:text-[#344054] transition-colors flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Leads</span>
        </Link>
        <span className="text-sm text-[#667085]">/ About</span>
        <div className="flex items-center gap-2 bg-[#f9f5ff] px-2 py-1 rounded-full">
          <div className="w-2 h-2 bg-[#7f56d9] rounded-full"></div>
          <span className="text-xs text-[#7f56d9] font-medium">Generated from {leadData.platform}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end flex-wrap gap-3 mb-8">
        <Button
          variant="outline"
          className="cursor-pointer border-[#d0d5dd] text-[#344054] hover:bg-[#f9fafb] h-10 px-4 flex items-center gap-2 bg-transparent"
        >
          <ExternalLink className="w-4 h-4" />
          Links
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Button>
        <Button
          variant="outline"
          className="cursor-pointer border-[#d0d5dd] text-[#344054] hover:bg-[#f9fafb] h-10 px-4 flex items-center gap-2 bg-transparent"
        >
          <User className="w-4 h-4" />
          Profile
        </Button>
        <Button
          variant="outline"
          className="cursor-pointer border-[#d0d5dd] text-[#344054] hover:bg-[#f9fafb] h-10 px-4 flex items-center gap-2 bg-transparent"
        >
          <Mail className="w-4 h-4" />
          Message
        </Button>
        <Button className="cursor-pointer bg-[#7f56d9] hover:bg-[#6941c6] text-white h-10 px-4 flex items-center gap-2">
          <Mail className="w-4 h-4" />
          Email
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Profile Info */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg border border-[#eaecf0] p-4 sm:p-6">
            {/* Profile Header */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-[#f2f4f7]">
                  <Image
                    src={Avatar1}
                    alt={leadData.data.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                {getIsVerified(leadData.data) && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#0ba5ec] rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                )}
              </div>
              <h1 className="text-xl font-semibold text-[#101828] mb-1">{getDisplayName(leadData.data)}</h1>
              <p className="text-[#667085] mb-2">@{leadData.data.name || leadData.data.username || 'N/A'}</p>
              <div className="flex items-center justify-center flex-wrap gap-x-2 gap-y-1 text-sm text-[#667085] mb-2">
                <Mail className="w-4 h-4" />
                <span>
                  {leadData.data.email && leadData.data.email.length > 0 
                    ? leadData.data.email.join(", ") 
                    : leadData.data.other_emails && leadData.data.other_emails.length > 0
                    ? leadData.data.other_emails.join(", ")
                    : "No email"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#667085]">
                <MapPin className="w-4 h-4" />
                <span>{leadData.data.country || leadData.data.city || "No location"}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6 text-center">
              <div>
                <div className="text-lg font-semibold text-[#101828]">{formatNumber(getFollowersCount(leadData.data))}</div>
                <div className="text-sm text-[#667085]">
                  {leadData.platform.toLowerCase() === 'youtube' ? 'Subscribers' : 'Followers'}
                </div>
              </div>
              <div>
                <div className="text-lg font-semibold text-[#101828]">
                  {leadData.platform.toLowerCase() === 'soundcloud' ? formatNumber(leadData.data.likes || 0) :
                   leadData.data.following ? formatNumber(leadData.data.following) : 
                   leadData.platform.toLowerCase() === 'youtube' ? formatNumber(leadData.data.views_count || 0) : 'N/A'}
                </div>
                <div className="text-sm text-[#667085]">
                  {leadData.platform.toLowerCase() === 'soundcloud' ? 'Likes' :
                   leadData.platform.toLowerCase() === 'youtube' ? 'Views' : 'Following'}
                </div>
              </div>
              <div>
                <div className="text-lg font-semibold text-[#101828]">{formatNumber(getPostsCount(leadData.data))}</div>
                <div className="text-sm text-[#667085]">
                  {leadData.platform.toLowerCase() === 'soundcloud' ? 'Tracks' :
                   leadData.platform.toLowerCase() === 'youtube' ? 'Videos' : 'Posts'}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-medium text-[#101828] mb-3">Description</h3>
              <p className="text-sm text-[#667085] leading-relaxed">{leadData.data.description || "No description available"}</p>
            </div>
          </div>
        </div>

        {/* Right Column - Platform Details */}
        <div className="md:col-span-2">
          {/* Platform Tabs */}
          <div className="flex items-center border-b border-gray-200 overflow-x-auto">
            {platformTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`cursor-pointer px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors -mb-px border-b-2 ${
                  activeTab === tab
                    ? "border-[#7f56d9] text-[#7f56d9]"
                    : "border-transparent text-[#667085] hover:text-[#344054] hover:border-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Platform Content */}
          <div className="bg-white rounded-b-lg border-x border-b border-[#eaecf0] p-4 sm:p-6">
            {/* Platform Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-lg border border-[#eaecf0] flex items-center justify-center">
                  {getPlatformIcon(leadData.platform) ? (
                    <Image 
                      src={getPlatformIcon(leadData.platform)!} 
                      alt={leadData.platform} 
                      width={20} 
                      height={20}
                      className="w-5 h-5" 
                    />
                  ) : (
                    <User className="w-5 h-5 text-[#667085]" />
                  )}
                </div>
                <h2 className="text-lg font-semibold text-[#101828] capitalize">{leadData.platform}</h2>
              </div>
              <div className="flex items-center gap-2">
                {leadData.data.url && (
                  <Button
                    variant="outline"
                    onClick={() => window.open(leadData.data.url, '_blank')}
                    className="cursor-pointer border-[#d0d5dd] text-[#344054] hover:bg-[#f9fafb] h-9 px-3 flex items-center gap-2 bg-transparent"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="hidden sm:inline">View Profile</span>
                  </Button>
                )}
              </div>
            </div>

            {activeTab === "Profile" && (
              <>
                {/* Platform Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                  <div>
                    <div className="text-2xl font-semibold text-[#101828] mb-1">
                      {formatNumber(getFollowersCount(leadData.data))}
                    </div>
                    <div className="text-sm text-[#667085]">
                      {leadData.platform.toLowerCase() === 'youtube' ? 'Subscribers' : 'Followers'}
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-[#101828] mb-1">
                      {leadData.data.following ? formatNumber(leadData.data.following) : 
                       leadData.platform.toLowerCase() === 'youtube' ? formatNumber(leadData.data.views_count || 0) : 'N/A'}
                    </div>
                    <div className="text-sm text-[#667085]">
                      {leadData.platform.toLowerCase() === 'youtube' ? 'Total Views' : 'Following'}
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-[#101828] mb-1">
                      {formatNumber(getPostsCount(leadData.data))}
                    </div>
                    <div className="text-sm text-[#667085]">
                      {leadData.platform.toLowerCase() === 'youtube' ? 'Videos' : 'Posts'}
                    </div>
                  </div>
                </div>

                {/* YouTube specific stats */}
                {leadData.platform.toLowerCase() === 'youtube' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 pt-4 border-t border-[#eaecf0]">
                    {leadData.data.join_date && (
                      <div>
                        <div className="text-sm font-medium text-[#101828] mb-1">Channel Created</div>
                        <div className="text-sm text-[#667085]">
                          {new Date(leadData.data.join_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    )}
                    {leadData.data.is_family_safe !== undefined && (
                      <div>
                        <div className="text-sm font-medium text-[#101828] mb-1">Family Safe</div>
                        <div className="text-sm text-[#667085]">{leadData.data.is_family_safe ? 'Yes' : 'No'}</div>
                      </div>
                    )}
                  </div>
                )}

                {/* TikTok specific stats */}
                {leadData.platform.toLowerCase() === 'tiktok' && leadData.data.likes && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 pt-4 border-t border-[#eaecf0]">
                    <div>
                      <div className="text-2xl font-semibold text-[#101828] mb-1">
                        {formatNumber(leadData.data.likes)}
                      </div>
                      <div className="text-sm text-[#667085]">Total Likes</div>
                    </div>
                    {leadData.data.friendscount && (
                      <div>
                        <div className="text-2xl font-semibold text-[#101828] mb-1">
                          {formatNumber(leadData.data.friendscount)}
                        </div>
                        <div className="text-sm text-[#667085]">Friends</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Platform Details */}
                <div className="space-y-4">
                  {/* UID for TikTok */}
                  {leadData.platform.toLowerCase() === 'tiktok' && leadData.data.uid && (
                    <div className="flex items-start gap-3">
                      <Hash className="w-5 h-5 text-[#667085] mt-1 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-[#101828]">UID</div>
                        <div className="text-sm text-[#667085] break-all">{leadData.data.uid}</div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-[#667085] mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-[#101828]">Name</div>
                      <div className="text-sm text-[#667085]">{leadData.data.name}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AtSign className="w-5 h-5 text-[#667085] mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-[#101828]">Username</div>
                      <div className="text-sm text-[#667085]">@{leadData.data.username}</div>
                    </div>
                  </div>
                  {leadData.data.catagory_name && (
                    <div className="flex items-start gap-3">
                      <Hash className="w-5 h-5 text-[#667085] mt-1 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-[#101828]">Category</div>
                        <div className="text-sm text-[#667085]">{leadData.data.catagory_name}</div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#667085] mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <div className="text-sm font-medium text-[#101828]">Verified</div>
                      <div className="text-sm text-[#667085]">{getIsVerified(leadData.data) ? "Yes" : "No"}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#667085] mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <div>
                      <div className="text-sm font-medium text-[#101828]">Account Type</div>
                      <div className="text-sm text-[#667085]">{getIsBusiness(leadData.data) ? "Business" : "Personal"}</div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {leadData.data.description && (
                  <div className="mt-6 pt-6 border-t border-[#eaecf0]">
                    <h3 className="text-sm font-medium text-[#101828] mb-3">Bio</h3>
                    <p className="text-sm text-[#667085] leading-relaxed">{leadData.data.description}</p>
                  </div>
                )}
              </>
            )}

            {activeTab === "Links" && (
              <div className="space-y-4">
                <div className="text-sm text-[#101828] font-medium mb-4">Social Media Links</div>
                
                {leadData.data.url && (
                  <div className="flex items-center gap-3 p-3 bg-[#f9fafb] rounded-lg">
                    {getPlatformIcon(leadData.platform) && (
                      <Image 
                        src={getPlatformIcon(leadData.platform)!} 
                        alt={leadData.platform} 
                        width={16} 
                        height={16}
                        className="w-4 h-4" 
                      />
                    )}
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[#101828] capitalize">{leadData.platform}</div>
                      <a 
                        href={leadData.data.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-[#7f56d9] hover:underline break-all"
                      >
                        {leadData.data.url}
                      </a>
                    </div>
                    <ExternalLink className="w-4 h-4 text-[#667085]" />
                  </div>
                )}

                {/* YouTube socials */}
                {leadData.platform.toLowerCase() === 'youtube' && leadData.data.socials && (
                  <>
                    {leadData.data.socials.instagram && (
                      <div className="flex items-center gap-3 p-3 bg-[#f9fafb] rounded-lg">
                        <Image src={Instagram} alt="Instagram" width={16} height={16} className="w-4 h-4" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-[#101828]">Instagram</div>
                          <a 
                            href={leadData.data.socials.instagram} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-[#7f56d9] hover:underline break-all"
                          >
                            {leadData.data.socials.instagram}
                          </a>
                        </div>
                        <ExternalLink className="w-4 h-4 text-[#667085]" />
                      </div>
                    )}
                    
                    {leadData.data.socials.twitter && (
                      <div className="flex items-center gap-3 p-3 bg-[#f9fafb] rounded-lg">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-[#101828]">Twitter</div>
                          <a 
                            href={leadData.data.socials.twitter} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-[#7f56d9] hover:underline break-all"
                          >
                            {leadData.data.socials.twitter}
                          </a>
                        </div>
                        <ExternalLink className="w-4 h-4 text-[#667085]" />
                      </div>
                    )}

                    {leadData.data.socials.facebook && (
                      <div className="flex items-center gap-3 p-3 bg-[#f9fafb] rounded-lg">
                        <svg className="w-4 h-4 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-[#101828]">Facebook</div>
                          <a 
                            href={leadData.data.socials.facebook} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-[#7f56d9] hover:underline break-all"
                          >
                            {leadData.data.socials.facebook}
                          </a>
                        </div>
                        <ExternalLink className="w-4 h-4 text-[#667085]" />
                      </div>
                    )}

                    {leadData.data.socials.tiktok && (
                      <div className="flex items-center gap-3 p-3 bg-[#f9fafb] rounded-lg">
                        <Image src={TikTok} alt="TikTok" width={16} height={16} className="w-4 h-4" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-[#101828]">TikTok</div>
                          <a 
                            href={leadData.data.socials.tiktok} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-[#7f56d9] hover:underline break-all"
                          >
                            {leadData.data.socials.tiktok}
                          </a>
                        </div>
                        <ExternalLink className="w-4 h-4 text-[#667085]" />
                      </div>
                    )}

                    {leadData.data.socials.spotify && (
                      <div className="flex items-center gap-3 p-3 bg-[#f9fafb] rounded-lg">
                        <Image src={Spotify} alt="Spotify" width={16} height={16} className="w-4 h-4" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-[#101828]">Spotify</div>
                          <a 
                            href={leadData.data.socials.spotify} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-[#7f56d9] hover:underline break-all"
                          >
                            {leadData.data.socials.spotify}
                          </a>
                        </div>
                        <ExternalLink className="w-4 h-4 text-[#667085]" />
                      </div>
                    )}

                    {leadData.data.socials.soundcloud && (
                      <div className="flex items-center gap-3 p-3 bg-[#f9fafb] rounded-lg">
                        <Image src={SoundCloud} alt="SoundCloud" width={16} height={16} className="w-4 h-4" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-[#101828]">SoundCloud</div>
                          <a 
                            href={leadData.data.socials.soundcloud} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-[#7f56d9] hover:underline break-all"
                          >
                            {leadData.data.socials.soundcloud}
                          </a>
                        </div>
                        <ExternalLink className="w-4 h-4 text-[#667085]" />
                      </div>
                    )}

                    {leadData.data.socials.linktree && (
                      <div className="flex items-center gap-3 p-3 bg-[#f9fafb] rounded-lg">
                        <ExternalLink className="w-4 h-4 text-[#667085]" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-[#101828]">Linktree</div>
                          <a 
                            href={leadData.data.socials.linktree} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-[#7f56d9] hover:underline break-all"
                          >
                            {leadData.data.socials.linktree}
                          </a>
                        </div>
                        <ExternalLink className="w-4 h-4 text-[#667085]" />
                      </div>
                    )}
                  </>
                )}

                {/* Other platform links (TikTok, Instagram format) */}
                {leadData.data.tiktok && (
                  <div className="flex items-center gap-3 p-3 bg-[#f9fafb] rounded-lg">
                    <Image src={TikTok} alt="TikTok" width={16} height={16} className="w-4 h-4" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[#101828]">TikTok</div>
                      <a 
                        href={leadData.data.tiktok} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-[#7f56d9] hover:underline break-all"
                      >
                        {leadData.data.tiktok}
                      </a>
                    </div>
                    <ExternalLink className="w-4 h-4 text-[#667085]" />
                  </div>
                )}

                {leadData.data.youtube && (
                  <div className="flex items-center gap-3 p-3 bg-[#f9fafb] rounded-lg">
                    <Image src={YouTube} alt="YouTube" width={16} height={16} className="w-4 h-4" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[#101828]">YouTube</div>
                      <a 
                        href={leadData.data.youtube} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-[#7f56d9] hover:underline break-all"
                      >
                        {leadData.data.youtube}
                      </a>
                    </div>
                    <ExternalLink className="w-4 h-4 text-[#667085]" />
                  </div>
                )}

                {leadData.data.spotify && (
                  <div className="flex items-center gap-3 p-3 bg-[#f9fafb] rounded-lg">
                    <Image src={Spotify} alt="Spotify" width={16} height={16} className="w-4 h-4" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[#101828]">Spotify</div>
                      <a 
                        href={leadData.data.spotify} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-[#7f56d9] hover:underline break-all"
                      >
                        {leadData.data.spotify}
                      </a>
                    </div>
                    <ExternalLink className="w-4 h-4 text-[#667085]" />
                  </div>
                )}

                {leadData.data.soundcloud && (
                  <div className="flex items-center gap-3 p-3 bg-[#f9fafb] rounded-lg">
                    <Image src={SoundCloud} alt="SoundCloud" width={16} height={16} className="w-4 h-4" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[#101828]">SoundCloud</div>
                      <a 
                        href={leadData.data.soundcloud} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-[#7f56d9] hover:underline break-all"
                      >
                        {leadData.data.soundcloud}
                      </a>
                    </div>
                    <ExternalLink className="w-4 h-4 text-[#667085]" />
                  </div>
                )}

                {leadData.data.instagram && (
                  <div className="flex items-center gap-3 p-3 bg-[#f9fafb] rounded-lg">
                    <Image src={Instagram} alt="Instagram" width={16} height={16} className="w-4 h-4" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[#101828]">Instagram</div>
                      <a 
                        href={leadData.data.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-[#7f56d9] hover:underline break-all"
                      >
                        {leadData.data.instagram}
                      </a>
                    </div>
                    <ExternalLink className="w-4 h-4 text-[#667085]" />
                  </div>
                )}

                {leadData.data.linktree && (
                  <div className="flex items-center gap-3 p-3 bg-[#f9fafb] rounded-lg">
                    <ExternalLink className="w-4 h-4 text-[#667085]" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[#101828]">Linktree</div>
                      <a 
                        href={leadData.data.linktree} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-[#7f56d9] hover:underline break-all"
                      >
                        {leadData.data.linktree}
                      </a>
                    </div>
                    <ExternalLink className="w-4 h-4 text-[#667085]" />
                  </div>
                )}

                {leadData.data.other && (
                  <div className="flex items-center gap-3 p-3 bg-[#f9fafb] rounded-lg">
                    <ExternalLink className="w-4 h-4 text-[#667085]" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[#101828]">Other</div>
                      <a 
                        href={leadData.data.other} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-[#7f56d9] hover:underline break-all"
                      >
                        {leadData.data.other}
                      </a>
                    </div>
                    <ExternalLink className="w-4 h-4 text-[#667085]" />
                  </div>
                )}

                {/* Deep Search Instagram Links for YouTube */}
                {leadData.platform.toLowerCase() === 'youtube' && leadData.data.deep_search?.instagram && (
                  <div className="pt-6 border-t border-[#eaecf0]">
                    <div className="text-sm text-[#101828] font-medium mb-4">Connected Instagram Profile</div>
                    <div className="flex items-center gap-3 p-3 bg-[#f9fafb] rounded-lg mb-4">
                      <Image src={Instagram} alt="Instagram" width={16} height={16} className="w-4 h-4" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-[#101828]">
                          {leadData.data.deep_search.instagram.name} (@{leadData.data.deep_search.instagram.username})
                        </div>
                        <a 
                          href={leadData.data.deep_search.instagram.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-[#7f56d9] hover:underline break-all"
                        >
                          {leadData.data.deep_search.instagram.url}
                        </a>
                      </div>
                      <ExternalLink className="w-4 h-4 text-[#667085]" />
                    </div>
                    
                    {leadData.data.deep_search.instagram["Bio Links"] && leadData.data.deep_search.instagram["Bio Links"].length > 0 && (
                      <div>
                        <div className="text-xs text-[#667085] mb-2">Bio Links</div>
                        {leadData.data.deep_search.instagram["Bio Links"].map((link, index) => (
                          <div key={index} className="flex items-center gap-3 p-2 bg-white border border-[#eaecf0] rounded-lg mb-2">
                            <ExternalLink className="w-3 h-3 text-[#667085]" />
                            <div className="flex-1">
                              <div className="text-xs font-medium text-[#101828]">{link.title}</div>
                              <a 
                                href={link.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-[#7f56d9] hover:underline break-all"
                              >
                                {link.url}
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Check if no links available */}
                {!leadData.data.url && 
                 !leadData.data.tiktok && 
                 !leadData.data.youtube && 
                 !leadData.data.spotify && 
                 !leadData.data.soundcloud && 
                 !leadData.data.linktree && 
                 !leadData.data.instagram && 
                 !leadData.data.other &&
                 (!leadData.data.socials || Object.values(leadData.data.socials).every(link => !link)) &&
                 (
                   <div className="text-center py-8">
                     <p className="text-[#667085]">No social media links available</p>
                   </div>
                 )}
              </div>
            )}

            {activeTab === "Additional Info" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm font-medium text-[#101828] mb-2">Account Privacy</div>
                    <div className="text-sm text-[#667085]">{getIsPrivate(leadData.data) ? "Private" : "Public"}</div>
                  </div>
                  {leadData.data.llm_generated !== undefined && (
                    <div>
                      <div className="text-sm font-medium text-[#101828] mb-2">AI Generated</div>
                      <div className="text-sm text-[#667085]">{leadData.data.llm_generated ? "Yes" : "No"}</div>
                    </div>
                  )}
                  {leadData.data.pronouns && (
                    <div>
                      <div className="text-sm font-medium text-[#101828] mb-2">Pronouns</div>
                      <div className="text-sm text-[#667085]">{leadData.data.pronouns || "Not specified"}</div>
                    </div>
                  )}
                  {(leadData.data.email && leadData.data.email.length > 0) || (leadData.data.other_emails && leadData.data.other_emails.length > 0) && (
                    <div>
                      <div className="text-sm font-medium text-[#101828] mb-2">Email</div>
                      <div className="text-sm text-[#667085]">
                        {leadData.data.email && leadData.data.email.length > 0 
                          ? leadData.data.email.join(", ")
                          : leadData.data.other_emails && leadData.data.other_emails.length > 0
                          ? leadData.data.other_emails.join(", ")
                          : "N/A"}
                      </div>
                    </div>
                  )}
                  
                  {/* SoundCloud specific fields */}
                  {leadData.platform.toLowerCase() === 'soundcloud' && leadData.data.creator_subscription && (
                    <div>
                      <div className="text-sm font-medium text-[#101828] mb-2">Subscription Type</div>
                      <div className="text-sm text-[#667085] capitalize">{leadData.data.creator_subscription}</div>
                    </div>
                  )}
                  {leadData.platform.toLowerCase() === 'soundcloud' && leadData.data.playlist_count !== undefined && (
                    <div>
                      <div className="text-sm font-medium text-[#101828] mb-2">Playlists</div>
                      <div className="text-sm text-[#667085]">{formatNumber(leadData.data.playlist_count)}</div>
                    </div>
                  )}
                  {leadData.platform.toLowerCase() === 'soundcloud' && leadData.data.created_at && (
                    <div>
                      <div className="text-sm font-medium text-[#101828] mb-2">Account Created</div>
                      <div className="text-sm text-[#667085]">{formatCreationDate(leadData.data.created_at)}</div>
                    </div>
                  )}
                  
                  {/* TikTok specific fields */}
                  {leadData.platform.toLowerCase() === 'tiktok' && leadData.data.friendscount && (
                    <div>
                      <div className="text-sm font-medium text-[#101828] mb-2">Friends Count</div>
                      <div className="text-sm text-[#667085]">{formatNumber(leadData.data.friendscount)}</div>
                    </div>
                  )}
                  {leadData.platform.toLowerCase() === 'tiktok' && leadData.data.likes && (
                    <div>
                      <div className="text-sm font-medium text-[#101828] mb-2">Total Likes</div>
                      <div className="text-sm text-[#667085]">{formatNumber(leadData.data.likes)}</div>
                    </div>
                  )}
                </div>
                
                <div className="pt-6 border-t border-[#eaecf0]">
                  <div className="text-sm font-medium text-[#101828] mb-4">Metadata</div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#667085]">Lead ID:</span>
                      <span className="text-[#344054] font-mono">{leadData.id}</span>
                    </div>
                    {leadData.platform.toLowerCase() === 'tiktok' && leadData.data.uid && (
                      <div className="flex justify-between">
                        <span className="text-[#667085]">UID:</span>
                        <span className="text-[#344054] font-mono">{leadData.data.uid}</span>
                      </div>
                    )}
                    {leadData.platform.toLowerCase() === 'soundcloud' && leadData.data.c_id && (
                      <div className="flex justify-between">
                        <span className="text-[#667085]">SoundCloud ID:</span>
                        <span className="text-[#344054] font-mono">{leadData.data.c_id}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-[#667085]">Platform:</span>
                      <span className="text-[#344054] capitalize">{leadData.platform}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#667085]">Search Query:</span>
                      <span className="text-[#344054]">{leadData.search}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#667085]">Created At:</span>
                      <span className="text-[#344054]">{new Date(leadData.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#667085]">Last Updated:</span>
                      <span className="text-[#344054]">{new Date(leadData.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
