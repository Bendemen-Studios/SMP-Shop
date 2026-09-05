export type Product = {
  id: number; name: string; status?: boolean; slug?: string; price: number; old_price?: number; percent_off?: number;
  small_description?: string; category?: number | { id: number; name: string } | null; subscription?: boolean;
  stock?: number; featured?: boolean; image?: string;
  purchases?: number; purchase_count?: number; sales?: number; sales_count?: number; sold?: number;
  views?: number; view_count?: number; product_views?: number;
};
export type Category = { id: number; name: string; slug: string; hide?: boolean; image?: string; description?: string };
export type Store = { id: number; title: string; description?: string; currency?: string; logo?: string; domain?: string };
export type CartItem = { product: Product; quantity: number; purchaseMode?: 'once' | 'subscribe'; serverSelection?: number; customFields?: Record<string, unknown> };