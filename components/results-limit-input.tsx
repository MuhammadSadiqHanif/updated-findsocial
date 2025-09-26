"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Info, ArrowUp, Loader2 } from "lucide-react";

interface ResultsLimitInputProps {
  resultsLimit: string;
  setResultsLimit: (limit: string) => void;
  onSearch?: () => void;
  isLoading?: boolean;
  searchQuery: string;
}

export function ResultsLimitInput({
  resultsLimit,
  setResultsLimit,
  onSearch,
  isLoading = false,
  searchQuery,
}: ResultsLimitInputProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="flex items-center gap-3 w-full md:w-auto">
      <div className="relative flex-grow md:flex-grow-0">
        <Input
          type="text"
          placeholder="Results Limit"
          value={resultsLimit}
          onChange={(e) => setResultsLimit(e.target.value)}
          className="w-full md:w-36 h-10 px-3 text-sm border border-input focus:border-purple-500 focus:ring-purple-500 rounded-lg pr-8"
        />
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 p-0 hover:bg-transparent"
          onClick={() => setShowTooltip(!showTooltip)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <Info className="w-4 h-4 text-gray-400" />
        </Button>

        {/* Tooltip */}
        {showTooltip && (
          <>
            {/* <div
              className="fixed inset-0 z-40"
              onClick={() => setShowTooltip(false)}
            ></div> */}
            <div className="absolute bottom-full mb-2 w-80 max-w-[90vw] bg-gray-900 text-white text-sm rounded-lg p-4 shadow-lg z-50 left-1/2 -translate-x-1/2 md:left-auto md:right-0 md:translate-x-0">
              <div className="font-semibold mb-2">Results Limit</div>
              <div className="text-gray-300 leading-relaxed">
                Credit Limit controls the number of results generated in a
                single search. You can set any limit between 1 and 500 results
                for each specific search, ensuring that you don't waste credits
                on unnecessary results.
              </div>
              {/* Tooltip arrow */}
              <div className="absolute top-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-gray-900 left-1/2 -translate-x-1/2 md:left-auto md:right-4 md:translate-x-0"></div>
            </div>
          </>
        )}
      </div>
      {onSearch && (
        <Button
          onClick={onSearch}
          size="sm"
          className="bg-[#7F56D9] hover:bg-[#7F56D9] cursor-pointer text-white rounded-full w-10 h-10 p-0"
          disabled={!searchQuery.trim() || isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4" />
          ) : (
            <ArrowUp className="w-4 h-4" />
          )}
        </Button>
      )}
    </div>
  );
}
