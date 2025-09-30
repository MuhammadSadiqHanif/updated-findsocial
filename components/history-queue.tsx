import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Instagram from "@/public/platform/instagram.png";
import Spotify from "@/public/platform/spotify.png";
import { ChevronDown, Eye, RefreshCw } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StatusBadge } from "./status-badge";

export function HistoryQueue({ userId }: { userId: string | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tasks, setTasks] = useState<any>({
    processing_tasks: [],
    completed_tasks: [],
    failed_tasks: [],
    all_tasks: [],
    summary: {},
  });
  console.log(userId);

  useEffect(() => {
    if (userId === null) return;
    console.log("userId:", userId);

    setLoading(true);
    setError(null);
    fetch(`https://dev-api.findsocial.io/multi-platform-search-queue/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setTasks(data);
        } else {
          setError("No history found.");
        }
      })
      .catch(() => setError("Failed to fetch history."))
      .finally(() => setLoading(false));
  }, [userId]);

  // Helper to get status badge type
  const getStatus = (status: string) => {
    if (status === "Completed") return "completed";
    if (status === "Failed") return "error";
    if (status === "Processing") return "in-progress";
    return "pending";
  };

  // Helper to get platform icons
  const getPlatformIcons = (platform: string) => {
    if (platform.toLowerCase().includes("instagram"))
      return <Image src={Instagram} alt="Instagram" className="w-5 h-5" />;
    if (platform.toLowerCase().includes("spotify"))
      return <Image src={Spotify} alt="Spotify" className="w-5 h-5" />;
    return null;
  };

  // ...existing render code...

  return (
    <Card className="bg-[#ffffff] border-[#eaecf0]">
      <CardHeader className="">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-[#101828]">
            History / Queue
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="text-[#667085] hover:text-[#344054]"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="p-8 text-center text-[#667085]">Loading...</div>
        ) : error ? (
          <div className="p-8 text-center text-[#da1e28]">{error}</div>
        ) : (
          <>
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
                  {tasks.all_tasks && tasks.all_tasks.length > 0 ? (
                    tasks.all_tasks.map((item: any, index: number) => (
                      <tr
                        key={index}
                        className="hover:bg-[#f9fafb] transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-[#101828]">
                              {item.search}
                            </p>
                            <p className="text-xs text-[#667085]">
                              {item.timestamp
                                ? new Date(item.timestamp).toLocaleString()
                                : "-"}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getPlatformIcons(item.platform) || item.platform}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={getStatus(item.status)} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-[#667085] hover:text-[#344054]"
                            onClick={() => router.push(`/Leads?search=${encodeURIComponent(item.search)}`)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-8 text-[#667085]"
                      >
                        No history found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Mobile View */}
            <div className="block lg:hidden">
              <div className="space-y-4 p-4">
                {tasks.all_tasks && tasks.all_tasks.length > 0 ? (
                  tasks.all_tasks.map((item: any, index: number) => (
                    <Card
                      key={index}
                      className="bg-white shadow-md rounded-lg overflow-hidden"
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-[#101828]">
                              {item.search}
                            </p>
                            <p className="text-xs text-[#667085]">
                              {item.timestamp
                                ? new Date(item.timestamp).toLocaleString()
                                : "-"}
                            </p>
                          </div>
                          <StatusBadge status={getStatus(item.status)} />
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2">
                            {getPlatformIcons(item.platform) || item.platform}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-[#667085] hover:text-[#344054]"
                            onClick={() => router.push(`/Leads?search=${encodeURIComponent(item.search)}`)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8 text-[#667085]">
                    No history found.
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
