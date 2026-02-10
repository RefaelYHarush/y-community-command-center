'use client';

import { useEffect, useState } from 'react';
import { Bot, Play, Pause, AlertCircle } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'error';
  autonomous: boolean;
  last_run?: string;
}

export default function AgentsTable() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
    const interval = setInterval(fetchAgents, 30000);
    return () => clearInterval(interval);
  }, []);

  async function fetchAgents() {
    try {
      const response = await fetch('/api/agents');
      const data = await response.json();
      setAgents(data);
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setLoading(false);
    }
  }

  const getStatusIcon = (status: Agent['status']) => {
    switch (status) {
      case 'active':
        return <Play className="w-4 h-4 text-green-400" />;
      case 'inactive':
        return <Pause className="w-4 h-4 text-slate-400" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
    }
  };

  const getStatusBadge = (status: Agent['status']) => {
    const classes = {
      active: 'bg-green-500/20 text-green-400 border-green-500/30',
      inactive: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
      error: 'bg-red-500/20 text-red-400 border-red-500/30',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${classes[status]}`}>
        {status === 'active' ? 'פעיל' : status === 'inactive' ? 'מושהה' : 'שגיאה'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700/50">
        <div className="text-white">טוען סוכנים...</div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700/50">
      <div className="flex items-center gap-2 mb-6">
        <Bot className="w-6 h-6 text-blue-400" />
        <h2 className="text-xl font-bold text-white">סוכנים ({agents.length})</h2>
      </div>

      <div className="space-y-3">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30 hover:border-slate-600/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                {getStatusIcon(agent.status)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-medium">{agent.name}</h3>
                    {agent.autonomous && (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30">
                        אוטונומי
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm line-clamp-2">{agent.description}</p>
                  <p className="text-slate-500 text-xs mt-2">ID: {agent.id}</p>
                </div>
              </div>
              <div className="flex-shrink-0">
                {getStatusBadge(agent.status)}
              </div>
            </div>
          </div>
        ))}

        {agents.length === 0 && (
          <div className="text-center text-slate-500 py-8">
            אין סוכנים במערכת
          </div>
        )}
      </div>
    </div>
  );
}
