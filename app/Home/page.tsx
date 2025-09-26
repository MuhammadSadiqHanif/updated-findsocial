"use client";

import { HistoryQueue } from "@/components/history-queue";
import { MetricsCards } from "@/components/metrics-cards";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/top-bar";
import { useAuth } from "@/hooks/use-auth";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
   const { userId } = useAuth();

  return (
    <div className="flex h-screen bg-background">
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setSidebarOpen(false)}
          ></div>
          <div className="absolute top-0 left-0 h-full">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-72">
        <TopBar title="Home">
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </TopBar>

        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <MetricsCards userId={userId}/>
            </div>
            <div className="lg:col-span-2">
              <HistoryQueue userId={userId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
