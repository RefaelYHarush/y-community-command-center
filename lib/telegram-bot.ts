import { Telegraf, Context } from 'telegraf';
import { supabaseAdmin } from './supabase';
import type { Agent, AgentRun, AgentAlert } from '@/types';

if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN is required');
}

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Admin user IDs (from environment or config)
const ADMIN_IDS = process.env.TELEGRAM_ADMIN_IDS?.split(',').map(id => parseInt(id.trim())) || [];

// Check if user is admin
function isAdmin(ctx: Context): boolean {
  return ADMIN_IDS.includes(ctx.from?.id || 0);
}

// Helper to format date
function formatDate(date: string | Date): string {
  return new Date(date).toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' });
}

// Commands

bot.command('start', async (ctx) => {
  await ctx.reply(
    '👋 ברוך הבא ל-Y-Community Command Center!\n\n' +
    'פקודות זמינות:\n' +
    '/status - סטטוס כללי של המערכת\n' +
    '/agents - רשימת כל הסוכנים\n' +
    '/runs - ריצות אחרונות\n' +
    '/alerts - התראות פעילות\n' +
    '/help - עזרה\n\n' +
    (isAdmin(ctx) ? '🔐 יש לך הרשאות Admin' : '👤 משתמש רגיל')
  );
});

bot.command('help', async (ctx) => {
  const helpText = `
📚 *Y-Community Command Center - עזרה*

*פקודות בסיסיות:*
/status - סטטוס כללי של המערכת
/agents - רשימת כל הסוכנים
/runs - 10 הריצות האחרונות
/alerts - התראות פעילות
/ping - בדיקת חיבור

${isAdmin(ctx) ? `
*פקודות Admin:*
/run <agent\\_id> - הפעלת סוכן ידנית
/pause <agent\\_id> - השהיית סוכן
/resume <agent\\_id> - המשך סוכן
/clear\\_alerts - ניקוי כל ההתראות
/stats - סטטיסטיקות מפורטות
` : ''}

*הערות:*
• הבוט פועל 24/7
• עדכונים אוטומטיים כל 5 דקות
• התראות קריטיות נשלחות מיידית

זקוק לעזרה? פנה ל-@refaelyharush
  `;

  await ctx.reply(helpText, { parse_mode: 'Markdown' });
});

bot.command('status', async (ctx) => {
  try {
    // Get agents count
    const { count: totalAgents } = await supabaseAdmin
      .from('agents')
      .select('*', { count: 'exact', head: true });

    const { count: activeAgents } = await supabaseAdmin
      .from('agents')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    // Get recent runs
    const { data: recentRuns } = await supabaseAdmin
      .from('agent_runs')
      .select('status')
      .order('created_at', { ascending: false })
      .limit(100);

    const totalRuns = recentRuns?.length || 0;
    const successfulRuns = recentRuns?.filter(r => r.status === 'completed').length || 0;
    const failedRuns = recentRuns?.filter(r => r.status === 'failed').length || 0;
    const successRate = totalRuns > 0 ? ((successfulRuns / totalRuns) * 100).toFixed(1) : '0';

    // Get active alerts
    const { count: activeAlerts } = await supabaseAdmin
      .from('agent_alerts')
      .select('*', { count: 'exact', head: true })
      .eq('acknowledged', false);

    const statusText = `
📊 *סטטוס מערכת Y-Community*

🤖 *סוכנים:*
• סה"כ: ${totalAgents || 0}
• פעילים: ${activeAgents || 0}
• לא פעילים: ${(totalAgents || 0) - (activeAgents || 0)}

📈 *ריצות (100 אחרונות):*
• סה"כ: ${totalRuns}
• הצליחו: ${successfulRuns} ✅
• נכשלו: ${failedRuns} ❌
• אחוז הצלחה: ${successRate}%

⚠️ *התראות פעילות:* ${activeAlerts || 0}

🕐 *עדכון אחרון:* ${formatDate(new Date())}
    `;

    await ctx.reply(statusText, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Error in /status:', error);
    await ctx.reply('❌ שגיאה בטעינת הסטטוס. נסה שוב.');
  }
});

bot.command('agents', async (ctx) => {
  try {
    const { data: agents } = await supabaseAdmin
      .from('agents')
      .select('*')
      .order('autonomous', { ascending: false })
      .order('name');

    if (!agents || agents.length === 0) {
      await ctx.reply('אין סוכנים במערכת.');
      return;
    }

    const agentsList = agents.map((agent: any) => {
      const statusEmoji = agent.status === 'active' ? '✅' : agent.status === 'error' ? '❌' : '⏸️';
      const autoEmoji = agent.autonomous ? '🤖' : '👤';
      return `${statusEmoji} ${autoEmoji} *${agent.name}*\n  ID: \`${agent.id}\`\n  ${agent.description}`;
    }).join('\n\n');

    const message = `
🤖 *רשימת סוכנים*

${agentsList}

*מקרא:*
✅ = פעיל | ⏸️ = מושהה | ❌ = שגיאה
🤖 = אוטונומי | 👤 = ידני
    `;

    await ctx.reply(message, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Error in /agents:', error);
    await ctx.reply('❌ שגיאה בטעינת הסוכנים.');
  }
});

bot.command('runs', async (ctx) => {
  try {
    const { data: runs } = await supabaseAdmin
      .from('agent_runs')
      .select(`
        *,
        agent:agents(name)
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    if (!runs || runs.length === 0) {
      await ctx.reply('אין ריצות אחרונות.');
      return;
    }

    const runsList = runs.map((run: any) => {
      const statusEmoji = run.status === 'completed' ? '✅' :
                         run.status === 'failed' ? '❌' :
                         run.status === 'running' ? '⏳' : '⏸️';
      const duration = run.duration_ms ? `${(run.duration_ms / 1000).toFixed(1)}s` : '-';
      return `${statusEmoji} *${run.agent?.name || 'Unknown'}*\n  ${formatDate(run.created_at)} | ${duration}`;
    }).join('\n\n');

    await ctx.reply(`📊 *10 ריצות אחרונות*\n\n${runsList}`, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Error in /runs:', error);
    await ctx.reply('❌ שגיאה בטעינת הריצות.');
  }
});

bot.command('alerts', async (ctx) => {
  try {
    const { data: alerts } = await supabaseAdmin
      .from('agent_alerts')
      .select(`
        *,
        agent:agents(name)
      `)
      .eq('acknowledged', false)
      .order('created_at', { ascending: false })
      .limit(20);

    if (!alerts || alerts.length === 0) {
      await ctx.reply('✅ אין התראות פעילות!');
      return;
    }

    const alertsList = alerts.map((alert: any) => {
      const severityEmoji = alert.severity === 'critical' ? '🔴' :
                           alert.severity === 'error' ? '❌' :
                           alert.severity === 'warning' ? '⚠️' : 'ℹ️';
      return `${severityEmoji} *${alert.agent?.name || 'System'}*\n  ${alert.message}\n  ${formatDate(alert.created_at)}`;
    }).join('\n\n');

    await ctx.reply(`⚠️ *התראות פעילות (${alerts.length})*\n\n${alertsList}`, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Error in /alerts:', error);
    await ctx.reply('❌ שגיאה בטעינת ההתראות.');
  }
});

bot.command('ping', async (ctx) => {
  const start = Date.now();
  const msg = await ctx.reply('🏓 Pong!');
  const latency = Date.now() - start;
  await ctx.telegram.editMessageText(
    ctx.chat?.id,
    msg.message_id,
    undefined,
    `🏓 Pong! (${latency}ms)`
  );
});

// Admin commands
bot.command('run', async (ctx) => {
  if (!isAdmin(ctx)) {
    await ctx.reply('❌ פקודה זו דורשת הרשאות Admin.');
    return;
  }

  const args = ctx.message.text.split(' ');
  if (args.length < 2) {
    await ctx.reply('שימוש: /run <agent_id>');
    return;
  }

  const agentId = args[1];

  try {
    // Call Agent Runtime API
    const response = await fetch(`${process.env.AGENT_RUNTIME_URL}/run/${agentId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    await ctx.reply(`✅ סוכן ${agentId} הופעל בהצלחה!`);
  } catch (error) {
    console.error('Error running agent:', error);
    await ctx.reply(`❌ שגיאה בהפעלת הסוכן: ${error}`);
  }
});

bot.command('clear_alerts', async (ctx) => {
  if (!isAdmin(ctx)) {
    await ctx.reply('❌ פקודה זו דורשת הרשאות Admin.');
    return;
  }

  try {
    const { error } = await supabaseAdmin
      .from('agent_alerts')
      .update({ acknowledged: true })
      .eq('acknowledged', false);

    if (error) throw error;

    await ctx.reply('✅ כל ההתראות נוקו!');
  } catch (error) {
    console.error('Error clearing alerts:', error);
    await ctx.reply('❌ שגיאה בניקוי ההתראות.');
  }
});

export default bot;
