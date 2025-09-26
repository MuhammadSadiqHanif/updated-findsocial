"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Edit2, Trash2, Folder } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { CreateListModal } from "./create-list-modal"
import { useToast } from "@/hooks/use-toast"
import { useUserInfo } from "@/hooks/use-user-info"
import Link from "next/link"

// Define interface for list data from API
interface ListData {
  id: string
  name: string
  description: string
  creator_name: string
  auth0_id: string
  leads_count: number
  created_at: string
  updated_at: string
}

interface ListsResponse {
  total_lists: number
  total_leads: number
  lists: ListData[]
}

// Transform API data to UI format
const transformListForUI = (list: ListData) => ({
  id: parseInt(list.id),
  name: list.name,
  records: list.leads_count,
  createdBy: list.creator_name,
  lastModified: formatDate(list.updated_at),
})

// Helper function to format date
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    if (diffInDays < 30) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  } catch (error) {
    return "Unknown"
  }
}

export function ListsContent() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [listsData, setListsData] = useState<any[]>([])
  const [isCreatingList, setIsCreatingList] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [totalLists, setTotalLists] = useState(0)
  const [totalLeads, setTotalLeads] = useState(0)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [listToDelete, setListToDelete] = useState<{ id: number; name: string } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [editingList, setEditingList] = useState<any>(null)
  const { toast } = useToast()
  const { userInfo } = useUserInfo()

  // Fetch lists from API
  const fetchLists = async () => {
    if (!userInfo?.user_id) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`https://dev-api.findsocial.io/lists/user-lists?auth0_id=${userInfo.user_id}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch lists: ${response.status}`)
      }

      const data: ListsResponse = await response.json()
      
      // Transform API data to UI format
      const transformedLists = data.lists.map(transformListForUI)
      
      setListsData(transformedLists)
      setTotalLists(data.total_lists)
      setTotalLeads(data.total_leads)
      
    } catch (error) {
      console.error('Error fetching lists:', error)
      toast({
        title: "Error",
        description: "Failed to load lists. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch lists when component mounts or when userInfo changes
  useEffect(() => {
    fetchLists()
  }, [userInfo?.user_id])

  const handleListCreated = async (listName: string, description: string, creatorName: string) => {
    if (!userInfo?.user_id) {
      toast({
        title: "Error",
        description: "User not authenticated. Please login again.",
        variant: "destructive",
      })
      return
    }

    setIsCreatingList(true)
    
    try {
      let response, newListData;
      
      if (editingList) {
        // Edit existing list - PUT request
        response = await fetch(`https://dev-api.findsocial.io/lists/${editingList.id}?auth0_id=${userInfo.user_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: listName,
            description: description,
            creator_name: creatorName
          })
        })
      } else {
        // Create new list - POST request
        response = await fetch(`https://dev-api.findsocial.io/lists/create?auth0_id=${userInfo.user_id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: listName,
            description: description,
            creator_name: creatorName
          })
        })
      }

      if (!response.ok) {
        throw new Error(`Failed to ${editingList ? 'update' : 'create'} list: ${response.status}`)
      }

      newListData = await response.json()
      
      if (editingList) {
        // Update existing list in local state
        const updatedListForUI = transformListForUI(newListData)
        setListsData(prev => prev.map(list => 
          list.id === editingList.id ? updatedListForUI : list
        ))
        
        toast({
          title: "List Updated Successfully",
          description: `"${newListData.name}" has been updated successfully.`,
          variant: "default",
        })
      } else {
        // Add new list to local state
        const newListForUI = transformListForUI(newListData)
        setListsData([newListForUI, ...listsData])
        setTotalLists(prev => prev + 1)
        
        toast({
          title: "List Created Successfully",
          description: `"${newListData.name}" has been created successfully.`,
          variant: "default",
        })
      }
      
      setIsCreateModalOpen(false)
      setEditingList(null)

    } catch (error) {
      console.error(`Error ${editingList ? 'updating' : 'creating'} list:`, error)
      toast({
        title: "Error",
        description: `Failed to ${editingList ? 'update' : 'create'} list. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsCreatingList(false)
    }
  }

  // Handle delete button click
  const handleDeleteClick = (list: any) => {
    setListToDelete({
      id: list.id,
      name: list.name
    })
    setShowDeleteDialog(true)
  }

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!listToDelete || !userInfo?.user_id) {
      return
    }

    setIsDeleting(true)
    
    try {
      const response = await fetch(
        `https://dev-api.findsocial.io/lists/${listToDelete.id}?auth0_id=${userInfo.user_id}`, 
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to delete list: ${response.status}`)
      }

      const result = await response.json()

      // Remove the deleted list from local state
      setListsData(prev => prev.filter(list => list.id !== listToDelete.id))
      setTotalLists(prev => prev - 1)
      
      // Close dialog and reset state
      setShowDeleteDialog(false)
      setListToDelete(null)

      toast({
        title: "List Deleted Successfully",
        description: `"${result.deleted_list_name || listToDelete.name}" has been deleted. ${result.leads_count_removed || 0} leads were removed.`,
        variant: "default",
      })

    } catch (error) {
      console.error('Error deleting list:', error)
      toast({
        title: "Error",
        description: "Failed to delete list. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // Handle delete cancel
  const handleDeleteCancel = () => {
    setShowDeleteDialog(false)
    setListToDelete(null)
  }

  // Handle edit button click
  const handleEditClick = (list: any) => {
    setEditingList(list)
    setIsCreateModalOpen(true)
  }

  // Handle modal close
  const handleModalClose = (open: boolean) => {
    setIsCreateModalOpen(open)
    if (!open) {
      setEditingList(null)
    }
  }

  return (
    <div className="space-y-6 w-full max-w-full">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[250px] max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#667085] w-4 h-4" />
          <Input
            placeholder="Search"
            className="pl-10 border-[#d0d5dd] bg-white text-[#344054] placeholder:text-[#667085]"
          />
        </div>
        <Button
          className="cursor-pointer bg-[#7f56d9] hover:bg-[#6941c6] text-white px-4 py-2 rounded-lg flex items-center gap-2"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="w-4 h-4" />
          Create a List
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-[#eaecf0]">
        {/* Table Header */}
        <div className="border-b border-[#eaecf0] bg-[#f9fafb] px-6 py-3 hidden md:grid grid-cols-12 gap-4 items-center text-xs font-medium text-[#667085] uppercase tracking-wide">
            <div className="col-span-1">
              <Checkbox className="border-[#d0d5dd]" />
            </div>
            <div className="col-span-4 flex items-start gap-1">
              List Name
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
            </div>
            <div className="col-span-2 flex items-center gap-1">
              No. of Records
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
            </div>
            <div className="col-span-2 flex items-center gap-1">
              Created By
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
            </div>
            <div className="col-span-2">Last Modified</div>
            <div className="col-span-1"></div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-[#eaecf0]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7f56d9]"></div>
              <span className="ml-3 text-[#667085]">Loading lists...</span>
            </div>
          ) : listsData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="w-16 h-16 bg-[#f9fafb] rounded-full flex items-center justify-center mb-4">
                <Folder className="w-8 h-8 text-[#667085]" />
              </div>
              <h3 className="text-lg font-semibold text-[#101828] mb-2">No lists found</h3>
              <p className="text-[#667085] text-center mb-6 max-w-md">
                You haven't created any lists yet. Create your first list to start organizing your prospects.
              </p>
              <Button
                className="cursor-pointer bg-[#7f56d9] hover:bg-[#6941c6] text-white px-4 py-2 rounded-lg flex items-center gap-2"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Plus className="w-4 h-4" />
                Create Your First List
              </Button>
            </div>
          ) : (
            listsData.map((list) => (
              <div key={list.id} className="px-6 py-4 hover:bg-[#f9fafb] transition-colors">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-3 md:gap-4 md:items-center">
                  
                  <div className="flex justify-between items-center md:col-span-5">
                    <div className="flex items-center gap-3">
                      <Checkbox className="border-[#d0d5dd]" />
                      <Folder className="w-5 h-5 text-[#667085]" />
                      <Link
                        href={`/Lists/${list.id}`}
                        className="text-sm font-medium text-[#101828] hover:text-[#7f56d9] transition-colors cursor-pointer"
                      >
                        {list.name}
                      </Link>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex items-center gap-2 md:block">
                      <span className="md:hidden text-xs font-medium text-[#667085] uppercase tracking-wide">Records:</span>
                      <span className="text-sm text-[#475467]">{list.records.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex items-center gap-2 md:block">
                      <span className="md:hidden text-xs font-medium text-[#667085] uppercase tracking-wide">Created By:</span>
                      <span className="text-sm text-[#475467]">{list.createdBy}</span>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex items-center gap-2 md:block">
                      <span className="md:hidden text-xs font-medium text-[#667085] uppercase tracking-wide">Last Modified:</span>
                      <span className="text-sm text-[#667085]">{list.lastModified}</span>
                    </div>
                  </div>

                  <div className="md:col-span-1 flex items-center justify-start md:justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(list)}
                      className="cursor-pointer p-1 h-8 w-8 text-[#667085] hover:text-[#344054] hover:bg-[#f2f4f7]"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(list)}
                      className="cursor-pointer p-1 h-8 w-8 text-[#667085] hover:text-[#da1e28] hover:bg-[#fef3f2]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <CreateListModal 
        open={isCreateModalOpen} 
        onOpenChange={handleModalClose} 
        onListCreated={handleListCreated}
        isCreating={isCreatingList}
        userId={userInfo?.user_id || null}
        editingList={editingList}
      />

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && listToDelete && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-[#101828] mb-1">Delete List</h3>
                  <p className="text-sm text-[#667085]">
                    Are you sure you want to delete "{listToDelete.name}"? This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Button
                  variant="outline"
                  className="cursor-pointer flex-1 border-[#d0d5dd] text-[#344054] hover:bg-[#f9fafb] hover:border-[#d0d5dd] bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleDeleteCancel}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  className={`flex-1 text-white flex items-center gap-2 ${
                    isDeleting
                      ? "bg-[#98a2b3] cursor-not-allowed hover:bg-[#98a2b3]"
                      : "bg-red-600 hover:bg-red-700 cursor-pointer"
                  }`}
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                >
                  {isDeleting && (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  )}
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
