'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HelpCircle, Settings, LogOut, User, ChevronUp, ChevronDown ,TicketPlusIcon} from 'lucide-react';
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
import { logout } from '@/lib/auth';

export function Sidebar({ onClose }: { onClose?: () => void}) {
   const { userId, isLoading, apiCallWithUserId } = useAuth();
    const { userInfo, loading, error, refetch } = useUserInfo(userId || '');
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
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

  const handleLogout = async () => {
    try {
      // Clear local authentication data and redirect to login
      logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback: still try to logout even if there's an error
      logout();
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed left-0 top-0 w-72 bg-sidebar border-r border-sidebar-border flex flex-col h-screen z-40">
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

      {/* Bottom Items and User Profile */}
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

        {/* User Profile with Dropdown */}
        <div className="p-4 border-t border-sidebar-border relative" ref={dropdownRef}>
          <div 
            className="flex items-center gap-3 cursor-pointer hover:bg-sidebar-accent/50 rounded-lg p-2 -m-2 transition-colors"
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
          >
            <Avatar className="w-8 h-8">
              <AvatarImage src={userInfo?.picture} alt={userInfo?.name} />
              <AvatarFallback>
                {userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground">
                {userInfo?.name || 'User'}
              </p>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                {userInfo?.email || 'user@example.com'}
              </p>
            </div>
            <div className="flex items-center">
              {isUserDropdownOpen ? (
                <ChevronUp className="w-4 h-4 text-sidebar-foreground/60" />
              ) : (
                <ChevronDown className="w-4 h-4 text-sidebar-foreground/60" />
              )}
            </div>
          </div>

          {/* Dropdown Menu */}
          {isUserDropdownOpen && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 sm:left-2 sm:right-2">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {userInfo?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {userInfo?.email || 'user@example.com'}
                </p>
              </div>
              
              <div className="py-1">
                <button
                  onClick={() => {
                    handleNavigation('/Profile');
                    setIsUserDropdownOpen(false);
                  }}
                  className="cursor-pointer w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">View Profile</span>
                </button>
                
                <button
                  onClick={() => {
                    handleNavigation('/Settings');
                    setIsUserDropdownOpen(false);
                  }}
                  className="cursor-pointer w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">Settings</span>
                </button>
                
                <button
                  onClick={() => {
                    handleNavigation('/PlanAndBilling');
                    setIsUserDropdownOpen(false);
                  }}
                  className="cursor-pointer w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <TicketPlusIcon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">Plan And Billing</span>
                </button>
              </div>
              
              <div className="border-t border-gray-100 pt-1">
                <button
                  onClick={() => {
                    handleLogout();
                    setIsUserDropdownOpen(false);
                  }}
                  className="cursor-pointer w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
