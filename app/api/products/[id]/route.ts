import { NextResponse } from 'next/server';
import { getJson } from '@/lib/tip4serv';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await getJson(`/store/product/${encodeURIComponent(id)}`);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Product unavailable' }, { status: 502 });
  }
}