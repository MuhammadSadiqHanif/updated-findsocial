"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
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
import { useToast } from "@/hooks/use-toast";

// Define interface for lead data
interface LeadData {
  id: string;
  data: {
    url: string;
    name: string;
    username: string;
    email: string[] | null;
    link: string | { link: string; risk?: number } | [];
    followers: number;
    following: number;
    description: string;
    posts?: number;
    post?: number; // TikTok uses 'post' instead of 'posts'
    verified: boolean;
    private?: boolean;
    privateuser?: boolean; // TikTok uses 'privateuser'
    country: string | null;
    catagory_name?: string | null;
    business?: boolean;
    pronouns?: string;
    tiktok?: string;
    soundcloud?: string;
    spotify?: string;
    youtube?: string;
    linktree?: string;
    // Additional fields for different platforms
    uid?: string;
    other_link?: string[];
    likes?: number;
    friendscount?: number;
    commerceuser?: boolean;
    instagram?: string;
    other?: string;
    deep_search?: any;
  };
  platform: string;
  search?: string;
  scrapper_name?: string;
  timestamp: string;
  created_at: string;
}

interface LeadsResponse {
  data: LeadData[];
  pagination: {
    page: number;
    limit: number;
    sort_by: string;
    sort_order: string;
  };
  total_count: number;
  total_pages: number;
  current_page: number;
  has_next: boolean;
  has_previous: boolean;
}

export function LeadsContent({ userId }: { userId: string | null }) {
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [appliedPlatforms, setAppliedPlatforms] = useState<string[]>([]);
  const [appliedKeyword, setAppliedKeyword] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    platform: true,
    keyword: false,
  });
  const [keywordFilter, setKeywordFilter] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<{ id: string; name: string; platform: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
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
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // API-related state
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  // Prefill search from query param
  const initialSearch = searchParams?.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [isSearching, setIsSearching] = useState(false);
  
  const { toast } = useToast();

  // Fetch leads from API (normal fetch)
  const fetchLeads = async (page = 1, limit = 20, platforms: string[] = []) => {
    if (!userId) return;
    
    setLoading(true);
    try {
      let url = `https://dev-api.findsocial.io/leads/leads?auth0_id=${userId}&page=${page}&limit=${limit}&sort_by=timestamp&sort_order=desc`;
      
      // Add platform filter if any platforms are selected
      if (platforms.length > 0) {
        const platformParam = platforms.join(',');
        url += `&platform=${encodeURIComponent(platformParam)}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch leads');
      }
      
      const data: LeadsResponse = await response.json();
      setLeads(data.data);
      setTotalRecords(data.total_count);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast({
        title: "Error",
        description: "Failed to fetch leads. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Search leads using search API
  const searchLeads = async (searchTerm: string, page = 1, limit = 20, platforms: string[] = []) => {
    if (!userId || !searchTerm.trim()) {
      // If no search term, fetch regular leads
      fetchLeads(page, limit, platforms);
      return;
    }
    
    setLoading(true);
    setIsSearching(true);
    try {
      let url = `https://dev-api.findsocial.io/leads/leads/search?auth0_id=${userId}&search_term=${encodeURIComponent(searchTerm.trim())}&page=${page}&limit=${limit}&sort_by=timestamp&sort_order=desc`;
      
      // Add platform filter if any platforms are selected
      if (platforms.length > 0) {
        const platformParam = platforms.join(',');
        url += `&platform=${encodeURIComponent(platformParam)}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to search leads');
      }
      
      const data: LeadsResponse = await response.json();
      setLeads(data.data);
      setTotalRecords(data.total_count);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error('Error searching leads:', error);
      toast({
        title: "Error",
        description: "Failed to search leads. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  // Fetch leads on component mount and when page/limit changes
  useEffect(() => {
    if (searchQuery.trim()) {
      searchLeads(searchQuery, currentPage, itemsPerPage, appliedPlatforms);
    } else {
      fetchLeads(currentPage, itemsPerPage, appliedPlatforms);
    }
  }, [userId, currentPage, itemsPerPage, appliedPlatforms, searchQuery]);

  // Debounced search effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      fetchLeads(currentPage, itemsPerPage, appliedPlatforms);
      return;
    }

    const timeoutId = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when searching
      searchLeads(searchQuery, 1, itemsPerPage, appliedPlatforms);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery, itemsPerPage, userId, appliedPlatforms]);

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

  // Get platform icon
  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return Instagram;
      case 'tiktok':
        return TikTok;
      case 'youtube':
        return YouTube;
      case 'spotify':
      case 'spotify-artist':
      case 'spotify-playlist':
        return Spotify;
      case 'soundcloud':
        return SoundCloud;
      default:
        return null;
    }
  };

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
    // Reset to first page when applying filters
    setCurrentPage(1);
    if (searchQuery.trim()) {
      searchLeads(searchQuery, 1, itemsPerPage, selectedPlatforms);
    } else {
      fetchLeads(1, itemsPerPage, selectedPlatforms);
    }
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (appliedPlatforms.length > 0) count += appliedPlatforms.length;
    if (appliedKeyword.trim()) count += 1;
    return count;
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // The search will be triggered by the debounced useEffect
  };

  const handleRefresh = () => {
    if (searchQuery.trim()) {
      searchLeads(searchQuery, currentPage, itemsPerPage);
    } else {
      fetchLeads(currentPage, itemsPerPage);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Trigger search or fetch based on current state
    if (searchQuery.trim()) {
      searchLeads(searchQuery, page, itemsPerPage);
    } else {
      fetchLeads(page, itemsPerPage);
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
    // The useEffect will handle the API call
  };

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

  const handleDropdownToggle = (leadId: string) => {
    setOpenDropdownId(openDropdownId === leadId ? null : leadId);
  };

  const handleEdit = (leadId: string) => {
    console.log("Edit lead:", leadId);
    // Add your edit logic here
    setOpenDropdownId(null);
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
    if (!leadToDelete || !userId) return;
    
    setIsDeleting(true);
    try {
      const url = `https://dev-api.findsocial.io/leads/leads/${leadToDelete.id}?auth0_id=${userId}&platform=${encodeURIComponent(leadToDelete.platform)}`;
      
      const response = await fetch(url, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete lead');
      }
      
      // Remove the deleted lead from the current leads list
      setLeads(prevLeads => prevLeads.filter(lead => lead.id !== leadToDelete.id));
      setTotalRecords(prev => prev - 1);
      
      toast({
        title: "Success",
        description: `Lead "${leadToDelete.name}" has been deleted successfully.`,
      });
      
      // Refresh the data to ensure consistency
      if (searchQuery.trim()) {
        searchLeads(searchQuery, currentPage, itemsPerPage, appliedPlatforms);
      } else {
        fetchLeads(currentPage, itemsPerPage, appliedPlatforms);
      }
      
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast({
        title: "Error",
        description: "Failed to delete lead. Please try again.",
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

  const handleDelete = (leadId: string) => {
    console.log("Delete lead:", leadId);
    // Add your delete logic here
    setOpenDropdownId(null);
  };

  // Bulk action handlers
  const handleSelectLead = (leadId: string) => {
    setSelectedLeads(prev => {
      const newSelected = prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId];
      
      setShowBulkActions(newSelected.length > 0);
      return newSelected;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allLeadIds = leads.map(lead => lead.id);
      setSelectedLeads(allLeadIds);
      setShowBulkActions(true);
    } else {
      setSelectedLeads([]);
      setShowBulkActions(false);
    }
  };

  const handleAddToList = () => {
    console.log("Add to list:", selectedLeads);
    toast({
      title: "Add to List",
      description: `${selectedLeads.length} leads will be added to list`,
    });
  };

  const handleExport = () => {
    console.log("Export leads:", selectedLeads);
    toast({
      title: "Export",
      description: `Exporting ${selectedLeads.length} leads`,
    });
  };

  const handleSendMessages = () => {
    console.log("Send messages to:", selectedLeads);
    toast({
      title: "Send Messages",
      description: `Messages will be sent to ${selectedLeads.length} leads`,
    });
  };

  const handleBulkDelete = () => {
    console.log("Bulk delete:", selectedLeads);
    toast({
      title: "Bulk Delete",
      description: `${selectedLeads.length} leads will be deleted`,
    });
  };

  const handleClearSelection = () => {
    setSelectedLeads([]);
    setShowBulkActions(false);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Search and Filter Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4 flex-1 min-w-0 w-full sm:w-auto">
          <div className="relative flex-1 max-w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#667085] w-4 h-4" />
            <Input
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-10 border-[#d0d5dd] bg-white text-[#344054] placeholder:text-[#667085] h-10"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearch("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#667085] hover:text-[#344054]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
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
              <div className="absolute top-full left-0 mt-2 w-full max-w-xs sm:w-80 bg-white border border-[#eaecf0] rounded-lg shadow-lg z-50">
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
            onClick={() => setShowColumnSettings(!showColumnSettings)}
            className="cursor-pointer p-2 h-10 w-10 text-[#667085] hover:text-[#344054] hover:bg-[#f2f4f7] relative"
          >
            <Settings className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            className="cursor-pointer p-2 h-10 w-10 text-[#667085] hover:text-[#344054] hover:bg-[#f2f4f7]"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Search Status */}
      {searchQuery && (
        <div className="flex items-center gap-2 text-sm text-[#667085] bg-[#f9fafb] px-4 py-2 rounded-lg border border-[#eaecf0]">
          <Search className="w-4 h-4" />
          <span>
            Search results for "<span className="font-medium text-[#344054]">{searchQuery}</span>" 
            {totalRecords > 0 && <span className="ml-1">({totalRecords} results)</span>}
          </span>
          {isSearching && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#7f56d9] ml-2"></div>
          )}
        </div>
      )}

      {/* Bulk Actions Bar */}
      {showBulkActions && (
        <div className="flex items-center justify-between bg-[#f0f9ff] border border-[#0ea5e9] rounded-lg px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#0ea5e9] rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-[#0ea5e9]">
                {selectedLeads.length} lead{selectedLeads.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            <button
              onClick={handleClearSelection}
              className="text-sm text-[#6b7280] hover:text-[#374151] underline"
            >
              Clear selection
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddToList}
              className="cursor-pointer h-8 px-3 text-sm border-[#d1d5db] text-[#374151] hover:bg-[#f9fafb]"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add to List
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="cursor-pointer h-8 px-3 text-sm border-[#d1d5db] text-[#374151] hover:bg-[#f9fafb]"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSendMessages}
              className="cursor-pointer h-8 px-3 text-sm border-[#d1d5db] text-[#374151] hover:bg-[#f9fafb]"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Send Messages
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkDelete}
              className="cursor-pointer h-8 px-3 text-sm border-red-300 text-red-600 hover:bg-red-50"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Leads Table */}
      <div className="bg-white rounded-lg border border-[#eaecf0] overflow-hidden">
        {/* Table Header */}
        <div className="overflow-x-auto">
          <div className="hidden md:block border-b border-[#eaecf0] bg-[#f9fafb] px-6 py-3">
            <div className="flex items-center gap-4 text-xs font-medium text-[#667085] uppercase tracking-wide w-full" style={{ minWidth: 'max(1200px, 100%)' }}>
              <div className="flex-1 min-w-[48px]">
                <Checkbox 
                  className="border-[#d0d5dd]"
                  checked={selectedLeads.length > 0 && selectedLeads.length === leads.length}
                  onCheckedChange={handleSelectAll}
                />
              </div>
              {columnSettings.name && (
                <div className="flex-[3] min-w-[192px] flex items-center gap-1">
                  Name
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
                </div>
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
                <div className="flex-1 min-w-[96px] flex items-center gap-1">
                  Followers
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
                </div>
              )}
              
              {columnSettings.following && (
                <div className="flex-1 min-w-[96px] flex items-center gap-1">
                  Following
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
                </div>
              )}
              
              {columnSettings.posts && (
                <div className="flex-1 min-w-[80px] flex items-center gap-1">
                  Posts
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
                </div>
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
        <div className="divide-y divide-[#eaecf0]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7f56d9]"></div>
            </div>
          ) : leads.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-[#667085]">No leads found</p>
            </div>
          ) : (
            leads.map((lead) => (
            <div key={lead.id} className="px-6 py-4 hover:bg-[#f9fafb] transition-colors">
              {/* Mobile View: Stacked */}
              <div className="md:hidden space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      className="border-[#d0d5dd]"
                      checked={selectedLeads.includes(lead.id)}
                      onCheckedChange={() => handleSelectLead(lead.id)}
                    />
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#f2f4f7] flex-shrink-0">
                      <Image src={Avatar1} alt={lead.data.name} width={40} height={40} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <Link href={`/Leads/${lead.id}`} className="text-sm font-medium text-[#101828] hover:text-[#7f56d9] transition-colors cursor-pointer">
                        {lead.data.name}
                      </Link>
                      <div className="text-sm text-[#667085]">@{lead.data.username}</div>
                    </div>
                  </div>
                  <div className="relative">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDropdownToggle(lead.id)}
                      className="cursor-pointer p-1 h-8 w-8 text-[#667085] hover:text-[#344054] hover:bg-[#f2f4f7]"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                    
                    {openDropdownId === lead.id && (
                      <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-[#eaecf0] rounded-lg shadow-lg z-50">
                        <div className="py-2">
                          <button
                            onClick={() => handleEdit(lead.id)}
                            className="w-full cursor-pointer px-4 py-2 text-left text-sm text-[#344054] hover:bg-[#f9fafb] flex items-center gap-3 transition-colors"
                          >
                            <svg className="w-4 h-4 text-[#667085]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Edit Lead</span>
                          </button>
                          <div className="border-t border-[#f2f4f7] my-1"></div>
                          <button
                            onClick={() => handleDeleteClick(lead)}
                            className="w-full cursor-pointer px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                          >
                            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Delete Lead</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="text-xs text-[#667085] mb-1">Email address</div>
                    <div className="text-sm text-[#475467] truncate">
                      {lead.data.email && Array.isArray(lead.data.email) && lead.data.email.length > 0 
                        ? lead.data.email.join(", ") 
                        : "N/A"
                      }
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-[#667085] mb-1">Country</div>
                    <div className="flex items-center gap-2">
                      <Image src={US} alt="Flag" width={20} height={15} className="rounded-sm" />
                      <span className="text-sm text-[#475467]">{lead.data.country || "N/A"}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-[#667085] mb-1">URL/Links</div>
                    <div className="flex items-center gap-2">
                      {getPlatformIcon(lead.platform) && (
                        // <div className="flex items-center gap-1 bg-[#f2f4f7] px-2 py-1 rounded-md">
                          <Image 
                            src={getPlatformIcon(lead.platform)!} 
                            alt={lead.platform} 
                            className="w-4 h-4" 
                          />
                          // {/* <span className="text-xs text-[#667085] capitalize">{lead.platform}</span> */}
                        // </div>
                      )}
                      <Button variant="ghost" size="sm" className="p-1 h-8 w-8 text-[#667085] hover:text-[#344054] hover:bg-[#f2f4f7]">
                        <LinkIcon className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="p-1 h-8 w-8 text-[#667085] hover:text-[#344054] hover:bg-[#f2f4f7]">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop View: Flexbox */}
              <div className="hidden md:flex items-center gap-4 w-full" style={{ minWidth: 'max(1200px, 100%)' }}>
                <div className="flex-1 min-w-[48px]">
                  <Checkbox 
                    className="border-[#d0d5dd]"
                    checked={selectedLeads.includes(lead.id)}
                    onCheckedChange={() => handleSelectLead(lead.id)}
                  />
                </div>
                
                {columnSettings.name && (
                  <div className="flex-[3] min-w-[192px] flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#f2f4f7] flex-shrink-0">
                      <Image src={Avatar1} alt={lead.data.name} width={40} height={40} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link href={`/Leads/${lead.id}`} className="text-sm font-medium text-[#101828] truncate hover:text-[#7f56d9] transition-colors cursor-pointer block">
                        {lead.data.name}
                      </Link>
                      <div className="text-sm text-[#667085] truncate">@{lead.data.username}</div>
                    </div>
                  </div>
                )}
                
                {columnSettings.email && (
                  <div className="flex-[2] min-w-[160px] flex items-center">
                    <span className="text-sm text-[#475467] truncate block">
                      {lead.data.email && Array.isArray(lead.data.email) && lead.data.email.length > 0 
                        ? lead.data.email.join(", ") 
                        : "N/A"
                      }
                    </span>
                  </div>
                )}
                
                {columnSettings.country && (
                  <div className="flex-[1.5] min-w-[128px] flex items-center gap-2">
                    <Image src={US} alt="Flag" width={20} height={15} className="rounded-sm" />
                    <span className="text-sm text-[#475467] truncate">{lead.data.country || "N/A"}</span>
                  </div>
                )}
                
                {columnSettings.urls && (
                  <div className="flex-[2] min-w-[160px] flex items-center gap-2">
                    {getPlatformIcon(lead.platform) && (
                      <Image 
                        src={getPlatformIcon(lead.platform)!} 
                        alt={lead.platform} 
                        className="w-4 h-4" 
                      />
                    )}
                    <Button variant="ghost" size="sm" className="p-1 h-8 w-8 text-[#667085] hover:text-[#344054] hover:bg-[#f2f4f7]">
                      <LinkIcon className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-1 h-8 w-8 text-[#667085] hover:text-[#344054] hover:bg-[#f2f4f7]">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                
                {columnSettings.followers && (
                  <div className="flex-1 min-w-[96px] flex items-center">
                    <span className="text-sm text-[#475467] truncate">
                      {lead.data.followers ? lead.data.followers.toLocaleString() : "N/A"}
                    </span>
                  </div>
                )}

                {columnSettings.following && (
                  <div className="flex-1 min-w-[96px] flex items-center">
                    <span className="text-sm text-[#475467] truncate">
                      {lead.data.following ? lead.data.following.toLocaleString() : "N/A"}
                    </span>
                  </div>
                )}

                {columnSettings.posts && (
                  <div className="flex-1 min-w-[80px] flex items-center">
                    <span className="text-sm text-[#475467] truncate">
                      {lead.data.posts || lead.data.post ? (lead.data.posts || lead.data.post)?.toLocaleString() : "N/A"}
                    </span>
                  </div>
                )}

                {columnSettings.verified && (
                  <div className="flex-1 min-w-[80px] flex items-center">
                    {lead.data.verified ? (
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        <span className="text-xs text-blue-600">Verified</span>
                      </div>
                    ) : (
                      <span className="text-xs text-[#667085]">Not verified</span>
                    )}
                  </div>
                )}

                {columnSettings.business && (
                  <div className="flex-1 min-w-[96px] flex items-center">
                    {lead.data.business ? (
                      <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Business
                      </div>
                    ) : (
                      <span className="text-xs text-[#667085]">Personal</span>
                    )}
                  </div>
                )}
                
                <div className="flex-1 min-w-[48px] flex items-center justify-end relative">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDropdownToggle(lead.id)}
                    className="cursor-pointer p-1 h-8 w-8 text-[#667085] hover:text-[#344054] hover:bg-[#f2f4f7]"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                  
                  {openDropdownId === lead.id && (
                    <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-[#eaecf0] rounded-lg shadow-lg z-50">
                      <div className="py-2">
                        <button
                          onClick={() => handleEdit(lead.id)}
                          className="w-full cursor-pointer px-4 py-2 text-left text-sm text-[#344054] hover:bg-[#f9fafb] flex items-center gap-3 transition-colors"
                        >
                          <svg className="w-4 h-4 text-[#667085]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span>Edit Lead</span>
                        </button>
                        <div className="border-t border-[#f2f4f7] my-1"></div>
                        <button
                          onClick={() => handleDeleteClick(lead)}
                          className="w-full cursor-pointer px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                        >
                          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Delete Lead</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4 text-sm text-[#344054]">
          <span>Total Records {totalRecords}</span>
          <div className="flex items-center gap-2">
            <span>Showing per page</span>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
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
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1 || loading}
            className="cursor-pointer border-[#d0d5dd] text-[#344054] hover:bg-[#f9fafb] h-10 px-3 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            <span className="hidden sm:inline">Previous</span>
          </Button>

          <div className="flex items-center gap-1">
            {renderPaginationNumbers().map((page, index) => (
              <Button
                key={index}
                variant={page === currentPage ? "default" : "ghost"}
                size="sm"
                onClick={() => typeof page === "number" && handlePageChange(page)}
                disabled={page === "..." || loading}
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
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages || loading}
            className="cursor-pointer border-[#d0d5dd] text-[#344054] hover:bg-[#f9fafb] h-10 px-3 flex items-center gap-2"
          >
            <span className="hidden sm:inline">Next</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </Button>
        </div>
      </div>

      {/* Column Settings Modal */}
      {showColumnSettings && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#101828]">Table Column Settings</h3>
                  <p className="text-sm text-[#667085]">Choose which columns to show in the table</p>
                </div>
                <button
                  onClick={() => setShowColumnSettings(false)}
                  className="p-2 hover:bg-[#f9fafb] rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-[#667085]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={columnSettings.name}
                      onCheckedChange={() => handleColumnToggle('name')}
                      className="border-[#d0d5dd] data-[state=checked]:bg-[#7f56d9] data-[state=checked]:border-[#7f56d9]"
                    />
                    <label className="text-sm font-medium text-[#344054]">Name</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#667085]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={columnSettings.email}
                      onCheckedChange={() => handleColumnToggle('email')}
                      className="border-[#d0d5dd] data-[state=checked]:bg-[#7f56d9] data-[state=checked]:border-[#7f56d9]"
                    />
                    <label className="text-sm font-medium text-[#344054]">Email Address</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#667085]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={columnSettings.country}
                      onCheckedChange={() => handleColumnToggle('country')}
                      className="border-[#d0d5dd] data-[state=checked]:bg-[#7f56d9] data-[state=checked]:border-[#7f56d9]"
                    />
                    <label className="text-sm font-medium text-[#344054]">Country</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#667085]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={columnSettings.urls}
                      onCheckedChange={() => handleColumnToggle('urls')}
                      className="border-[#d0d5dd] data-[state=checked]:bg-[#7f56d9] data-[state=checked]:border-[#7f56d9]"
                    />
                    <label className="text-sm font-medium text-[#344054]">URL/Links</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#667085]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </div>
                </div>

                <div className="border-t border-[#eaecf0] pt-4">
                  <p className="text-xs font-medium text-[#667085] mb-3 uppercase tracking-wide">Additional Columns</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={columnSettings.followers}
                          onCheckedChange={() => handleColumnToggle('followers')}
                          className="border-[#d0d5dd] data-[state=checked]:bg-[#7f56d9] data-[state=checked]:border-[#7f56d9]"
                        />
                        <label className="text-sm font-medium text-[#344054]">Followers</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-[#667085]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={columnSettings.following}
                          onCheckedChange={() => handleColumnToggle('following')}
                          className="border-[#d0d5dd] data-[state=checked]:bg-[#7f56d9] data-[state=checked]:border-[#7f56d9]"
                        />
                        <label className="text-sm font-medium text-[#344054]">Following</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-[#667085]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={columnSettings.posts}
                          onCheckedChange={() => handleColumnToggle('posts')}
                          className="border-[#d0d5dd] data-[state=checked]:bg-[#7f56d9] data-[state=checked]:border-[#7f56d9]"
                        />
                        <label className="text-sm font-medium text-[#344054]">Posts</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-[#667085]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={columnSettings.verified}
                          onCheckedChange={() => handleColumnToggle('verified')}
                          className="border-[#d0d5dd] data-[state=checked]:bg-[#7f56d9] data-[state=checked]:border-[#7f56d9]"
                        />
                        <label className="text-sm font-medium text-[#344054]">Verified</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-[#667085]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={columnSettings.business}
                          onCheckedChange={() => handleColumnToggle('business')}
                          className="border-[#d0d5dd] data-[state=checked]:bg-[#7f56d9] data-[state=checked]:border-[#7f56d9]"
                        />
                        <label className="text-sm font-medium text-[#344054]">Business Account</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-[#667085]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                      </div>
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
                    className="cursor-pointer border-[#d0d5dd] text-[#344054] hover:bg-[#f9fafb] h-9 px-3"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => setShowColumnSettings(false)}
                    className="cursor-pointer bg-[#7f56d9] hover:bg-[#6941c6] text-white h-9 px-4"
                  >
                    Apply Changes
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.35 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#101828]">Delete Lead</h3>
                  <p className="text-sm text-[#667085]">This action cannot be undone</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-[#475467]">
                  Are you sure you want to delete the lead{' '}
                  <span className="font-medium text-[#101828]">"{leadToDelete.name}"</span>{' '}
                  from{' '}
                  <span className="font-medium text-[#101828] capitalize">{leadToDelete.platform}</span>?
                </p>
                <p className="text-sm text-[#667085] mt-2">
                  This will permanently remove the lead from your database.
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
                  {isDeleting && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  {isDeleting ? 'Deleting...' : 'Delete Lead'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
