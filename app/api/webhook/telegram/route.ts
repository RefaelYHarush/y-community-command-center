import { NextRequest, NextResponse } from 'next/server';
import bot from '@/lib/telegram-bot';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Process the update with Telegraf
    await bot.handleUpdate(body);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    bot: 'telegram',
    timestamp: new Date().toISOString()
  });
}
