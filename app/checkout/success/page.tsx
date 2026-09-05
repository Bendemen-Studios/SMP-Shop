'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CheckCircle2, ArrowRight, UserRound, ShoppingBag } from 'lucide-react';
import { Header } from '@/components/header';
import { useCart } from '@/lib/cart';

export default function CheckoutSuccess() {
  const clear = useCart((state) => state.clear);
  const [paymentChecked, setPaymentChecked] = useState(false);
  const [paymentId, setPaymentId] = useState<number | null>(null);
  const [testMode, setTestMode] = useState(false);

  useEffect(() => {
    clear();
    let cancelled = false;
    const check = async () => {
      try {
        const raw = sessionStorage.getItem('steampunk_checkout');
        if (!raw) return setPaymentChecked(true);
        const checkout = JSON.parse(raw);
        const params = new URLSearchParams({
          email: String(checkout.email || ''),
          minecraftUsername: String(checkout.minecraftUsername || ''),
          amount: String(checkout.amount || 0),
          startedAt: String(checkout.startedAt || Date.now()),
        });
        const response = await fetch(`/api/checkout/status?${params}`, { cache: 'no-store' });
        const data = await response.json();
        if (!cancelled && data?.paid) {
          setPaymentId(data.paymentId || null);
          setTestMode(data.testMode === true);
        }
      } catch {} finally {
        if (!cancelled) setPaymentChecked(true);
      }
    };
    check();
    try { sessionStorage.removeItem('steampunk_checkout'); } catch {}
    return () => { cancelled = true; };
  }, [clear]);

  return <main><Header/><div className="checkout-result-page"><div className="checkout-result-card"><div className="checkout-result-icon"><CheckCircle2 size={52}/></div><span className="eyebrow">{testMode?'TESTBETALING ONTVANGEN':'BETALING ONTVANGEN'}</span><h1 className="shop-title">Bedankt voor je <em>Aankoop!</em></h1><p>{testMode?'De Tip4Serv-testbetaling is succesvol verwerkt. Je aankoopflow en levering kunnen nu veilig worden getest.':'Je betaling is succesvol afgerond. Je aankoop wordt door Steampunk SMP verwerkt en zo snel mogelijk in-game geleverd.'}</p><div className="checkout-payment-confirmed">{paymentChecked&&paymentId?`BETALING #${paymentId} BEVESTIGD${testMode?' · TEST':''}`:testMode?'TESTBETALING BEVESTIGD':'BETALING BEVESTIGD'}</div><div className="checkout-result-actions"><Link className="brass-button" href="/shop"><ShoppingBag size={17}/> VERDER WINKELEN <ArrowRight size={16}/></Link><Link className="account-result-button" href="/account"><UserRound size={17}/> MIJN ACCOUNT</Link></div></div></div></main>;
}
