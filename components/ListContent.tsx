"use client"

import { useState } from "react"
import { Search, Plus, Edit2, Trash2, Folder } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { CreateListModal } from "./create-list-modal"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

const initialListsData = [
  {
    id: 1,
    name: "Trending Artist",
    records: 2000,
    createdBy: "Emma Carter",
    lastModified: "13 minutes ago",
  },
  {
    id: 2,
    name: "Trending Artist",
    records: 1788,
    createdBy: "Olivia Rhye",
    lastModified: "20 minutes ago",
  },
  {
    id: 3,
    name: "Top Playlist",
    records: 1788,
    createdBy: "Olivia Rhye",
    lastModified: "3 hours ago",
  },
  {
    id: 4,
    name: "Indie Pop Artist",
    records: 1235,
    createdBy: "Emma Carter",
    lastModified: "Aug 1, 2025",
  },
]

export function ListsContent() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [listsData, setListsData] = useState(initialListsData)
  const { toast } = useToast()

  const handleListCreated = (listName: string, description: string) => {
    const newList = {
      id: listsData.length + 1,
      name: listName,
      records: 0,
      createdBy: "Olivia Rhye",
      lastModified: "Just now",
    }

    setListsData([newList, ...listsData])
    setIsCreateModalOpen(false)

    toast({
      title: "New List Created",
      description: "Your new list has been successfully created. Start adding prospects to it now.",
      variant: "success",
    })
  }

  return (
    <div className="space-y-6">
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
        <div className="border-b border-[#eaecf0] bg-[#f9fafb] px-6 py-3 hidden md:grid grid-cols-12 gap-4 items-center text-xs font-medium text-[#667085] uppercase tracking-wide">
            <div className="col-span-1">
              <Checkbox className="border-[#d0d5dd]" />
            </div>
            <div className="col-span-4 flex items-center gap-1">
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

        <div className="divide-y divide-[#eaecf0]">
          {listsData.map((list) => (
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
                    className="p-1 h-8 w-8 text-[#667085] hover:text-[#344054] hover:bg-[#f2f4f7]"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-8 w-8 text-[#667085] hover:text-[#da1e28] hover:bg-[#fef3f2]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CreateListModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} onListCreated={handleListCreated} />
    </div>
  )
}
