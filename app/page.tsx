'use client';

import { useEffect, useState } from 'react';
import { Activity, Bot, AlertTriangle, TrendingUp } from 'lucide-react';
import StatsCard from '@/components/StatsCard';
import AgentsTable from '@/components/AgentsTable';
import RunsTimeline from '@/components/RunsTimeline';
import AlertsPanel from '@/components/AlertsPanel';
import RunsChart from '@/components/RunsChart';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  async function fetchStats() {
    try {
      const response = await fetch('/api/stats');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setStats(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Set default stats to unblock UI
      setStats({
        totalAgents: 0,
        activeAgents: 0,
        totalRuns: 0,
        successfulRuns: 0,
        failedRuns: 0,
        successRate: 0,
        avgDuration: 0,
        activeAlerts: 0,
        chartData: [],
        lastUpdate: new Date().toISOString()
      });
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">טוען נתונים...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          🎛️ Y-Community Command Center
        </h1>
        <p className="text-slate-400">
          ניהול ובקרה על כל הסוכנים והאוטומציות
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="סוכנים פעילים"
          value={stats?.activeAgents || 0}
          total={stats?.totalAgents || 0}
          icon={Bot}
          color="blue"
        />
        <StatsCard
          title="ריצות (24 שעות)"
          value={stats?.successfulRuns || 0}
          total={stats?.totalRuns || 0}
          icon={Activity}
          color="green"
        />
        <StatsCard
          title="אחוז הצלחה"
          value={`${stats?.successRate?.toFixed(1) || 0}%`}
          subtitle={`${stats?.failedRuns || 0} נכשלו`}
          icon={TrendingUp}
          color="purple"
        />
        <StatsCard
          title="התראות פעילות"
          value={stats?.activeAlerts || 0}
          subtitle="דורשות טיפול"
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <RunsChart data={stats?.chartData || []} />
        </div>
        <div>
          <AlertsPanel />
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AgentsTable />
        <RunsTimeline />
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-slate-500 text-sm">
        <p>עדכון אחרון: {new Date(stats?.lastUpdate).toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' })}</p>
        <p className="mt-2">Powered by Y-Community · Agent Runtime on Railway</p>
      </div>
    </div>
  );
}
