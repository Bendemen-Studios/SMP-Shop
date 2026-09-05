'use client';
import Link from 'next/link';
import { ShoppingCart, UserRound } from 'lucide-react';
import { useCart } from '@/lib/cart';

export function Header(){
 const count=useCart(s=>s.items.reduce((n,i)=>n+i.quantity,0));
 return <header className="header brass-frame">
  <Link href="/" className="brand" aria-label="Steampunk SMP home"><img className="brand-logo" src="/shop-logo-128.svg" alt="Steampunk SMP"/><span className="brand-wordmark"><b>STEAMPUNK</b><small>SMP</small></span></Link>
  <nav><Link href="/">Home</Link><Link href="/shop">Shop</Link></nav>
  <div className="header-actions"><Link href="/account" className="account-button" aria-label="Mijn account" title="Mijn account"><UserRound size={18}/></Link><Link href="/cart" className="cart-button" aria-label="Winkelwagen"><ShoppingCart size={19}/><i>{count}</i></Link></div>
 </header>
}