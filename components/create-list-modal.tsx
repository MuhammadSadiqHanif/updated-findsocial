"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface CreateListModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onListCreated?: (listName: string, description: string, creatorName: string) => Promise<void>
  isCreating?: boolean
  userId?: string | null
  editingList?: any
}

export function CreateListModal({ open, onOpenChange, onListCreated, isCreating = false, userId, editingList }: CreateListModalProps) {
  const [listName, setListName] = useState("")
  const [description, setDescription] = useState("")
  const [creatorName, setCreatorName] = useState("")

  // Populate form when editing
  useEffect(() => {
    if (editingList && open) {
      setListName(editingList.name || "")
      setDescription(editingList.description || "")
      setCreatorName(editingList.createdBy || "")
    } else if (!editingList && open) {
      // Reset form for new list creation
      setListName("")
      setDescription("")
      setCreatorName("")
    }
  }, [editingList, open])

  const isEditMode = !!editingList
  const isFormValid = listName.trim().length > 0 && creatorName.trim().length > 0

  const handleCreate = async () => {
    if (isFormValid && onListCreated) {
      await onListCreated(listName.trim(), description.trim(), creatorName.trim())
      // Only reset form if creation was successful (modal will close)
      if (!open) {
        setListName("")
        setDescription("")
        setCreatorName("")
      }
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isCreating) {
      setListName("")
      setDescription("")
      setCreatorName("")
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0 bg-white border-0 shadow-xl">
        {/* Header */}
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-[#101828]">
              {isEditMode ? "Edit list" : "Create a new list"}
            </DialogTitle>
           
          </div>
          <p className="text-sm text-[#667085] mt-2 text-left">
            {isEditMode 
              ? "Update the details of your list." 
              : "Add a name for your list, and start adding prospects to get started."
            }
          </p>
        </DialogHeader>

        {/* Form Content */}
        <div className="px-6 pb-6 space-y-4">
          {/* List Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#344054]">List Name *</label>
            <Input
              placeholder="e.g. Potential leads"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              disabled={isCreating}
              className="border-[#d0d5dd] bg-white text-[#344054] placeholder:text-[#98a2b3] focus:border-[#7f56d9] focus:ring-[#7f56d9] disabled:bg-[#f9fafb] disabled:cursor-not-allowed"
            />
          </div>

          {/* Creator Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#344054]">Creator Name *</label>
            <Input
              placeholder="Enter your name"
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
              disabled={isCreating}
              className="border-[#d0d5dd] bg-white text-[#344054] placeholder:text-[#98a2b3] focus:border-[#7f56d9] focus:ring-[#7f56d9] disabled:bg-[#f9fafb] disabled:cursor-not-allowed"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#344054]">Description (Optional)</label>
            <Textarea
              placeholder="Describe your list's purpose."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isCreating}
              className="border-[#d0d5dd] bg-white text-[#344054] placeholder:text-[#98a2b3] focus:border-[#7f56d9] focus:ring-[#7f56d9] min-h-[100px] resize-none disabled:bg-[#f9fafb] disabled:cursor-not-allowed"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
            <Button
              variant="outline"
              className="cursor-pointer flex-1 border-[#d0d5dd] text-[#344054] hover:bg-[#f9fafb] hover:border-[#d0d5dd] bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handleOpenChange(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              className={`flex-1 text-white flex items-center gap-2 ${
                isFormValid && !isCreating
                  ? "bg-[#7f56d9] hover:bg-[#6941c6] cursor-pointer"
                  : "bg-[#98a2b3] cursor-not-allowed hover:bg-[#98a2b3]"
              }`}
              disabled={!isFormValid || isCreating}
              onClick={handleCreate}
            >
              {isCreating && (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              )}
              {isCreating 
                ? (isEditMode ? "Updating..." : "Creating...") 
                : (isEditMode ? "Update" : "Create")
              }
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
