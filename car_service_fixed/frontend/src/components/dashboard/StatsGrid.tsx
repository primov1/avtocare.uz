import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import {cn} from "../../lib/utils";

export interface StatCardProps {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

export function StatCard({ label, value, change, trend, icon: Icon, iconBg, iconColor }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[12px] text-gray-500 dark:text-gray-400">{label}</span>
        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', iconBg)}>
          <Icon size={15} className={iconColor} />
        </div>
      </div>
      <p className="text-[24px] font-medium text-gray-900 dark:text-gray-100 tracking-tight leading-none">
        {value}
      </p>
      <div className={cn('flex items-center gap-1 mt-1.5 text-[11px]',
        trend === 'up'   ? 'text-emerald-600 dark:text-emerald-400' :
        trend === 'down' ? 'text-red-500 dark:text-red-400' :
        'text-gray-400'
      )}>
        {trend === 'up'   && <TrendingUp size={11} />}
        {trend === 'down' && <TrendingDown size={11} />}
        <span>{change}</span>
      </div>
    </div>
  );
}

export function StatsGrid({ stats }: { stats: StatCardProps[] }) {
  return (
    <div className="grid grid-cols-4 gap-3.5 mb-6 max-lg:grid-cols-2 max-sm:grid-cols-1">
      {stats.map((s, i) => <StatCard key={i} {...s} />)}
    </div>
  );
}
