'use client';
import { useEffect, useMemo, useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Header } from '@/components/header';
import { ProductCard } from '@/components/product-card';
import type { Product, Category } from '@/lib/types';

export default function Shop(){
 const [products,setProducts]=useState<Product[]>([]); const [cats,setCats]=useState<Category[]>([]); const [active,setActive]=useState('all'); const [query,setQuery]=useState(''); const [sort,setSort]=useState('featured'); const [loading,setLoading]=useState(true);
 useEffect(()=>{const category=new URLSearchParams(window.location.search).get('category');if(category)setActive(category);Promise.all([fetch('/api/products').then(r=>r.json()),fetch('/api/categories').then(r=>r.json())]).then(([p,c])=>{setProducts(p.products||[]);setCats((c.categories||[]).filter((x:Category)=>!x.hide));}).finally(()=>setLoading(false));},[]);
 const filtered=useMemo(()=>{let list=active==='all'?products:products.filter(p=>typeof p.category==='object'?p.category?.name.toLowerCase()===active.toLowerCase():cats.find(c=>c.id===p.category)?.name.toLowerCase()===active.toLowerCase());const q=query.trim().toLowerCase();if(q)list=list.filter(p=>`${p.name} ${p.small_description||''}`.toLowerCase().includes(q));return [...list].sort((a,b)=>sort==='price-low'?a.price-b.price:sort==='price-high'?b.price-a.price:sort==='name'?a.name.localeCompare(b.name):Number(b.featured)-Number(a.featured));},[products,cats,active,query,sort]);
 return <main><Header/><div className="shop-page"><span className="eyebrow">DE MARKTPLAATS VAN DE SMP</span><h1 className="shop-title">De <em>Werkplaats</em></h1><p className="shop-intro">Ontdek machines, upgrades, ranks, cosmetics en exclusieve items. Alles wordt live geladen.</p>
  <div className="shop-tools"><label className="search-box"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Zoek in de werkplaats..."/><button onClick={()=>setQuery('')} aria-label="Wis zoekopdracht"><X size={15}/></button></label><label className="sort-box"><SlidersHorizontal size={15}/><select value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Uitgelicht</option><option value="price-low">Prijs: laag → hoog</option><option value="price-high">Prijs: hoog → laag</option><option value="name">Naam A → Z</option></select></label></div>
  <div className="filters"><button className={`filter ${active==='all'?'active':''}`} onClick={()=>setActive('all')}>ALLES</button>{cats.map(c=><button key={c.id} className={`filter ${active===c.name.toLowerCase()?'active':''}`} onClick={()=>setActive(c.name.toLowerCase())}>{c.name.toUpperCase()}</button>)}</div>
  {loading?<div className="products">{[1,2,3,4].map(i=><div className="product-card skeleton" key={i}/>)}</div>:filtered.length?<div className="products">{filtered.map(p=><ProductCard key={p.id} product={p}/>)}</div>:<div className="empty">Geen machines gevonden. Probeer een andere zoekopdracht of categorie.</div>}
 </div></main>
}