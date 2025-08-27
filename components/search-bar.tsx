"use client"

import { Input } from "@/components/ui/input"

interface SearchBarProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="Enter keywords e.g. 'Pop Artist, Jazz Music or Indie Pop'"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full h-14 px-4 border-none text-base focus:border-purple-500 focus:ring-purple-500"
      />
    </div>
  )
}
