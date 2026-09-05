import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config';

export async function POST(request: NextRequest){
  try{
    const body=await request.json();
    if(!body?.store || !Array.isArray(body.products) || !body.user?.email) return NextResponse.json({error:'Vul alle verplichte gegevens in.'},{status:400});
    const products=body.products.map((item:any)=>({
      product_id:Number(item.product_id),
      type:item.type==='subscribe'?'subscribe':'addtocart',
      quantity:Math.max(1,Number(item.quantity)||1),
      ...(item.server_selection!==undefined&&item.server_selection!==null?{server_selection:item.server_selection}:{}),
      ...(item.custom_fields&&typeof item.custom_fields==='object'?{custom_fields:item.custom_fields}:{}),
    }));
    if(products.some((item:any)=>!Number.isFinite(item.product_id)||item.product_id<1)){
      return NextResponse.json({error:'Een product in je aankoop heeft geen geldig Tip4Serv product-ID. Open het product opnieuw en probeer het nogmaals.'},{status:400});
    }
    const payload={store:body.store,products,user:body.user,redirect_success_checkout:body.redirect_success_checkout,redirect_canceled_checkout:body.redirect_canceled_checkout,redirect_pending_checkout:body.redirect_pending_checkout};
    const response=await fetch(`${config.api.baseUrl}/store/checkout?store=${encodeURIComponent(body.store)}&redirect=true`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${config.api.key}`},body:JSON.stringify(payload)});
    const text=await response.text(); let data:any; try{data=JSON.parse(text)}catch{data={error:text.slice(0,300)}}
    if(!response.ok) return NextResponse.json({error:data?.error||'Checkout kon niet worden aangemaakt.'},{status:response.status});
    return NextResponse.json(data);
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Checkout mislukt'},{status:500})}
}