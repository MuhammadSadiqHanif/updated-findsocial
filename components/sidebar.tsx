'use client';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HelpCircle, Settings } from 'lucide-react';
import Menu from '@/public/siderbar-icon/menu.png';
import Search from '@/public/siderbar-icon/search.png';
import Home from '@/public/siderbar-icon/home.png';
import List from '@/public/siderbar-icon/list.png';
import Users from '@/public/siderbar-icon/leads.png';
import Message from '@/public/siderbar-icon/message.png';
import Template from '@/public/siderbar-icon/template.png';
import Support from '@/public/siderbar-icon/support.png';
import Setting from '@/public/siderbar-icon/settings.png';
import RightArrow from '@/public/siderbar-icon/right-arrow.png';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useUserInfo } from '@/hooks/use-user-info';

export function Sidebar({ onClose }: { onClose?: () => void}) {
   const { userId, isLoading, apiCallWithUserId } = useAuth();
    const { userInfo, loading, error, refetch } = useUserInfo(userId)
  const pathname = usePathname();
  const router = useRouter();
  const sidebarItems = [
    { icon: Search, label: 'Search', href: '/Dashboard' },
    { icon: Home, label: 'Home', href: '/Home' },
    { icon: List, label: 'Lists', href: '/Lists' },
    { icon: Users, label: 'Leads', href: '/Leads' },
    { icon: Message, label: 'Messages', href: '/Messages' },
    { icon: Template, label: 'Templates', href: '/Templates' },
  ];

  const bottomItems = [
    { icon: Support, label: 'Support', href: '/Support' },
    { icon: Setting, label: 'Settings', href: '/Settings' },
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="w-72 bg-sidebar border-r border-sidebar-border flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#7F56D9] rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
          <span className="font-semibold text-sidebar-foreground">
            Untitled UI
          </span>
          <Button variant="ghost" size="sm" className="ml-auto cursor-pointer" onClick={onClose}>
            <Image src={Menu} alt="Menu" className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-2">
        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Button
                key={item.label}
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                } cursor-pointer`}
                onClick={() => handleNavigation(item.href)}
              >
                <Image src={item.icon} alt={item.label} className="w-5 h-5" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </div>

      {/* User Profile */}
      <div>
        <div className="mt-auto p-2">
          <nav className="space-y-2">
            {bottomItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Button
                  key={item.label}
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start gap-3 ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  } cursor-pointer`}
                  onClick={() => handleNavigation(item.href)}
                >
                  <Image src={item.icon} alt={item.label} className="w-5 h-5" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={userInfo?.picture} alt={userInfo?.name} />
              {/* <AvatarFallback>OR</AvatarFallback> */}
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground">
               {userInfo?.name}
              </p>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                {userInfo?.email}
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
