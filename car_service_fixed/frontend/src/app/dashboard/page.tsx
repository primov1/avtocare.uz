'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Wrench } from 'lucide-react';
import { useAuth } from "../../lib/auth";
import { cn } from "../../lib/utils";

// 1. Apt interfeysini e'lon qilamiz (Xatoni yo'qotish uchun asosiy qadam)
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
        status:         a.status as AppointmentStatus,
        master:         a.master?.fullName    || '—',
    };
}

// Backend ulanmaganda ko'rinadigan demo ma'lumotlar
const DEMO_APPOINTMENTS = [
    { id:'1', clientName:'Jasur Toshmatov',  clientInitials:'JT', clientPhone:'+998 90 123 45 67', carName:'Toyota Cobalt',    plateNumber:'01A 123 BC', service:'Moy almashtirish',     date:'Bugun, 10:00',  status:'in_progress' as AppointmentStatus, master:'A. Karimov'  },
    { id:'2', clientName:'Malika Yusupova',  clientInitials:'MY', clientPhone:'+998 91 234 56 78', carName:'Chevrolet Malibu', plateNumber:'10B 456 DE', service:'Tormoz tizimi',        date:'Bugun, 11:30',  status:'confirmed'   as AppointmentStatus, master:'B. Rahimov'  },
    { id:'3', clientName:'Bobur Aliyev',     clientInitials:'BA', clientPhone:'+998 93 345 67 89', carName:'Nexia 3',          plateNumber:'30C 789 FG', service:'Dvigatel diagnostika', date:'Bugun, 14:00',  status:'pending'     as AppointmentStatus, master:'—'          },
];

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            // Redirect to role-specific dashboard
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
                    // Stay on main dashboard if role not recognized
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