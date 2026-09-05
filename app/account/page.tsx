'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, Ban, CalendarDays, CheckCircle2, Clock, CreditCard, ExternalLink, Loader2, LogOut, RefreshCw, Repeat, UserRound, XCircle } from 'lucide-react';
import { Header } from '@/components/header';

declare global {
  interface Window {
    Tip4Serv?: {
      OAuth?: {
        Connect: (opts: { return_url: string }) => Promise<void>;
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
const SDK_ID='tip4serv-account-sdk';
const SESSION_KEY='steampunk-smp-account-login-at';
const SESSION_TTL=12*60*60*1000;
const date=(ts:number)=>ts?new Date(ts>1e12?ts:ts*1000).toLocaleDateString('nl-NL',{day:'2-digit',month:'2-digit',year:'numeric'}):'—';
const money=(n:number,c='EUR')=>new Intl.NumberFormat('nl-NL',{style:'currency',currency:c||'EUR'}).format(Number(n)||0);
function sessionStarted(){try{const raw=localStorage.getItem(SESSION_KEY);const value=raw?Number(raw):0;return Number.isFinite(value)&&value>0?value:0;}catch{return 0}}
function rememberSession(){try{localStorage.setItem(SESSION_KEY,String(Date.now()))}catch{}}
function forgetSession(){try{localStorage.removeItem(SESSION_KEY)}catch{}}
function sessionValid(){const started=sessionStarted();return !!started&&(Date.now()-started<SESSION_TTL)}

function paymentStatus(status:string){
 const value=String(status||'').trim().toLowerCase().replace(/[_-]+/g,' ');
 if(['paid','complete','completed','success','successful','succeeded'].includes(value))return {kind:'paid',label:'PAID'};
 if(['pending','processing','waiting','awaiting payment','open'].includes(value))return {kind:'pending',label:'PENDING'};
 if(['refused','declined','failed','failure','canceled','cancelled','rejected','denied'].includes(value))return {kind:'refused',label:'REFUSED'};
 return {kind:'pending',label:String(status||'PENDING').toUpperCase()};
}

function PaymentStatus({status}:{status:string}){
 const state=paymentStatus(status);
 if(state.kind==='paid')return <span className="account-status payment-paid"><CheckCircle2 size={13}/> {state.label}</span>;
 if(state.kind==='refused')return <span className="account-status payment-refused"><XCircle size={13}/> {state.label}</span>;
 return <span className="account-status payment-pending"><Clock size={13}/> {state.label}</span>;
}

async function api<T>(token:string,path:string,init?:RequestInit):Promise<T>{const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),10000);try{const r=await fetch(`https://api.tip4serv.com/v1${path}`,{...init,signal:controller.signal,headers:{Authorization:`Bearer ${token}`,Accept:'application/json','Content-Type':'application/json',...(init?.headers||{})}});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d?.error?.message||d?.message||d?.error||`Verzoek mislukt (${r.status})`);return d;}finally{clearTimeout(timeout)}}
const fetchJsonWithTimeout=async(url:string,ms=8000)=>{const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),ms);try{const r=await fetch(url,{signal:controller.signal,cache:'no-store'});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d?.error?.message||d?.error||`Verzoek mislukt (${r.status})`);return d;}finally{clearTimeout(timeout)}};

function loadSdk(storeId:number):Promise<void>{
  return new Promise((resolve,reject)=>{
    const existing=document.getElementById(SDK_ID) as HTMLScriptElement|null;
    if(existing){
      if(window.Tip4Serv?.OAuth?.Connect)return resolve();
      const onLoad=()=>window.Tip4Serv?.OAuth?.Connect?resolve():reject(new Error('Tip4Serv account SDK is geladen zonder OAuth.'));
      const onError=()=>reject(new Error('Tip4Serv account SDK kon niet worden geladen.'));
      existing.addEventListener('load',onLoad,{once:true});
      existing.addEventListener('error',onError,{once:true});
      return;
    }
    const script=document.createElement('script');
    script.id=SDK_ID;
    script.src=SDK;
    script.async=true;
    script.setAttribute('data-store-id',String(storeId));
    const onLoad=()=>window.Tip4Serv?.OAuth?.Connect?resolve():reject(new Error('Tip4Serv account SDK is geladen zonder OAuth.'));
    const onError=()=>reject(new Error('Tip4Serv account SDK kon niet worden geladen.'));
    script.addEventListener('load',onLoad,{once:true});
    script.addEventListener('error',onError,{once:true});
    document.head.appendChild(script);
  });
}

export default function Account(){
 const [store,setStore]=useState<number|null>(null);const [ready,setReady]=useState(false);const [loading,setLoading]=useState(true);const [token,setToken]=useState<string|null>(null);const [user,setUser]=useState<User|null>(null);const [tab,setTab]=useState<'profile'|'payments'|'subscriptions'>('profile');const [payments,setPayments]=useState<Payment[]>([]);const [subs,setSubs]=useState<Subscription[]>([]);const [error,setError]=useState('');const [busy,setBusy]=useState<number|null>(null);
 const clearLocalSession=useCallback(()=>{try{window.Tip4Serv?.OAuth?.Disconnect?.()}catch{}forgetSession();setToken(null);setUser(null);setPayments([]);setSubs([])},[]);
 useEffect(()=>{let cancelled=false;(async()=>{try{const d=await fetchJsonWithTimeout('/api/store',10000);if(cancelled)return;const id=Number(d?.id??d?.store?.id);if(!id)throw new Error('Store-ID ontbreekt in de Tip4Serv store-response.');setStore(id);}catch(e){if(!cancelled){setError(e instanceof Error?e.message:'De accountverbinding kon niet worden geladen.');setLoading(false);}}})();return()=>{cancelled=true}},[]);
 useEffect(()=>{if(!store)return;let cancelled=false;setLoading(true);loadSdk(store).then(()=>{if(cancelled)return;setReady(true);const params=new URLSearchParams(location.search);const returned=params.has('tip4serv_access_token');if(params.has('error')){setError('Inloggen is door Tip4Serv geannuleerd of mislukt.');}if(returned){try{window.Tip4Serv?.OAuth?.Save?.()}catch{setError('De Tip4Serv login-token kon niet worden opgeslagen.')}}const t=window.Tip4Serv?.OAuth?.Token?.();if(t){if(returned)rememberSession();if(sessionValid())setToken(t);else{try{window.Tip4Serv?.OAuth?.Disconnect?.()}catch{}forgetSession();setError('Je sessie is verlopen. Log opnieuw in.')}}const u=new URL(location.href);['tip4serv_access_token','error','state','code'].forEach(p=>u.searchParams.delete(p));if(returned||params.has('error'))history.replaceState({},document.title,u.pathname+u.search+u.hash);}).catch(e=>{if(!cancelled)setError(e instanceof Error?e.message:'Account-login kon niet worden geladen.')}).finally(()=>{if(!cancelled)setLoading(false)});return()=>{cancelled=true}},[store]);
 useEffect(()=>{if(!token)return;const check=()=>{if(!sessionValid())clearLocalSession()};const timer=setInterval(check,60000);check();return()=>clearInterval(timer)},[token,clearLocalSession]);
 const loadUser=useCallback(async()=>{if(!token)return;try{const d=await api<User>(token,'/user/whoami');setUser((d as any).user||(d as any));}catch{clearLocalSession();}},[token,clearLocalSession]);
 const loadPayments=useCallback(async()=>{if(!token)return;const d=await api<{payments:Payment[]}>(token,'/user/payments?page=1&max_page=50');setPayments(d.payments||[]);},[token]);
 const loadSubs=useCallback(async()=>{if(!token)return;const d=await api<{subscriptions:Subscription[]}>(token,'/user/subscriptions?page=1&max_page=50&only_recurring_subscription=false');setSubs(d.subscriptions||[]);},[token]);
 useEffect(()=>{if(token)loadUser().catch(()=>{});},[token,loadUser]);
 useEffect(()=>{if(tab==='payments'&&token)loadPayments().catch(e=>setError(e.message));if(tab==='subscriptions'&&token)loadSubs().catch(e=>setError(e.message));},[tab,token,loadPayments,loadSubs]);
 const connect=async()=>{setError('');if(!window.Tip4Serv?.OAuth?.Connect){setError('De Tip4Serv account-login is nog niet geladen.');return}try{await window.Tip4Serv.OAuth.Connect({return_url:`${location.origin}${location.pathname}`});}catch(e){setError(e instanceof Error?e.message:'Accountverbinding mislukt.')}};
 const logout=()=>clearLocalSession();
 const unsubscribe=async(id:number)=>{if(!token||!confirm('Weet je zeker dat je dit abonnement wilt annuleren?'))return;setBusy(id);setError('');try{await api(token,'/user/subscriptions/unsubscribe',{method:'PATCH',body:JSON.stringify({subscription_id:id})});setSubs(x=>x.map(s=>s.id===id?{...s,unsubscribed:true}:s));}catch(e){setError(e instanceof Error?e.message:'Annuleren mislukt')}finally{setBusy(null)}};
 if(loading)return <main><Header/><div className="account-page"><div className="account-loading"><Loader2 className="spin" size={35}/><p>Account wordt geladen...</p></div></div></main>;
 if(!token)return <main><Header/><div className="account-page"><Link href="/" className="text-link"><ArrowLeft size={15}/> TERUG NAAR HOME</Link><div className="account-login"><div className="account-icon"><UserRound size={36}/></div><span className="eyebrow">MIJN ACCOUNT</span><h1 className="shop-title">Jouw <em>Emporium-account</em></h1><p>Log in met je bestaande account of maak direct een nieuw account aan. In het volgende scherm kun je kiezen voor inloggen of registreren.</p><div className="account-auth-actions"><button className="brass-button" onClick={connect} disabled={!ready}><UserRound size={18}/> INLOGGEN</button><button className="account-register-button" onClick={connect} disabled={!ready}><UserRound size={18}/> ACCOUNT AANMAKEN</button></div>{error?<p className="checkout-error">{error}</p>:null}</div></div></main>;
 return <main><Header/><div className="account-page"><div className="account-top"><div><span className="eyebrow">MIJN ACCOUNT</span><h1 className="shop-title">Mijn <em>Emporium</em></h1><p>Beheer je profiel, aankopen en abonnementen.</p></div><button className="account-logout" onClick={logout}><LogOut size={15}/> UITLOGGEN</button></div><div className="account-tabs">{([['profile','Profiel',UserRound],['payments','Aankoopgeschiedenis',CreditCard],['subscriptions','Abonnementen',Repeat]] as const).map(([k,label,Icon])=><button key={k} className={tab===k?'active':''} onClick={()=>{setTab(k);setError('')}}><Icon size={16}/>{label}</button>)}</div>{error?<p className="checkout-error account-error">{error}</p>:null}{tab==='profile'?<div className="account-panel"><div className="account-avatar">{user?.profile_picture?<img src={user.profile_picture} alt=""/>:<UserRound size={32}/>}</div><h2>{user?.username||'Mijn account'}</h2><p>{user?.email||'E-mailadres niet beschikbaar'}</p><div className="account-details"><div><small>ACCOUNT-ID</small><b>{user?.id||'—'}</b></div><div><small>GEREGISTREERD</small><b><CalendarDays size={14}/> {date(user?.registration_date||0)}</b></div></div></div>:null}{tab==='payments'?<div className="account-list">{!payments.length?<div className="account-empty"><CreditCard size={30}/><p>Geen aankopen gevonden.</p></div>:payments.map(p=><div className="account-row" key={p.id}><div className="account-row-icon"><CreditCard size={18}/></div><div className="account-row-main"><b>Aankoop #{p.id}</b><span>{p.cart||'Emporium-aankoop'} · {date(p.date)}</span></div><strong>{money(p.amount,p.currency)}</strong><PaymentStatus status={p.status}/>{p.details_page?<a href={p.details_page} target="_blank" rel="noreferrer" className="account-external"><ExternalLink size={14}/></a>:null}</div>)}</div>:null}{tab==='subscriptions'?<div className="account-list">{!subs.length?<div className="account-empty"><Repeat size={30}/><p>Geen abonnementen gevonden.</p></div>:subs.map(s=><div className="account-row subscription-row" key={s.id}><div className="account-row-icon"><Repeat size={18}/></div><div className="account-row-main"><b>{s.name}</b><span>{money(s.price,s.currency)} · {s.onetime?'Eenmalig':'Terugkerend'} · gestart {date(s.start_date)}</span>{!s.onetime&&!s.unsubscribed?<small><Clock size={12}/> Volgende betaling: {date(s.next_payment)}</small>:null}</div><span className="account-status">{s.unsubscribed?<><XCircle size={13}/> Geannuleerd</>:<><CheckCircle2 size={13}/> {s.status||'Actief'}</>}</span>{!s.onetime&&!s.unsubscribed?<button className="unsubscribe" disabled={busy===s.id} onClick={()=>unsubscribe(s.id)}>{busy===s.id?<Loader2 className="spin" size={14}/>:<Ban size={14}/>} ANNULEREN</button>:null}</div>)}</div>:null}<div className="account-refresh"><button onClick={()=>tab==='payments'?loadPayments():tab==='subscriptions'?loadSubs():loadUser()}><RefreshCw size={14}/> VERNIEUW</button></div></div></main>;
}
