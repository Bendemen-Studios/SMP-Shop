import { NextResponse } from 'next/server';
import { getJson } from '@/lib/tip4serv';

export async function GET() {
  try {
    const data = await getJson('/store/categories');
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Categories unavailable' }, { status: 502 });
  }
}