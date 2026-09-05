'use client';

import Link from 'next/link';
import { Header } from '@/components/header';
import { AlertTriangle, ArrowRight, RotateCcw, ShoppingCart } from 'lucide-react';

export default function Failed() {
  return (
    <main>
      <Header />
      <div className="checkout-result-page">
        <div className="checkout-result-card checkout-result-failed">
          <div className="checkout-result-icon" aria-hidden="true">
            <AlertTriangle size={42} />
          </div>
          <span className="eyebrow">BETALING NIET VOLTOOID</span>
          <h1 className="shop-title">Aankoop <em>Mislukt</em></h1>
          <p>
            Helaas is je aankoop niet gelukt. Er is niets afgeschreven.
            Je winkelwagen staat nog klaar, zodat je het direct opnieuw kunt proberen.
          </p>

          <div className="checkout-result-actions">
            <Link className="brass-button" href="/cart">
              <RotateCcw size={17} /> PROBEER HET OPNIEUW <ArrowRight size={16} />
            </Link>
            <Link className="checkout-secondary-button" href="/shop">
              <ShoppingCart size={16} /> TERUG NAAR HET EMPORIUM
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
