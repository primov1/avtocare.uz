'use client';

import { AppointmentStatus } from "../../../types";
import { useAppointments, useUpdateAppointmentStatus } from "../../../hooks/useApi";
import { AppointmentsTable } from "../../../components/dashboard/AppointmentsTable";
export const dynamic = 'force-dynamic';
// Buni qo'shish kerak yoki types'dan import qilish kerak
interface Apt {
    id: string;
    date: string;
    status: string;
    problemDescription?: string;
    driver?: { fullName: string; phone: string };
    vehicle?: { make: string; model: string; plateNumber: string };
    master?: { fullName: string };
}

function mapApt(a: Apt) {
    // Ism-sharifdan bosh harflarni olish (Initials)
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
        // Sana formatini o'zbekcha qilish
        date:           new Date(a.date).toLocaleString('uz-UZ', { dateStyle: 'short', timeStyle: 'short' }),
        status:         a.status as AppointmentStatus,
        master:         a.master?.fullName    || '—',
    };
}

export default function AppointmentsPage() {
    const { data, isLoading, isError, refetch } = useAppointments();
    const updateStatus = useUpdateAppointmentStatus();

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400 text-sm animate-pulse">Ma'lumotlar yuklanmoqda...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
                <div className="text-center p-6">
                    <p className="text-[14px] font-medium text-gray-700 dark:text-gray-300">Ma'lumotlarni olib bo'lmadi</p>
                    <p className="text-[12px] text-gray-500 mt-2">Backend serveri (`localhost:3000`) ishlayotganiga ishonch hosil qiling.</p>
                    <button
                        onClick={() => refetch()}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Qayta urinish
                    </button>
                </div>
            </div>
        );
    }

    // Data bo'lsa uni map qilamiz
    const appointments = (data || []).map(mapApt);

    return (
        <div className="space-y-6">
            <AppointmentsTable
                appointments={appointments}
                onNewClick={() => alert('Yangi navbat yaratish oynasi yaqin orada qo\'shiladi!')}
            />
        </div>
    );
}