"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface CreateListModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onListCreated?: (listName: string, description: string) => void
}

export function CreateListModal({ open, onOpenChange, onListCreated }: CreateListModalProps) {
  const [listName, setListName] = useState("")
  const [description, setDescription] = useState("")

  const isFormValid = listName.trim().length > 0

  const handleCreate = () => {
    if (isFormValid) {
      onListCreated?.(listName.trim(), description.trim())
      setListName("")
      setDescription("")
      onOpenChange(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setListName("")
      setDescription("")
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0 bg-white border-0 shadow-xl">
        {/* Header */}
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-[#101828]">Create a new list</DialogTitle>
           
          </div>
          <p className="text-sm text-[#667085] mt-2 text-left">
            Add a name for your list, and start adding prospects to get started.
          </p>
        </DialogHeader>

        {/* Form Content */}
        <div className="px-6 pb-6 space-y-4">
          {/* List Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#344054]">List Name</label>
            <Input
              placeholder="e.g. Potential leads"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              className="border-[#d0d5dd] bg-white text-[#344054] placeholder:text-[#98a2b3] focus:border-[#7f56d9] focus:ring-[#7f56d9]"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#344054]">Description (Optional)</label>
            <Textarea
              placeholder="Describe your list's purpose."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-[#d0d5dd] bg-white text-[#344054] placeholder:text-[#98a2b3] focus:border-[#7f56d9] focus:ring-[#7f56d9] min-h-[100px] resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
            <Button
              variant="outline"
              className="cursor-pointer flex-1 border-[#d0d5dd] text-[#344054] hover:bg-[#f9fafb] hover:border-[#d0d5dd] bg-transparent"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className={`cursor-pointer flex-1 text-white ${
                isFormValid
                  ? "bg-[#7f56d9] hover:bg-[#6941c6] cursor-pointer"
                  : "bg-[#98a2b3] cursor-not-allowed hover:bg-[#98a2b3]"
              }`}
              disabled={!isFormValid}
              onClick={handleCreate}
            >
              Create
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
