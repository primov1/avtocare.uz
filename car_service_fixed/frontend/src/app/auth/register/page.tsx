'use client';

import {useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {Loader2, Wrench} from 'lucide-react';
import {UserRole} from "../../../types";
import {useAuth} from "../../../lib/auth";


const ROLES: { value: UserRole; label: string; desc: string }[] = [
    {value: 'DRIVER', label: 'Haydovchi', desc: 'Mashina egasi, navbat oluvchi'},
    {value: 'WORKSHOP_ADMIN', label: 'Ustaxona Admini', desc: 'Ustaxona boshqaruvchisi'},
    {value: 'MASTER', label: 'Usta', desc: 'Texnik xodim'},
    {value: 'STORE_OWNER', label: 'Do\'kon egasi', desc: 'Ehtiyot qismlar sotuvchisi'},
];

export default function RegisterPage() {
    const {register, user} = useAuth();
    const router = useRouter();
    const [form, setForm] = useState({
        email: '', password: '', fullName: '', phone: '',
        role: 'DRIVER' as UserRole,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (user) {
        router.push('/dashboard');
        return null;
    }

    function set(k: keyof typeof form, v: string) {
        setForm(p => ({...p, [k]: v}));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (form.password.length < 6) {
            setError('Parol kamida 6 ta belgi bo\'lishi kerak');
            return;
        }
        setError('');
        setLoading(true);
        try {
            await register(form);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Xatolik yuz berdi. Qayta urining.');
        } finally {
            setLoading(false);
        }
    }

    const inputCls = 'w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-[14px] text-gray-900 dark:text-gray-100 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-colors';
    const labelCls = 'block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5';

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 py-10">
            <div
                className="w-full max-w-[440px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-sm">
                <div className="flex flex-col items-center mb-7">
                    <div className="w-11 h-11 bg-emerald-700 rounded-xl flex items-center justify-center mb-3">
                        <Wrench size={20} className="text-white"/>
                    </div>
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Ro'yxatdan o'tish</h1>
                    <p className="text-sm text-gray-500 mt-1">AutoCare Ecosystem</p>
                </div>

                {error && (
                    <div
                        className="mb-4 px-3 py-2.5 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-[13px] text-red-600 dark:text-red-400">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className={labelCls}>To'liq ism</label>
                        <input type="text" required autoComplete="name" value={form.fullName}
                               onChange={e => set('fullName', e.target.value)}
                               placeholder="Jasur Toshmatov" className={inputCls}/>
                    </div>
                    <div>
                        <label className={labelCls}>Email</label>
                        <input type="email" required autoComplete="email" value={form.email}
                               onChange={e => set('email', e.target.value)}
                               placeholder="jasur@example.com" className={inputCls}/>
                    </div>
                    <div>
                        <label className={labelCls}>Telefon (ixtiyoriy)</label>
                        <input type="tel" autoComplete="tel" value={form.phone}
                               onChange={e => set('phone', e.target.value)}
                               placeholder="+998 90 123 45 67" className={inputCls}/>
                    </div>
                    <div>
                        <label className={labelCls}>Parol</label>
                        <input type="password" required minLength={6} autoComplete="new-password"
                               value={form.password} onChange={e => set('password', e.target.value)}
                               placeholder="Kamida 6 ta belgi" className={inputCls}/>
                    </div>

                    <div>
                        <label className={labelCls}>Rol tanlang</label>
                        <div className="grid grid-cols-2 gap-2 mt-1.5">
                            {ROLES.map(r => (
                                <button key={r.value} type="button" onClick={() => set('role', r.value)}
                                        className={`p-3 rounded-lg border text-left transition-all ${
                                            form.role === r.value
                                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                        }`}>
                                    <p className={`text-[13px] font-medium ${form.role === r.value ? 'text-emerald-800 dark:text-emerald-300' : 'text-gray-800 dark:text-gray-200'}`}>
                                        {r.label}
                                    </p>
                                    <p className="text-[11px] text-gray-400 mt-0.5">{r.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <button type="submit" disabled={loading}
                            className="w-full h-10 bg-emerald-700 hover:bg-emerald-800 text-white text-[14px] font-medium rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2">
                        {loading && <Loader2 size={15} className="animate-spin"/>}
                        {loading ? 'Saqlanmoqda...' : 'Ro\'yxatdan o\'tish'}
                    </button>
                </form>

                <p className="text-center text-[13px] text-gray-500 mt-5">
                    Hisob bor?{' '}
                    <Link href="/auth/login" className="text-emerald-700 hover:text-emerald-800 font-medium">
                        Kirish
                    </Link>
                </p>
            </div>
        </div>
    );
}
