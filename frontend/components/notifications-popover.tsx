'use client';

import { Bell, CheckCircle, WarningCircle, Info, EnvelopeSimple, UserCircle } from '@phosphor-icons/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { notificationService } from '@/app/services/api';
import { useRouter } from 'next/navigation';

function getNotificationIcon(type: string) {
  switch (type) {
    case 'approved':
      return <CheckCircle size={20} className="text-[#ffd666]" />;
    case 'rejected':
      return <WarningCircle size={20} className="text-[#d5233b]" />;
    case 'approval_required':
      return <UserCircle size={20} className="text-[#006c9c]" />;
    case 'obf_created':
      return <Info size={20} className="text-[#006c9c]" />;
    case 'comment':
      return <EnvelopeSimple size={20} className="text-gray-500" />;
    default:
      return <Info size={20} className="text-gray-400" />;
  }
}

function toSentenceCase(str: string) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ').toLowerCase();
}

export function NotificationsPopover() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationService.getAll(true);
      setNotifications(res.data);
      setUnreadCount(res.data.length);
    } catch (e) {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(); // Fetch on mount (user logs in)
  }, []);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) fetchNotifications();
  };

  const handleMarkAllRead = async () => {
    await Promise.all(notifications.map((n: any) => notificationService.markRead(n.id)));
    setNotifications([]);
    setUnreadCount(0);
  };

  const handleNotificationClick = async (n: any) => {
    await notificationService.markRead(n.id);
    setNotifications((prev) => prev.map((n) => n.id === n.id ? { ...n, read: true } : n));
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild className='relative'>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 h-2 w-2 bg-[#d5233b] text-white rounded-full text-xs px-0 py-0.5"></span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-3 pt-3 pb-1">
          <DropdownMenuLabel className="text-base font-semibold">Notifications</DropdownMenuLabel>
          {notifications.length > 0 && (
            <button
              className="text-xs text-white bg-[#d5233b] py-2 px-2 rounded-md hover:underline font-medium"
              onClick={handleMarkAllRead}
            >
              Mark all as read
            </button>
          )}
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-[300px] overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">No unread notifications</div>
          ) : notifications.map((n) => (
            <DropdownMenuItem
              key={n.id}
              className={`group cursor-pointer flex items-start gap-3 rounded-lg border border-transparent hover:border-[#006c9c]/20 hover:bg-[#006c9c]/5 transition px-3 py-2 mb-1 bg-[#006c9c]/2`}
              onClick={() => handleNotificationClick(n)}
            >
              <div className="pt-0.5">{getNotificationIcon(n.type)}</div>
              <div className="flex flex-col gap-0.5 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{toSentenceCase(n.type)}</p>
                <p className="text-xs text-gray-600">
                  {toSentenceCase(n.message)}
                  {n.project_name && (
                    <span className="ml-1 text-[#006c9c]">
                      ({n.project_name} - {n.project_code})
                    </span>
                  )}
                </p>
              </div>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 