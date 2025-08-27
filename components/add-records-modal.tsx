"use client"

import { useState } from "react"
import { Search, Filter, X, LinkIcon, Instagram, SproutIcon as Spotify, Settings } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import Avatar1 from "@/public/Avatar.png";
import US from "@/public/US.png";
import Image from "next/image"
const availableRecords = [
  {
    id: 1,
    name: "Olivia Rhye",
    username: "@olivia",
    email: "olivia@untitledui.com",
    country: "United States",
    avatar: Avatar1,
    socialLinks: {
      website: true,
      instagram: true,
      spotify: true,
    },
  },
  {
    id: 2,
    name: "Phoenix Baker",
    username: "@phoenix",
    email: "phoenix@untitledui.com",
    country: "United States",
    avatar: Avatar1,
    socialLinks: {
      website: true,
      instagram: true,
      spotify: true,
    },
  },
  {
    id: 3,
    name: "Lana Steiner",
    username: "@lana",
    email: "lana@untitledui.com",
    country: "United States",
    avatar: Avatar1,
    socialLinks: {
      website: true,
      instagram: true,
      spotify: true,
    },
  },
  {
    id: 4,
    name: "Demi Wilkinson",
    username: "@demi",
    email: "demi@untitledui.com",
    country: "United States",
    avatar: Avatar1,
    socialLinks: {
      website: true,
      instagram: true,
      spotify: true,
    },
  },
  {
    id: 5,
    name: "Candice Wu",
    username: "@candice",
    email: "candice@untitledui.com",
    country: "United States",
    avatar: Avatar1,
    socialLinks: {
      website: true,
      instagram: true,
      spotify: true,
    },
  },
]

interface AddRecordsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddRecords: (selectedRecords: any[]) => void
}

export function AddRecordsModal({ open, onOpenChange, onAddRecords }: AddRecordsModalProps) {
  const [selectedRecords, setSelectedRecords] = useState<number[]>([1, 2, 3, 4])
  const [currentPage, setCurrentPage] = useState(1)

  const handleRecordToggle = (recordId: number) => {
    setSelectedRecords((prev) => (prev.includes(recordId) ? prev.filter((id) => id !== recordId) : [...prev, recordId]))
  }

  const handleAddToList = () => {
    const recordsToAdd = availableRecords.filter((record) => selectedRecords.includes(record.id))
    onAddRecords(recordsToAdd)
    setSelectedRecords([])
  }

  const handleCancel = () => {
    onOpenChange(false)
    setSelectedRecords([])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1400px]  w-[95vw] max-h-[85vh] p-0 bg-white overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-[#eaecf0] flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-[#101828]">Add Records</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="p-1 h-8 w-8 text-[#667085] hover:text-[#344054] hover:bg-[#f2f4f7]"
            >
              {/* <X className="w-4 h-4" /> */}
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 py-4 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#667085] w-4 h-4" />
                <Input
                  placeholder="Search"
                  className="pl-10 border-[#d0d5dd] bg-white text-[#344054] placeholder:text-[#667085] h-10"
                />
              </div>
              <Button
                variant="outline"
                className="border-[#d0d5dd] text-[#344054] hover:bg-[#f9fafb] flex items-center gap-2 bg-white h-10 px-4"
              >
                <Filter className="w-4 h-4" />
                Filter
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="p-2 h-10 w-10 border-[#d0d5dd] text-[#667085] hover:bg-[#f9fafb] bg-white"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 px-6 overflow-auto">
            <div className="bg-white rounded-lg border border-[#eaecf0] overflow-hidden">
              {/* Table Header */}
              <div className="border-b border-[#eaecf0] bg-[#f9fafb] px-6 py-3 sticky top-0">
                <div className="grid grid-cols-[40px_1fr_1fr_200px_200px] gap-6 items-center text-xs font-medium text-[#667085] uppercase tracking-wide">
                  <div className="flex items-center">
                    <Checkbox
                      className="border-[#7f56d9] data-[state=checked]:bg-[#7f56d9] data-[state=checked]:border-[#7f56d9]"
                      checked={selectedRecords.length === availableRecords.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedRecords(availableRecords.map((r) => r.id))
                        } else {
                          setSelectedRecords([])
                        }
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    Name
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                      />
                    </svg>
                  </div>
                  <div className="flex items-center gap-1">
                    Email address
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                      />
                    </svg>
                  </div>
                  <div className="flex items-center gap-1">
                    Country
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                      />
                    </svg>
                  </div>
                  <div>URL/Links</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-[#eaecf0]">
                {availableRecords.map((record) => (
                  <div key={record.id} className="px-6 py-4 hover:bg-[#f9fafb] transition-colors">
                    <div className="grid grid-cols-[40px_1fr_1fr_200px_200px] gap-6 items-center">
                      <div className="flex items-center">
                        <Checkbox
                          className="border-[#7f56d9] data-[state=checked]:bg-[#7f56d9] data-[state=checked]:border-[#7f56d9]"
                          checked={selectedRecords.includes(record.id)}
                          onCheckedChange={() => handleRecordToggle(record.id)}
                        />
                      </div>
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative flex-shrink-0">
                          <Image
                            src={record.avatar || "/placeholder.svg"}
                            alt={record.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-[#101828] truncate">{record.name}</div>
                          <div className="text-sm text-[#667085] truncate">{record.username}</div>
                        </div>
                      </div>
                      <div className="min-w-0">
                        <span className="text-sm text-[#475467] truncate block">{record.email}</span>
                      </div>
                      <div className="flex items-center gap-2 min-w-0">
                        <Image
                          src={US}
                          alt="US Flag"
                          className="w-6 h-4 rounded-sm object-cover flex-shrink-0"
                        />
                        <span className="text-sm text-[#475467] truncate">{record.country}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {record.socialLinks.website && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1.5 h-8 w-8 text-[#667085] hover:text-[#344054] hover:bg-[#f2f4f7] rounded-md flex-shrink-0"
                          >
                            <LinkIcon className="w-4 h-4" />
                          </Button>
                        )}
                        {record.socialLinks.instagram && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1.5 h-8 w-8 text-[#667085] hover:text-[#344054] hover:bg-[#f2f4f7] rounded-md flex-shrink-0"
                          >
                            <Instagram className="w-4 h-4" />
                          </Button>
                        )}
                        {record.socialLinks.spotify && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1.5 h-8 w-8 text-[#667085] hover:text-[#344054] hover:bg-[#f2f4f7] rounded-md flex-shrink-0"
                          >
                            <Spotify className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="px-6 py-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-[#344054]">
                <span>
                  Total Records <span className="font-medium">147</span>
                </span>
                <span>•</span>
                <span>Showing per page</span>
                <select className="border border-[#d0d5dd] rounded-md px-2 py-1 text-sm bg-white ml-1">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#d0d5dd] text-[#344054] bg-white hover:bg-[#f9fafb] px-3 py-2"
                >
                  ← Previous
                </Button>
                <div className="flex items-center gap-1">
                  {[1, 2, 3].map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "outline" : "ghost"}
                      size="sm"
                      className={
                        currentPage === page
                          ? "border-[#d0d5dd] bg-[#f9fafb] text-[#344054] w-8 h-8 p-0"
                          : "text-[#667085] hover:bg-[#f9fafb] w-8 h-8 p-0"
                      }
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  <span className="text-[#667085] px-2">...</span>
                  {[8, 9, 10].map((page) => (
                    <Button
                      key={page}
                      variant="ghost"
                      size="sm"
                      className="text-[#667085] hover:bg-[#f9fafb] w-8 h-8 p-0"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#d0d5dd] text-[#344054] bg-white hover:bg-[#f9fafb] px-3 py-2"
                >
                  Next →
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-[#eaecf0] flex items-center justify-end gap-3 bg-white flex-shrink-0">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="border-[#d0d5dd] text-[#344054] hover:bg-[#f9fafb] bg-white px-4 py-2"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddToList}
            disabled={selectedRecords.length === 0}
            className="bg-[#7f56d9] hover:bg-[#6941c6] text-white disabled:bg-[#f2f4f7] disabled:text-[#667085] px-4 py-2"
          >
            Add to list
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
