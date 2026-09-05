export type Product = {
  id: number; name: string; status?: boolean; slug?: string; price: number; old_price?: number; percent_off?: number;
  small_description?: string; category?: number | { id: number; name: string } | null; subscription?: boolean;
  stock?: number; featured?: boolean; image?: string;
};
export type Category = { id: number; name: string; slug: string; hide?: boolean; image?: string; description?: string };
export type Store = { id: number; title: string; description?: string; currency?: string; logo?: string; domain?: string };
export type CartItem = { product: Product; quantity: number };