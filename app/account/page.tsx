'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, Ban, CalendarDays, CheckCircle2, Clock, CreditCard, ExternalLink, Loader2, LogOut, RefreshCw, Repeat, UserRound, XCircle } from 'lucide-react';
import { Header } from '@/components/header';

declare global {
  interface Window {
    Tip4Serv?: {
      OAuth?: {
        Connect: (opts: { return_url: string; store_id?: number }) => Promise<void>;
        Save: (opts?: { token?: string }) => void;
        Token: () => string;
        Disconnect: () => void;
      };
    };
  }
}

type User={id:number;username?:string;email?:string;language?:string;timezone?:string;registration_date?:number;profile_picture?:string};
type Payment={id:number;status:string;cart:string;sub_id:number;date:number;amount:number;currency:string;username:string;identifier:string;gateway:string;details_page:string};
type Subscription={id:number;name:string;status:string;price:number;onetime:boolean;username:string;start_date:number;next_payment:number;expire_date:number;unsubscribed:boolean;duration_periodicity:string;period_num:number;currency:string;details_page:string};

const SDK='https://js.tip4serv.com/tip4serv.min.js?v=1.0.16';
const date=(ts:number)=>ts?new Date(ts>1e12?ts:ts*1000).toLocaleDateString('nl-NL',{day:'2-digit',month:'2-digit',year:'numeric'}):'—';
const money=(n:number,c='EUR')=>new Intl.NumberFormat('nl-NL',{style:'currency',currency:c||'EUR'}).format(Number(n)||0);

async function api<T>(token:string,path:string,init?:RequestInit):Promise<T>{
 const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),10000);
 try{const r=await fetch(`https://api.tip4serv.com/v1${path}`,{...init,signal:controller.signal,headers:{Authorization:`Bearer ${token}`,Accept:'application/json','Content-Type':'application/json',...(init?.headers||{})}});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d?.error?.message||d?.message||d?.error||`Verzoek mislukt (${r.status})`);return d;}finally{clearTimeout(timeout)}
}

const fetchJsonWithTimeout=async(url:string,ms=8000)=>{const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),ms);try{const r=await fetch(url,{signal:controller.signal});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d?.error||`Verzoek mislukt (${r.status})`);return d;}finally{clearTimeout(timeout)}};

export default function Account(){
 const [store,setStore]=useState<number|null>(null);const [ready,setReady]=useState(false);const [loading,setLoading]=useState(true);const [token,setToken]=useState<string|null>(null);const [user,setUser]=useState<User|null>(null);const [tab,setTab]=useState<'profile'|'payments'|'subscriptions'>('profile');const [payments,setPayments]=useState<Payment[]>([]);const [subs,setSubs]=useState<Subscription[]>([]);const [error,setError]=useState('');const [busy,setBusy]=useState<number|null>(null);
 useEffect(()=>{let cancelled=false;(async()=>{try{const d=await fetchJsonWithTimeout('/api/store',6000);if(cancelled)return;const id=Number(d?.id||(d?.store?.id));if(!id)throw new Error('Store-ID ontbreekt');setStore(id);}catch(e){if(!cancelled){setError(e instanceof Error?e.message:'De accountverbinding kon niet worden geladen.');setLoading(false);}}})();return()=>{cancelled=true}},[]);
 useEffect(()=>{if(!store)return;let cancelled=false;const existing=document.getElementById('tip4serv-account-sdk');if(existing&&window.Tip4Serv?.OAuth){setReady(true);setLoading(false);return}const s=document.createElement('script');s.id='tip4serv-account-sdk';s.src=SDK;s.async=true;s.setAttribute('data-store-id',String(store));const done=(ok:boolean)=>{if(cancelled)return;setReady(ok);if(ok){try{if(new URLSearchParams(location.search).has('tip4serv_access_token'))window.Tip4Serv?.OAuth?.Save?.()}catch{}const t=window.Tip4Serv?.OAuth?.Token?.();if(t)setToken(t);const u=new URL(location.href);['tip4serv_access_token','error','state','code'].forEach(p=>u.searchParams.delete(p));history.replaceState({},document.title,u.pathname+u.search+u.hash);}else setError('Account-login kon niet worden geladen.');setLoading(false)};s.onload=()=>done(true);s.onerror=()=>done(false);document.head.appendChild(s);const timeout=setTimeout(()=>done(false),8000);return()=>{cancelled=true;clearTimeout(timeout);};},[store]);
 const loadUser=useCallback(async()=>{if(!token)return;try{const d=await api<User>(token,'/user/whoami');setUser((d as any).user||(d as any));}catch{setToken(null);}},[token]);
 const loadPayments=useCallback(async()=>{if(!token)return;const d=await api<{payments:Payment[]}>(token,'/user/payments?page=1&max_page=50');setPayments(d.payments||[]);},[token]);
 const loadSubs=useCallback(async()=>{if(!token)return;const d=await api<{subscriptions:Subscription[]}>(token,'/user/subscriptions?page=1&max_page=50&only_recurring_subscription=false');setSubs(d.subscriptions||[]);},[token]);
 useEffect(()=>{if(token)loadUser().catch(()=>{});},[token,loadUser]);
 useEffect(()=>{if(tab==='payments'&&token)loadPayments().catch(e=>setError(e.message));if(tab==='subscriptions'&&token)loadSubs().catch(e=>setError(e.message));},[tab,token,loadPayments,loadSubs]);
 const connect=async()=>{setError('');if(!window.Tip4Serv?.OAuth?.Connect){setError('De accountverbinding is nog niet geladen.');return}try{await window.Tip4Serv.OAuth.Connect({return_url:`${location.origin}/account`,store_id:store||undefined});}catch(e){setError(e instanceof Error?e.message:'Accountverbinding mislukt.')}};
 const logout=()=>{try{window.Tip4Serv?.OAuth?.Disconnect?.()}catch{}setToken(null);setUser(null);setPayments([]);setSubs([])};
 const unsubscribe=async(id:number)=>{if(!token||!confirm('Weet je zeker dat je dit abonnement wilt annuleren?'))return;setBusy(id);setError('');try{await api(token,'/user/subscriptions/unsubscribe',{method:'PATCH',body:JSON.stringify({subscription_id:id})});setSubs(x=>x.map(s=>s.id===id?{...s,unsubscribed:true}:s));}catch(e){setError(e instanceof Error?e.message:'Annuleren mislukt')}finally{setBusy(null)}};
 if(loading)return <main><Header/><div className="account-page"><div className="account-loading"><Loader2 className="spin" size={35}/><p>Account wordt geladen...</p></div></div></main>;
 if(!token)return <main><Header/><div className="account-page"><Link href="/" className="text-link"><ArrowLeft size={15}/> TERUG NAAR HOME</Link><div className="account-login"><div className="account-icon"><UserRound size={36}/></div><span className="eyebrow">MIJN ACCOUNT</span><h1 className="shop-title">Jouw <em>Emporium-account</em></h1><p>Log in met je bestaande account of maak direct een nieuw account aan. In het volgende scherm kun je kiezen voor inloggen of registreren.</p><div className="account-auth-actions"><button className="brass-button" onClick={connect} disabled={!ready}><UserRound size={18}/> INLOGGEN</button><button className="account-register-button" onClick={connect} disabled={!ready}><UserRound size={18}/> ACCOUNT AANMAKEN</button></div>{error?<p className="checkout-error">{error}</p>:null}</div></div></main>;
 return <main><Header/><div className="account-page"><div className="account-top"><div><span className="eyebrow">MIJN ACCOUNT</span><h1 className="shop-title">Mijn <em>Emporium</em></h1><p>Beheer je profiel, aankopen en abonnementen.</p></div><button className="account-logout" onClick={logout}><LogOut size={15}/> UITLOGGEN</button></div><div className="account-tabs">{([['profile','Profiel',UserRound],['payments','Aankoopgeschiedenis',CreditCard],['subscriptions','Abonnementen',Repeat]] as const).map(([k,label,Icon])=><button key={k} className={tab===k?'active':''} onClick={()=>{setTab(k);setError('')}}><Icon size={16}/>{label}</button>)}</div>{error?<p className="checkout-error account-error">{error}</p>:null}{tab==='profile'?<div className="account-panel"><div className="account-avatar">{user?.profile_picture?<img src={user.profile_picture} alt=""/>:<UserRound size={32}/>}</div><h2>{user?.username||'Mijn account'}</h2><p>{user?.email||'E-mailadres niet beschikbaar'}</p><div className="account-details"><div><small>ACCOUNT-ID</small><b>{user?.id||'—'}</b></div><div><small>GEREGISTREERD</small><b><CalendarDays size={14}/> {date(user?.registration_date||0)}</b></div></div></div>:null}{tab==='payments'?<div className="account-list">{!payments.length?<div className="account-empty"><CreditCard size={30}/><p>Geen aankopen gevonden.</p></div>:payments.map(p=><div className="account-row" key={p.id}><div className="account-row-icon"><CreditCard size={18}/></div><div className="account-row-main"><b>Aankoop #{p.id}</b><span>{p.cart||'Emporium-aankoop'} · {date(p.date)}</span></div><strong>{money(p.amount,p.currency)}</strong><span className="account-status"><CheckCircle2 size={13}/> {p.status}</span>{p.details_page?<a href={p.details_page} target="_blank" rel="noreferrer" className="account-external"><ExternalLink size={14}/></a>:null}</div>)}</div>:null}{tab==='subscriptions'?<div className="account-list">{!subs.length?<div className="account-empty"><Repeat size={30}/><p>Geen abonnementen gevonden.</p></div>:subs.map(s=><div className="account-row subscription-row" key={s.id}><div className="account-row-icon"><Repeat size={18}/></div><div className="account-row-main"><b>{s.name}</b><span>{money(s.price,s.currency)} · {s.onetime?'Eenmalig':'Terugkerend'} · gestart {date(s.start_date)}</span>{!s.onetime&&!s.unsubscribed?<small><Clock size={12}/> Volgende betaling: {date(s.next_payment)}</small>:null}</div><span className="account-status">{s.unsubscribed?<><XCircle size={13}/> Geannuleerd</>:<><CheckCircle2 size={13}/> {s.status||'Actief'}</>}</span>{!s.onetime&&!s.unsubscribed?<button className="unsubscribe" disabled={busy===s.id} onClick={()=>unsubscribe(s.id)}>{busy===s.id?<Loader2 className="spin" size={14}/>:<Ban size={14}/>} ANNULEREN</button>:null}</div>)}</div>:null}<div className="account-refresh"><button onClick={()=>tab==='payments'?loadPayments():tab==='subscriptions'?loadSubs():loadUser()}><RefreshCw size={14}/> VERNIEUW</button></div></div></main>;
}
