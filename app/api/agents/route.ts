import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: agents, error } = await supabaseAdmin
      .from('agents')
      .select('*')
      .order('autonomous', { ascending: false })
      .order('name');

    if (error) throw error;

    return NextResponse.json(agents || []);
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agents' },
      { status: 500 }
    );
  }
}
