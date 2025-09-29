"use client";

import { useState, useEffect } from "react";
import { Search, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useUserInfo } from "@/hooks/use-user-info";
import Image from "next/image";
import Avatar1 from "@/public/Avatar.png";
import US from "@/public/US.png";
import Instagram from "@/public/platform/instagram.png";
import TikTok from "@/public/platform/tiktok.png";
import YouTube from "@/public/platform/youtube.png";
import Spotify from "@/public/platform/spotify.png";
import SoundCloud from "@/public/platform/soundcloud.png";

// Interface for lead data (same as leads-content.tsx)
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
    post?: number;
    verified: boolean;
    private?: boolean;
    privateuser?: boolean;
    country: string | null;
    catagory_name?: string | null;
    business?: boolean;
    pronouns?: string;
    tiktok?: string;
    soundcloud?: string;
    spotify?: string;
    youtube?: string;
    linktree?: string;
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

interface AddRecordsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddRecords: (selectedRecords: LeadData[]) => void;
  listId: string;
}

export function AddRecordsModal({ open, onOpenChange, onAddRecords, listId }: AddRecordsModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [isAddingLeads, setIsAddingLeads] = useState(false);
  const itemsPerPage = 10;

  const { toast } = useToast();
  const { userInfo } = useUserInfo();

  // Get platform icon function (same as leads-content.tsx)
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

  // Fetch leads from API (same logic as leads-content.tsx)
  const fetchLeads = async (page = 1, limit = 10, platforms: string[] = []) => {
    if (!userInfo?.user_id) return;
    
    setLoading(true);
    try {
      let url = `https://dev-api.findsocial.io/leads/leads?auth0_id=${userInfo.user_id}&page=${page}&limit=${limit}&sort_by=timestamp&sort_order=desc`;
      
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

  // Search leads using search API (same logic as leads-content.tsx)
  const searchLeads = async (searchTerm: string, page = 1, limit = 10, platforms: string[] = []) => {
    if (!userInfo?.user_id || !searchTerm.trim()) {
      fetchLeads(page, limit, platforms);
      return;
    }
    
    setLoading(true);
    setIsSearching(true);
    try {
      let url = `https://dev-api.findsocial.io/leads/leads/search?auth0_id=${userInfo.user_id}&search_term=${encodeURIComponent(searchTerm.trim())}&page=${page}&limit=${limit}&sort_by=timestamp&sort_order=desc`;
      
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

  // Fetch leads when modal opens
  useEffect(() => {
    if (open) {
      setCurrentPage(1);
      setSelectedLeads([]);
      if (searchQuery.trim()) {
        searchLeads(searchQuery, 1, itemsPerPage);
      } else {
        fetchLeads(1, itemsPerPage);
      }
      // Fetch existing leads in the list to pre-select them
      fetchExistingListLeads();
    }
  }, [open, userInfo?.user_id, listId]);

  // Function to fetch existing leads in the list and pre-select them
  const fetchExistingListLeads = async () => {
    if (!userInfo?.user_id || !listId) return;
    
    try {
      const response = await fetch(
        `https://dev-api.findsocial.io/lists/${listId}/leads?auth0_id=${userInfo.user_id}`
      );
      
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        
        if (data?.leads) {
          // Pre-select existing leads
          const existingLeadIds = data.leads.map((lead: any) => lead.id);
          setSelectedLeads(existingLeadIds);
        }
      }
    } catch (error) {
      console.error('Error fetching existing list leads:', error);
    }
  };

  // Debounced search effect
  useEffect(() => {
    if (!open) return;

    if (!searchQuery.trim()) {
      fetchLeads(currentPage, itemsPerPage);
      return;
    }

    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      searchLeads(searchQuery, 1, itemsPerPage);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, open]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (searchQuery.trim()) {
      searchLeads(searchQuery, page, itemsPerPage);
    } else {
      fetchLeads(page, itemsPerPage);
    }
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
    if (selectedLeads.length === leads.length && leads.length > 0) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leads.map(lead => lead.id));
    }
  };

  // Handle add selected records to list
  const handleAddSelected = async () => {
    if (!userInfo?.user_id || !listId || selectedLeads.length === 0) return;
    
    setIsAddingLeads(true);
    
    try {
      const requestBody = {
        lead_ids: selectedLeads
      };

      const response = await fetch(
        `https://dev-api.findsocial.io/lists/${listId}/add-leads?auth0_id=${userInfo.user_id}`,
        {
          method: 'POST',
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
          description: `${selectedLeads.length} leads have been added to the list.`,
        });
        
        // Call the parent callback if needed
        const selectedLeadData = leads.filter(lead => selectedLeads.includes(lead.id));
        onAddRecords(selectedLeadData);
        
        // Close the modal
        onOpenChange(false);
      } else {
        throw new Error(data.message || 'Failed to add leads to list');
      }
    } catch (error) {
      console.error('Error adding leads to list:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add leads to list. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingLeads(false);
    }
  };

  // Handle close modal
  const handleClose = () => {
    setSelectedLeads([]);
    setSearchQuery("");
    setCurrentPage(1);
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#eaecf0]">
          <div>
            <h3 className="text-lg font-semibold text-[#101828]">Add Records to List</h3>
            <p className="text-sm text-[#667085]">Select leads from your database to add to this list</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="cursor-pointer p-2 h-8 w-8 text-[#667085] hover:text-[#344054] hover:bg-[#f2f4f7]"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-[#eaecf0]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#667085] w-4 h-4" />
            <Input
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-[#d0d5dd] bg-white text-[#344054] placeholder:text-[#667085] h-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#667085] hover:text-[#344054]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Search Status */}
        {searchQuery && (
          <div className="px-6 py-3 bg-[#f9fafb] border-b border-[#eaecf0]">
            <div className="flex items-center gap-2 text-sm text-[#667085]">
              <Search className="w-4 h-4" />
              <span>
                Search results for "<span className="font-medium text-[#344054]">{searchQuery}</span>" 
                {totalRecords > 0 && <span className="ml-1">({totalRecords} results)</span>}
              </span>
              {isSearching && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#7f56d9] ml-2"></div>
              )}
            </div>
          </div>
        )}

        {/* Selection Bar */}
        {selectedLeads.length > 0 && (
          <div className="px-6 py-3 bg-[#f0f9ff] border-b border-[#0ea5e9]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-[#0ea5e9] rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-[#0369a1]">
                  {selectedLeads.length} lead{selectedLeads.length !== 1 ? 's' : ''} selected
                </span>
              </div>
              <button
                onClick={() => setSelectedLeads([])}
                className="text-sm text-[#0369a1] hover:text-[#0c4a6e] underline"
              >
                Clear selection
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto max-h-96">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7f56d9]"></div>
              <span className="ml-3 text-[#667085]">Loading leads...</span>
            </div>
          ) : leads.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 bg-[#f2f4f7] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-[#667085]" />
                </div>
                <h3 className="text-sm font-medium text-[#101828] mb-1">No leads found</h3>
                <p className="text-sm text-[#667085]">
                  {searchQuery ? "No leads match your search criteria" : "No leads available in your database"}
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-[#eaecf0]">
              {/* Table Header */}
              <div className="hidden md:block bg-[#f9fafb] px-6 py-3">
                <div className="grid grid-cols-12 gap-4 items-center text-xs font-medium text-[#667085] uppercase tracking-wide">
                  <div className="col-span-1">
                    <Checkbox 
                      checked={selectedLeads.length === leads.length && leads.length > 0}
                      onCheckedChange={handleSelectAll}
                      className="border-[#d0d5dd]" 
                    />
                  </div>
                  <div className="col-span-4">Name</div>
                  <div className="col-span-3">Email</div>
                  <div className="col-span-2">Platform</div>
                  <div className="col-span-2">Followers</div>
                </div>
              </div>

              {/* Table Body */}
              {leads.map((lead) => (
                <div key={lead.id} className="px-6 py-4 hover:bg-[#f9fafb] transition-colors">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-y-3 md:gap-4 md:items-center">
                    
                    {/* Mobile & Desktop: Checkbox + Name */}
                    <div className="flex justify-between items-center md:col-span-5">
                      <div className="flex items-center gap-3">
                        <Checkbox 
                          checked={selectedLeads.includes(lead.id)}
                          onCheckedChange={() => handleSelectLead(lead.id)}
                          className="border-[#d0d5dd]" 
                        />
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-[#f2f4f7] flex-shrink-0">
                          <Image src={Avatar1} alt={lead.data.name} width={40} height={40} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-[#101828] truncate">
                            {lead.data.name}
                          </div>
                          <div className="text-sm text-[#667085] truncate">@{lead.data.username}</div>
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="md:col-span-3">
                      <div className="flex items-center gap-2 md:block">
                        <span className="md:hidden text-xs font-medium text-[#667085] uppercase tracking-wide">Email:</span>
                        <span className="text-sm text-[#475467]">
                          {lead.data.email && Array.isArray(lead.data.email) && lead.data.email.length > 0 
                            ? lead.data.email[0] 
                            : "Not available"
                          }
                        </span>
                      </div>
                    </div>

                    {/* Platform */}
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-2 md:block">
                        <span className="md:hidden text-xs font-medium text-[#667085] uppercase tracking-wide">Platform:</span>
                        <div className="flex items-center gap-2">
                          {getPlatformIcon(lead.platform) && (
                            <Image 
                              src={getPlatformIcon(lead.platform)!} 
                              alt={lead.platform} 
                              className="w-4 h-4" 
                            />
                          )}
                          <span className="text-sm text-[#475467] capitalize">{lead.platform}</span>
                        </div>
                      </div>
                    </div>

                    {/* Followers */}
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-2 md:block">
                        <span className="md:hidden text-xs font-medium text-[#667085] uppercase tracking-wide">Followers:</span>
                        <span className="text-sm text-[#475467]">
                          {lead.data.followers ? lead.data.followers.toLocaleString() : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-[#eaecf0] bg-[#f9fafb]">
            <div className="flex items-center justify-between">
              <div className="text-sm text-[#344054]">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalRecords)} of {totalRecords} results
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1 || loading}
                  className="cursor-pointer border-[#d0d5dd] text-[#344054] hover:bg-white"
                >
                  Previous
                </Button>
                <span className="text-sm text-[#344054] px-3">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages || loading}
                  className="cursor-pointer border-[#d0d5dd] text-[#344054] hover:bg-white"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-[#eaecf0] bg-white">
          <Button
            variant="outline"
            onClick={handleClose}
            className="cursor-pointer border-[#d0d5dd] text-[#344054] hover:bg-[#f9fafb] px-4 py-2"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddSelected}
            disabled={selectedLeads.length === 0 || isAddingLeads}
            className="cursor-pointer bg-[#7f56d9] hover:bg-[#6941c6] text-white px-4 py-2 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAddingLeads ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add {selectedLeads.length > 0 ? `${selectedLeads.length} ` : ''}Record{selectedLeads.length !== 1 ? 's' : ''} to List
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}