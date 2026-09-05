'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from './types';

type AddOptions={serverSelection?:number;customFields?:Record<string,unknown>};
type CartStore={items:CartItem[];add:(product:Product,options?:AddOptions)=>void;remove:(id:number)=>void;setQty:(id:number,quantity:number)=>void;clear:()=>void;total:()=>number};
export const useCart=create<CartStore>()(persist((set,get)=>({
 items:[],
 add:(product,options={})=>set(state=>{const found=state.items.find(i=>i.product.id===product.id&&i.serverSelection===options.serverSelection);return {items:found?state.items.map(i=>i===found?{...i,quantity:i.quantity+1}:{...i}):[...state.items,{product,quantity:1,...options}]};}),
 remove:id=>set(state=>({items:state.items.filter(i=>i.product.id!==id)})),
 setQty:(id,quantity)=>set(state=>({items:quantity<1?state.items.filter(i=>i.product.id!==id):state.items.map(i=>i.product.id===id?{...i,quantity}:{...i})})),
 clear:()=>set({items:[]}),
 total:()=>get().items.reduce((sum,i)=>sum+i.product.price*i.quantity,0),
}),{name:'steampunk-smp-cart'}));