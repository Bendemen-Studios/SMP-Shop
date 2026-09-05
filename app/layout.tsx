import type { Metadata } from 'next';
import './globals.css';
import './steampunk.css';
import './responsive.css';
import './shop-logo.css';

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
  return <html lang="nl"><body>{children}</body></html>;
}