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
  Wrench,
  Settings,
  Menu,
  CheckCircle,
  Clock,
  Plus,
  Play,
} from 'lucide-react';

export default function MasterDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentService, setCurrentService] = useState<any>(null);

  const sidebarItems = [
    { label: 'Dashboard', href: '/dashboard/master', icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: 'My Vehicles', href: '/dashboard/master/vehicles', icon: <CarFront className="h-5 w-5" /> },
    { label: 'Services', href: '/dashboard/master/services', icon: <Wrench className="h-5 w-5" /> },
  ];

  const tabBarItems = [
    { label: 'Home', href: '/dashboard/master', icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: 'Vehicles', href: '/dashboard/master/vehicles', icon: <CarFront className="h-5 w-5" /> },
    { label: 'Services', href: '/dashboard/master/services', icon: <Wrench className="h-5 w-5" /> },
    { label: 'More', href: '/dashboard/master/settings', icon: <Menu className="h-5 w-5" /> },
  ];

  const assignedVehicles = [
    {
      id: 1,
      plateNumber: '01AA001UZ',
      model: 'Nexia A6',
      owner: 'John Doe',
      serviceType: 'Oil Change',
      status: 'in-progress',
      currentMileage: 0,
    },
    {
      id: 2,
      plateNumber: '02BB002UZ',
      model: 'Cobalt',
      owner: 'Jane Smith',
      serviceType: 'Full Service',
      status: 'pending',
      currentMileage: 0,
    },
  ];

  const calculateNextService = (currentMileage: number, oilType: string) => {
    const intervals: Record<string, number> = {
      '5W-30': 7000,
      '5W-40': 8000,
      '10W-40': 10000,
      '15W-40': 12000,
    };
    return currentMileage + (intervals[oilType] || 7000);
  };

  const completeService = (vehicleId: number, mileage: number, oilType: string) => {
    const nextServiceMileage = calculateNextService(mileage, oilType);
    console.log(`Service completed for vehicle ${vehicleId}. Next service at ${nextServiceMileage} km`);
    // Here you would make API call to complete service
  };

  return (
    <ProtectedRoute requiredRole="MASTER">
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
                <h1 className="text-2xl font-bold text-[#1A1A1A]">Master Panel</h1>
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
                    <div className="text-3xl font-bold text-[#0F6E56]">2</div>
                    <div className="text-sm text-gray-600 mt-1">Assigned Vehicles</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#0F6E56]">1</div>
                    <div className="text-sm text-gray-600 mt-1">In Progress</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#0F6E56]">15</div>
                    <div className="text-sm text-gray-600 mt-1">Services Today</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Assigned Vehicles */}
            <Card>
              <CardHeader>
                <CardTitle>My Assigned Vehicles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assignedVehicles.map((vehicle) => (
                    <div key={vehicle.id} className="border border-[#E8E8E8] rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 bg-[#0F6E56]/10 rounded-lg flex items-center justify-center">
                            <CarFront className="h-6 w-6 text-[#0F6E56]" />
                          </div>
                          <div>
                            <div className="font-semibold text-[#1A1A1A]">{vehicle.model}</div>
                            <div className="text-sm text-gray-600">{vehicle.plateNumber} • {vehicle.owner}</div>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          vehicle.status === 'in-progress'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {vehicle.status === 'in-progress' ? 'In Progress' : 'Pending'}
                        </div>
                      </div>

                      <div className="text-sm text-gray-600 mb-3">
                        Service Type: {vehicle.serviceType}
                      </div>

                      {vehicle.status === 'in-progress' && (
                        <OilServiceForm
                          vehicleId={vehicle.id}
                          onComplete={completeService}
                        />
                      )}

                      {vehicle.status === 'pending' && (
                        <Button size="sm" className="gap-2">
                          <Play className="h-4 w-4" />
                          Start Service
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Service History */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-[#E8E8E8] rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="text-sm font-medium">Nexia A6 (01AA001UZ)</div>
                        <div className="text-xs text-gray-500">Oil Change • 9:30 AM</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-[#E8E8E8] rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="text-sm font-medium">Cobalt (02BB002UZ)</div>
                        <div className="text-xs text-gray-500">Full Service • 11:00 AM</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">In Progress</div>
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

// Oil Service Form Component
function OilServiceForm({
  vehicleId,
  onComplete
}: {
  vehicleId: number;
  onComplete: (vehicleId: number, mileage: number, oilType: string) => void;
}) {
  const [mileage, setMileage] = useState('');
  const [oilType, setOilType] = useState('5W-30');
  const [nextService, setNextService] = useState(0);

  const handleMileageChange = (value: string) => {
    setMileage(value);
    const numMileage = parseInt(value) || 0;
    const intervals: Record<string, number> = {
      '5W-30': 7000,
      '5W-40': 8000,
      '10W-40': 10000,
      '15W-40': 12000,
    };
    setNextService(numMileage + (intervals[oilType] || 7000));
  };

  const handleOilTypeChange = (value: string) => {
    setOilType(value);
    const numMileage = parseInt(mileage) || 0;
    const intervals: Record<string, number> = {
      '5W-30': 7000,
      '5W-40': 8000,
      '10W-40': 10000,
      '15W-40': 12000,
    };
    setNextService(numMileage + (intervals[value] || 7000));
  };

  return (
    <div className="space-y-3 border-t border-[#E8E8E8] pt-3">
      <h4 className="font-medium text-[#1A1A1A]">Complete Oil Service</h4>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Mileage (km)
          </label>
          <input
            type="number"
            value={mileage}
            onChange={(e) => handleMileageChange(e.target.value)}
            className="w-full px-3 py-2 border border-[#E8E8E8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F6E56]/20 focus:border-[#0F6E56]"
            placeholder="Enter current mileage"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Oil Type
          </label>
          <select
            value={oilType}
            onChange={(e) => handleOilTypeChange(e.target.value)}
            className="w-full px-3 py-2 border border-[#E8E8E8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F6E56]/20 focus:border-[#0F6E56]"
          >
            <option value="5W-30">5W-30</option>
            <option value="5W-40">5W-40</option>
            <option value="10W-40">10W-40</option>
            <option value="15W-40">15W-40</option>
          </select>
        </div>
      </div>

      {nextService > 0 && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm text-blue-800">
            <strong>Next Service Reminder:</strong> {nextService.toLocaleString()} km
          </div>
        </div>
      )}

      <Button
        size="sm"
        className="gap-2"
        onClick={() => onComplete(vehicleId, parseInt(mileage), oilType)}
        disabled={!mileage}
      >
        <CheckCircle className="h-4 w-4" />
        Complete Service
      </Button>
    </div>
  );
}
