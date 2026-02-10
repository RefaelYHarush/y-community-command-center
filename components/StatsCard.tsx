import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  total?: number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'red';
}

const colorClasses = {
  blue: 'bg-blue-500/10 text-blue-400',
  green: 'bg-green-500/10 text-green-400',
  purple: 'bg-purple-500/10 text-purple-400',
  red: 'bg-red-500/10 text-red-400',
};

export default function StatsCard({ title, value, subtitle, total, icon: Icon, color }: StatsCardProps) {
  return (
    <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold text-white">{value}</p>
        {total !== undefined && (
          <span className="text-slate-500 text-lg">/ {total}</span>
        )}
      </div>
      {subtitle && (
        <p className="text-slate-500 text-sm mt-2">{subtitle}</p>
      )}
    </div>
  );
}
