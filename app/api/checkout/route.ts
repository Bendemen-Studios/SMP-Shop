import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config';

export async function POST(request: NextRequest){
  try{
    const body=await request.json();
    if(!body?.store || !Array.isArray(body.products) || !body.user?.email) return NextResponse.json({error:'Vul alle verplichte gegevens in.'},{status:400});
    const response=await fetch(`${config.api.baseUrl}/store/checkout?store=${encodeURIComponent(body.store)}&redirect=true`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${config.api.key}`},body:JSON.stringify(body)});
    const text=await response.text(); let data:any; try{data=JSON.parse(text)}catch{data={error:text.slice(0,300)}}
    if(!response.ok) return NextResponse.json({error:data?.error||'Checkout kon niet worden aangemaakt.'},{status:response.status});
    return NextResponse.json(data);
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Checkout mislukt'},{status:500})}
}