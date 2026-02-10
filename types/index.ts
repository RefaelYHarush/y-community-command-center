// Agent Types
export interface Agent {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'error';
  lastRun?: Date;
  nextRun?: Date;
  autonomous: boolean;
}

export interface AgentRun {
  id: string;
  agent_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
  error?: string;
  started_at: Date;
  completed_at?: Date;
  duration_ms?: number;
}

export interface AgentAlert {
  id: string;
  agent_id: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  created_at: Date;
  acknowledged: boolean;
}

// Telegram Types
export interface TelegramCommand {
  command: string;
  description: string;
  adminOnly: boolean;
  handler: (ctx: any) => Promise<void>;
}

export interface BotContext {
  userId: number;
  chatId: number;
  username?: string;
  isAdmin: boolean;
}

// Dashboard Types
export interface DashboardStats {
  totalAgents: number;
  activeAgents: number;
  totalRuns: number;
  successRate: number;
  avgDuration: number;
  lastUpdate: Date;
}

export interface ChartDataPoint {
  date: string;
  runs: number;
  success: number;
  failed: number;
}
