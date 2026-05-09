'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
export const dynamic = 'force-dynamic';

import { Wrench } from 'lucide-react';
import { useAuth } from "../../lib/auth";

// 1. Appointment statuslari uchun turni shu yerning o'zida e'lon qilamiz
type AppointmentStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

interface Apt {
    id: string;
    date: string;
    status: string;
    problemDescription?: string;
    driver?: { fullName: string; phone: string };
    vehicle?: { make: string; model: string; plateNumber: string };
    master?: { fullName: string };
}

// 2. Ma'lumotlarni jadval formatiga o'tkazuvchi funksiya
function mapApt(a: Apt) {
    const initials = (a.driver?.fullName || 'NN')
        .trim()
        .split(/\s+/)
        .map(w => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return {
        id:             a.id,
        clientName:     a.driver?.fullName    || '—',
        clientInitials: initials,
        clientPhone:    a.driver?.phone       || '—',
        carName:        a.vehicle ? `${a.vehicle.make} ${a.vehicle.model}` : '—',
        plateNumber:    a.vehicle?.plateNumber || '—',
        service:        a.problemDescription  || 'Umumiy ta\'mirlash',
        date:           a.date ? new Date(a.date).toLocaleString('uz-UZ', { dateStyle: 'short', timeStyle: 'short' }) : '—',
        // "as AppointmentStatus" xatolikni oldini oladi
        status:         a.status as AppointmentStatus,
        master:         a.master?.fullName    || '—',
    };
}

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            switch (user.role) {
                case 'SUPER_ADMIN':
                    router.push('/dashboard/admin');
                    break;
                case 'WORKSHOP_ADMIN':
                    router.push('/dashboard/workshop');
                    break;
                case 'MASTER':
                    router.push('/dashboard/master');
                    break;
                case 'DRIVER':
                    router.push('/dashboard/driver');
                    break;
                case 'STORE_OWNER':
                    router.push('/dashboard/shop');
                    break;
                default:
                    break;
            }
        }
    }, [user, loading, router]);

    if (loading) {
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

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
            <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 bg-emerald-700 rounded-xl flex items-center justify-center">
                    <Wrench size={18} className="text-white" />
                </div>
                <p className="text-sm text-gray-400">Dashboardga yo'naltirilmoqda...</p>
            </div>
        </div>
    );
}