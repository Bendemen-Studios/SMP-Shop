# ⚙ Steampunk SMP Shop

**Ontdek de Wereld van Machtige Machines**

Een volledig custom, animated steampunk Minecraft SMP storefront gebouwd met Next.js en **Tip4Serv als headless commerce backend**.

## Features

- Victorian steampunk UI met koper/brons/gouden industriële styling
- Framer Motion page, card, hover en entrance animations
- Bewegende tandwielen, stoomdeeltjes, scanlines en mechanische highlights
- Live Tip4Serv productcatalogus, categorieën, prijzen, voorraad en afbeeldingen
- Uitgebreide productpagina's met gallery, prijsinformatie, voorraad en serverkeuze
- Zoekfunctie en sortering: uitgelicht, prijs laag/hoog en naam
- Persistente Zustand winkelwagen
- Dynamische Tip4Serv checkout-identificatievelden op basis van de inhoud van de winkelwagen
- Ondersteuning voor Minecraft, Discord, Steam, FiveM, Rust en andere identifiers
- Serverselectie wordt vanuit het product naar de winkelwagen en checkout meegenomen
- Tip4Serv checkout met success/canceled/pending redirects
- API-key blijft uitsluitend server-side
- Mobile navigation en responsive layout
- Standaard poort **3030**

## Stack

- Next.js 16
- React 19
- TypeScript
- Framer Motion
- Zustand
- Lucide React
- Tip4Serv API

## Installatie

```bash
git clone https://github.com/Bendemen-Studios/SMP-Shop.git
cd SMP-Shop
npm install
cp .env.example .env.local
nano .env.local
npm run build
npm run start
```

## Environment

```env
TIP4SERV_API_KEY=your_tip4serv_api_key
TIP4SERV_API_BASE=https://api.tip4serv.com/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3030
```

`TIP4SERV_API_KEY` is verplicht. Zet nooit een API-key in client-side code of commit `.env.local` naar Git.

## PM2

```bash
pm2 start npm --name steampunk-smp-shop -- start
pm2 save
pm2 startup
```

De `start` script gebruikt automatisch poort **3030**. Voor Nginx Proxy Manager gebruik je op de storefront-VPS als upstream:

```text
http://SERVER-IP:3030
```

## Tip4Serv architectuur

De browser praat niet rechtstreeks met geauthenticeerde Tip4Serv endpoints. Next.js route handlers fungeren als server-side proxy:

```text
Browser
   ↓
Steampunk SMP Next.js
   ↓
/api/products
/api/categories
/api/store
/api/checkout/identifiers
/api/checkout
   ↓
Tip4Serv API
   ↓
Checkout / betaling / levering
```

## Ontwerp

Naam: **Steampunk SMP**  
Slogan: **Ontdek de Wereld van Machtige Machines**  
Thema: donkere Victorian steampunk, tandwielen, koper, brons, stoom, industriële panelen en motion effects.