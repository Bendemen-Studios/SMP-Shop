'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Zap, HeartHandshake, Package, Cpu, Copy, Check, type LucideIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/header';
import { ProductCard } from '@/components/product-card';
import type { Product } from '@/lib/types';

const SERVER_IP='play.steampunksmp.nl';
const benefits:{icon:LucideIcon;title:string;text:string}[]=[
 {icon:ShieldCheck,title:'VEILIGE BETALINGEN',text:'Veilig en vertrouwd'},
 {icon:Zap,title:'DIRECTE LEVERING',text:'In-game na betaling'},
 {icon:HeartHandshake,title:'ONDERSTEUN DE SMP',text:'Help de community'},
 {icon:Package,title:'BOOST JE GAMEPLAY',text:'Help je eigen avontuur een handje'}
];
const purchases=(p:Product)=>Number(p.purchases??p.purchase_count??p.sales??p.sales_count??p.sold??0)||0;
const views=(p:Product)=>Number(p.views??p.view_count??p.product_views??0)||0;

export default function Home(){
 const [products,setProducts]=useState<Product[]>([]);const [online,setOnline]=useState(true);const [copied,setCopied]=useState(false);
 useEffect(()=>{fetch('/api/products').then(r=>r.json()).then(d=>setProducts(d.products||[])).catch(()=>setOnline(false));},[]);
 const copyIp=async()=>{try{await navigator.clipboard.writeText(SERVER_IP);setCopied(true);setTimeout(()=>setCopied(false),1800);}catch{}};
 const ranked=useMemo(()=>{
  const purchaseRank=[...products].filter(p=>purchases(p)>0).sort((a,b)=>purchases(b)-purchases(a)||views(b)-views(a));
  const chosen=purchaseRank.slice(0,5);const ids=new Set(chosen.map(p=>p.id));
  return [...chosen,...[...products].sort((a,b)=>views(b)-views(a)||purchases(b)-purchases(a)).filter(p=>!ids.has(p.id)).slice(0,5-chosen.length)].slice(0,5);
 },[products]);
 return <main><Header/><section className="hero"><div className="hero-gears">⚙</div><motion.div className="hero-copy" initial={{opacity:0,x:-50}} animate={{opacity:1,x:0}} transition={{duration:.8}}><div className="eyebrow"><Cpu size={15}/> BOUW • ONTDEK • OVERLEEF</div><h1>Ontdek de Wereld van<br/><em>Machtige Machines</em></h1><p>Betreed Steampunk SMP. En bewonder de Fabrieken, bedrijven en ontdek jouw plek in deze wereld waar je even terug in de tijd kan.</p><Link className="brass-button" href="/shop">BEKIJK DE SHOP <ArrowRight size={18}/></Link></motion.div><div className="hero-art"><div className="city"><div className="tower t1"/><div className="tower t2"/><div className="tower t3"/><div className="airship">◈</div></div></div><div className="status"><span className={online?'dot':''}/><div><small>SERVER STATUS</small><b>{online?'ONLINE':'OFFLINE'}</b><button className="server-ip" onClick={copyIp} title="Kopieer server IP" aria-label="Kopieer server IP"><span>{SERVER_IP}</span>{copied?<Check size={13}/>:<Copy size={13}/>}</button></div></div></section><section className="benefits">{benefits.map(({icon:Icon,title,text},i)=><motion.div key={title} initial={{opacity:0,y:15}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.08}}><Icon/><div><b>{title}</b><span>{text}</span></div></motion.div>)}</section><section className="section"><div className="section-head"><div><span className="eyebrow">UITGEKOZEN DOOR DE COMMUNITY</span><h2>Bestsellers</h2></div><Link href="/shop">BEKIJK ALLE PRODUCTEN <ArrowRight size={16}/></Link></div><div className="products">{products.length?ranked.map(p=><ProductCard key={p.id} product={p}/>):[1,2,3,4,5].map(i=><div className="product-card skeleton" key={i}/>)}</div>{products.length>0&&ranked.length===0?<div className="empty">Er zijn nog geen aankoopgegevens beschikbaar.</div>:null}</section><section className="machine-banner"><div><span className="eyebrow">STEAM POWERED COMMUNITY</span><h2>Jouw avontuur.<br/><em>Jouw machine.</em></h2><p>Maak deel uit van een wereld waarin technologie en Minecraft samenkomen.</p><Link href="/shop" className="text-link">ONTDEK MEER <ArrowRight size={16}/></Link></div><div className="big-gear">⚙</div></section><footer><div className="footer-brand">STEAMPUNK <span>SMP</span></div><p>Ontdek de Wereld van Machtige Machines.</p><span>© {new Date().getFullYear()} Steampunk SMP</span></footer></main>
}