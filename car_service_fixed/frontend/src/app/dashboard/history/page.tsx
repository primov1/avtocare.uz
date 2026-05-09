'use client';

import { useState } from 'react';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';
import {ServiceHistory, Vehicle} from "../../../types";
import {useAuth} from "../../../lib/auth";
import {useMyVehicles, useVehicleHistory} from "../../../hooks/useApi";
export const dynamic = 'force-dynamic';

// Demo history shown before backend is connected
const DEMO: ServiceHistory[] = [
  { id:'1', description:'Moy almashtirish (5W-30), havo filtri, yog\' filtri',     cost:285000, mileage:45000, vehicleId:'v1', workshopId:'w1', createdAt:'2025-05-18T08:00:00Z' },
  { id:'2', description:'Tormoz kolodkasi almashtirish (old va orqa)',               cost:520000, mileage:62400, vehicleId:'v2', workshopId:'w1', createdAt:'2025-05-05T10:30:00Z' },
  { id:'3', description:'Dvigatel diagnostika, svecha almashtirish, hisob tozalash', cost:195000, mileage:38200, vehicleId:'v3', workshopId:'w1', createdAt:'2025-04-22T09:00:00Z' },
  { id:'4', description:'Konditsioner gazi to\'ldirish, filtr almashtirish',         cost:350000, mileage:71600, vehicleId:'v4', workshopId:'w1', createdAt:'2025-04-10T11:00:00Z' },
];

function HistoryItem({ item }: { item: ServiceHistory }) {
  const [open, setOpen] = useState(false);
  const d = new Date(item.createdAt);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden mb-3">
      <button
        onClick={() => setOpen(p => !p)}
        className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <div className="w-12 h-12 shrink-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
          <span className="text-[18px] font-semibold text-gray-900 dark:text-gray-100 leading-none">{d.getDate()}</span>
          <span className="text-[10px] text-gray-400">{d.toLocaleString('uz-UZ', { month: 'short' })}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] text-gray-700 dark:text-gray-300 truncate">{item.description}</p>
          {item.mileage && (
            <p className="text-[11px] text-gray-400 mt-0.5">Probeg: {item.mileage.toLocaleString()} km</p>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[14px] font-semibold text-emerald-700 dark:text-emerald-400">
            {item.cost.toLocaleString()} so'm
          </span>
          {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-800 pt-3">
          <div className="grid grid-cols-2 gap-3 text-[12px]">
            <div>
              <p className="text-gray-400 mb-0.5">Tavsif</p>
              <p className="text-gray-700 dark:text-gray-300">{item.description}</p>
            </div>
            {item.partsUsed && (
              <div>
                <p className="text-gray-400 mb-0.5">Ehtiyot qismlar</p>
                <p className="text-gray-700 dark:text-gray-300">{item.partsUsed}</p>
              </div>
            )}
            {item.nextServiceMileage && (
              <div>
                <p className="text-gray-400 mb-0.5">Keyingi servis probegi</p>
                <p className="text-gray-700 dark:text-gray-300">{item.nextServiceMileage.toLocaleString()} km</p>
              </div>
            )}
            {item.nextServiceDate && (
              <div>
                <p className="text-gray-400 mb-0.5">Keyingi servis sanasi</p>
                <p className="text-gray-700 dark:text-gray-300">
                  {new Date(item.nextServiceDate).toLocaleDateString('uz-UZ')}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function HistoryPage() {
  const { user } = useAuth();
  const isDriver = user?.role === 'DRIVER';

  // Drivers see their vehicle history; workshop staff see a flat demo list
  const { data: vehicles = [] } = useMyVehicles();
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const { data: vehicleHistory = [], isLoading } = useVehicleHistory(selectedVehicle);

  const historyItems: ServiceHistory[] = isDriver
    ? (vehicleHistory.length ? vehicleHistory : DEMO)
    : DEMO;

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-[17px] font-medium text-gray-900 dark:text-gray-100">Servis tarixi</h2>
        <p className="text-[13px] text-gray-400 mt-0.5">Digital Service Book — {historyItems.length} ta yozuv</p>
      </div>

      {/* Vehicle filter for drivers */}
      {isDriver && vehicles.length > 0 && (
        <div className="mb-5">
          <select
            value={selectedVehicle}
            onChange={e => setSelectedVehicle(e.target.value)}
            className="h-9 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-[13px] text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
          >
            <option value="">— Mashina tanlang —</option>
            {(vehicles as Vehicle[]).map((v: Vehicle) => (
              <option key={v.id} value={v.id}>{v.make} {v.model} — {v.plateNumber}</option>
            ))}
          </select>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-40 text-gray-400 text-sm">Yuklanmoqda...</div>
      ) : historyItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-3">
          <FileText size={40} className="opacity-30" />
          <p className="text-[14px]">Servis tarixi topilmadi</p>
        </div>
      ) : (
        historyItems.map(item => <HistoryItem key={item.id} item={item} />)
      )}
    </div>
  );
}
