"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HelpCircle, Settings } from "lucide-react";
import Menu from "@/public/siderbar-icon/menu.png";
import Search from "@/public/siderbar-icon/search.png";
import Home from "@/public/siderbar-icon/home.png";
import List from "@/public/siderbar-icon/list.png";
import Users from "@/public/siderbar-icon/leads.png";
import Message from "@/public/siderbar-icon/message.png";
import Template from "@/public/siderbar-icon/template.png";
import Support from "@/public/siderbar-icon/support.png";
import Setting from "@/public/siderbar-icon/settings.png";
import RightArrow from "@/public/siderbar-icon/right-arrow.png";
import Image from "next/image";

export function Sidebar() {
  const sidebarItems = [
    { icon: Search, label: "Search", active: true },
    { icon: Home, label: "Home" },
    { icon: List, label: "Lists" },
    { icon: Users, label: "Leads" },
    { icon: Message, label: "Messages" },
    { icon: Template, label: "Templates" },
  ];

  const bottomItems = [
    { icon: Support, label: "Support" },
    { icon: Setting, label: "Settings" },
  ];

  return (
    <div className="w-72 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#7F56D9] rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
          <span className="font-semibold text-sidebar-foreground">
            Untitled UI
          </span>
          <Button variant="ghost" size="sm" className="ml-auto cursor-pointer">
            <Image src={Menu} alt="Menu" className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-2">
        <nav className="space-y-2">
          {sidebarItems.map((item) => (
            <Button
              key={item.label}
              variant={item.active ? "secondary" : "ghost"}
              className={`w-full justify-start gap-3 ${
                item.active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              } cursor-pointer`}
            >
              <Image src={item.icon} alt={item.label} className="w-5 h-5" />
              {item.label}
            </Button>
          ))}
        </nav>

        {/* Bottom Navigation */}
      </div>

      {/* User Profile */}
      <div>
        <div className="mt-auto p-2">
          <nav className="space-y-2">
            {bottomItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer"
              >
                <Image src={item.icon} alt={item.label} className="w-5 h-5" />
                {item.label}
              </Button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src="/professional-woman-avatar.png" />
              <AvatarFallback>OR</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground">
                Olivia Rhye
              </p>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                olivia@example.com
              </p>
            </div>
            <Button variant="ghost" size="sm">
              <Image src={RightArrow} alt="right-arrow" className="w-3 h-3 cursor-pointer" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
