"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Settings,
  RefreshCw,
  LinkIcon,
  Plus,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import Avatar1 from "@/public/Avatar.png";
import US from "@/public/US.png";
import Instagram from "@/public/platform/instagram.png";
import TikTok from "@/public/platform/tiktok.png";
import YouTube from "@/public/platform/youtube.png";
import Spotify from "@/public/platform/spotify.png";
import SoundCloud from "@/public/platform/soundcloud.png";
const leadsData = [
  {
    id: 1,
    name: "Olivia Rhye",
    username: "@olivia",
    email: "olivia@untitledui.com",
    country: "United States",
    avatar: Avatar1,
  },
  {
    id: 2,
    name: "Phoenix Baker",
    username: "@phoenix",
    email: "phoenix@untitledui.com",
    country: "United States",
    avatar: Avatar1,
  },
  {
    id: 3,
    name: "Lana Steiner",
    username: "@lana",
    email: "lana@untitledui.com",
    country: "United States",
    avatar: Avatar1,
  },
  {
    id: 4,
    name: "Demi Wilkinson",
    username: "@demi",
    email: "demi@untitledui.com",
    country: "United States",
    avatar: Avatar1,
  },
  {
    id: 5,
    name: "Candice Wu",
    username: "@candice",
    email: "candice@untitledui.com",
    country: "United States",
    avatar: Avatar1,
  },
  {
    id: 6,
    name: "Natali Craig",
    username: "@natali",
    email: "natali@untitledui.com",
    country: "United States",
    avatar: Avatar1,
  },
  {
    id: 7,
    name: "Drew Cano",
    username: "@drew",
    email: "drew@untitledui.com",
    country: "United States",
    avatar: Avatar1,
  },
  {
    id: 8,
    name: "Orlando Diggs",
    username: "@orlando",
    email: "orlando@untitledui.com",
    country: "United States",
    avatar: Avatar1,
  },
  {
    id: 9,
    name: "Andi Lane",
    username: "@andi",
    email: "andi@untitledui.com",
    country: "United States",
    avatar: Avatar1,
  },
  {
    id: 10,
    name: "Kate Morrison",
    username: "@kate",
    email: "kate@untitledui.com",
    country: "United States",
    avatar: Avatar1,
  },
];

export function LeadsContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [appliedPlatforms, setAppliedPlatforms] = useState<string[]>([]);
  const [appliedKeyword, setAppliedKeyword] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    platform: true,
    keyword: false,
  });
  const [keywordFilter, setKeywordFilter] = useState("");

  const totalRecords = 147;
  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  const platformOptions = [
    { id: "instagram", name: "Instagram", icon: "📷" },
    { id: "tiktok", name: "TikTok", icon: "🎵" },
    { id: "youtube", name: "YouTube", icon: "📺" },
    { id: "spotify-artist", name: "Spotify Artist", icon: "🎧" },
    { id: "spotify-playlist", name: "Spotify Playlist", icon: "🎧" },
    { id: "soundcloud", name: "SoundCloud", icon: "🔊" },
  ];

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((id) => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleClearAll = () => {
    setSelectedPlatforms([]);
    setKeywordFilter("");
  };

  const handleApplyFilters = () => {
    setAppliedPlatforms(selectedPlatforms);
    setAppliedKeyword(keywordFilter);
    setIsFilterOpen(false);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (appliedPlatforms.length > 0) count += appliedPlatforms.length;
    if (appliedKeyword.trim()) count += 1;
    return count;
  };

  const getFilteredLeads = () => {
    let filtered = [...leadsData];

    if (appliedPlatforms.length > 0) {
      filtered = filtered.slice(
        0,
        Math.max(1, filtered.length - appliedPlatforms.length)
      );
    }

    if (appliedKeyword.trim()) {
      const keyword = appliedKeyword.toLowerCase();
      filtered = filtered.filter(
        (lead) =>
          lead.name.toLowerCase().includes(keyword) ||
          lead.username.toLowerCase().includes(keyword) ||
          lead.email.toLowerCase().includes(keyword)
      );
    }

    return filtered;
  };

  const filteredLeads = getFilteredLeads();
  const activeFilterCount = getActiveFilterCount();

  const renderPaginationNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage, "...", totalPages);
      }
    }

    return pages;
  };

  const toggleSection = (section: "platform" | "keyword") => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#667085] w-4 h-4" />
            <Input
              placeholder="Search"
              className="pl-10 border-[#d0d5dd] bg-white text-[#344054] placeholder:text-[#667085] h-10"
            />
          </div>
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`cursor-pointer border-[#d0d5dd] text-[#344054] hover:bg-white hover:ring-[#7f56d9] hover:text-[#7f56d9] hover:ring-2 h-10 px-4 flex items-center gap-2 bg-transparent relative ${
                isFilterOpen ? "ring-2 ring-[#7f56d9] text-[#7f56d9]" : ""
              }  ${
                activeFilterCount > 0 ? "ring-2 ring-[#7f56d9] text-[#7f56d9]" : ""
              }`}
            >
              <Filter className={`w-4 h-4`} />
              Filter
              {activeFilterCount > 0 && (
                <span className="bg-[#D6BBFB] text-black text-xs w-6 h-6 rounded-sm flex items-center justify-center font-medium">
                  {activeFilterCount}
                </span>
              )}
            </Button>

            {/* Filter Dropdown */}
            {isFilterOpen && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-[#eaecf0] rounded-lg shadow-lg z-50">
                <div className="p-4">
                  <h3 className="text-sm font-medium text-[#101828] mb-4">
                    Filter By
                  </h3>

                  {/* Platform Section */}
                  <div className="mb-4">
                    <button
                      onClick={() => toggleSection("platform")}
                      className=" cursor-pointer flex items-center justify-between w-full text-left mb-3 hover:bg-[#f9fafb] p-2 -m-2 rounded-md transition-colors"
                    >
                      <h4 className="text-sm font-medium text-[#344054]">
                        Platform
                      </h4>
                      {expandedSections.platform ? (
                        <ChevronDown className="w-4 h-4 text-[#667085]" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-[#667085]" />
                      )}
                    </button>
                    {expandedSections.platform && (
                      <div className="space-y-3 pl-2">
                        {platformOptions.map((platform) => (
                          <div
                            key={platform.id}
                            className="flex items-center gap-3"
                          >
                            <Checkbox
                              id={platform.id}
                              checked={selectedPlatforms.includes(platform.id)}
                              onCheckedChange={() =>
                                handlePlatformToggle(platform.id)
                              }
                              className=" cursor-pointer border-[#d0d5dd] data-[state=checked]:bg-[#7f56d9] data-[state=checked]:border-[#7f56d9]"
                            />
                            <div className="flex items-center gap-2">
                              {platform.id === "instagram" && (
                               <Image src={Instagram} alt="instagram" className="w-4 h-4"/>
                               // <div className="w-4 h-4 bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] rounded-sm flex items-center justify-center">
                                //   <svg
                                //     className="w-3 h-3 text-white"
                                //     fill="currentColor"
                                //     viewBox="0 0 24 24"
                                //   >
                                //     <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919-.058 1.265-.069 1.645-.069 4.849 0 3.205-.012 3.584-.07 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.849.07-3.204 0-3.584-.012-4.849-.07-4.358-.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.849 0 3.205-.012 3.584-.07 4.849.149 3.225 1.664 4.771 4.919 4.919 1.266.058 1.645.07 4.849.07 3.259 0 3.667-.014 4.947-.072 4.358-.2 6.78 2.618 6.98 6.98.059 1.281.073 1.689.073 4.849 0 3.259-.014 3.668-.072 4.948-.196 4.354-2.617-6.78-6.979-6.98-1.281-.059-1.689-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                //   </svg>
                                // </div>
                              )}
                              {platform.id === "tiktok" && (
                               <Image src={TikTok} alt="instagram" className="w-4 h-4"/>
                              )}
                              {platform.id === "youtube" && (
                                <Image src={YouTube} alt="instagram" className="w-4 h-4"/>
                              )}
                              {(platform.id === "spotify-artist" ||
                                platform.id === "spotify-playlist") && (
                                    <Image src={Spotify} alt="instagram" className="w-4 h-4"/>
                              )}
                              {platform.id === "soundcloud" && (
                               <Image src={SoundCloud} alt="instagram" className="w-4 h-4"/>
                              )}
                              <label
                                htmlFor={platform.id}
                                className="text-sm text-[#344054] cursor-pointer"
                              >
                                {platform.name}
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Keyword Section */}
                  <div className="mb-6">
                    <button
                      onClick={() => toggleSection("keyword")}
                      className="cursor-pointer flex items-center justify-between w-full text-left mb-3 hover:bg-[#f9fafb] p-2 -m-2 rounded-md transition-colors"
                    >
                      <h4 className="text-sm font-medium text-[#344054]">
                        Keyword
                      </h4>
                      {expandedSections.keyword ? (
                        <ChevronDown className="w-4 h-4 text-[#667085]" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-[#667085]" />
                      )}
                    </button>
                    {expandedSections.keyword && (
                      <div className="pl-2">
                        <Input
                          placeholder="Enter keyword..."
                          value={keywordFilter}
                          onChange={(e) => setKeywordFilter(e.target.value)}
                          className="border-[#d0d5dd] bg-white text-[#344054] placeholder:text-[#667085] h-9"
                        />
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#eaecf0]">
                    <Button
                      variant="ghost"
                      onClick={handleClearAll}
                      className="cursor-pointer text-[#667085] hover:text-[#344054] hover:bg-[#f9fafb] h-9 px-3"
                    >
                      Clear All
                    </Button>
                    <Button
                      onClick={handleApplyFilters}
                      className="cursor-pointer bg-[#7f56d9] hover:bg-[#6941c6] text-white h-9 px-4"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="p-2 h-10 w-10 text-[#667085] hover:text-[#344054] hover:bg-[#f2f4f7]"
          >
            <Settings className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-2 h-10 w-10 text-[#667085] hover:text-[#344054] hover:bg-[#f2f4f7]"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Leads Table */}
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
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              className="px-6 py-4 hover:bg-[#f9fafb] transition-colors"
            >
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-1">
                  <Checkbox className="border-[#d0d5dd]" />
                </div>
                <div className="col-span-3 flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#f2f4f7] flex-shrink-0">
                    <Image
                      src={lead.avatar || "/placeholder.svg"}
                      alt={lead.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/Leads/${lead.id}`}
                      className="text-sm font-medium text-[#101828] truncate hover:text-[#7f56d9] transition-colors cursor-pointer block"
                    >
                      {lead.name}
                    </Link>
                    <div className="text-sm text-[#667085] truncate">
                      {lead.username}
                    </div>
                  </div>
                </div>
                <div className="col-span-3">
                  <span className="text-sm text-[#475467] truncate block">
                    {lead.email}
                  </span>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <Image
                    src={US}
                    alt="US Flag"
                    width={20}
                    height={15}
                    className="rounded-sm"
                  />
                  <span className="text-sm text-[#475467] truncate">
                    {lead.country}
                  </span>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-8 w-8 text-[#667085] hover:text-[#344054] hover:bg-[#f2f4f7]"
                  >
                    <LinkIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-8 w-8 text-[#667085] hover:text-[#344054] hover:bg-[#f2f4f7]"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z" />
                    </svg>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-8 w-8 text-[#667085] hover:text-[#344054] hover:bg-[#f2f4f7]"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-8 w-8 text-[#667085] hover:text-[#344054] hover:bg-[#f2f4f7]"
                  >
                    <Plus className="w-4 h-4" />
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
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4 text-sm text-[#344054]">
          <span>Total Records {filteredLeads.length}</span>
          <div className="flex items-center gap-2">
            <span>Showing per page</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="border border-[#d0d5dd] rounded-lg px-3 py-1 text-sm bg-white"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="cursor-pointer border-[#d0d5dd] text-[#344054] hover:bg-[#f9fafb] h-10 px-3 flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {renderPaginationNumbers().map((page, index) => (
              <Button
                key={index}
                variant={page === currentPage ? "default" : "ghost"}
                size="sm"
                onClick={() => typeof page === "number" && setCurrentPage(page)}
                disabled={page === "..."}
                className={`h-10 w-10 ${
                  page === currentPage
                    ? "bg-[#7f56d9] text-white hover:bg-[#6941c6]"
                    : "text-[#344054] hover:bg-[#f9fafb]"
                }`}
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className="cursor-pointer border-[#d0d5dd] text-[#344054] hover:bg-[#f9fafb] h-10 px-3 flex items-center gap-2"
          >
            Next
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
