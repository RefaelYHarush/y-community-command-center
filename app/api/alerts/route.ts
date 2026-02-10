import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    const acknowledged = searchParams.get('acknowledged');

    let query = supabaseAdmin
      .from('agent_alerts')
      .select(`
        *,
        agent:agents(name)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (acknowledged !== null) {
      query = query.eq('acknowledged', acknowledged === 'true');
    }

    const { data: alerts, error } = await query;

    if (error) throw error;

    return NextResponse.json(alerts || []);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, acknowledged } = body;

    const { error } = await supabaseAdmin
      .from('agent_alerts')
      .update({ acknowledged })
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating alert:', error);
    return NextResponse.json(
      { error: 'Failed to update alert' },
      { status: 500 }
    );
  }
}
