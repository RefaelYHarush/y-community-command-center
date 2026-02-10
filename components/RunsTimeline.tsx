'use client';

import { useEffect, useState } from 'react';
import { Activity, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { he } from 'date-fns/locale';

interface AgentRun {
  id: string;
  agent_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  created_at: string;
  duration_ms?: number;
  agent?: { name: string };
}

export default function RunsTimeline() {
  const [runs, setRuns] = useState<AgentRun[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRuns();
    const interval = setInterval(fetchRuns, 15000); // Refresh every 15s
    return () => clearInterval(interval);
  }, []);

  async function fetchRuns() {
    try {
      const response = await fetch('/api/runs?limit=20');
      const data = await response.json();
      setRuns(data);
    } catch (error) {
      console.error('Error fetching runs:', error);
    } finally {
      setLoading(false);
    }
  }

  const getStatusIcon = (status: AgentRun['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'running':
        return <Clock className="w-5 h-5 text-blue-400 animate-pulse" />;
      default:
        return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const formatDuration = (ms?: number) => {
    if (!ms) return '-';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  if (loading) {
    return (
      <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700/50">
        <div className="text-white">טוען ריצות...</div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700/50">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-6 h-6 text-green-400" />
        <h2 className="text-xl font-bold text-white">ריצות אחרונות</h2>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {runs.map((run) => (
          <div
            key={run.id}
            className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getStatusIcon(run.status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="text-white text-sm font-medium truncate">
                    {run.agent?.name || run.agent_id}
                  </h3>
                  <span className="text-slate-500 text-xs flex-shrink-0">
                    {formatDuration(run.duration_ms)}
                  </span>
                </div>
                <p className="text-slate-400 text-xs">
                  {formatDistanceToNow(new Date(run.created_at), { addSuffix: true, locale: he })}
                </p>
              </div>
            </div>
          </div>
        ))}

        {runs.length === 0 && (
          <div className="text-center text-slate-500 py-8">
            אין ריצות אחרונות
          </div>
        )}
      </div>
    </div>
  );
}
