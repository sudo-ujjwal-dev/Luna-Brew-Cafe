export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  categorySlug: string;
  image: string;
  imageAlt: string;
  available: boolean;
  featured: boolean;
  tags: string[];
  allergens: string[];
  preparationTime: number | null;
}

export interface MenuCategory {
  id: string;
  slug: string;
  name: string;
}
