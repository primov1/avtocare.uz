'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import {cn} from "../../lib/utils";

export type AppointmentStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  clientName: string;
  clientInitials: string;
  clientPhone: string;
  carName: string;
  plateNumber: string;
  service: string;
  date: string;
  status: AppointmentStatus;
  master: string;
}

const STATUS_CONFIG: Record<AppointmentStatus, { label: string; classes: string; dot: string }> = {
  pending:    { label: 'Kutayotgan',  classes: 'bg-amber-50  dark:bg-amber-950 text-amber-800  dark:text-amber-200', dot: 'bg-amber-500'   },
  confirmed:  { label: 'Tasdiqlangan',classes: 'bg-blue-50   dark:bg-blue-950  text-blue-800   dark:text-blue-200',  dot: 'bg-blue-500'    },
  in_progress:{ label: 'Jarayonda',   classes: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200', dot: 'bg-emerald-500'},
  completed:  { label: 'Tugallangan', classes: 'bg-green-50  dark:bg-green-950  text-green-800  dark:text-green-200', dot: 'bg-green-600'   },
  cancelled:  { label: 'Bekor',       classes: 'bg-red-50    dark:bg-red-950    text-red-800    dark:text-red-200',   dot: 'bg-red-500'     },
};

const AVATAR_COLORS = [
  'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200',
  'bg-blue-100    dark:bg-blue-900    text-blue-800    dark:text-blue-200',
  'bg-amber-100   dark:bg-amber-900   text-amber-800   dark:text-amber-200',
  'bg-pink-100    dark:bg-pink-900    text-pink-800    dark:text-pink-200',
  'bg-green-100   dark:bg-green-900   text-green-800   dark:text-green-200',
];

const FILTERS: { key: AppointmentStatus | 'all'; label: string }[] = [
  { key: 'all',        label: 'Hammasi'     },
  { key: 'pending',    label: 'Kutayotgan'  },
  { key: 'in_progress',label: 'Jarayonda'   },
  { key: 'confirmed',  label: 'Tasdiqlangan'},
];

interface Props {
  appointments: Appointment[];
  onNewClick?: () => void;
}

export function AppointmentsTable({ appointments, onNewClick }: Props) {
  const [filter, setFilter] = useState<AppointmentStatus | 'all'>('all');

  const filtered = filter === 'all'
    ? appointments
    : appointments.filter(a => a.status === filter);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <span className="text-[14px] font-medium text-gray-900 dark:text-gray-100">
          Yaqinlashayotgan navbatlar
        </span>
        <div className="flex items-center gap-2">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                'h-[30px] px-3 rounded-lg border text-[12px] transition-all flex items-center gap-1.5',
                filter === f.key
                  ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                  : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-gray-900'
              )}
            >
              {f.label}
            </button>
          ))}
          <button
            onClick={onNewClick}
            className="h-[30px] px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[12px] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-1.5 transition-colors"
          >
            <Plus size={13} />
            Yangi navbat
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full" style={{ tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '22%' }} />
            <col style={{ width: '18%' }} />
            <col style={{ width: '18%' }} />
            <col style={{ width: '16%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '12%' }} />
          </colgroup>
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              {['Mijoz', 'Mashina', 'Xizmat turi', 'Sana', 'Status', 'Usta'].map(h => (
                <th key={h} className="px-4 py-2.5 text-left text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((apt, i) => {
              const s = STATUS_CONFIG[apt.status];
              const av = AVATAR_COLORS[i % AVATAR_COLORS.length];
              return (
                <tr
                  key={apt.id}
                  className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className={cn('w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium shrink-0', av)}>
                        {apt.clientInitials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium text-gray-900 dark:text-gray-100 truncate">{apt.clientName}</p>
                        <p className="text-[11px] text-gray-400 truncate">{apt.clientPhone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-[13px] text-gray-700 dark:text-gray-300 truncate">{apt.carName}</p>
                    <span className="inline-block mt-0.5 text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700">
                      {apt.plateNumber}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-gray-700 dark:text-gray-300 truncate">
                    {apt.service}
                  </td>
                  <td className="px-4 py-3 text-[12px] text-gray-500 dark:text-gray-400">
                    {apt.date}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-medium', s.classes)}>
                      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', s.dot)} />
                      {s.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-gray-500 dark:text-gray-400 truncate">
                    {apt.master}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-[13px] text-gray-400">
                  Navbat topilmadi
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
