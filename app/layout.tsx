import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Steampunk SMP — Ontdek de Wereld van Machtige Machines',
  description: 'De officiële Steampunk SMP webshop. Ontdek ranks, crates, cosmetics en meer.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="nl"><body>{children}</body></html>;
}