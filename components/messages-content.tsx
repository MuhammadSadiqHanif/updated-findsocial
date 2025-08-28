"use client"

import { useState } from "react"
import { Search, RefreshCw, Send, Eye } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StatusBadge } from "@/components/status-badge"
import Instagram from "@/public/platform/instagram.png"
import SoundCloud from "@/public/platform/soundcloud.png"
import Image from "next/image"

const messagesData = [
    {
        id: 1,
        toProspect: {
          name: "Cameron Williamson",
          username: "@cameron.will",
          avatar: "/man-avatar.png",
        },
        from: {
          name: "Olivia Rhye",
          username: "@olivia",
          avatar: "/woman-avatar.png",
        },
        platform: "instagram",
        status: "sent",
        added: "13 minutes ago",
      },
      {
        id: 2,
        toProspect: {
          name: "Dianne Russell",
          username: "@dianne.russell",
          avatar: "/woman-avatar-2.png",
        },
        from: {
          name: "Olivia Rhye",
          username: "@olivia",
          avatar: "/woman-avatar.png",
        },
        platform: "soundcloud",
        status: "sent",
        added: "20 minutes ago",
      },
      {
        id: 3,
        toProspect: {
          name: "Jerome Bell",
          username: "@jerome.bell",
          avatar: "/man-avatar.png",
        },
        from: {
          name: "Olivia Rhye",
          username: "@olivia",
          avatar: "/woman-avatar.png",
        },
        platform: "instagram",
        status: "sent",
        added: "3 hours ago",
      },
      {
        id: 4,
        toProspect: {
          name: "Ronald Richards",
          username: "@ronald.richards",
          avatar: "/man-avatar.png",
        },
        from: {
          name: "Olivia Rhye",
          username: "@olivia",
          avatar: "/woman-avatar.png",
        },
        platform: "soundcloud",
        status: "pending",
        added: "Aug 1, 2025 9:48 AM",
      },
      {
        id: 5,
        toProspect: {
          name: "Darlene Robertson",
          username: "@darlene.robertson",
          avatar: "/woman-avatar-3.png",
        },
        from: {
          name: "Olivia Rhye",
          username: "@olivia",
          avatar: "/woman-avatar.png",
        },
        platform: "instagram",
        status: "error",
        added: "Aug 1, 2025 10:25 AM",
      },
]

const PlatformIcon = ({ platform }: { platform: string }) => {
  switch (platform) {
    case "instagram":
      return <Image src={Instagram} alt="Instagram" className="w-6 h-6 rounded-full" />
    case "soundcloud":
      return <Image src={SoundCloud} alt="SoundCloud" className="w-6 h-6 rounded-full" />
    default:
      return (
        <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-full"></div>
        </div>
      )
  }
}

export default function MessagesContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewAllMessages, setViewAllMessages] = useState(false)

  return (
    <div className="bg-white rounded-lg border border-[#eaecf0] overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-[#eaecf0]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#667085] w-5 h-5" />
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-[#d0d5dd] focus:border-[#7f56d9] focus:ring-[#7f56d9]"
            />
          </div>
          <div className="flex items-center justify-between md:justify-start gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="view-all"
                checked={viewAllMessages}
                onCheckedChange={() => setViewAllMessages(!viewAllMessages)}
                className="data-[state=checked]:bg-[#7f56d9] data-[state=checked]:border-[#7f56d9] cursor-pointer"
              />
              <label htmlFor="view-all" className="text-sm text-[#344054] cursor-pointer">
                View all Messages
              </label>
            </div>
            <button className="p-2 text-[#667085] hover:text-[#344054] hover:bg-[#f9fafb] rounded-lg transition-colors cursor-pointer">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Layout */}
      <div className="md:hidden">
        {messagesData.map((message) => (
          <div key={message.id} className="border-b border-[#eaecf0] p-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                        <AvatarImage src={message.toProspect.avatar || "/placeholder.svg"} alt={message.toProspect.name} />
                        <AvatarFallback className="bg-[#f2f4f7] text-[#667085]">
                        {message.toProspect.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-medium text-[#101828]">{message.toProspect.name}</p>
                        <p className="text-sm text-[#667085]">{message.toProspect.username}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-1 text-[#667085] hover:text-[#344054] hover:bg-[#f9fafb] rounded transition-colors">
                        <Send className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-[#667085] hover:text-[#344054] hover:bg-[#f9fafb] rounded transition-colors">
                        <Eye className="w-4 h-4" />
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-[#667085]">From</div>
              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={message.from.avatar || "/placeholder.svg"} alt={message.from.name} />
                  <AvatarFallback className="bg-[#f2f4f7] text-[#667085] text-xs">
                    {message.from.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-[#101828] font-medium">{message.from.name}</span>
              </div>

              <div className="text-[#667085]">Platform</div>
              <div><PlatformIcon platform={message.platform} /></div>

              <div className="text-[#667085]">Status</div>
              <div><StatusBadge status={message.status} /></div>

              <div className="text-[#667085]">Added</div>
              <div className="text-[#667085]">{message.added}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#f9fafb] border-b border-[#eaecf0]">
            <tr>
              <th className="text-left py-3 px-6 text-xs font-medium text-[#667085] uppercase tracking-wider">To Prospects</th>
              <th className="text-left py-3 px-6 text-xs font-medium text-[#667085] uppercase tracking-wider">From</th>
              <th className="text-left py-3 px-6 text-xs font-medium text-[#667085] uppercase tracking-wider">Platform</th>
              <th className="text-left py-3 px-6 text-xs font-medium text-[#667085] uppercase tracking-wider">Status</th>
              <th className="text-left py-3 px-6 text-xs font-medium text-[#667085] uppercase tracking-wider">Added</th>
              <th className="w-20"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eaecf0]">
            {messagesData.map((message) => (
              <tr key={message.id} className="hover:bg-[#f9fafb] transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={message.toProspect.avatar || "/placeholder.svg"} alt={message.toProspect.name} />
                      <AvatarFallback className="bg-[#f2f4f7] text-[#667085]">
                        {message.toProspect.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-[#101828]">{message.toProspect.name}</p>
                      <p className="text-sm text-[#667085]">{message.toProspect.username}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={message.from.avatar || "/placeholder.svg"} alt={message.from.name} />
                      <AvatarFallback className="bg-[#f2f4f7] text-[#667085]">
                        {message.from.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-[#101828]">{message.from.name}</p>
                      <p className="text-sm text-[#667085]">{message.from.username}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <PlatformIcon platform={message.platform} />
                  </div>
                </td>
                <td className="py-4 px-6">
                  <StatusBadge status={message.status} />
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-[#667085]">{message.added}</span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <button className="p-1 text-[#667085] hover:text-[#344054] hover:bg-[#f9fafb] rounded transition-colors">
                      <Send className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-[#667085] hover:text-[#344054] hover:bg-[#f9fafb] rounded transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

