'use client';
import Link from 'next/link';
import { ShoppingCart, Search, Menu, X } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { useState } from 'react';

export function Header(){
 const count=useCart(s=>s.items.reduce((n,i)=>n+i.quantity,0));
 const [open,setOpen]=useState(false);
 return <header className="header brass-frame">
  <Link href="/" className="brand" onClick={()=>setOpen(false)}><span className="brand-gear">⚙</span><span><b>STEAMPUNK</b><small>SMP</small></span></Link>
  <nav className={open?'mobile-open':''}><Link href="/" onClick={()=>setOpen(false)}>Home</Link><Link href="/shop" onClick={()=>setOpen(false)}>Shop</Link><Link href="/shop?category=ranks" onClick={()=>setOpen(false)}>Ranks</Link><Link href="/shop?category=crates" onClick={()=>setOpen(false)}>Crates</Link><Link href="/shop?category=cosmetics" onClick={()=>setOpen(false)}>Cosmetics</Link></nav>
  <div className="header-actions"><Link href="/shop" className="icon-button" aria-label="Zoeken"><Search size={19}/></Link><Link href="/cart" className="cart-button"><ShoppingCart size={19}/><i>{count}</i></Link><button className="menu-button" aria-label="Menu" onClick={()=>setOpen(!open)}>{open?<X size={21}/>:<Menu size={21}/>}</button></div>
 </header>
}