'use client';

import { useState } from 'react';
import { Car, Plus, ChevronRight, Loader2, History } from 'lucide-react';
import Link from 'next/link';
import {Vehicle} from "../../../types";
// Bu hooklar odatda sizning api yoki hooks papkangizda bo'ladi
import { useMyVehicles, useAddVehicle } from "../../../hooks/useApi";

const FIELD_CLS = 'w-full h-9 px-3 text-[13px] rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500';

export default function VehiclesPage() {
  const { data: vehicles = [], isLoading, isError } = useMyVehicles();
  const addVehicle = useAddVehicle();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ make: '', model: '', plateNumber: '', year: '', vin: '', color: '' });
  const [formErr, setFormErr] = useState('');

  function setF(k: keyof typeof form, v: string) { setForm(p => ({ ...p, [k]: v })); }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.make || !form.model || !form.plateNumber) {
      setFormErr('Marka, model va davlat raqami majburiy!');
      return;
    }
    setFormErr('');
    try {
      await addVehicle.mutateAsync({
        make:        form.make,
        model:       form.model,
        plateNumber: form.plateNumber,
        year:        form.year ? parseInt(form.year) : undefined,
        vin:         form.vin  || undefined,
        color:       form.color || undefined,
      });
      setShowForm(false);
      setForm({ make: '', model: '', plateNumber: '', year: '', vin: '', color: '' });
    } catch (err: any) {
      setFormErr(err?.response?.data?.message || 'Xatolik yuz berdi');
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-48 text-gray-400 text-sm">Yuklanmoqda...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-[17px] font-medium text-gray-900 dark:text-gray-100">Mening mashinalarim</h2>
          <p className="text-[13px] text-gray-400 mt-0.5">
            Virtual garaj — {(vehicles as Vehicle[]).length} ta mashina
          </p>
        </div>
        <button
          onClick={() => { setShowForm(p => !p); setFormErr(''); }}
          className="flex items-center gap-2 h-9 px-4 rounded-lg bg-emerald-700 text-white text-[13px] font-medium hover:bg-emerald-800 transition-colors"
        >
          <Plus size={15} />
          Mashina qo'shish
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 mb-5">
          <h3 className="text-[14px] font-medium text-gray-900 dark:text-gray-100 mb-4">Yangi mashina</h3>
          {formErr && (
            <p className="mb-3 px-3 py-2 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-[12px] text-red-600 dark:text-red-400">
              {formErr}
            </p>
          )}
          <form onSubmit={handleAdd}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
              {([
                { k:'make',        label:'Marka *',        ph:'Toyota'     },
                { k:'model',       label:'Model *',        ph:'Cobalt'     },
                { k:'plateNumber', label:'Davlat raqami *', ph:'01A 123 BC' },
                { k:'year',        label:'Yil',            ph:'2020'       },
                { k:'color',       label:'Rang',           ph:'Oq'         },
                { k:'vin',         label:'VIN (ixtiyoriy)', ph:'17 ta belgi'},
              ] as const).map(f => (
                <div key={f.k}>
                  <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1">{f.label}</label>
                  <input
                    value={form[f.k]}
                    onChange={e => setF(f.k, e.target.value)}
                    placeholder={f.ph}
                    className={FIELD_CLS}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={addVehicle.isPending}
                      className="h-9 px-5 bg-emerald-700 hover:bg-emerald-800 text-white text-[13px] font-medium rounded-lg flex items-center gap-2 transition-colors disabled:opacity-60">
                {addVehicle.isPending && <Loader2 size={13} className="animate-spin" />}
                Saqlash
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                      className="h-9 px-4 border border-gray-200 dark:border-gray-700 text-[13px] text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Bekor
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="mb-4 px-4 py-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-xl text-[13px] text-amber-700 dark:text-amber-300">
          Backend ulanmagan — mashinalar yuklanmadi. Demo rejimida ko'rsatilmoqda.
        </div>
      )}

      {/* Grid */}
      {(vehicles as Vehicle[]).length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-3">
          <Car size={40} className="opacity-30" />
          <p className="text-[14px]">Hali mashina qo'shilmagan</p>
          <button onClick={() => setShowForm(true)}
                  className="text-[13px] text-emerald-700 hover:text-emerald-800 font-medium">
            Birinchi mashinani qo'shing
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(vehicles as Vehicle[]).map((v: Vehicle) => (
            <div key={v.id}
                 className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors group">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center">
                  <Car size={20} className="text-emerald-700 dark:text-emerald-400" />
                </div>
                <ChevronRight size={15} className="text-gray-300 dark:text-gray-600 group-hover:text-emerald-500 transition-colors mt-1" />
              </div>
              <p className="text-[15px] font-medium text-gray-900 dark:text-gray-100">{v.make} {v.model}</p>
              <p className="text-[12px] text-gray-400 mt-0.5">{v.year || '—'} yil {v.color ? `· ${v.color}` : ''}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <span className="inline-block text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700 font-mono">
                  {v.plateNumber}
                </span>
                <Link href={`/dashboard/history`}
                      className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline">
                  <History size={12} />
                  Tarix
                </Link>
              </div>
              {v.currentMileage != null && (
                <p className="text-[11px] text-gray-400 mt-2">{v.currentMileage.toLocaleString()} km</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
