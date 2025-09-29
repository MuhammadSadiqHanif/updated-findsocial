"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Gift from "@/public/top-bar/gift.png"
import Bell from "@/public/top-bar/bell.png"
import Layers from "@/public/top-bar/layers.png"
import Image from "next/image"
import type React from "react"
import { useAuth } from "@/hooks/use-auth"

interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  notification_type: 'success' | 'info' | 'warning' | 'error';
  category: string;
  endpoint: string;
  metadata: any;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

interface NotificationStats {
  total_notifications: number;
  unread_count: number;
  notifications_by_type: {
    [key: string]: number;
  };
  notifications_by_category: {
    [key: string]: number;
  };
  recent_notifications: Notification[];
}

export function TopBar({ children, title }: { children?: React.ReactNode, title: string }) {
  const { userId, apiCall } = useAuth();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationStats | null>(null);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`https://dev-api.findsocial.io/notifications/user-notifications/stats?auth0_id=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    if (!userId) return;
    
    try {
      const response = await fetch(`https://dev-api.findsocial.io/notifications/${notificationId}/read?auth0_id=${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_read: true
        })
      });
      
      if (response.ok) {
        // Update local state to reflect the change
        if (notifications) {
          const updatedNotifications = {
            ...notifications,
            unread_count: Math.max(0, notifications.unread_count - 1),
            recent_notifications: notifications.recent_notifications.map(notif => 
              notif.id === notificationId 
                ? { ...notif, is_read: true }
                : notif
            )
          };
          setNotifications(updatedNotifications);
        }
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (isNotificationOpen && userId) {
      fetchNotifications();
    }
  }, [isNotificationOpen, userId]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      case 'info':
        return '💡';
      default:
        return '�';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'list':
        return '📋';
      case 'search':
        return '🔍';
      default:
        return '📢';
    }
  };

  const formatNotificationTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      
      return date.toLocaleDateString();
    } catch {
      return 'Recently';
    }
  };
  return (
    <div className="h-16 border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        {children}
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="cursor-pointer">
          <Image src={Gift} alt="Gift" className="w-4 h-4 " />
        </Button>
        
        {/* Notification Bell with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="relative cursor-pointer"
          >
            <Image src={Bell} alt="Bell" className="w-4 h-4" />
            {notifications && notifications.unread_count > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs"
              >
                {notifications.unread_count > 9 ? '9+' : notifications.unread_count}
              </Badge>
            )}
          </Button>

          {/* Notification Dropdown */}
          {isNotificationOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  {notifications && (
                    <Badge variant="secondary" className="text-xs">
                      {notifications.unread_count} unread
                    </Badge>
                  )}
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#7F56D9] mx-auto"></div>
                    <p className="text-sm text-gray-500 mt-2">Loading notifications...</p>
                  </div>
                ) : notifications && notifications.recent_notifications.length > 0 ? (
                  notifications.recent_notifications.map((notification: Notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${
                        !notification.is_read ? 'bg-blue-50/30' : ''
                      }`}
                      onClick={() => {
                        if (!notification.is_read) {
                          markAsRead(notification.id);
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-1">
                          <span className="text-lg">{getNotificationIcon(notification.notification_type)}</span>
                          <span className="text-sm">{getCategoryIcon(notification.category)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {notification.title}
                            </p>
                            {!notification.is_read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-gray-400">
                              {formatNotificationTime(notification.created_at)}
                            </p>
                            <Badge variant="outline" className="text-xs capitalize">
                              {notification.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <div className="text-4xl mb-2">🔔</div>
                    <p className="text-gray-500 text-sm">No notifications yet</p>
                    <p className="text-gray-400 text-xs mt-1">You'll see notifications here when they arrive</p>
                  </div>
                )}
              </div>

              {notifications && notifications.recent_notifications.length > 0 && (
                <div className="p-3 border-t border-gray-100">
                  <Button variant="ghost" size="sm" className="w-full text-xs">
                    View All Notifications
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        <Button variant="ghost" size="sm" className="cursor-pointer">
          <Image src={Layers} alt="Layers" className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
