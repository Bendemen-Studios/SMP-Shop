'use client';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { useCart } from '@/lib/cart';
import { sanitizeRichText } from '@/lib/rich-text';

export function ProductCard({product}:{product:Product}){
 const add=useCart(s=>s.add);
 const price=Number(product.price||0).toFixed(2).replace('.',',');
 const description=sanitizeRichText(product.small_description)||'<p>Een krachtig onderdeel voor jouw avontuur in Steampunk SMP.</p>';
 return <motion.article className="product-card" initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.12}} whileHover={{y:-9,rotateX:2}} transition={{type:'spring',stiffness:260,damping:18}}>
  <Link href={`/product/${product.id}`} className="product-image">
   {product.image?<img src={product.image} alt={product.name}/>:<div className="placeholder-art"><span>⚙</span><b>✦</b></div>}
   {product.featured?<span className="corner">UITGELICHT</span>:null}
   {product.percent_off&&product.percent_off>0?<span className="discount">-{product.percent_off}%</span>:null}
   <span className="scanline"/>
  </Link>
  <div className="product-body"><div><h3>{product.name}</h3><div className="product-description" dangerouslySetInnerHTML={{__html:description}} /></div>
   <div className="product-bottom"><strong>€ {price}</strong><button onClick={()=>add(product)} aria-label={`Voeg ${product.name} toe`}><ShoppingCart size={18}/></button></div>
  </div>
 </motion.article>
}