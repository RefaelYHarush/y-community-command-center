import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    // Get agents stats
    const { count: totalAgents } = await supabaseAdmin
      .from('agents')
      .select('*', { count: 'exact', head: true });

    const { count: activeAgents } = await supabaseAdmin
      .from('agents')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    // Get runs stats (last 24h)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data: recentRuns } = await supabaseAdmin
      .from('agent_runs')
      .select('status, duration_ms')
      .gte('created_at', yesterday);

    const totalRuns = recentRuns?.length || 0;
    const successfulRuns = recentRuns?.filter(r => r.status === 'completed').length || 0;
    const failedRuns = recentRuns?.filter(r => r.status === 'failed').length || 0;
    const successRate = totalRuns > 0 ? (successfulRuns / totalRuns) * 100 : 0;

    // Calculate average duration
    const completedRuns = recentRuns?.filter(r => r.status === 'completed' && r.duration_ms) || [];
    const avgDuration = completedRuns.length > 0
      ? completedRuns.reduce((sum, r) => sum + (r.duration_ms || 0), 0) / completedRuns.length
      : 0;

    // Get active alerts
    const { count: activeAlerts } = await supabaseAdmin
      .from('agent_alerts')
      .select('*', { count: 'exact', head: true })
      .eq('acknowledged', false);

    // Get runs by day (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data: runsByDay } = await supabaseAdmin
      .from('agent_runs')
      .select('created_at, status')
      .gte('created_at', sevenDaysAgo)
      .order('created_at');

    // Group by day
    const chartData: Record<string, { runs: number; success: number; failed: number }> = {};
    runsByDay?.forEach(run => {
      const date = new Date(run.created_at).toLocaleDateString('en-CA'); // YYYY-MM-DD
      if (!chartData[date]) {
        chartData[date] = { runs: 0, success: 0, failed: 0 };
      }
      chartData[date].runs++;
      if (run.status === 'completed') chartData[date].success++;
      if (run.status === 'failed') chartData[date].failed++;
    });

    const chartDataArray = Object.entries(chartData).map(([date, data]) => ({
      date,
      ...data
    }));

    return NextResponse.json({
      totalAgents: totalAgents || 0,
      activeAgents: activeAgents || 0,
      totalRuns,
      successfulRuns,
      failedRuns,
      successRate,
      avgDuration,
      activeAlerts: activeAlerts || 0,
      chartData: chartDataArray,
      lastUpdate: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
