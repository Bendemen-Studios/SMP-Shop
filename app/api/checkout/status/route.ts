import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config';

export const runtime = 'nodejs';

const toNumber = (value: unknown) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

const normalize = (value: unknown) => String(value ?? '').trim().toLowerCase();

export async function GET(request: NextRequest) {
  try {
    const email = normalize(request.nextUrl.searchParams.get('email'));
    const username = normalize(request.nextUrl.searchParams.get('minecraftUsername'));
    const amount = toNumber(request.nextUrl.searchParams.get('amount'));
    const startedAt = toNumber(request.nextUrl.searchParams.get('startedAt'));

    if ((!email && !username) || !amount || !startedAt) {
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
      const rawCreated = Number(payment?.created ?? payment?.date ?? 0);
      const created = rawCreated > 1e12 ? Math.floor(rawCreated / 1000) : rawCreated;
      const identifiers = [
        payment?.customer?.identifier,
        payment?.recipient?.identifier,
        payment?.identifier,
        payment?.username,
        payment?.minecraft_username,
        payment?.player?.username,
      ].map(normalize).filter(Boolean);

      const status = normalize(payment?.status);
      const statusId = Number(payment?.status_id);
      const testMode = payment?.test === true || payment?.test_mode === true || normalize(payment?.mode) === 'test';
      const paidStatus = status === 'paid' || status === 'complete' || status === 'completed' || status === 'success' || status === 'succeeded' || statusId === 1;
      const testPaidStatus = testMode && (status === 'test' || status === 'test_paid' || status === 'paid' || status === 'complete' || status === 'completed' || status === 'success' || status === 'succeeded' || statusId === 1);
      const paid = paidStatus || testPaidStatus;

      const amountMatches = Number.isFinite(paymentAmount) && Math.abs(paymentAmount - amount) < 0.02;
      const emailMatches = !!email && identifiers.some((value) => value === email || value.includes(email));
      const usernameMatches = !!username && identifiers.some((value) => value === username || value.includes(username));
      const identifierMatches = emailMatches || usernameMatches;
      const recentEnough = !created || created >= startedSeconds - 600;

      return paid && amountMatches && identifierMatches && recentEnough;
    });

    if (match) {
      return NextResponse.json({
        status: 'paid',
        paid: true,
        testMode: match.test === true || match.test_mode === true || normalize(match.mode) === 'test',
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
