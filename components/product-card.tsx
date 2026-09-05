'use client';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { useCart } from '@/lib/cart';

export function ProductCard({product}:{product:Product}){ const add=useCart(s=>s.add); return <motion.article className="product-card" whileHover={{y:-8, rotateX:2}} transition={{type:'spring',stiffness:300}}><Link href={`/product/${product.id}`} className="product-image">{product.image?<img src={product.image} alt=""/>:<div className="placeholder-art"><span>⚙</span><b>⚡</b></div>}<span className="corner">{product.featured?'FEATURED':'ITEM'}</span></Link><div className="product-body"><div><h3>{product.name}</h3><p>{product.small_description || 'Een krachtig item voor jouw avontuur.'}</p></div><div className="product-bottom"><strong>€ {product.price.toFixed(2).replace('.',',')}</strong><button onClick={()=>add(product)} aria-label={`Voeg ${product.name} toe`}><ShoppingCart size={18}/></button><Link href={`/product/${product.id}`} className="more"><ArrowUpRight size={17}/></Link></div></div></motion.article> }