'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, CalendarDays, Car, Users,
  FileText, Settings, Wrench, Bell, Search,
  LogOut, Menu, X,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import {useAuth} from "../../lib/auth";
import {useDashboard} from "../../contexts/DashboardContext";
import {cn} from "../../lib/utils";


const NAV_ITEMS = [
  { href: '/dashboard',              label: 'Dashboard',     icon: LayoutDashboard, badge: null as number | null, group: 'main'   },
  { href: '/dashboard/appointments', label: 'Navbatlar',     icon: CalendarDays,    badge: null,                  group: 'main'   },
  { href: '/dashboard/vehicles',     label: 'Mashinalar',    icon: Car,             badge: null,                  group: 'main'   },
  { href: '/dashboard/masters',      label: 'Ustalar',       icon: Users,           badge: null,                  group: 'manage' },
  { href: '/dashboard/history',      label: 'Servis tarixi', icon: FileText,        badge: null,                  group: 'manage' },
  { href: '/dashboard/settings',     label: 'Sozlamalar',    icon: Settings,        badge: null,                  group: 'manage' },
];

const MOBILE_NAV = NAV_ITEMS.slice(0, 4);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, loading, logout } = useAuth();
  const { showSearch, setShowSearch, showNotifications, setShowNotifications } = useDashboard();
  const [open, setOpen] = useState(false);

  // FIX: redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
  }, [user, loading, router]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showNotifications && !(event.target as Element).closest('.notification-dropdown')) {
        setShowNotifications(false);
      }
      if (showSearch && !(event.target as Element).closest('.search-button')) {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications, showSearch, setShowNotifications, setShowSearch]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 bg-emerald-700 rounded-xl flex items-center justify-center">
            <Wrench size={18} className="text-white" />
          </div>
          <p className="text-sm text-gray-400">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  const initials = user.fullName
    ?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() ?? 'U';

  const mainItems   = NAV_ITEMS.filter(n => n.group === 'main');
  const manageItems = NAV_ITEMS.filter(n => n.group === 'manage');

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* ── DESKTOP SIDEBAR ───────────────────────────────────────── */}
      <aside className="hidden lg:flex w-[220px] shrink-0 flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
        <SidebarLogo />
        <nav className="flex-1 px-2.5 py-3 overflow-y-auto">
          <NavGroup label="Asosiy"     items={mainItems}   pathname={pathname} />
          <NavGroup label="Boshqaruv" items={manageItems} pathname={pathname} />
        </nav>
        <SidebarUser initials={initials} user={user} onLogout={logout} />
      </aside>

      {/* ── MOBILE DRAWER ─────────────────────────────────────────── */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />
      )}
      <aside className={cn(
        'fixed top-0 left-0 z-50 h-full w-[260px] flex flex-col lg:hidden',
        'bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800',
        'transition-transform duration-300',
        open ? 'translate-x-0' : '-translate-x-full',
      )}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-emerald-700 rounded-lg flex items-center justify-center">
              <Wrench size={13} className="text-white" />
            </div>
            <span className="text-[15px] font-medium text-gray-900 dark:text-gray-100">AutoCare</span>
          </div>
          <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
            <X size={18} />
          </button>
        </div>
        <nav className="flex-1 px-2.5 py-3 overflow-y-auto">
          <NavGroup label="Asosiy"     items={mainItems}   pathname={pathname} onClose={() => setOpen(false)} />
          <NavGroup label="Boshqaruv" items={manageItems} pathname={pathname} onClose={() => setOpen(false)} />
        </nav>
        <SidebarUser initials={initials} user={user} onLogout={logout} />
      </aside>

      {/* ── MAIN ──────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 lg:px-6 flex items-center gap-3 shrink-0">
          <button onClick={() => setOpen(true)} className="lg:hidden w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500">
            <Menu size={16} />
          </button>
          <div className="flex lg:hidden items-center gap-2 mr-auto">
            <div className="w-6 h-6 bg-emerald-700 rounded-md flex items-center justify-center">
              <Wrench size={12} className="text-white" />
            </div>
            <span className="text-[14px] font-medium text-gray-900 dark:text-gray-100">AutoCare</span>
          </div>
          <div className="hidden lg:block flex-1">
            <h1 className="text-[16px] font-medium text-gray-900 dark:text-gray-100 tracking-tight leading-none">Dashboard</h1>
            <p className="text-[12px] text-gray-400 mt-0.5">Bugun — Umumiy ko'rinish</p>
          </div>
          <div className="flex items-center gap-2 ml-auto lg:ml-0">
            <button 
              onClick={() => setShowSearch(!showSearch)}
              className="search-button w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <Search size={15} />
            </button>
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="notification-dropdown relative w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Bell size={15} />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border-[1.5px] border-white dark:border-gray-900 pointer-events-none" />
              </button>
              {showNotifications && (
                <div className="absolute right-0 top-10 w-80 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg z-50">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Bildirishnomalar</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <p className="text-sm text-gray-900 dark:text-gray-100">Yangi navbat qo'shildi</p>
                      <p className="text-xs text-gray-500">Jasur Toshmatov - Toyota Cobalt</p>
                      <p className="text-xs text-gray-400">5 daqiqa oldin</p>
                    </div>
                    <div className="p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <p className="text-sm text-gray-900 dark:text-gray-100">Ta'mirlash tugadi</p>
                      <p className="text-xs text-gray-500">Malika Yusupova - Chevrolet Malibu</p>
                      <p className="text-xs text-gray-400">1 soat oldin</p>
                    </div>
                    <div className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <p className="text-sm text-gray-900 dark:text-gray-100">To'lov amalga oshirildi</p>
                      <p className="text-xs text-gray-500">Bobur Aliyev - Nexia 3</p>
                      <p className="text-xs text-gray-400">2 soat oldin</p>
                    </div>
                  </div>
                  <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                    <button className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">
                      Barcha bildirishnomalarni ko'rish
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="hidden lg:block w-px h-5 bg-gray-200 dark:bg-gray-700" />
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-[12px] font-medium text-emerald-800 dark:text-emerald-200 cursor-pointer select-none">
              {initials}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 pb-24 lg:pb-6 overflow-auto">
          {children}
        </main>

        {/* ── MOBILE BOTTOM NAV ─────────────────────────────────── */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-around px-2 py-2">
            {MOBILE_NAV.map(item => {
              const Icon   = item.icon;
              const active = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link key={item.href} href={item.href} className={cn(
                  'flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl min-w-[56px] transition-colors',
                  active ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'
                )}>
                  <div className="relative">
                    <Icon size={22} />
                    {item.badge && (
                      <span className="absolute -top-1.5 -right-2 bg-emerald-700 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-medium">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-medium leading-none">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}

function SidebarLogo() {
  return (
    <div className="px-5 py-5 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-emerald-700 rounded-lg flex items-center justify-center shrink-0">
          <Wrench size={15} className="text-white" />
        </div>
        <div>
          <p className="text-[15px] font-medium text-gray-900 dark:text-gray-100 tracking-tight leading-none">AutoCare</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Ecosystem v1.0</p>
        </div>
      </div>
    </div>
  );
}

function SidebarUser({ initials, user, onLogout }: { initials: string; user: any; onLogout: () => void }) {
  return (
    <div className="px-4 py-3.5 border-t border-gray-200 dark:border-gray-800 flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-[12px] font-medium text-emerald-800 dark:text-emerald-200 shrink-0">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-gray-900 dark:text-gray-100 truncate">{user.fullName || user.email}</p>
        <p className="text-[11px] text-gray-400">{user.role}</p>
      </div>
      <button onClick={onLogout} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1" title="Chiqish">
        <LogOut size={14} />
      </button>
    </div>
  );
}

function NavGroup({ label, items, pathname, onClose }: {
  label: string; items: typeof NAV_ITEMS; pathname: string; onClose?: () => void;
}) {
  return (
    <div className="mb-1">
      <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest px-2.5 py-1.5 mt-2">{label}</p>
      <div className="space-y-0.5">
        {items.map(item => {
          const Icon   = item.icon;
          // FIX: also match sub-pages (e.g. /dashboard/appointments/123)
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link key={item.href} href={item.href} onClick={onClose}
                  className={cn(
                    'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13.5px] transition-all',
                    active
                      ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-medium'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                  )}>
              <Icon size={15} className={cn('shrink-0', active ? 'text-emerald-700 dark:text-emerald-400' : '')} />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="bg-emerald-700 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium leading-none">{item.badge}</span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
