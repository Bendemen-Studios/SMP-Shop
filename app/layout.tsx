import type { Metadata } from 'next';
import './globals.css';
import './steampunk.css';
import './responsive.css';
import './shop-logo.css';
import './account.css';
import './checkout-result.css';
import './discord.css';

export const metadata: Metadata = {
  title: 'Steampunk SMP — Ontdek de Wereld van Machtige Machines',
  description: 'De officiële Steampunk SMP webshop. Ontdek ranks, crates, cosmetics en meer.',
  icons: {
    icon: '/shop-logo-128.svg',
    shortcut: '/shop-logo-128.svg',
    apple: '/shop-logo-128.svg',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="nl"><body><style dangerouslySetInnerHTML={{__html:`
    .purchase-choice-grid{display:grid!important;grid-template-columns:1fr 1fr!important;gap:10px!important}
    .purchase-choice-grid .purchase-choice{appearance:none!important;-webkit-appearance:none!important;display:flex!important;flex-direction:column!important;justify-content:center!important;align-items:flex-start!important;gap:5px!important;min-height:72px!important;padding:14px 16px!important;background:#171717!important;border:1px solid #555!important;border-radius:0!important;color:#aaa!important;text-align:left!important;box-shadow:none!important;cursor:pointer!important}
    .purchase-choice-grid .purchase-choice b{display:block!important;width:100%!important;margin:0!important;color:#aaa!important;font:600 12px/1.25 Cinzel,serif!important}
    .purchase-choice-grid .purchase-choice small{display:block!important;width:100%!important;margin:0!important;color:#777!important;font:400 9px/1.35 Inter,sans-serif!important}
    .purchase-choice-grid .purchase-choice:hover{background:#202020!important;border-color:#777!important;color:#ddd!important;transform:translateY(-1px)!important}
    .purchase-choice-grid .purchase-choice.active{background:linear-gradient(180deg,#2a190d,#17100b)!important;border-color:#d18a3c!important;box-shadow:inset 0 0 0 1px #6d421d,0 0 18px #a760271c!important;color:#f0c88f!important}
    .purchase-choice-grid .purchase-choice.active b{color:#f0c88f!important}
    .purchase-choice-grid .purchase-choice.active small{color:#b9966d!important}
    @media(max-width:600px){.purchase-choice-grid{grid-template-columns:1fr!important}.purchase-choice-grid .purchase-choice{min-height:64px!important}}
  `}}/>{children}</body></html>;
}
