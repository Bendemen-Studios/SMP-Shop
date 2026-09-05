'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowLeft, CheckCircle2, Package, Zap, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { useCart } from '@/lib/cart';
import type { Product } from '@/lib/types';

type DetailedProduct=Product&{description?:string;gallery?:string[];youtube?:string;server_choice?:boolean;server_options?:{id:number;name:string}[];quantity?:boolean;stock?:number;subscription?:boolean;duration_periodicity?:string|boolean|null;period_num?:number;custom_fields?:unknown[]};
export default function ProductPage({params}:{params:Promise<{id:string}>}){
 const [product,setProduct]=useState<DetailedProduct|null>(null);const [selected,setSelected]=useState('');const [selectedImage,setSelectedImage]=useState('');const [qty,setQty]=useState(1);const [added,setAdded]=useState(false);const add=useCart(s=>s.add);
 useEffect(()=>{params.then(p=>fetch(`/api/products/${p.id}`).then(r=>r.ok?r.json():null).then((data:DetailedProduct|null)=>setProduct(data)).catch(()=>setProduct(null)))},[params]);
 if(!product)return <main><Header/><div className="empty"><div className="loading-machine">⚙</div>Product wordt uit de werkplaats gehaald...</div></main>;
 const currentProduct=product;
 const images=[...(currentProduct.image?[currentProduct.image]:[]),...(currentProduct.gallery||[])].filter((x,i,a):x is string=>Boolean(x)&&a.indexOf(x)===i);const activeImage=selectedImage||images[0];const price=Number(currentProduct.price||0);const max=currentProduct.stock&&currentProduct.stock>0?Math.min(currentProduct.stock,99):99;
 function addToCart(){const server=selected?Number(selected):undefined;for(let i=0;i<qty;i++)add(currentProduct,{serverSelection:server});setAdded(true);setTimeout(()=>setAdded(false),1800)}
 return <main><Header/><div className="product-page"><Link href="/shop" className="text-link"><ArrowLeft size={15}/> TERUG NAAR DE WERKPLAATS</Link><div className="product-detail">
  <motion.div className="detail-media" initial={{opacity:0,x:-25}} animate={{opacity:1,x:0}}>{activeImage?<motion.img key={activeImage} initial={{opacity:0}} animate={{opacity:1}} src={activeImage} alt={currentProduct.name}/>:<div className="placeholder-art"><span>⚙</span><b>✦</b></div>}<div className="media-frame"/><span className="machine-stamp">STEAMPUNK SMP</span></motion.div>
  <motion.div className="detail-copy" initial={{opacity:0,x:25}} animate={{opacity:1,x:0}}><span className="eyebrow">{currentProduct.featured?'UITGELICHTE MACHINE':'MACHINE UIT DE WERKPLAATS'}</span><h1>{currentProduct.name}</h1><p className="lead">{currentProduct.small_description||'Een exclusief onderdeel van jouw avontuur in de wereld van machtige machines.'}</p><div className="detail-price">€ {price.toFixed(2).replace('.',',')}{currentProduct.subscription?<small> / {currentProduct.duration_periodicity||'periode'}</small>:null}</div>{currentProduct.old_price&&currentProduct.old_price>price?<div className="old-price">Was € {currentProduct.old_price.toFixed(2).replace('.',',')} · {currentProduct.percent_off||Math.round((1-price/currentProduct.old_price)*100)}% voordeel</div>:null}
   <div className="specs"><div><ShieldCheck size={18}/><span><b>Veilige betaling</b><small>Veilige betaalomgeving</small></span></div><div><Zap size={18}/><span><b>Directe levering</b><small>Na succesvolle betaling</small></span></div><div><Package size={18}/><span><b>Voorraad</b><small>{currentProduct.stock&&currentProduct.stock>0?`${currentProduct.stock} beschikbaar`:'Beschikbaar'}</small></span></div></div>
   {currentProduct.server_choice&&currentProduct.server_options?.length?<label className="select-field">Server<select value={selected} onChange={e=>setSelected(e.target.value)}><option value="">Kies een server...</option>{currentProduct.server_options.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label>:null}
   {currentProduct.quantity!==false?<div className="qty-large"><span>AANTAL</span><button onClick={()=>setQty(Math.max(1,qty-1))}>−</button><b>{qty}</b><button onClick={()=>setQty(Math.min(max,qty+1))}>+</button></div>:null}
   <button className="brass-button add-large" onClick={addToCart} disabled={!!(currentProduct.server_choice&&currentProduct.server_options?.length&&!selected)}>{added?<><CheckCircle2 size={18}/> TOEGEVOEGD AAN WINKELWAGEN</>:<><ShoppingCart size={18}/> TOEVOEGEN AAN WINKELWAGEN</>}</button><Link href="/cart" className="cart-link">NAAR WINKELWAGEN →</Link>
  </motion.div></div>
  {images.length>1?<div className="gallery-strip">{images.map(image=><button key={image} className={activeImage===image?'gallery-active':''} onClick={()=>setSelectedImage(image)}><img src={image} alt=""/></button>)}</div>:null}
  <motion.section className="description-panel" initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}><span className="eyebrow">TECHNISCHE SPECIFICATIES</span><h2>Over deze machine</h2><div className="rich-description">{currentProduct.description?<p>{currentProduct.description}</p>:<p>Deze machine is onderdeel van Steampunk SMP. Productinformatie, prijzen en beschikbaarheid worden rechtstreeks vanuit de winkel geladen.</p>}</div></motion.section>
 </div></main>
}