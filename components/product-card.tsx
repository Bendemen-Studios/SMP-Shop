'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, X } from 'lucide-react';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { useCart } from '@/lib/cart';
import { sanitizeRichText } from '@/lib/rich-text';

export function ProductCard({product}:{product:Product}){
 const add=useCart(s=>s.add);
 const [showPurchaseChoice,setShowPurchaseChoice]=useState(false);
 const price=Number(product.price||0).toFixed(2).replace('.',',');
 const description=sanitizeRichText(product.small_description)||'<p>Een krachtig onderdeel voor jouw avontuur in Steampunk SMP.</p>';
 function addProduct(purchaseMode:'once'|'subscribe'){
  add(product,{purchaseMode});
  setShowPurchaseChoice(false);
 }
 return <motion.article className="product-card" initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.12}} whileHover={{y:-9,rotateX:2}} transition={{type:'spring',stiffness:260,damping:18}}>
  <Link href={`/product/${product.id}`} className="product-image">
   {product.image?<img src={product.image} alt={product.name}/>:<div className="placeholder-art"><span>⚙</span><b>✦</b></div>}
   {product.featured?<span className="corner">UITGELICHT</span>:null}
   {product.percent_off&&product.percent_off>0?<span className="discount">-{product.percent_off}%</span>:null}
   <span className="scanline"/>
  </Link>
  <div className="product-body"><div><h3>{product.name}</h3><div className="product-description" dangerouslySetInnerHTML={{__html:description}} /></div>
   <div className="product-bottom"><strong>€ {price}</strong><button onClick={()=>product.subscription?setShowPurchaseChoice(true):addProduct('once')} aria-label={`Voeg ${product.name} toe`}><ShoppingCart size={18}/></button></div>
  </div>
  {showPurchaseChoice?<div className="purchase-modal-backdrop" role="presentation" onClick={()=>setShowPurchaseChoice(false)}>
   <div className="purchase-modal" role="dialog" aria-modal="true" aria-labelledby={`purchase-title-${product.id}`} onClick={e=>e.stopPropagation()}>
    <button className="purchase-modal-close" type="button" onClick={()=>setShowPurchaseChoice(false)} aria-label="Sluiten"><X size={18}/></button>
    <span className="eyebrow">KIES JE AANKOOP</span>
    <h3 id={`purchase-title-${product.id}`}>{product.name}</h3>
    <p>Wil je dit product eenmalig kopen of als abonnement aanschaffen?</p>
    <div className="purchase-modal-options">
     <button type="button" className="purchase-modal-option" onClick={()=>addProduct('once')}><b>Los kopen</b><small>Eenmalige betaling</small></button>
     <button type="button" className="purchase-modal-option purchase-modal-option-subscribe" onClick={()=>addProduct('subscribe')}><b>Abonneren</b><small>Automatisch verlengen</small></button>
    </div>
    <Link href={`/product/${product.id}`} className="purchase-modal-details">MEER INFORMATIE →</Link>
   </div>
  </div>:null}
 </motion.article>
}