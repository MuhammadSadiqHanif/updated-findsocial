"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  LinkIcon,
  Instagram,
  SproutIcon as Spotify,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { AddRecordsModal } from "./add-records-modal";
import { EmptyListState } from "./empty-list-state";
import Image from "next/image";
import Avatar1 from "@/public/Avatar.png";
import US from "@/public/US.png";
// Mock data for records
const mockRecords = [
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
];

interface ListDetailContentProps {
  listId: string;
}

export function ListDetailContent({ listId }: ListDetailContentProps) {
  const [isAddRecordsModalOpen, setIsAddRecordsModalOpen] = useState(false);
  const [records, setRecords] = useState(mockRecords);
  const [showEmptyState, setShowEmptyState] = useState(false); // Set to true to show empty state

  const handleAddRecords = (selectedRecords: any[]) => {
    setRecords([...records, ...selectedRecords]);
    setShowEmptyState(false);
    setIsAddRecordsModalOpen(false);
  };

  if (showEmptyState || records.length === 0) {
    return (
      <EmptyListState onAddRecords={() => setIsAddRecordsModalOpen(true)} />
    );
  }

  return (
    <div className="space-y-6">
      {/* Search, Filter and Add Records */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#667085] w-4 h-4" />
            <Input
              placeholder="Search"
              className="pl-10 border-[#d0d5dd] bg-white text-[#344054] placeholder:text-[#667085]"
            />
          </div>
          <Button
            variant="outline"
            className="border-[#d0d5dd] text-[#344054] hover:bg-[#f9fafb] flex items-center gap-2 bg-transparent"
          >
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="bg-[#7f56d9] hover:bg-[#6941c6] text-white px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={() => setIsAddRecordsModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Add Records
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="p-2 border-[#d0d5dd] text-[#667085] hover:bg-[#f9fafb] bg-transparent"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-lg border border-[#eaecf0] overflow-hidden">
        {/* Table Header */}
        <div className="border-b border-[#eaecf0] bg-[#f9fafb] px-6 py-3">
          <div className="grid grid-cols-12 gap-4 items-center text-xs font-medium text-[#667085] uppercase tracking-wide">
            <div className="col-span-1">
              <Checkbox className="border-[#d0d5dd]" />
            </div>
            <div className="col-span-3 flex items-center gap-1">
              Name
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                />
              </svg>
            </div>
            <div className="col-span-3 flex items-center gap-1">
              Email address
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                />
              </svg>
            </div>
            <div className="col-span-2 flex items-center gap-1">
              Country
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                />
              </svg>
            </div>
            <div className="col-span-2">URL/Links</div>
            <div className="col-span-1"></div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-[#eaecf0]">
          {records.map((record) => (
            <div
              key={record.id}
              className="px-6 py-4 hover:bg-[#f9fafb] transition-colors"
            >
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-1">
                  <Checkbox className="border-[#d0d5dd]" />
                </div>
                <div className="col-span-3 flex items-center gap-3">
                  <Image
                    src={record.avatar || "/placeholder.svg"}
                    alt={record.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-sm font-medium text-[#101828]">
                      {record.name}
                    </div>
                    <div className="text-sm text-[#667085]">
                      {record.username}
                    </div>
                  </div>
                </div>
                <div className="col-span-3">
                  <span className="text-sm text-[#475467]">{record.email}</span>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <Image
                    src={US}
                    alt="US Flag"
                    className="w-6 h-4 rounded-sm object-cover"
                  />
                  <span className="text-sm text-[#475467]">
                    {record.country}
                  </span>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  {record.socialLinks.website && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-6 w-6 text-[#667085] hover:text-[#344054] hover:bg-[#f2f4f7]"
                    >
                      <LinkIcon className="w-3 h-3" />
                    </Button>
                  )}
                  {record.socialLinks.instagram && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-6 w-6 text-[#667085] hover:text-[#344054] hover:bg-[#f2f4f7]"
                    >
                      <Instagram className="w-3 h-3" />
                    </Button>
                  )}
                  {record.socialLinks.spotify && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-6 w-6 text-[#667085] hover:text-[#344054] hover:bg-[#f2f4f7]"
                    >
                      <Spotify className="w-3 h-3" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-6 w-6 text-[#667085] hover:text-[#344054] hover:bg-[#f2f4f7]"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                <div className="col-span-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-8 w-8 text-[#667085] hover:text-[#344054] hover:bg-[#f2f4f7]"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-[#344054]">
          Total Records <span className="font-medium">5</span> • Showing per
          page{" "}
          <select className="border border-[#d0d5dd] rounded px-2 py-1 text-sm">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-[#d0d5dd] text-[#344054] bg-transparent"
          >
            Previous
          </Button>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="border-[#d0d5dd] bg-[#f9fafb] text-[#344054]"
            >
              1
            </Button>
            <Button variant="ghost" size="sm" className="text-[#667085]">
              Next
            </Button>
          </div>
        </div>
      </div>

      <AddRecordsModal
        open={isAddRecordsModalOpen}
        onOpenChange={setIsAddRecordsModalOpen}
        onAddRecords={handleAddRecords}
      />
    </div>
  );
}
