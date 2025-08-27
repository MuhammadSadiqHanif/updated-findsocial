"use client"

import { useState } from "react"
import {
  Search,
  Home,
  List,
  Users,
  MessageSquare,
  FileText,
  HelpCircle,
  Settings,
  Plus,
  Shuffle,
  Upload,
  Wand2,
  ArrowUp,
  X,
  Info,
  Check,
  ChevronDown,
  Trash2,
  Gift,
  Bell,
  Layers3,
  Instagram,
  Music,
  Play,
  Headphones,
  Cloud,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"

const platforms = [
  { id: "instagram", name: "Instagram", icon: Instagram, color: "text-pink-500" },
  { id: "tiktok", name: "TikTok", icon: Music, color: "text-black" },
  { id: "youtube", name: "YouTube", icon: Play, color: "text-red-500" },
  { id: "spotify-artist", name: "Spotify Artist", icon: Headphones, color: "text-green-500" },
  { id: "spotify-playlist", name: "Spotify Playlist", icon: Headphones, color: "text-green-500" },
  { id: "soundcloud", name: "SoundCloud", icon: Cloud, color: "text-orange-500" },
]

export default function Dashboard() {
  const [showFiltersModal, setShowFiltersModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showPlatformDropdown, setShowPlatformDropdown] = useState(false)
  const [showResultsTooltip, setShowResultsTooltip] = useState(false)
  const [selectedPlatforms, setSelectedPlatforms] = useState(["instagram", "tiktok", "youtube"])
  const [deepSearch, setDeepSearch] = useState(true)
  const [aiSearch, setAiSearch] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [followersRange, setFollowersRange] = useState([0])
  const [followingRange, setFollowingRange] = useState([0])
  const [postsRange, setPostsRange] = useState([0])
  const [uploadProgress, setUploadProgress] = useState(40)

  const sidebarItems = [
    { icon: Search, label: "Search", active: true },
    { icon: Home, label: "Home" },
    { icon: List, label: "Lists" },
    { icon: Users, label: "Leads" },
    { icon: MessageSquare, label: "Messages" },
    { icon: FileText, label: "Templates" },
    { icon: HelpCircle, label: "Support" },
    { icon: Settings, label: "Settings" },
  ]

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId) ? prev.filter((id) => id !== platformId) : [...prev, platformId],
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#7F56D9] rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <span className="font-semibold text-gray-900">Untitled UI</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item, index) => (
              <li key={index}>
                <button
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    item.active ? "bg-purple-50 text-purple-700" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">Olivia Rhye</div>
              <div className="text-sm text-gray-500">olivia@example.com</div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Search</h1>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Gift className="w-5 h-5 text-gray-600" />
              </Button>
              <Button variant="ghost" size="sm">
                <Bell className="w-5 h-5 text-gray-600" />
              </Button>
              <Button variant="ghost" size="sm">
                <Layers3 className="w-5 h-5 text-gray-600" />
              </Button>
            </div>
          </div>
        </header>

        {/* Search Content */}
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <h2 className="text-5xl font-semibold text-gray-900 mb-12">Hi Olivia, What do you want to find?</h2>

              <div className="relative mb-8">
                <Input
                  type="text"
                  placeholder='Enter keywords e.g. "Pop Artist, Jazz Music or Indie Pop"'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-20 pl-8 pr-48 text-lg border-gray-300 rounded-2xl shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />

                <div className="absolute right-4 top-4 flex items-center gap-3">
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-12 px-4 text-gray-600 hover:bg-gray-100 border border-gray-200 rounded-lg"
                      onMouseEnter={() => setShowResultsTooltip(true)}
                      onMouseLeave={() => setShowResultsTooltip(false)}
                    >
                      Results Limit
                      <Info className="w-4 h-4 ml-2 text-gray-400" />
                    </Button>

                    {showResultsTooltip && (
                      <div className="absolute right-0 top-14 w-80 bg-gray-900 text-white p-4 rounded-lg shadow-lg z-50">
                        <h4 className="font-semibold mb-2">Results Limit</h4>
                        <p className="text-sm">
                          Credit Limit controls the number of results generated in a single search. You can set any
                          limit between 1 and 500 results for each specific search, ensuring that you don't waste
                          credits on unnecessary results.
                        </p>
                      </div>
                    )}
                  </div>

                  <Button className="h-12 w-12 p-0 bg-[#7F56D9] hover:bg-purple-700 rounded-full">
                    <ArrowUp className="w-5 h-5 text-white" />
                  </Button>
                </div>
              </div>

              <div className="relative flex items-center justify-center gap-4 mb-8">
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => setShowPlatformDropdown(!showPlatformDropdown)}
                    className="h-12 w-12 p-0 bg-purple-100 hover:bg-purple-200 border border-purple-200 rounded-lg"
                  >
                    <Plus className="w-5 h-5 text-[#7F56D9]" />
                  </Button>

                  {showPlatformDropdown && (
                    <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-96 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-lg font-semibold text-gray-900">Platforms</h3>
                          <span className="text-sm text-gray-500">selected {selectedPlatforms.length}/6</span>
                        </div>

                        <div className="space-y-3">
                          {platforms.map((platform) => {
                            const IconComponent = platform.icon
                            return (
                              <button
                                key={platform.id}
                                onClick={() => togglePlatform(platform.id)}
                                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <IconComponent className={`w-5 h-5 ${platform.color}`} />
                                  <span className="font-medium text-gray-900">{platform.name}</span>
                                </div>
                                {selectedPlatforms.includes(platform.id) && (
                                  <Check className="w-5 h-5 text-[#7F56D9]" />
                                )}
                              </button>
                            )
                          })}
                        </div>

                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                          <label className="flex items-center gap-2 text-sm text-gray-600">
                            <input type="checkbox" className="rounded" />
                            Select All
                          </label>
                          <Button
                            size="sm"
                            className="bg-[#7F56D9] hover:bg-purple-700"
                            onClick={() => setShowPlatformDropdown(false)}
                          >
                            Apply
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="lg"
                  className="h-12 w-12 p-0 hover:bg-gray-100 border border-gray-200 rounded-lg"
                >
                  <Shuffle className="w-5 h-5 text-gray-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  className="h-12 w-12 p-0 hover:bg-gray-100 border border-gray-200 rounded-lg"
                  onClick={() => setShowImportModal(true)}
                >
                  <Upload className="w-5 h-5 text-gray-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => setShowFiltersModal(true)}
                  className="h-12 w-12 p-0 hover:bg-gray-100 border border-gray-200 rounded-lg"
                >
                  <Wand2 className="w-5 h-5 text-gray-600" />
                </Button>
              </div>

              {/* Platform Tags */}
              {selectedPlatforms.length > 0 && (
                <div className="flex flex-wrap gap-3 justify-center mb-12">
                  {selectedPlatforms.map((platformId) => {
                    const platform = platforms.find((p) => p.id === platformId)
                    const IconComponent = platform?.icon
                    return (
                      <div key={platformId} className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                        {IconComponent && <IconComponent className={`w-4 h-4 ${platform.color}`} />}
                        <span className="text-sm font-medium text-gray-700">{platform?.name}</span>
                        <button
                          onClick={() => togglePlatform(platformId)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}

              <div className="space-y-8 mt-16">
                <h3 className="text-2xl font-semibold text-gray-900">Advance Search Features</h3>

                <div className="max-w-3xl mx-auto space-y-6">
                  <div className="flex items-start justify-between p-8 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="text-left flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Deep Search</h4>
                      <p className="text-gray-600 leading-relaxed">
                        Explores more data layers and uncovers results that may be hidden in standard search. Ideal for
                        in-depth queries.
                      </p>
                    </div>
                    <Switch checked={deepSearch} onCheckedChange={setDeepSearch} className="ml-8 scale-125" />
                  </div>

                  <div className="flex items-start justify-between p-8 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="text-left flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">AI Semantic Search</h4>
                      <p className="text-gray-600 leading-relaxed">
                        Understands the meaning behind your query to deliver more relevant, intent-based results—even if
                        keywords don't match exactly.
                      </p>
                    </div>
                    <Switch checked={aiSearch} onCheckedChange={setAiSearch} className="ml-8 scale-125" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Data Filters Modal */}
      {showFiltersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Data Filters</h2>
                <p className="text-gray-600">
                  Filter your data to target the right influencers and make smarter outreach decisions.
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowFiltersModal(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex">
              {/* Platform Selection */}
              <div className="w-1/3 p-6 border-r border-gray-200">
                <div className="space-y-3">
                  {platforms.map((platform) => {
                    const IconComponent = platform.icon
                    return (
                      <button
                        key={platform.id}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                          platform.id === "instagram"
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <IconComponent className={`w-5 h-5 ${platform.color}`} />
                        <span className="font-medium">{platform.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Instagram Filters */}
              <div className="flex-1 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Instagram</h3>

                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Followers Range</label>
                      <div className="text-sm text-gray-500 mb-4">0 - 50,000,000</div>
                      <Slider
                        value={followersRange}
                        onValueChange={setFollowersRange}
                        max={50000000}
                        step={1000}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Following Range</label>
                      <div className="text-sm text-gray-500 mb-4">0 - 50,000,000</div>
                      <Slider
                        value={followingRange}
                        onValueChange={setFollowingRange}
                        max={50000000}
                        step={1000}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">Social Post Range</label>
                    <div className="text-sm text-gray-500 mb-4">0 - 50,000,000</div>
                    <Slider
                      value={postsRange}
                      onValueChange={setPostsRange}
                      max={50000000}
                      step={1000}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">Account Preference</label>
                    <div className="flex gap-3">
                      <Button className="bg-[#7F56D9] hover:bg-purple-700">
                        Private <Check className="w-4 h-4 ml-1" />
                      </Button>
                      <Button className="bg-[#7F56D9] hover:bg-purple-700">
                        Verified <Check className="w-4 h-4 ml-1" />
                      </Button>
                      <Button variant="outline">Professional</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-6 border-t border-gray-200">
              <Button variant="outline">Reset</Button>
              <div className="flex gap-3">
                <Button variant="outline">
                  Save/Load Template <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
                <Button className="bg-[#7F56D9] hover:bg-purple-700">Apply</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Import</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowImportModal(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Import a CSV file containing Instagram URLs to find their contact details
              </p>

              <div className="border-2 border-dashed border-purple-300 rounded-lg p-8 text-center mb-6">
                <Upload className="w-8 h-8 text-[#7F56D9] mx-auto mb-4" />
                <p className="text-[#7F56D9] font-medium mb-2">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500">CSV file format (max. 5 MB)</p>
                <div className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs mt-2">CSV</div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">CSV</div>
                    <div>
                      <div className="font-medium text-gray-900">New_Pop_Leads.csv</div>
                      <div className="text-sm text-gray-500">5 MB</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-[#7F56D9] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <div className="text-right text-sm text-gray-600">{uploadProgress}%</div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowImportModal(false)}>
                  Cancel
                </Button>
                <Button className="flex-1 bg-[#7F56D9] hover:bg-purple-700">Import</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
