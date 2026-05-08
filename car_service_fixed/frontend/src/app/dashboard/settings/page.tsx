'use client';

import { useState } from 'react';
import { LogOut, User, Bell, Shield } from 'lucide-react';
import {useAuth} from "../../../lib/auth";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSms,   setNotifSms]   = useState(false);

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-[17px] font-medium text-gray-900 dark:text-gray-100">Sozlamalar</h2>
        <p className="text-[13px] text-gray-400 mt-0.5">Profil va tizim sozlamalari</p>
      </div>

      {/* Profile */}
      <Section title="Profil ma'lumotlari" icon={<User size={15} />}>
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-[18px] font-medium text-emerald-800 dark:text-emerald-200 shrink-0">
            {(user?.fullName || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-[15px] font-medium text-gray-900 dark:text-gray-100">{user?.fullName || '—'}</p>
            <p className="text-[13px] text-gray-400">{user?.email}</p>
            <span className="inline-block mt-1 text-[11px] bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 font-medium">
              {user?.role}
            </span>
          </div>
        </div>
        <Row label="Email"   value={user?.email    || '—'} />
        <Row label="Telefon" value={user?.phone    || 'Kiritilmagan'} />
        <Row label="Ro'yxatdan o'tgan" value={user ? new Date(user.createdAt).toLocaleDateString('uz-UZ') : '—'} />
      </Section>

      {/* Notifications */}
      <Section title="Bildirishnomalar" icon={<Bell size={15} />}>
        <Toggle label="Email bildirishnomalari" desc="Yangi navbatlar haqida email olish"
                value={notifEmail} onChange={setNotifEmail} />
        <Toggle label="SMS bildirishnomalari"   desc="Navbat o'zgarishlari uchun SMS"
                value={notifSms}   onChange={setNotifSms} />
      </Section>

      {/* Security */}
      <Section title="Xavfsizlik" icon={<Shield size={15} />}>
        <Row label="Parol"  value="••••••••" action="O'zgartirish" />
        <Row label="2FA"    value="O'chirilgan" action="Yoqish" />
      </Section>

      {/* Logout */}
      <button onClick={logout}
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-[14px] font-medium hover:bg-red-50 dark:hover:bg-red-950 transition-colors mt-4">
        <LogOut size={16} />
        Tizimdan chiqish
      </button>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 mb-3">
      <div className="flex items-center gap-2 mb-4 text-gray-700 dark:text-gray-300">
        {icon}
        <h3 className="text-[14px] font-medium">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Row({ label, value, action }: { label: string; value: string; action?: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <span className="text-[13px] text-gray-500 dark:text-gray-400">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-[13px] text-gray-900 dark:text-gray-100">{value}</span>
        {action && (
          <button className="text-[12px] text-emerald-700 dark:text-emerald-400 hover:underline font-medium">{action}</button>
        )}
      </div>
    </div>
  );
}

function Toggle({ label, desc, value, onChange }: {
  label: string; desc: string; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <div>
        <p className="text-[13px] text-gray-900 dark:text-gray-100">{label}</p>
        <p className="text-[12px] text-gray-400 mt-0.5">{desc}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative w-10 h-6 rounded-full transition-colors ${value ? 'bg-emerald-600' : 'bg-gray-200 dark:bg-gray-700'}`}
      >
        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${value ? 'translate-x-5' : 'translate-x-1'}`} />
      </button>
    </div>
  );
}
