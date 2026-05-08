'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Sidebar } from '@/components/layout/Sidebar';
import { TabBar } from '@/components/layout/TabBar';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  CarFront,
  History,
  Calendar,
  Menu,
  Plus,
  Navigation,
} from 'lucide-react';

export default function DriverDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarItems = [
    { label: 'Dashboard', href: '/dashboard/driver', icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: 'My Garage', href: '/dashboard/driver/garage', icon: <CarFront className="h-5 w-5" /> },
    { label: 'Appointments', href: '/dashboard/driver/appointments', icon: <Calendar className="h-5 w-5" /> },
    { label: 'Service History', href: '/dashboard/driver/history', icon: <History className="h-5 w-5" /> },
  ];

  const tabBarItems = [
    { label: 'Home', href: '/dashboard/driver', icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: 'Garage', href: '/dashboard/driver/garage', icon: <CarFront className="h-5 w-5" /> },
    { label: 'History', href: '/dashboard/driver/history', icon: <History className="h-5 w-5" /> },
    { label: 'More', href: '/dashboard/driver/settings', icon: <Menu className="h-5 w-5" /> },
  ];

  return (
    <ProtectedRoute requiredRole="DRIVER">
      <div className="flex h-screen bg-[#F9F9F9]">
        <Sidebar
          items={sidebarItems}
          onLogout={() => {
            logout();
            router.push('/auth/login');
          }}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-auto pb-20 md:pb-0">
          {/* Header */}
          <div className="sticky top-0 z-20 border-b border-[#E8E8E8] bg-white">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden text-gray-600"
                >
                  <Menu className="h-6 w-6" />
                </button>
                <h1 className="text-2xl font-bold text-[#1A1A1A]">My Dashboard</h1>
              </div>
              <div className="text-sm text-gray-600">
                Welcome, {user?.fullName}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#0F6E56]">1</div>
                    <div className="text-sm text-gray-600 mt-1">Active Vehicles</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#0F6E56]">0</div>
                    <div className="text-sm text-gray-600 mt-1">Pending Services</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#0F6E56]">5</div>
                    <div className="text-sm text-gray-600 mt-1">Service History</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* My Garage Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>My Garage</CardTitle>
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Vehicle
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border border-[#E8E8E8] rounded-lg hover:border-[#0F6E56]/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-[#0F6E56]/10 rounded-lg flex items-center justify-center">
                        <CarFront className="h-6 w-6 text-[#0F6E56]" />
                      </div>
                      <div>
                        <div className="font-semibold text-[#1A1A1A]">Nexia A6 (2020)</div>
                        <div className="text-sm text-gray-600">Plate: 01AA001UZ</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Navigation className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Services */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <p>No upcoming services scheduled</p>
                  <Button variant="secondary" size="sm" className="mt-4">
                    Find a Workshop
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <TabBar items={tabBarItems} />
      </div>
    </ProtectedRoute>
  );
}
