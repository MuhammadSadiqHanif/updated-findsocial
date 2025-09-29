"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  LinkIcon,
  Instagram,
  SproutIcon as Spotify,
  Settings,
  Youtube,
  Music,
  ChevronDown,
  ChevronRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { AddRecordsModal } from "./add-records-modal";
import { EmptyListState } from "./empty-list-state";
import { useToast } from "@/hooks/use-toast";
import { useUserInfo } from "@/hooks/use-user-info";
import Link from "next/link";
import Image from "next/image";
import Instagram_IMG from "@/public/platform/instagram.png";
import TikTok_IMG from "@/public/platform/tiktok.png";
import YouTube_IMG from "@/public/platform/youtube.png";
import Spotify_IMG from "@/public/platform/spotify.png";
import SoundCloud_IMG from "@/public/platform/soundcloud.png";

// API Response Interfaces
interface LeadData {
  data: {
    url: string;
    name: string;
    username: string;
    email: string[] | null;
    link: string;
    followers: number;
    following: number;
    description: string;
    posts?: number;
    post?: number;
    verified: boolean;
    private: boolean;
    country: string | null;
    llm_generated: boolean;
    catagory_name: string;
    business: boolean;
    pronouns: string;
    tiktok: string;
    soundcloud: string;
    spotify: string;
    youtube: string;
    linktree: string;
    instagram?: string;
    other?: string;
    uid?: string;
    other_link?: string[];
    likes?: number;
    friendscount?: number;
    commerceuser?: boolean;
  };
  platform: string;
  scrapper_name: string;
  search: string;
  timestamp: string;
  id: string;
}

interface ListDetailResponse {
  list_id: string;
  list_name: string;
  total_leads: number;
  leads: LeadData[];
}

interface ListDetailContentProps {
  listId: string;
}

export function ListDetailContent({ listId }: ListDetailContentProps) {
  const [isAddRecordsModalOpen, setIsAddRecordsModalOpen] = useState(false);
  const [listData, setListData] = useState<ListDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  
  // Filter states
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [appliedPlatforms, setAppliedPlatforms] = useState<string[]>([]);
  const [appliedKeyword, setAppliedKeyword] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    platform: true,
    keyword: false,
    verified: false,
    business: false,
  });
  const [keywordFilter, setKeywordFilter] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState<string>("");
  const [businessFilter, setBusinessFilter] = useState<string>("");
  
  // Column settings state
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [columnSettings, setColumnSettings] = useState({
    name: true,
    email: true,
    country: true,
    urls: true,
    followers: false,
    following: false,
    posts: false,
    verified: false,
    business: false,
  });
  
  // Dropdown and delete states
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<{ id: string; name: string; platform: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { toast } = useToast();
  const { userInfo } = useUserInfo();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const platformOptions = [
    { id: "instagram", name: "Instagram", icon: Instagram_IMG },
    { id: "tiktok", name: "TikTok", icon: TikTok_IMG },
    { id: "youtube", name: "YouTube", icon: YouTube_IMG },
    { id: "spotify-artist", name: "Spotify Artist", icon: Spotify_IMG },
    { id: "spotify-playlist", name: "Spotify Playlist", icon: Spotify_IMG },
    { id: "soundcloud", name: "SoundCloud", icon: SoundCloud_IMG },
  ];

  // Fetch list leads from API
  const fetchListLeads = async () => {
    if (!userInfo?.user_id || !listId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://dev-api.findsocial.io/lists/${listId}/leads?auth0_id=${userInfo.user_id}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch list leads: ${response.status}`);
      }

      const data: ListDetailResponse = await response.json();
      setListData(data);
    } catch (error) {
      console.error("Error fetching list leads:", error);
      toast({
        title: "Error",
        description: "Failed to load list leads. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchListLeads();
  }, [userInfo?.user_id, listId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    };

    if (openDropdownId) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdownId]);

  // Filter handling functions
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
    setVerifiedFilter("");
    setBusinessFilter("");
  };

  const handleApplyFilters = () => {
    setAppliedPlatforms(selectedPlatforms);
    setAppliedKeyword(keywordFilter);
    setIsFilterOpen(false);
    toast({
      title: "Filters Applied",
      description: "List has been filtered based on your criteria.",
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (appliedPlatforms.length > 0) count += appliedPlatforms.length;
    if (appliedKeyword.trim()) count += 1;
    if (verifiedFilter) count += 1;
    if (businessFilter) count += 1;
    return count;
  };

  const toggleSection = (section: "platform" | "keyword" | "verified" | "business") => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Handle adding records
  const handleAddRecords = (selectedRecords: any[]) => {
    // Refresh list data after adding records
    fetchListLeads();
    setIsAddRecordsModalOpen(false);
  };

  // Handle select lead
  const handleSelectLead = (leadId: string) => {
    setSelectedLeads(prev => {
      if (prev.includes(leadId)) {
        return prev.filter(id => id !== leadId);
      } else {
        return [...prev, leadId];
      }
    });
  };

  // Handle select all
  const handleSelectAll = () => {
    if (!listData) return;
    
    if (selectedLeads.length === filteredLeads.length && filteredLeads.length > 0) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(lead => lead.id));
    }
  };

  // Column settings handlers
  const handleColumnToggle = (columnKey: keyof typeof columnSettings) => {
    setColumnSettings(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }));
  };

  const handleResetColumns = () => {
    setColumnSettings({
      name: true,
      email: true,
      country: true,
      urls: true,
      followers: false,
      following: false,
      posts: false,
      verified: false,
      business: false,
    });
  };

  // Dropdown and delete handlers
  const handleDropdownToggle = (leadId: string) => {
    setOpenDropdownId(openDropdownId === leadId ? null : leadId);
  };

  const handleDeleteClick = (lead: LeadData) => {
    setLeadToDelete({
      id: lead.id,
      name: lead.data.name,
      platform: lead.platform
    });
    setShowDeleteDialog(true);
    setOpenDropdownId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!leadToDelete || !userInfo?.user_id || !listId) return;
    
    setIsDeleting(true);
    try {
      // Remove lead from list using the new API endpoint
      const requestBody = {
        lead_ids: [leadToDelete.id]
      };

      const response = await fetch(
        `https://dev-api.findsocial.io/lists/${listId}/remove-leads?auth0_id=${userInfo.user_id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );
      
      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: "Success",
          description: `Lead "${leadToDelete.name}" has been removed from the list successfully.`,
        });
        
        // Refresh the list data
        fetchListLeads();
      } else {
        throw new Error(data.message || 'Failed to remove lead from list');
      }
      
    } catch (error) {
      console.error('Error removing lead from list:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove lead from list. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
      setLeadToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
    setLeadToDelete(null);
  };

  // Handle bulk removal from list
  const handleBulkRemoveFromList = async () => {
    if (!userInfo?.user_id || !listId || selectedLeads.length === 0) return;
    
    // Show confirmation for bulk removal
    const confirmed = window.confirm(
      `Are you sure you want to remove ${selectedLeads.length} lead${selectedLeads.length !== 1 ? 's' : ''} from this list?`
    );
    
    if (!confirmed) return;

    try {
      const requestBody = {
        lead_ids: selectedLeads
      };

      const response = await fetch(
        `https://dev-api.findsocial.io/lists/${listId}/remove-leads?auth0_id=${userInfo.user_id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );
      
      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: "Success",
          description: `${data.removed_leads?.length || 0} leads have been removed from the list successfully.`,
        });
        
        // Clear selection and refresh the list data
        setSelectedLeads([]);
        fetchListLeads();
      } else {
        throw new Error(data.message || 'Failed to remove leads from list');
      }
      
    } catch (error) {
      console.error('Error removing leads from list:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove leads from list. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Get platform icon
  const getPlatformIcon = (platform: string): React.ReactElement | null => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className="w-3 h-3" />;
      case 'tiktok':
        return <Music className="w-3 h-3" />;
      case 'youtube':
        return <Youtube className="w-3 h-3" />;
      case 'spotify':
        return <Spotify className="w-3 h-3" />;
      case 'soundcloud':
        return <Music className="w-3 h-3" />;
      default:
        return <LinkIcon className="w-3 h-3" />;
    }
  };

  // Get social links for a lead
  const getSocialLinks = (lead: LeadData) => {
    const links = [];
    
    // Main platform URL
    if (lead.data.url) {
      links.push({
        platform: lead.platform,
        url: lead.data.url,
        icon: getPlatformIcon(lead.platform)
      });
    }
    
    // Other social platforms
    if (lead.data.instagram) {
      links.push({
        platform: 'instagram',
        url: lead.data.instagram,
        icon: <Instagram className="w-3 h-3" />
      });
    }
    if (lead.data.youtube) {
      links.push({
        platform: 'youtube',
        url: lead.data.youtube,
        icon: <Youtube className="w-3 h-3" />
      });
    }
    if (lead.data.spotify) {
      links.push({
        platform: 'spotify',
        url: lead.data.spotify,
        icon: <Spotify className="w-3 h-3" />
      });
    }
    if (lead.data.tiktok) {
      links.push({
        platform: 'tiktok',
        url: lead.data.tiktok,
        icon: <Music className="w-3 h-3" />
      });
    }
    if (lead.data.linktree) {
      links.push({
        platform: 'linktree',
        url: lead.data.linktree,
        icon: <LinkIcon className="w-3 h-3" />
      });
    }
    
    return links;
  };

  // Filter leads based on search and applied filters
  const filteredLeads = listData?.leads.filter(lead => {
    // Text search filter
    const matchesSearch = lead.data.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.data.username.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Platform filter
    const matchesPlatform = appliedPlatforms.length === 0 || 
      appliedPlatforms.includes(lead.platform);
    
    // Keyword filter
    const matchesKeyword = !appliedKeyword.trim() || 
      lead.data.name.toLowerCase().includes(appliedKeyword.toLowerCase()) ||
      lead.data.username.toLowerCase().includes(appliedKeyword.toLowerCase()) ||
      lead.data.description.toLowerCase().includes(appliedKeyword.toLowerCase());
    
    // Verified filter
    const matchesVerified = !verifiedFilter || 
      (verifiedFilter === "verified" && lead.data.verified) ||
      (verifiedFilter === "not-verified" && !lead.data.verified);
    
    // Business filter
    const matchesBusiness = !businessFilter ||
      (businessFilter === "business" && lead.data.business) ||
      (businessFilter === "personal" && !lead.data.business);
    
    return matchesSearch && matchesPlatform && matchesKeyword && matchesVerified && matchesBusiness;
  }) || [];

  const activeFilterCount = getActiveFilterCount();

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7f56d9]"></div>
          <span className="ml-3 text-[#667085]">Loading list details...</span>
        </div>
      </div>
    );
  }

  // Show empty state if no leads
  if (!listData || listData.total_leads === 0) {
    return (
      <EmptyListState onAddRecords={() => setIsAddRecordsModalOpen(true)} />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with list name */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#101828]">
            {listData.list_name}
          </h1>
          <p className="text-sm text-[#667085]">
            {listData.total_leads} leads
          </p>
        </div>
      </div>

      {/* Search and Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-[250px]">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#667085] w-4 h-4" />
            <Input
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-[#d0d5dd] bg-white text-[#344054] placeholder:text-[#667085]"
            />
          </div>
          
          {/* Filter Dropdown */}
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`cursor-pointer border-[#d0d5dd] text-[#344054] hover:bg-white hover:ring-[#7f56d9] hover:text-[#7f56d9] hover:ring-2 h-10 px-4 flex items-center gap-2 bg-transparent relative ${
                isFilterOpen ? "ring-2 ring-[#7f56d9] text-[#7f56d9]" : ""
              } ${
                activeFilterCount > 0 ? "ring-2 ring-[#7f56d9] text-[#7f56d9]" : ""
              }`}
            >
              <Filter className="w-4 h-4" />
              Filter
              {activeFilterCount > 0 && (
                <span className="bg-[#D6BBFB] text-black text-xs w-6 h-6 rounded-sm flex items-center justify-center font-medium">
                  {activeFilterCount}
                </span>
              )}
            </Button>

            {/* Filter Dropdown */}
            {isFilterOpen && (
              <div className="absolute top-full left-0 mt-2 w-full max-w-xs sm:w-80 bg-white border border-[#eaecf0] rounded-lg shadow-lg z-50">
                <div className="p-4">
                  <h3 className="text-sm font-medium text-[#101828] mb-4">
                    Filter By
                  </h3>

                  {/* Platform Section */}
                  <div className="mb-4">
                    <button
                      onClick={() => toggleSection("platform")}
                      className="cursor-pointer flex items-center justify-between w-full text-left mb-3 hover:bg-[#f9fafb] p-2 -m-2 rounded-md transition-colors"
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
                              className="cursor-pointer border-[#d0d5dd] data-[state=checked]:bg-[#7f56d9] data-[state=checked]:border-[#7f56d9]"
                            />
                            <div className="flex items-center gap-2">
                              <Image 
                                src={platform.icon} 
                                alt={platform.name} 
                                className="w-4 h-4" 
                              />
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
                  <div className="mb-4">
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

                  {/* Verified Section */}
                  <div className="mb-4">
                    <button
                      onClick={() => toggleSection("verified")}
                      className="cursor-pointer flex items-center justify-between w-full text-left mb-3 hover:bg-[#f9fafb] p-2 -m-2 rounded-md transition-colors"
                    >
                      <h4 className="text-sm font-medium text-[#344054]">
                        Verification Status
                      </h4>
                      {expandedSections.verified ? (
                        <ChevronDown className="w-4 h-4 text-[#667085]" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-[#667085]" />
                      )}
                    </button>
                    {expandedSections.verified && (
                      <div className="space-y-3 pl-2">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id="verified"
                            checked={verifiedFilter === "verified"}
                            onCheckedChange={(checked) =>
                              setVerifiedFilter(checked ? "verified" : "")
                            }
                            className="cursor-pointer border-[#d0d5dd] data-[state=checked]:bg-[#7f56d9] data-[state=checked]:border-[#7f56d9]"
                          />
                          <label
                            htmlFor="verified"
                            className="text-sm text-[#344054] cursor-pointer"
                          >
                            Verified Only
                          </label>
                        </div>
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id="not-verified"
                            checked={verifiedFilter === "not-verified"}
                            onCheckedChange={(checked) =>
                              setVerifiedFilter(checked ? "not-verified" : "")
                            }
                            className="cursor-pointer border-[#d0d5dd] data-[state=checked]:bg-[#7f56d9] data-[state=checked]:border-[#7f56d9]"
                          />
                          <label
                            htmlFor="not-verified"
                            className="text-sm text-[#344054] cursor-pointer"
                          >
                            Not Verified Only
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Business Account Section */}
                  <div className="mb-6">
                    <button
                      onClick={() => toggleSection("business")}
                      className="cursor-pointer flex items-center justify-between w-full text-left mb-3 hover:bg-[#f9fafb] p-2 -m-2 rounded-md transition-colors"
                    >
                      <h4 className="text-sm font-medium text-[#344054]">
                        Account Type
                      </h4>
                      {expandedSections.business ? (
                        <ChevronDown className="w-4 h-4 text-[#667085]" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-[#667085]" />
                      )}
                    </button>
                    {expandedSections.business && (
                      <div className="space-y-3 pl-2">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id="business"
                            checked={businessFilter === "business"}
                            onCheckedChange={(checked) =>
                              setBusinessFilter(checked ? "business" : "")
                            }
                            className="cursor-pointer border-[#d0d5dd] data-[state=checked]:bg-[#7f56d9] data-[state=checked]:border-[#7f56d9]"
                          />
                          <label
                            htmlFor="business"
                            className="text-sm text-[#344054] cursor-pointer"
                          >
                            Business Accounts
                          </label>
                        </div>
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id="personal"
                            checked={businessFilter === "personal"}
                            onCheckedChange={(checked) =>
                              setBusinessFilter(checked ? "personal" : "")
                            }
                            className="cursor-pointer border-[#d0d5dd] data-[state=checked]:bg-[#7f56d9] data-[state=checked]:border-[#7f56d9]"
                          />
                          <label
                            htmlFor="personal"
                            className="text-sm text-[#344054] cursor-pointer"
                          >
                            Personal Accounts
                          </label>
                        </div>
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
            className="cursor-pointer bg-[#7f56d9] hover:bg-[#6941c6] text-white px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={() => setIsAddRecordsModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Add Records
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowColumnSettings(!showColumnSettings)}
            className="cursor-pointer p-2 border-[#d0d5dd] text-[#667085] hover:bg-[#f9fafb] bg-transparent"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedLeads.length > 0 && (
        <div className="flex items-center justify-between bg-[#f0f9ff] border border-[#0ea5e9] rounded-lg px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[#0369a1]">
                {selectedLeads.length} selected
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedLeads([])}
                className="cursor-pointer text-xs text-[#0369a1] hover:text-[#0c4a6e] p-1 h-auto"
              >
                Clear selection
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkRemoveFromList}
              className="cursor-pointer text-[#344054] border-[#d0d5dd] hover:bg-[#f9fafb]"
            >
              Remove from List
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer text-[#344054] border-[#d0d5dd] hover:bg-[#f9fafb]"
            >
              Export
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg border border-[#eaecf0] overflow-hidden">
        {/* Table Header */}
        <div className="overflow-x-auto">
          <div className="hidden md:block border-b border-[#eaecf0] bg-[#f9fafb] px-6 py-3">
            <div className="flex items-center gap-4 text-xs font-medium text-[#667085] uppercase tracking-wide w-full" style={{ minWidth: 'max(1200px, 100%)' }}>
              <div className="flex-1 min-w-[48px]">
                <Checkbox 
                  checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                  onCheckedChange={handleSelectAll}
                  className="border-[#d0d5dd]" 
                />
              </div>
              
              {columnSettings.name && (
                <div className="flex-[3] min-w-[192px] flex items-center gap-1">Name</div>
              )}
              
              {columnSettings.email && (
                <div className="flex-[2] min-w-[160px] flex items-center gap-1">Email address</div>
              )}
              
              {columnSettings.country && (
                <div className="flex-[1.5] min-w-[128px] flex items-center gap-1">Country</div>
              )}
              
              {columnSettings.urls && (
                <div className="flex-[2] min-w-[160px]">URL/Links</div>
              )}
              
              {columnSettings.followers && (
                <div className="flex-1 min-w-[96px] flex items-center gap-1">Followers</div>
              )}
              
              {columnSettings.following && (
                <div className="flex-1 min-w-[96px] flex items-center gap-1">Following</div>
              )}
              
              {columnSettings.posts && (
                <div className="flex-1 min-w-[80px] flex items-center gap-1">Posts</div>
              )}
              
              {columnSettings.verified && (
                <div className="flex-1 min-w-[80px]">Verified</div>
              )}
              
              {columnSettings.business && (
                <div className="flex-1 min-w-[96px]">Business</div>
              )}
              
              <div className="flex-1 min-w-[48px]"></div>
            </div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-[#eaecf0] overflow-x-auto">
          {filteredLeads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <h3 className="text-lg font-semibold text-[#101828] mb-2">No leads found</h3>
              <p className="text-[#667085] text-center mb-6 max-w-md">
                {searchQuery || activeFilterCount > 0
                  ? "No leads match your search criteria or filters."
                  : "This list is empty. Add some leads to get started."
                }
              </p>
            </div>
          ) : (
            filteredLeads.map((lead) => (
              <div
                key={lead.id}
                className="px-6 py-4 hover:bg-[#f9fafb] transition-colors"
              >
                {/* Mobile View: Stacked */}
                <div className="md:hidden space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        checked={selectedLeads.includes(lead.id)}
                        onCheckedChange={() => handleSelectLead(lead.id)}
                        className="border-[#d0d5dd]" 
                      />
                      <div className="w-8 h-8 rounded-full bg-[#f2f4f7] flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-[#344054]">
                          {lead.data.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/Leads/${lead.id}`}
                          className="text-sm font-medium text-[#101828] hover:text-[#7f56d9] transition-colors cursor-pointer block truncate"
                        >
                          {lead.data.name}
                        </Link>
                        <div className="text-sm text-[#667085] truncate">
                          @{lead.data.username}
                        </div>
                      </div>
                    </div>
                    <div className="relative" ref={openDropdownId === lead.id ? dropdownRef : undefined}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDropdownToggle(lead.id)}
                        className="p-1 h-8 w-8 text-[#667085] hover:text-[#344054] hover:bg-[#f2f4f7]"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                      
                      {/* Dropdown Menu */}
                      {openDropdownId === lead.id && (
                        <div className="absolute right-0 mt-1 w-48 bg-white border border-[#eaecf0] rounded-lg shadow-lg z-50">
                          <div className="py-1">
                            <button
                              onClick={() => handleDeleteClick(lead)}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Remove from List
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-[#667085] uppercase tracking-wide">Email:</span>
                      <span className="text-sm text-[#475467]">
                        {lead.data.email && lead.data.email.length > 0 
                          ? lead.data.email[0] 
                          : "Not available"
                        }
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-[#667085] uppercase tracking-wide">Country:</span>
                      <span className="text-sm text-[#475467]">
                        {lead.data.country || "Not specified"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-[#667085] uppercase tracking-wide">URL/Links:</span>
                      <div className="flex items-center gap-2">
                        {getSocialLinks(lead).slice(0, 3).map((link, index) => (
                          <a
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="p-1 h-6 w-6 text-[#667085] hover:text-[#344054] hover:bg-[#f2f4f7]"
                            >
                              {link.icon}
                            </Button>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop View: Flexbox */}
                <div className="hidden md:flex items-center gap-4 w-full" style={{ minWidth: 'max(1200px, 100%)' }}>
                  <div className="flex-1 min-w-[48px]">
                    <Checkbox 
                      checked={selectedLeads.includes(lead.id)}
                      onCheckedChange={() => handleSelectLead(lead.id)}
                      className="border-[#d0d5dd]" 
                    />
                  </div>
                  
                  {columnSettings.name && (
                    <div className="flex-[3] min-w-[192px]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#f2f4f7] flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium text-[#344054]">
                            {lead.data.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/Leads/${lead.id}`}
                            className="text-sm font-medium text-[#101828] hover:text-[#7f56d9] transition-colors cursor-pointer block truncate"
                          >
                            {lead.data.name}
                          </Link>
                          <div className="text-sm text-[#667085] truncate">
                            @{lead.data.username}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {columnSettings.email && (
                    <div className="flex-[2] min-w-[160px]">
                      <span className="text-sm text-[#475467]">
                        {lead.data.email && lead.data.email.length > 0 
                          ? lead.data.email[0] 
                          : "Not available"
                        }
                      </span>
                    </div>
                  )}
                  
                  {columnSettings.country && (
                    <div className="flex-[1.5] min-w-[128px]">
                      <span className="text-sm text-[#475467]">
                        {lead.data.country || "Not specified"}
                      </span>
                    </div>
                  )}
                  
                  {columnSettings.urls && (
                    <div className="flex-[2] min-w-[160px]">
                      <div className="flex items-center gap-2">
                        {getSocialLinks(lead).slice(0, 3).map((link, index) => (
                          <a
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="p-1 h-6 w-6 text-[#667085] hover:text-[#344054] hover:bg-[#f2f4f7]"
                            >
                              {link.icon}
                            </Button>
                          </a>
                        ))}
                        {getSocialLinks(lead).length > 3 && (
                          <Button variant="ghost" size="sm" className="p-1 h-6 w-6 text-[#667085] hover:text-[#344054] hover:bg-[#f2f4f7]">
                            <Plus className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {columnSettings.followers && (
                    <div className="flex-1 min-w-[96px]">
                      <span className="text-sm text-[#475467]">
                        {lead.data.followers?.toLocaleString() || '0'}
                      </span>
                    </div>
                  )}
                  
                  {columnSettings.following && (
                    <div className="flex-1 min-w-[96px]">
                      <span className="text-sm text-[#475467]">
                        {lead.data.following?.toLocaleString() || '0'}
                      </span>
                    </div>
                  )}
                  
                  {columnSettings.posts && (
                    <div className="flex-1 min-w-[80px]">
                      <span className="text-sm text-[#475467]">
                        {(lead.data.posts || lead.data.post)?.toLocaleString() || '0'}
                      </span>
                    </div>
                  )}
                  
                  {columnSettings.verified && (
                    <div className="flex-1 min-w-[80px]">
                      {lead.data.verified ? (
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {columnSettings.business && (
                    <div className="flex-1 min-w-[96px]">
                      {lead.data.business ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Business
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Personal
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-[48px] flex justify-end">
                    <div className="relative" ref={openDropdownId === lead.id ? dropdownRef : undefined}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDropdownToggle(lead.id)}
                        className="cursor-pointer p-1 h-8 w-8 text-[#667085] hover:text-[#344054] hover:bg-[#f2f4f7]"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                      
                      {/* Dropdown Menu */}
                      {openDropdownId === lead.id && (
                        <div className="absolute right-0 mt-1 w-48 bg-white border border-[#eaecf0] rounded-lg shadow-lg z-50">
                          <div className="py-1">
                            <button
                              onClick={() => handleDeleteClick(lead)}
                              className="cursor-pointer w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Remove from List
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-sm text-[#344054]">
          Total Records <span className="font-medium">{filteredLeads.length}</span> of{" "}
          <span className="font-medium">{listData.total_leads}</span> • Showing per
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
            className="cursor-pointer border-[#d0d5dd] text-[#344054] bg-transparent"
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
            <Button variant="ghost" size="sm" className="cursor-pointer text-[#667085]">
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Column Settings Modal */}
      {showColumnSettings && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#101828]">Column Settings</h3>
                  <p className="text-sm text-[#667085] mt-1">Choose which columns to display in the table</p>
                </div>
                <button
                  onClick={() => setShowColumnSettings(false)}
                  className="p-2 hover:bg-[#f9fafb] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-[#667085]" />
                </button>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-[#344054]">Name</label>
                  <Checkbox
                    checked={columnSettings.name}
                    onCheckedChange={() => handleColumnToggle('name')}
                    className="cursor-pointer border-[#d0d5dd] data-[state=checked]:bg-[#7f56d9] data-[state=checked]:border-[#7f56d9]"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-[#344054]">Email Address</label>
                  <Checkbox
                    checked={columnSettings.email}
                    onCheckedChange={() => handleColumnToggle('email')}
                    className="cursor-pointer border-[#d0d5dd] data-[state=checked]:bg-[#7f56d9] data-[state=checked]:border-[#7f56d9]"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-[#344054]">Country</label>
                  <Checkbox
                    checked={columnSettings.country}
                    onCheckedChange={() => handleColumnToggle('country')}
                    className="cursor-pointer border-[#d0d5dd] data-[state=checked]:bg-[#7f56d9] data-[state=checked]:border-[#7f56d9]"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-[#344054]">URL/Links</label>
                  <Checkbox
                    checked={columnSettings.urls}
                    onCheckedChange={() => handleColumnToggle('urls')}
                    className="cursor-pointer border-[#d0d5dd] data-[state=checked]:bg-[#7f56d9] data-[state=checked]:border-[#7f56d9]"
                  />
                </div>

                <div className="border-t border-[#eaecf0] pt-4">
                  <p className="text-xs font-medium text-[#667085] uppercase tracking-wide mb-3">Additional Columns</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-[#344054]">Followers</label>
                      <Checkbox
                        checked={columnSettings.followers}
                        onCheckedChange={() => handleColumnToggle('followers')}
                        className="cursor-pointer border-[#d0d5dd] data-[state=checked]:bg-[#7f56d9] data-[state=checked]:border-[#7f56d9]"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm text-[#344054]">Following</label>
                      <Checkbox
                        checked={columnSettings.following}
                        onCheckedChange={() => handleColumnToggle('following')}
                        className="cursor-pointer border-[#d0d5dd] data-[state=checked]:bg-[#7f56d9] data-[state=checked]:border-[#7f56d9]"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm text-[#344054]">Posts</label>
                      <Checkbox
                        checked={columnSettings.posts}
                        onCheckedChange={() => handleColumnToggle('posts')}
                        className="cursor-pointer border-[#d0d5dd] data-[state=checked]:bg-[#7f56d9] data-[state=checked]:border-[#7f56d9]"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm text-[#344054]">Verified Status</label>
                      <Checkbox
                        checked={columnSettings.verified}
                        onCheckedChange={() => handleColumnToggle('verified')}
                        className="cursor-pointer border-[#d0d5dd] data-[state=checked]:bg-[#7f56d9] data-[state=checked]:border-[#7f56d9]"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm text-[#344054]">Account Type</label>
                      <Checkbox
                        checked={columnSettings.business}
                        onCheckedChange={() => handleColumnToggle('business')}
                        className="cursor-pointer border-[#d0d5dd] data-[state=checked]:bg-[#7f56d9] data-[state=checked]:border-[#7f56d9]"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-[#eaecf0]">
                <Button
                  variant="ghost"
                  onClick={handleResetColumns}
                  className="cursor-pointer text-[#667085] hover:text-[#344054] hover:bg-[#f9fafb] h-9 px-3"
                >
                  Reset to Default
                </Button>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowColumnSettings(false)}
                    className="cursor-pointer border-[#d0d5dd] text-[#344054] hover:bg-[#f9fafb] h-9 px-4"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && leadToDelete && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#101828]">Remove Lead from List</h3>
                  <p className="text-sm text-[#667085]">This action cannot be undone</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-[#475467]">
                  Are you sure you want to remove <strong>{leadToDelete.name}</strong> from this list?
                </p>
                <p className="text-sm text-[#667085] mt-2">
                  This will only remove the lead from this specific list. The lead will remain in your database and other lists.
                </p>
              </div>
              
              <div className="flex items-center justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={handleDeleteCancel}
                  disabled={isDeleting}
                  className="cursor-pointer border-[#d0d5dd] text-[#344054] hover:bg-[#f9fafb] px-4 py-2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="cursor-pointer bg-red-600 hover:bg-red-700 text-white px-4 py-2 flex items-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Removing...
                    </>
                  ) : (
                    'Remove from List'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <AddRecordsModal
        open={isAddRecordsModalOpen}
        onOpenChange={setIsAddRecordsModalOpen}
        onAddRecords={handleAddRecords}
        listId={listId}
      />
    </div>
  );
}