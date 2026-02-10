'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface RunsChartProps {
  data: Array<{
    date: string;
    runs: number;
    success: number;
    failed: number;
  }>;
}

export default function RunsChart({ data }: RunsChartProps) {
  const formattedData = data.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('he-IL', { month: 'short', day: 'numeric' })
  }));

  return (
    <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700/50">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-6 h-6 text-purple-400" />
        <h2 className="text-xl font-bold text-white">ריצות לפי יום (7 ימים אחרונים)</h2>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="date"
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#f1f5f9'
              }}
              labelStyle={{ color: '#cbd5e1' }}
            />
            <Legend
              wrapperStyle={{ color: '#cbd5e1' }}
              formatter={(value) => {
                const labels: Record<string, string> = {
                  runs: 'סה"כ',
                  success: 'הצליחו',
                  failed: 'נכשלו'
                };
                return labels[value] || value;
              }}
            />
            <Bar dataKey="runs" fill="#8b5cf6" name="runs" />
            <Bar dataKey="success" fill="#10b981" name="success" />
            <Bar dataKey="failed" fill="#ef4444" name="failed" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {data.length === 0 && (
        <div className="h-[300px] flex items-center justify-center text-slate-500">
          אין נתונים להצגה
        </div>
      )}
    </div>
  );
}
