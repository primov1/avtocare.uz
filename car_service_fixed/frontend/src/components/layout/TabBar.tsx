import React from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface TabBarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface TabBarProps {
  items: TabBarItem[];
}

export const TabBar = React.forwardRef<HTMLDivElement, TabBarProps>(
  ({ items }, ref) => {
    const pathname = usePathname();

    return (
      <div
        ref={ref}
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#E8E8E8] bg-white md:hidden"
      >
        <div className="flex items-center justify-around">
          {items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 px-4 py-3 text-xs font-medium transition-colors duration-200 flex-1',
                  isActive
                    ? 'text-[#0F6E56]'
                    : 'text-[#999] hover:text-[#1A1A1A]'
                )}
              >
                {item.icon}
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }
);

TabBar.displayName = 'TabBar';
