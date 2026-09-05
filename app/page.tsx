'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Zap, HeartHandshake, Package, Cpu, type LucideIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/header';
import { ProductCard } from '@/components/product-card';
import type { Product } from '@/lib/types';

const benefits:{icon:LucideIcon;title:string;text:string}[]=[
 {icon:ShieldCheck,title:'VEILIGE BETALINGEN',text:'Veilig en vertrouwd'},
 {icon:Zap,title:'DIRECTE LEVERING',text:'In-game na betaling'},
 {icon:HeartHandshake,title:'ONDERSTEUN DE SMP',text:'Help de community'},
 {icon:Package,title:'EXCLUSIEVE ITEMS',text:'Alleen hier verkrijgbaar'}
];
const purchases=(p:Product)=>Number(p.purchases??p.purchase_count??p.sales??p.sales_count??p.sold??0)||0;
const views=(p:Product)=>Number(p.views??p.view_count??p.product_views??0)||0;

export default function Home(){
 const [products,setProducts]=useState<Product[]>([]);const [online,setOnline]=useState(true);const [ranking,setRanking]=useState<'bestsellers'|'views'>('bestsellers');
 useEffect(()=>{fetch('/api/products').then(r=>r.json()).then(d=>setProducts(d.products||[])).catch(()=>setOnline(false));},[]);
 const ranked=useMemo(()=>{
  const purchaseRank=[...products].filter(p=>purchases(p)>0).sort((a,b)=>purchases(b)-purchases(a)||views(b)-views(a));
  const viewRank=[...products].sort((a,b)=>views(b)-views(a)||purchases(b)-purchases(a));
  if(ranking==='views') return viewRank.slice(0,5);
  const chosen=purchaseRank.slice(0,5);const ids=new Set(chosen.map(p=>p.id));
  if(chosen.length<5) return [...chosen,...viewRank.filter(p=>!ids.has(p.id)).slice(0,5-chosen.length)];
  return chosen;
 },[products,ranking]);
 return <main><Header/><section className="hero"><div className="hero-gears">⚙</div><motion.div className="hero-copy" initial={{opacity:0,x:-50}} animate={{opacity:1,x:0}} transition={{duration:.8}}><div className="eyebrow"><Cpu size={15}/> BOUW • ONTDEK • OVERLEEF</div><h1>Ontdek de Wereld van<br/><em>Machtige Machines</em></h1><p>Betreed Steampunk SMP. En bewonder de Fabrieken, bedrijven en ontdek jouw plek in deze wereld waar je even terug in de tijd kan.</p><Link className="brass-button" href="/shop">BEKIJK DE SHOP <ArrowRight size={18}/></Link></motion.div><div className="hero-art"><div className="city"><div className="tower t1"/><div className="tower t2"/><div className="tower t3"/><div className="airship">◈</div></div></div><div className="status"><span className={online?'dot':''}/><div><small>WERELDSTATUS</small><b>{online?'ONLINE':'OFFLINE'}</b><span>STEAMPUNK SMP</span></div></div></section><section className="benefits">{benefits.map(({icon:Icon,title,text},i)=><motion.div key={title} initial={{opacity:0,y:15}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.08}}><Icon/><div><b>{title}</b><span>{text}</span></div></motion.div>)}</section><section className="section"><div className="section-head"><div><span className="eyebrow">UITGEKOZEN DOOR DE COMMUNITY</span><h2>{ranking==='bestsellers'?'Bestsellers':'Meest bekeken'}</h2></div><Link href="/shop">BEKIJK ALLE PRODUCTEN <ArrowRight size={16}/></Link></div><div className="ranking-filters"><button className={ranking==='bestsellers'?'active':''} onClick={()=>setRanking('bestsellers')}>BESTSELLERS</button><button className={ranking==='views'?'active':''} onClick={()=>setRanking('views')}>MEEST BEKEKEN</button></div><div className="products">{products.length?ranked.map(p=><ProductCard key={p.id} product={p}/>):[1,2,3,4,5].map(i=><div className="product-card skeleton" key={i}/>)}</div>{products.length>0&&ranked.length===0?<div className="empty">Er zijn nog geen aankoop- of kijkgegevens beschikbaar.</div>:null}</section><section className="machine-banner"><div><span className="eyebrow">STEAM POWERED COMMUNITY</span><h2>Jouw avontuur.<br/><em>Jouw machine.</em></h2><p>Maak deel uit van een wereld waarin technologie en Minecraft samenkomen.</p><Link href="/shop" className="text-link">ONTDEK MEER <ArrowRight size={16}/></Link></div><div className="big-gear">⚙</div></section><footer><div className="footer-brand">STEAMPUNK <span>SMP</span></div><p>Ontdek de Wereld van Machtige Machines.</p><span>© {new Date().getFullYear()} Steampunk SMP</span></footer></main>
}