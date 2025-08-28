"use client"

import { useState } from "react"
import { ArrowLeft, ExternalLink, User, Mail, MapPin, Hash, AtSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import Avatar1 from "@/public/Avatar.png";
interface LeadDetailContentProps {
  leadId: string
}

// Mock data for the lead detail
const leadDetailData = {
  id: "1",
  name: "Cameron Williamson",
  username: "@cameron",
  email: "cameron.williamson@example.com",
  location: "United States",
  avatar: Avatar1,
  isVerified: true,
  generatedFrom: "Instagram",
  stats: {
    followers: "6.8M",
    following: "6.8M",
    posts: "845",
  },
  description:
    "Velora sintac orvim nara pellus qaret minora. Trespia valinor ketra sumandis polmera fixtan ora velit. Lunaris pendra colvit estro maxel durat in fravim. Qerasto mintra polven exra dulmin faret moren falist. Trenova kelsor miphan dravon estel quaris montin. Frestal orvium latens drimur colvan sereth plomar.",
  platforms: {
    tiktok: {
      name: "TikTok",
      uid: "6791505430487532550",
      username: "@cameron.will",
      followers: "6.8M",
      following: "6.8M",
      posts: "845",
    },
  },
}

export default function LeadDetailContent({ leadId }: LeadDetailContentProps) {
  const [activeTab, setActiveTab] = useState("TikTok")

  const tabs = ["TikTok", "YouTube", "SoundCloud", "Spotify Artist", "Spotify"]

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
          <span className="text-xs text-[#7f56d9] font-medium">Generated from {leadDetailData.generatedFrom}</span>
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
                    src={leadDetailData.avatar || "/placeholder.svg"}
                    alt={leadDetailData.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                {leadDetailData.isVerified && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#0ba5ec] rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                )}
              </div>
              <h1 className="text-xl font-semibold text-[#101828] mb-1">{leadDetailData.name}</h1>
              <p className="text-[#667085] mb-2">{leadDetailData.username}</p>
              <div className="flex items-center justify-center flex-wrap gap-x-2 gap-y-1 text-sm text-[#667085] mb-2">
                <Mail className="w-4 h-4" />
                <span>{leadDetailData.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#667085]">
                <MapPin className="w-4 h-4" />
                <span>{leadDetailData.location}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6 text-center">
              <div>
                <div className="text-lg font-semibold text-[#101828]">{leadDetailData.stats.followers}</div>
                <div className="text-sm text-[#667085]">Followers</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-[#101828]">{leadDetailData.stats.following}</div>
                <div className="text-sm text-[#667085]">Following</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-[#101828]">{leadDetailData.stats.posts}</div>
                <div className="text-sm text-[#667085]">Posts</div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-medium text-[#101828] mb-3">Description</h3>
              <p className="text-sm text-[#667085] leading-relaxed">{leadDetailData.description}</p>
            </div>
          </div>
        </div>

        {/* Right Column - Platform Details */}
        <div className="md:col-span-2">
          {/* Platform Tabs */}
          <div className="flex items-center border-b border-gray-200 overflow-x-auto">
            {tabs.map((tab) => (
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
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-[#101828]">TikTok</h2>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="cursor-pointer border-[#d0d5dd] text-[#344054] hover:bg-[#f9fafb] h-9 px-3 flex items-center gap-2 bg-transparent"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="hidden sm:inline">Links</span>
                </Button>
                <Button
                  variant="outline"
                  className="cursor-pointer border-[#d0d5dd] text-[#344054] hover:bg-[#f9fafb] h-9 px-3 flex items-center gap-2 bg-transparent"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Profile</span>
                </Button>
              </div>
            </div>

            {/* Platform Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div>
                <div className="text-2xl font-semibold text-[#101828] mb-1">
                  {leadDetailData.platforms.tiktok.followers}
                </div>
                <div className="text-sm text-[#667085]">Followers</div>
              </div>
              <div>
                <div className="text-2xl font-semibold text-[#101828] mb-1">
                  {leadDetailData.platforms.tiktok.following}
                </div>
                <div className="text-sm text-[#667085]">Following</div>
              </div>
              <div>
                <div className="text-2xl font-semibold text-[#101828] mb-1">
                  {leadDetailData.platforms.tiktok.posts}
                </div>
                <div className="text-sm text-[#667085]">Posts</div>
              </div>
            </div>

            {/* Platform Details */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Hash className="w-5 h-5 text-[#667085] mt-1 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-[#101828]">UID</div>
                  <div className="text-sm text-[#667085] break-all">{leadDetailData.platforms.tiktok.uid}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-[#667085] mt-1 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-[#101828]">Name</div>
                  <div className="text-sm text-[#667085]">{leadDetailData.name}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AtSign className="w-5 h-5 text-[#667085] mt-1 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-[#101828]">Username</div>
                  <div className="text-sm text-[#667085]">{leadDetailData.platforms.tiktok.username}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6 pt-6 border-t border-[#eaecf0]">
              <h3 className="text-sm font-medium text-[#101828] mb-3">Description</h3>
              <p className="text-sm text-[#667085] leading-relaxed">{leadDetailData.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
