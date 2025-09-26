"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

interface SearchBarProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  onSearch?: () => void
  isLoading?: boolean
}

export function SearchBar({ searchQuery, setSearchQuery, onSearch, isLoading = false }: SearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onSearch && !isLoading) {
      onSearch()
    }
  }

  return (
    <div className="relative flex">
      <Input
        type="text"
        placeholder="Enter keywords e.g. 'Pop Artist, Jazz Music or Indie Pop'"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        className="w-full h-14 px-4 border-none text-base focus:ring-0 focus:border-none focus-visible:ring-0 focus-visible:border-none pr-20"
      />
    </div>
  )
}
