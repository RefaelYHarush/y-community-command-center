'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { he } from 'date-fns/locale';

interface Alert {
  id: string;
  agent_id: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  created_at: string;
  acknowledged: boolean;
  agent?: { name: string };
}

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 20000); // Refresh every 20s
    return () => clearInterval(interval);
  }, []);

  async function fetchAlerts() {
    try {
      const response = await fetch('/api/alerts?acknowledged=false&limit=10');
      const data = await response.json();
      setAlerts(data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  }

  async function acknowledgeAlert(id: string) {
    try {
      await fetch('/api/alerts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, acknowledged: true }),
      });
      setAlerts(alerts.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  }

  const getSeverityIcon = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getSeverityClass = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/20 border-red-500/50';
      case 'error':
        return 'bg-red-500/10 border-red-500/30';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/30';
      case 'info':
        return 'bg-blue-500/10 border-blue-500/30';
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700/50">
        <div className="text-white">טוען התראות...</div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700/50">
      <div className="flex items-center gap-2 mb-6">
        <AlertTriangle className="w-6 h-6 text-yellow-400" />
        <h2 className="text-xl font-bold text-white">התראות פעילות</h2>
        {alerts.length > 0 && (
          <span className="mr-auto px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-400 border border-red-500/30">
            {alerts.length}
          </span>
        )}
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`rounded-lg p-4 border ${getSeverityClass(alert.severity)}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getSeverityIcon(alert.severity)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-white text-sm font-medium">
                    {alert.agent?.name || 'מערכת'}
                  </h3>
                  <button
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="text-slate-400 hover:text-white transition-colors"
                    title="סמן כטופל"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-slate-300 text-sm mb-2">{alert.message}</p>
                <p className="text-slate-500 text-xs">
                  {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true, locale: he })}
                </p>
              </div>
            </div>
          </div>
        ))}

        {alerts.length === 0 && (
          <div className="text-center text-slate-500 py-8">
            <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-400" />
            <p>אין התראות פעילות! 🎉</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CheckCircle({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
