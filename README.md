# Steampunk SMP Shop

Een volledig custom steampunk-themed Next.js webshop voor Steampunk SMP, met animaties en Tip4Serv als commerce backend.

## Stack

- Next.js 16 + React 19
- TypeScript
- Framer Motion
- Zustand
- Tip4Serv API
- Poort 3030

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

Voor PM2:

```bash
pm2 start npm --name steampunk-smp-shop -- start
pm2 save
pm2 startup
```

De app gebruikt standaard poort **3030**. Zet je Nginx Proxy Manager naar `http://SERVER-IP:3030`.

## Environment

`TIP4SERV_API_KEY` is verplicht. De API-key wordt uitsluitend server-side gebruikt. Producten, categorieën, storegegevens en checkout worden via Next.js API routes naar Tip4Serv geproxied.

## Ontwerp

Slogan: **Ontdek de Wereld van Machtige Machines**

Thema: donkere Victorian steampunk, koper/brons, tandwielen, stoom, industriële panelen en motion effects.