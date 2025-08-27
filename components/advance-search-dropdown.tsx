"use client"

interface AdvanceSearchDropdownProps {
  show: boolean
  settings: {
    deepSearch: boolean
    aiSemanticSearch: boolean
  }
  onToggle: (setting: "deepSearch" | "aiSemanticSearch") => void
}

export function AdvanceSearchDropdown({ show, settings, onToggle }: AdvanceSearchDropdownProps) {
  if (!show) return null

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-6 z-10">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Advance Search Features</h3>

      {/* Deep Search */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-900">Deep Search</span>
          <button
            onClick={() => onToggle("deepSearch")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
              settings.deepSearch ? "bg-[#7F56D9]" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.deepSearch ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
        <p className="text-sm text-gray-600">
          Explores more data layers and uncovers results that may be hidden in standard search. Ideal for in-depth
          queries.
        </p>
      </div>

      {/* AI Semantic Search */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-900">AI Semantic Search</span>
          <button
            onClick={() => onToggle("aiSemanticSearch")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
              settings.aiSemanticSearch ? "bg-[#7F56D9]" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.aiSemanticSearch ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
        <p className="text-sm text-gray-600">
          Understands the meaning behind your query to deliver more relevant, intent-based results—even if keywords
          don't match exactly.
        </p>
      </div>
    </div>
  )
}
