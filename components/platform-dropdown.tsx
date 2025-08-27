"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface Platform {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface PlatformDropdownProps {
  show: boolean;
  platforms: Platform[];
  selectedPlatforms: Record<string, boolean>;
  onPlatformToggle: (platformId: string) => void;
  onClose: () => void;
}

export function PlatformDropdown({
  show,
  platforms,
  selectedPlatforms,
  onPlatformToggle,
  onClose,
}: PlatformDropdownProps) {
  if (!show) return null;

  const selectedCount = Object.values(selectedPlatforms).filter(Boolean).length;
  const totalCount = platforms.length;

  const handleSelectAll = () => {
    const allSelected = selectedCount === totalCount;
    platforms.forEach((platform) => {
      if (selectedPlatforms[platform.id] !== !allSelected) {
        onPlatformToggle(platform.id);
      }
    });
  };

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-900">Platforms</h3>
        <span className="text-xs text-gray-500">
          selected {selectedCount}/{totalCount}
        </span>
      </div>

      {/* Platform List */}
      <div className="space-y-3 mb-4">
        {platforms.map((platform) => (
          <div
            key={platform.id}
            className="flex items-center justify-between py-1"
          >
            <div className="flex items-center gap-3">
              {platform.icon}
              <span className="text-sm text-gray-900">{platform.label}</span>
            </div>
            <button
              onClick={() => onPlatformToggle(platform.id)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                selectedPlatforms[platform.id]
                  ? "bg-[#7F56D9] border-[#7F56D9]"
                  : "border-gray-300 hover:border-[#7F56D9]"
              } cursor-pointer`}
            >
              {selectedPlatforms[platform.id] && (
                <Check className="w-3 h-3 text-white" />
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <button
            onClick={handleSelectAll}
            className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
              selectedCount === totalCount
                ? "bg-[#7F56D9] border-[#7F56D9]"
                : "border-gray-300 hover:border-[#7F56D9]"
            } cursor-pointer`}
          >
            {selectedCount === totalCount && (
              <Check className="w-2.5 h-2.5 text-white" />
            )}
          </button>
          <label
            className="text-sm text-gray-700 cursor-pointer"
            onClick={handleSelectAll}
          >
            Select All
          </label>
        </div>
        <Button
          size="sm"
          className="bg-[#7F56D9] hover:bg-[#7F56D9] text-white px-4 py-1.5 text-sm rounded-lg cursor-pointer"
          onClick={onClose}
        >
          Apply
        </Button>
      </div>
    </div>
  );
}
