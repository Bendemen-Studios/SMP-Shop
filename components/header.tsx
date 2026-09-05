'use client';
import Link from 'next/link';
import { ShoppingCart, Cog, Search } from 'lucide-react';
import { useCart } from '@/lib/cart';

export function Header(){ const count=useCart(s=>s.items.reduce((n,i)=>n+i.quantity,0)); return <header className="header brass-frame"><Link href="/" className="brand"><span className="brand-gear">⚙</span><span><b>STEAMPUNK</b><small>SMP</small></span></Link><nav><Link href="/">Home</Link><Link href="/shop">Shop</Link><Link href="/shop?category=ranks">Ranks</Link><Link href="/shop?category=crates">Crates</Link><Link href="/shop?category=cosmetics">Cosmetics</Link></nav><div className="header-actions"><button aria-label="Search"><Search size={19}/></button><Link href="/cart" className="cart-button"><ShoppingCart size={19}/><i>{count}</i></Link><button aria-label="Settings"><Cog size={20}/></button></div></header> }