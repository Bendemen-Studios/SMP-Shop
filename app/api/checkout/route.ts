import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config';

export async function POST(request: NextRequest){
  try{
    const body=await request.json();
    if(!body?.store || !Array.isArray(body.products) || !body.user?.email || !body.user?.minecraft_username){
      return NextResponse.json({error:'Vul je e-mailadres en Minecraft gebruikersnaam in.'},{status:400});
    }

    const minecraftUsername=String(body.user.minecraft_username).trim();
    if(minecraftUsername.length<3 || minecraftUsername.length>16){
      return NextResponse.json({error:'Vul een geldige Minecraft gebruikersnaam in.'},{status:400});
    }

    // Tip4Serv can use the Minecraft UUID as the stable player identifier on an online-mode server.
    // The customer only has to enter their familiar Minecraft username; we resolve it here.
    const profileResponse=await fetch(`https://api.mojang.com/users/profiles/minecraft/${encodeURIComponent(minecraftUsername)}`,{
      headers:{Accept:'application/json'},
      cache:'no-store',
    });
    if(!profileResponse.ok){
      return NextResponse.json({error:'Deze Minecraft gebruikersnaam kon niet worden gevonden. Controleer de naam en probeer het opnieuw.'},{status:400});
    }
    const profile=await profileResponse.json();
    if(!profile?.id || !profile?.name){
      return NextResponse.json({error:'Deze Minecraft gebruiker kon niet worden geverifieerd.'},{status:400});
    }

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

    const user={...body.user,minecraft_username:profile.name,minecraft_uuid:profile.id};
    const payload={store:body.store,products,user,redirect_success_checkout:body.redirect_success_checkout,redirect_canceled_checkout:body.redirect_canceled_checkout,redirect_pending_checkout:body.redirect_pending_checkout};
    const response=await fetch(`${config.api.baseUrl}/store/checkout?store=${encodeURIComponent(body.store)}&redirect=true`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${config.api.key}`},body:JSON.stringify(payload)});
    const text=await response.text(); let data:any; try{data=JSON.parse(text)}catch{data={error:text.slice(0,300)}}
    if(!response.ok) return NextResponse.json({error:data?.error||'Checkout kon niet worden aangemaakt.'},{status:response.status});
    return NextResponse.json(data);
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Checkout mislukt'},{status:500})}
}
