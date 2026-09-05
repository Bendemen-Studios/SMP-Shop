import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config';

export async function GET(request: NextRequest){
 try{
  const store=request.nextUrl.searchParams.get('store');
  const products=request.nextUrl.searchParams.get('products');
  if(!store||!products)return NextResponse.json({error:'Store en producten zijn vereist.'},{status:400});
  const parsed=JSON.parse(products);
  if(!Array.isArray(parsed))throw new Error('products must be an array');
  const url=`${config.api.baseUrl}/store/checkout/identifiers?store=${encodeURIComponent(store)}&products=${encodeURIComponent(JSON.stringify(parsed))}`;
  const response=await fetch(url,{headers:{'Content-Type':'application/json'},cache:'no-store'});
  const text=await response.text();
  let data:any;try{data=JSON.parse(text)}catch{data=[]}
  if(!response.ok)return NextResponse.json({error:'Kon vereiste gegevens niet ophalen.',details:text.slice(0,300)},{status:response.status});
  return NextResponse.json({identifiers:Array.isArray(data)?data:data.identifiers||[]});
 }catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Identifiers ophalen mislukt'},{status:500})}
}