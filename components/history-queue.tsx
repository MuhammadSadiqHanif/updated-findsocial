import { RefreshCw, ChevronDown, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "./status-badge"
import Instagram from "@/public/platform/instagram.png"
import Spotify from "@/public/platform/spotify.png"
import Image from "next/image"
// import { PlatformIcon } from "./components/platform-icon"

const historyData = [
  {
    keyword: "Jazz Music",
    timestamp: "30 sec ago",
    platforms: ["instagram", "spotify"],
    status: "in-progress",
  },
  {
    keyword: "Pop Artist",
    timestamp: "2 min ago",
    platforms: ["instagram", "spotify"],
    status: "pending",
  },
  {
    keyword: "American folk music",
    timestamp: "5 hr ago",
    platforms: ["instagram", "spotify"],
    status: "no-data",
  },
  {
    keyword: "Middle Eastern music",
    timestamp: "1 day ago",
    platforms: ["instagram", "spotify"],
    status: "error",
  },
  {
    keyword: "Indie Pop",
    timestamp: "4 days ago",
    platforms: ["instagram", "spotify"],
    status: "completed",
  },
]

export function HistoryQueue() {
  return (
    <Card className="bg-[#ffffff] border-[#eaecf0]">
      <CardHeader className="">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-[#101828]">History / Queue</CardTitle>
          <Button variant="ghost" size="icon" className="text-[#667085] hover:text-[#344054]">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Desktop View */}
        <div className="overflow-x-auto hidden lg:block">
          <table className="w-full">
            <thead className="border-b border-[#eaecf0] bg-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-[#667085] uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    Keyword
                    <ChevronDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-[#667085] uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    Platform
                    <ChevronDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-[#667085] uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    Status
                    <ChevronDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="text-right px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaecf0]">
              {historyData.map((item, index) => (
                <tr key={index} className="hover:bg-[#f9fafb] transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-[#101828]">{item.keyword}</p>
                      <p className="text-xs text-[#667085]">{item.timestamp}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Image src={Instagram} alt="Instagram" className="w-5 h-5"/>
                      <Image src={Spotify} alt="Instagram" className="w-5 h-5"/>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="icon" className="text-[#667085] hover:text-[#344054]">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile View */}
        <div className="block lg:hidden">
          <div className="space-y-4 p-4">
            {historyData.map((item, index) => (
              <Card key={index} className="bg-white shadow-md rounded-lg overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-[#101828]">{item.keyword}</p>
                      <p className="text-xs text-[#667085]">{item.timestamp}</p>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <Image src={Instagram} alt="Instagram" className="w-5 h-5"/>
                      <Image src={Spotify} alt="Spotify" className="w-5 h-5"/>
                    </div>
                    <Button variant="ghost" size="icon" className="text-[#667085] hover:text-[#344054]">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
