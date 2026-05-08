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
  Users,
  Calendar,
  Settings,
  Menu,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  TrendingUp,
} from 'lucide-react';

export default function WorkshopAdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarItems = [
    { label: 'Dashboard', href: '/dashboard/workshop', icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: 'Live Board', href: '/dashboard/workshop/board', icon: <Clock className="h-5 w-5" /> },
    { label: 'Queue', href: '/dashboard/workshop/queue', icon: <Calendar className="h-5 w-5" /> },
    { label: 'Masters', href: '/dashboard/workshop/masters', icon: <Users className="h-5 w-5" /> },
  ];

  const tabBarItems = [
    { label: 'Home', href: '/dashboard/workshop', icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: 'Board', href: '/dashboard/workshop/board', icon: <Clock className="h-5 w-5" /> },
    { label: 'Queue', href: '/dashboard/workshop/queue', icon: <Calendar className="h-5 w-5" /> },
    { label: 'More', href: '/dashboard/workshop/settings', icon: <Menu className="h-5 w-5" /> },
  ];

  return (
    <ProtectedRoute requiredRole="WORKSHOP_ADMIN">
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
                <h1 className="text-2xl font-bold text-[#1A1A1A]">Workshop Dashboard</h1>
              </div>
              <div className="text-sm text-gray-600">
                Welcome, {user?.fullName}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#0F6E56]">3</div>
                    <div className="text-sm text-gray-600 mt-1">Active Services</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#0F6E56]">8</div>
                    <div className="text-sm text-gray-600 mt-1">In Queue</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#0F6E56]">12</div>
                    <div className="text-sm text-gray-600 mt-1">Masters</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#0F6E56]">₩1.2M</div>
                    <div className="text-sm text-gray-600 mt-1">Today Revenue</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Live Board */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Live Service Board</CardTitle>
                  <Button size="sm" variant="secondary">
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {/* Master 1 */}
                  <div className="border border-[#E8E8E8] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-[#1A1A1A]">Ali Master</h3>
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">Active</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Current:</span> Nexia A6 (01AA001UZ)
                      </div>
                      <div className="text-sm text-gray-600">Oil Change Service</div>
                      <div className="text-xs text-gray-500">Started: 10:30 AM</div>
                    </div>
                  </div>

                  {/* Master 2 */}
                  <div className="border border-[#E8E8E8] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-[#1A1A1A]">Vali Master</h3>
                      <div className="flex items-center gap-1 text-orange-600">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">Break</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-500">No active service</div>
                      <div className="text-xs text-gray-500">Last service: 9:45 AM</div>
                    </div>
                  </div>

                  {/* Master 3 */}
                  <div className="border border-[#E8E8E8] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-[#1A1A1A]">Hasan Master</h3>
                      <div className="flex items-center gap-1 text-blue-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">Waiting</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Next:</span> Cobalt (02BB002UZ)
                      </div>
                      <div className="text-sm text-gray-600">Full Service</div>
                      <div className="text-xs text-gray-500">ETA: 11:15 AM</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Queue Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Service Queue</CardTitle>
                  <Button size="sm" className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Send SMS Reminder
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border border-[#E8E8E8] rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-[#0F6E56]/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-[#0F6E56]">1</span>
                      </div>
                      <div>
                        <div className="font-semibold text-[#1A1A1A]">Spark (03CC003UZ)</div>
                        <div className="text-sm text-gray-600">Oil Change • John Doe</div>
                        <div className="text-xs text-gray-500">Booked: 9:00 AM</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary">Assign Master</Button>
                      <Button size="sm" variant="ghost">Details</Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-[#E8E8E8] rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-[#0F6E56]/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-[#0F6E56]">2</span>
                      </div>
                      <div>
                        <div className="font-semibold text-[#1A1A1A]">Lacetti (04DD004UZ)</div>
                        <div className="text-sm text-gray-600">Full Service • Jane Smith</div>
                        <div className="text-xs text-gray-500">Booked: 10:30 AM</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary">Assign Master</Button>
                      <Button size="sm" variant="ghost">Details</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Marketing Tools */}
            <Card>
              <CardHeader>
                <CardTitle>Marketing Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <Button variant="secondary" className="h-20 flex-col gap-2">
                    <MessageSquare className="h-6 w-6" />
                    <span>Send Oil Change Reminders</span>
                  </Button>
                  <Button variant="secondary" className="h-20 flex-col gap-2">
                    <TrendingUp className="h-6 w-6" />
                    <span>Service Promotion Campaign</span>
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
