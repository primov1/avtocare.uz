'use client';

import { Users, Wrench, Phone } from 'lucide-react';
import {useMasters} from "../../../hooks/useApi";
import {User} from "../../../types";


const COLORS = [
  'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200',
  'bg-blue-100    dark:bg-blue-900    text-blue-800    dark:text-blue-200',
  'bg-amber-100   dark:bg-amber-900   text-amber-800   dark:text-amber-200',
  'bg-pink-100    dark:bg-pink-900    text-pink-800    dark:text-pink-200',
  'bg-purple-100  dark:bg-purple-900  text-purple-800  dark:text-purple-200',
];

export default function MastersPage() {
  const { data: masters = [], isLoading, isError } = useMasters();

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-[17px] font-medium text-gray-900 dark:text-gray-100">Ustalar</h2>
        <p className="text-[13px] text-gray-400 mt-0.5">
          {isLoading ? 'Yuklanmoqda...' : `${(masters as User[]).length} ta usta ro'yxatda`}
        </p>
      </div>

      {isError && (
        <div className="mb-4 px-4 py-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-xl text-[13px] text-amber-700 dark:text-amber-300">
          Backend ulanmagan — ustalar yuklanmadi.
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-48 text-gray-400 text-sm">Yuklanmoqda...</div>
      ) : (masters as User[]).length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-3">
          <Users size={40} className="opacity-30" />
          <p className="text-[14px]">Hali usta qo'shilmagan</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(masters as User[]).map((m: User, i: number) => {
            const initials = (m.fullName || m.email)
              .split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
            return (
              <div key={m.id}
                   className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-medium shrink-0 ${COLORS[i % COLORS.length]}`}>
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[14px] font-medium text-gray-900 dark:text-gray-100 truncate">{m.fullName}</p>
                    <p className="text-[12px] text-gray-400 truncate">{m.email}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-3">
                  <div className="flex items-center gap-1.5 text-[12px] text-gray-500 dark:text-gray-400">
                    <Wrench size={12} />
                    <span>Ustaxona ustasi</span>
                  </div>
                  {m.phone && (
                    <a href={`tel:${m.phone}`}
                       className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline">
                      <Phone size={11} />
                      {m.phone}
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
