'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { useCart } from '@/lib/cart';
import type { Product } from '@/lib/types';

export default function ProductPage({params}:{params:Promise<{id:string}>}){const [product,setProduct]=useState<Product|null>(null);const add=useCart(s=>s.add);useEffect(()=>{params.then(p=>fetch(`/api/products/${p.id}`).then(r=>r.json()).then(setProduct))},[params]);if(!product)return <main><Header/><div className="empty">Product wordt uit de werkplaats gehaald...</div></main>;return <main><Header/><div className="shop-page"><Link href="/shop" className="text-link"><ArrowLeft size={15}/> TERUG NAAR SHOP</Link><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:35,marginTop:25}}><motion.div className="product-image" initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}}>{product.image?<img src={product.image} alt={product.name}/>:<div className="placeholder-art"><span>⚙</span><b>⚡</b></div>}</motion.div><motion.div initial={{opacity:0,x:30}} animate={{opacity:1,x:0}}><span className="eyebrow">STEAMPUNK SMP ITEM</span><h1 className="shop-title" style={{fontSize:'clamp(35px,5vw,60px)'}}>{product.name}</h1><p style={{color:'#9d896e',lineHeight:1.8}}>{product.small_description||'Een exclusief onderdeel van jouw avontuur.'}</p><div className="total"><span>Prijs</span><strong>€ {product.price.toFixed(2).replace('.',',')}</strong></div><button className="brass-button" onClick={()=>add(product)}><ShoppingCart size={18}/> TOEVOEGEN AAN WINKELWAGEN</button></motion.div></div></div></main>}