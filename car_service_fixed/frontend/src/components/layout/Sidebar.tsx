import React from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CarFront,
  Users,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  items: SidebarItem[];
  onLogout: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ items, onLogout, isOpen = true, onClose }, ref) => {
    const pathname = usePathname();

    return (
      <div
        ref={ref}
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-[#E8E8E8] transition-transform duration-300 lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#E8E8E8] px-6 py-4">
            <h1 className="text-xl font-bold text-[#0F6E56]">AutoCare</h1>
            {onClose && (
              <button
                onClick={onClose}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
            {items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-4 py-3 font-medium transition-colors duration-200',
                    isActive
                      ? 'bg-[#0F6E56]/10 text-[#0F6E56]'
                      : 'text-[#666] hover:bg-[#F5F5F5] hover:text-[#1A1A1A]'
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-[#E8E8E8] space-y-2 p-4">
            <button
              className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-[#666] hover:bg-[#F5F5F5] hover:text-[#1A1A1A] transition-colors duration-200"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </button>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
);

Sidebar.displayName = 'Sidebar';
