"use client";

import { ListDetailContent } from "@/components/list-detail-content";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/top-bar";
import { Menu } from "lucide-react";
import { use, useState } from "react";

export default function ListDetailPage({ params }: { params: { id: string } }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { id } = use(params);

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
      <div className="flex-1 flex flex-col lg:ml-72 w-full min-w-0">
        <TopBar title="List Detail">
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </TopBar>

        <div className="flex-1 p-6">
         <ListDetailContent listId={id} />
        </div>
      </div>
    </div>
  );
}
