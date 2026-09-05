import { NextRequest, NextResponse } from 'next/server';
import { getJson } from '@/lib/tip4serv';

export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get('category');
    const params = new URLSearchParams({ page: '1', max_page: '50', details: 'true', only_enabled: 'true' });
    if (category) params.set('category', category);
    const data = await getJson(`/store/products?${params.toString()}`, 60);
    return NextResponse.json(data, { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Products unavailable' }, { status: 502 });
  }
}
