'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Loader2, ArrowRight } from 'lucide-react';
import { Header } from '@/components/header';

export default function Pending() {
  const [message, setMessage] = useState('We controleren de betaling automatisch…');

  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;
    const check = async () => {
      try {
        const raw = sessionStorage.getItem('steampunk_checkout');
        if (!raw) { setMessage('Open je aankoopgeschiedenis om de actuele status te bekijken.'); return; }
        const checkout = JSON.parse(raw);
        const params = new URLSearchParams({ email: String(checkout.email || ''), amount: String(checkout.amount || 0), startedAt: String(checkout.startedAt || Date.now()) });
        const response = await fetch(`/api/checkout/status?${params}`, { cache: 'no-store' });
        const data = await response.json();
        if (cancelled) return;
        if (data?.paid) {
          window.location.replace('/checkout/success');
          return;
        }
        setMessage(data?.status === 'unknown' ? 'De betaalstatus is nog niet beschikbaar. We blijven automatisch controleren.' : 'Betaling nog niet bevestigd. We blijven automatisch controleren.');
      } catch {
        if (!cancelled) setMessage('We kunnen de betaalstatus tijdelijk niet ophalen. We proberen het opnieuw.');
      } finally {
        if (!cancelled) timer = window.setTimeout(check, 5000);
      }
    };
    check();
    return () => { cancelled = true; if (timer) window.clearTimeout(timer); };
  }, []);

  return <main><Header/><div className="checkout-result-page"><div className="checkout-result-card"><div className="checkout-result-icon pending"><Loader2 className="spin" size={52}/></div><span className="eyebrow">BETALING WORDT GECONTROLEERD</span><h1 className="shop-title">Betaling <em>in behandeling</em></h1><p>{message}</p><div className="checkout-result-actions"><Link className="account-result-button" href="/account">MIJN ACCOUNT <ArrowRight size={16}/></Link><Link className="account-result-button" href="/">NAAR HOME</Link></div></div></div></main>;
}
