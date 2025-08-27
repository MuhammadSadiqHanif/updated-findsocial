"use client";

import { Button } from "@/components/ui/button";
import { Upload, Sliders, Settings } from "lucide-react";
import Plus from "@/public/main-icon/plus.png";
import PlusColor from "@/public/main-icon/plus-color.png";
import Magic from "@/public/main-icon/magic.png";
import MagicColor from "@/public/main-icon/magic-color.png";
import Filter from "@/public/main-icon/filter.png";
import Import from "@/public/main-icon/import.png";
import Image from "next/image";

interface ActionIconsProps {
  showPlatformsDropdown: boolean;
  setShowPlatformsDropdown: (show: boolean) => void;
  showAdvanceSearchDropdown: boolean;
  setShowAdvanceSearchDropdown: (show: boolean) => void;
  setShowImportModal: (show: boolean) => void;
  setShowFilterModal: (show: boolean) => void;
}

export function ActionIcons({
  showPlatformsDropdown,
  setShowPlatformsDropdown,
  showAdvanceSearchDropdown,
  setShowAdvanceSearchDropdown,
  setShowImportModal,
  setShowFilterModal,
}: ActionIconsProps) {
  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="sm"
        className={`w-10 h-10 p-0 ${
          showPlatformsDropdown
            ? "bg-purple-100 text-[#7F56D9]"
            : "hover:bg-gray-100"
        } cursor-pointer`}
        onClick={() => setShowPlatformsDropdown(!showPlatformsDropdown)}
      >
        <Image
          src={showPlatformsDropdown ? PlusColor : Plus}
          alt="Plus"
          className="w-4 h-4"
        />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="w-10 h-10 p-0 hover:bg-gray-100 cursor-pointer"
        onClick={() => setShowFilterModal(true)}
      >
       <Image
          src={Filter}
          alt="Plus"
          className="w-4 h-4"
        />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="w-10 h-10 p-0 hover:bg-gray-100 cursor-pointer"
        onClick={() => setShowImportModal(true)}
      >
       <Image
          src={Import}
          alt="Import"
          className="w-4 h-4"
        />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className={`w-10 h-10 p-0 ${
          showAdvanceSearchDropdown
            ? "bg-purple-100 text-[#7F56D9]"
            : "hover:bg-gray-100"
        } cursor-pointer`}
        onClick={() => setShowAdvanceSearchDropdown(!showAdvanceSearchDropdown)}
      >
        <Image
          src={showAdvanceSearchDropdown ? MagicColor : Magic}
          alt="Magic"
          className="w-4 h-4"
        />
      </Button>
    </div>
  );
}
