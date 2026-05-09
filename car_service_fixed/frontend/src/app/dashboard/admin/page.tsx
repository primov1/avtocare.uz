'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Sidebar } from '@/components/layout/Sidebar';
import { TabBar } from '@/components/layout/TabBar';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
export const dynamic = 'force-dynamic';
import {
  LayoutDashboard,
  Users,
  MapPin,
  BarChart3,
  CheckCircle,
  XCircle,
  Menu,
  TrendingUp,
  Building,
} from 'lucide-react';

export default function SuperAdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarItems = [
    { label: 'Dashboard', href: '/dashboard/admin', icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: 'Workshops', href: '/dashboard/admin/workshops', icon: <Building className="h-5 w-5" /> },
    { label: 'Analytics', href: '/dashboard/admin/analytics', icon: <BarChart3 className="h-5 w-5" /> },
    { label: 'Users', href: '/dashboard/admin/users', icon: <Users className="h-5 w-5" /> },
  ];

  const tabBarItems = [
    { label: 'Home', href: '/dashboard/admin', icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: 'Workshops', href: '/dashboard/admin/workshops', icon: <Building className="h-5 w-5" /> },
    { label: 'Analytics', href: '/dashboard/admin/analytics', icon: <BarChart3 className="h-5 w-5" /> },
    { label: 'More', href: '/dashboard/admin/settings', icon: <Menu className="h-5 w-5" /> },
  ];

  return (
    <ProtectedRoute requiredRole="SUPER_ADMIN">
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
                <h1 className="text-2xl font-bold text-[#1A1A1A]">Super Admin Dashboard</h1>
              </div>
              <div className="text-sm text-gray-600">
                Welcome, {user?.fullName}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Global Stats */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#0F6E56]">24</div>
                    <div className="text-sm text-gray-600 mt-1">Active Workshops</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#0F6E56]">1,247</div>
                    <div className="text-sm text-gray-600 mt-1">Total Users</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#0F6E56]">8,932</div>
                    <div className="text-sm text-gray-600 mt-1">Services Completed</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#0F6E56]">₩2.4M</div>
                    <div className="text-sm text-gray-600 mt-1">Monthly Revenue</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Workshop Applications */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Workshop Applications</CardTitle>
                  <Button size="sm" variant="secondary">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border border-[#E8E8E8] rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-[#0F6E56]/10 rounded-lg flex items-center justify-center">
                        <Building className="h-6 w-6 text-[#0F6E56]" />
                      </div>
                      <div>
                        <div className="font-semibold text-[#1A1A1A]">AutoCare Tashkent</div>
                        <div className="text-sm text-gray-600">Tashkent, Uzbekistan</div>
                        <div className="text-xs text-gray-500">Applied 2 days ago</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="text-green-600 hover:bg-green-50">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50">
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-[#E8E8E8] rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-[#0F6E56]/10 rounded-lg flex items-center justify-center">
                        <Building className="h-6 w-6 text-[#0F6E56]" />
                      </div>
                      <div>
                        <div className="font-semibold text-[#1A1A1A]">Samarkand Auto Service</div>
                        <div className="text-sm text-gray-600">Samarkand, Uzbekistan</div>
                        <div className="text-xs text-gray-500">Applied 5 days ago</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="text-green-600 hover:bg-green-50">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50">
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border border-[#E8E8E8] rounded-lg">
                    <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">New workshop approved</div>
                      <div className="text-xs text-gray-500">AutoCare Tashkent • 2 hours ago</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 border border-[#E8E8E8] rounded-lg">
                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Monthly revenue milestone reached</div>
                      <div className="text-xs text-gray-500">₩2.4M • 1 day ago</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 border border-[#E8E8E8] rounded-lg">
                    <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">New user registration</div>
                      <div className="text-xs text-gray-500">Driver: John Doe • 3 days ago</div>
                    </div>
                  </div>
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
