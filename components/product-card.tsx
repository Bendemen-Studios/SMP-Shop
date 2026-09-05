'use client';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { useCart } from '@/lib/cart';

function cleanDescription(value?: string) {
 if (!value) return 'Een krachtig onderdeel voor jouw avontuur in Steampunk SMP.';
 return value.replace(/<br\s*\/?>/gi,' ').replace(/<[^>]*>/g,' ').replace(/&nbsp;/gi,' ').replace(/&amp;/gi,'&').replace(/&quot;/gi,'"').replace(/&#39;/gi,"'").replace(/\s+/g,' ').trim();
}

export function ProductCard({product}:{product:Product}){
 const add=useCart(s=>s.add);
 const price=Number(product.price||0).toFixed(2).replace('.',',');
 const description=cleanDescription(product.small_description);
 return <motion.article className="product-card" initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.12}} whileHover={{y:-9,rotateX:2}} transition={{type:'spring',stiffness:260,damping:18}}>
  <Link href={`/product/${product.id}`} className="product-image">
   {product.image?<img src={product.image} alt={product.name}/>:<div className="placeholder-art"><span>⚙</span><b>✦</b></div>}
   {product.featured?<span className="corner">UITGELICHT</span>:null}
   {product.percent_off&&product.percent_off>0?<span className="discount">-{product.percent_off}%</span>:null}
   <span className="scanline"/>
  </Link>
  <div className="product-body"><div><h3>{product.name}</h3><p>{description}</p></div>
   <div className="product-bottom"><strong>€ {price}</strong><button onClick={()=>add(product)} aria-label={`Voeg ${product.name} toe`}><ShoppingCart size={18}/></button></div>
  </div>
 </motion.article>
}