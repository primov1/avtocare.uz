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
  Package,
  ShoppingCart,
  Settings,
  Menu,
  Plus,
  Edit,
  Eye,
  DollarSign,
} from 'lucide-react';

export default function ShopOwnerDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarItems = [
    { label: 'Dashboard', href: '/dashboard/shop', icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: 'Inventory', href: '/dashboard/shop/inventory', icon: <Package className="h-5 w-5" /> },
    { label: 'Catalog', href: '/dashboard/shop/catalog', icon: <ShoppingCart className="h-5 w-5" /> },
  ];

  const tabBarItems = [
    { label: 'Home', href: '/dashboard/shop', icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: 'Inventory', href: '/dashboard/shop/inventory', icon: <Package className="h-5 w-5" /> },
    { label: 'Catalog', href: '/dashboard/shop/catalog', icon: <ShoppingCart className="h-5 w-5" /> },
    { label: 'More', href: '/dashboard/shop/settings', icon: <Menu className="h-5 w-5" /> },
  ];

  const inventoryItems = [
    {
      id: 1,
      name: 'Engine Oil 5W-30',
      category: 'Oil',
      stock: 45,
      price: 25000,
      status: 'in-stock',
    },
    {
      id: 2,
      name: 'Brake Pads Set',
      category: 'Brakes',
      stock: 12,
      price: 85000,
      status: 'low-stock',
    },
    {
      id: 3,
      name: 'Air Filter',
      category: 'Filters',
      stock: 0,
      price: 15000,
      status: 'out-of-stock',
    },
    {
      id: 4,
      name: 'Spark Plugs (Set of 4)',
      category: 'Ignition',
      stock: 28,
      price: 35000,
      status: 'in-stock',
    },
  ];

  return (
    <ProtectedRoute requiredRole="STORE_OWNER">
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
                <h1 className="text-2xl font-bold text-[#1A1A1A]">Shop Dashboard</h1>
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
                    <div className="text-3xl font-bold text-[#0F6E56]">127</div>
                    <div className="text-sm text-gray-600 mt-1">Total Products</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#0F6E56]">89</div>
                    <div className="text-sm text-gray-600 mt-1">In Stock</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">15</div>
                    <div className="text-sm text-gray-600 mt-1">Low Stock</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">23</div>
                    <div className="text-sm text-gray-600 mt-1">Out of Stock</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Inventory Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Inventory Management</CardTitle>
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Product
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {inventoryItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border border-[#E8E8E8] rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-[#0F6E56]/10 rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-[#0F6E56]" />
                        </div>
                        <div>
                          <div className="font-semibold text-[#1A1A1A]">{item.name}</div>
                          <div className="text-sm text-gray-600">{item.category} • ₩{item.price.toLocaleString()}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className={`text-sm font-medium ${
                            item.status === 'in-stock' ? 'text-green-600' :
                            item.status === 'low-stock' ? 'text-orange-600' : 'text-red-600'
                          }`}>
                            {item.stock} in stock
                          </div>
                          <div className="text-xs text-gray-500 capitalize">{item.status.replace('-', ' ')}</div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Public Catalog Preview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Public Catalog (Visible to All Users)</CardTitle>
                  <Button size="sm" variant="secondary">
                    View Full Catalog
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="border border-[#E8E8E8] rounded-lg p-4">
                    <div className="h-32 bg-[#F5F5F5] rounded-lg mb-3 flex items-center justify-center">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="font-semibold text-[#1A1A1A]">Engine Oil 5W-30</div>
                    <div className="text-sm text-gray-600">Premium synthetic oil</div>
                    <div className="text-lg font-bold text-[#0F6E56] mt-2">₩25,000</div>
                    <Button size="sm" className="w-full mt-3">
                      Add to Cart
                    </Button>
                  </div>

                  <div className="border border-[#E8E8E8] rounded-lg p-4">
                    <div className="h-32 bg-[#F5F5F5] rounded-lg mb-3 flex items-center justify-center">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="font-semibold text-[#1A1A1A]">Brake Pads Set</div>
                    <div className="text-sm text-gray-600">High quality brake pads</div>
                    <div className="text-lg font-bold text-[#0F6E56] mt-2">₩85,000</div>
                    <Button size="sm" className="w-full mt-3" disabled>
                      Out of Stock
                    </Button>
                  </div>

                  <div className="border border-[#E8E8E8] rounded-lg p-4">
                    <div className="h-32 bg-[#F5F5F5] rounded-lg mb-3 flex items-center justify-center">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="font-semibold text-[#1A1A1A]">Air Filter</div>
                    <div className="text-sm text-gray-600">Clean air for better performance</div>
                    <div className="text-lg font-bold text-[#0F6E56] mt-2">₩15,000</div>
                    <Button size="sm" className="w-full mt-3">
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sales Analytics */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#0F6E56]">₩1,250,000</div>
                    <div className="text-sm text-gray-600">Total Sales</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#0F6E56]">23</div>
                    <div className="text-sm text-gray-600">Orders</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#0F6E56]">8</div>
                    <div className="text-sm text-gray-600">Items Sold</div>
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
