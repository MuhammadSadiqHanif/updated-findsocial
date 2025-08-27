"use client"

import { Folder, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyListStateProps {
  onAddRecords: () => void
}

export function EmptyListState({ onAddRecords }: EmptyListStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="w-16 h-16 bg-[#7f56d9] rounded-lg flex items-center justify-center mb-6">
        <Folder className="w-8 h-8 text-white" />
      </div>

      <h3 className="text-lg font-semibold text-[#101828] mb-2">No Records found</h3>

      <p className="text-[#667085] mb-8 max-w-md">
        We didn't find any records in your list. Add records to your list now.
      </p>

      <Button
        className="bg-[#7f56d9] hover:bg-[#6941c6] text-white px-6 py-2 rounded-lg flex items-center gap-2"
        onClick={onAddRecords}
      >
        <Plus className="w-4 h-4" />
        Add Records
      </Button>
    </div>
  )
}
