import { NextResponse } from 'next/server';
import { getJson } from '@/lib/tip4serv';

export async function GET() {
  try {
    const data = await getJson('/store/categories', 300);
    return NextResponse.json(data, { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=900' } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Categories unavailable' }, { status: 502 });
  }
}
