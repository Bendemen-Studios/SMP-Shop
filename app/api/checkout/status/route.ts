import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config';

export const runtime = 'nodejs';

const toNumber = (value: unknown) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email')?.trim().toLowerCase();
    const amount = toNumber(request.nextUrl.searchParams.get('amount'));
    const startedAt = toNumber(request.nextUrl.searchParams.get('startedAt'));

    if (!email || !amount || !startedAt) {
      return NextResponse.json({ status: 'unknown', paid: false }, { status: 400 });
    }

    const response = await fetch(`${config.api.baseUrl}/store/payments?limit=50`, {
      headers: {
        Authorization: `Bearer ${config.api.key}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json({ status: 'unknown', paid: false }, { status: 200 });
    }

    const data = await response.json();
    const payments = Array.isArray(data?.payments) ? data.payments : [];
    const startedSeconds = startedAt > 1e12 ? Math.floor(startedAt / 1000) : Math.floor(startedAt);

    const match = payments.find((payment: any) => {
      const paymentAmount = Number(payment?.amount ?? payment?.amount_cents / 100);
      const created = Number(payment?.created ?? payment?.date ?? 0);
      const identifier = String(
        payment?.customer?.identifier ?? payment?.recipient?.identifier ?? payment?.identifier ?? '',
      ).trim().toLowerCase();
      const status = String(payment?.status ?? '').toLowerCase();
      const statusId = Number(payment?.status_id);
      const paid = status === 'paid' || status === 'complete' || status === 'completed' || statusId === 1;
      const amountMatches = Number.isFinite(paymentAmount) && Math.abs(paymentAmount - amount) < 0.02;
      const emailMatches = identifier === email || identifier.includes(email);
      const recentEnough = !created || created >= startedSeconds - 300;
      return paid && amountMatches && emailMatches && recentEnough;
    });

    if (match) {
      return NextResponse.json({
        status: 'paid',
        paid: true,
        paymentId: match.id ?? null,
        transaction: match.transaction ?? null,
      }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
    }

    return NextResponse.json(
      { status: 'pending', paid: false },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
  } catch {
    return NextResponse.json({ status: 'unknown', paid: false }, { status: 200 });
  }
}
