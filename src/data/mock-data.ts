export interface Shop {
  id: string;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  isPopular: boolean;
  shopId: string;
}

export const shops: Shop[] = [
  {
    id: 's1',
    name: 'Burger Joint',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80',
    rating: 4.8,
    deliveryTime: '15-25 min',
    tags: ['Burgers', 'Fast Food', 'American']
  },
  {
    id: 's2',
    name: 'Coffee House',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80',
    rating: 4.6,
    deliveryTime: '10-15 min',
    tags: ['Coffee', 'Desserts', 'Beverages']
  },
  {
    id: 's3',
    name: 'Campus Cafeteria',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80',
    rating: 4.5,
    deliveryTime: '5-10 min',
    tags: ['Snacks', 'Quick Bites', 'Local']
  },
  {
    id: 's4',
    name: 'Green & Healthy',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba88061?auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    deliveryTime: '20-30 min',
    tags: ['Healthy', 'Salads', 'Vegan']
  },
  {
    id: 's5',
    name: 'Pizza Express',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80',
    rating: 4.7,
    deliveryTime: '30-40 min',
    tags: ['Pizza', 'Italian', 'Fast Food']
  }
];

export const categories: Category[] = [
  { id: '1', name: 'Burgers', icon: '🍔' },
  { id: '2', name: 'Coffee', icon: '☕' },
  { id: '3', name: 'Healthy', icon: '🥗' },
  { id: '4', name: 'Pizza', icon: '🍕' },
  { id: '5', name: 'Snacks', icon: '🍟' },
  { id: '6', name: 'Desserts', icon: '🍩' },
];

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Classic Cheeseburger',
    price: 8.99,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
    rating: 4.8,
    isPopular: true,
    shopId: 's1',
  },
  {
    id: 'p2',
    name: 'Caramel Macchiato',
    price: 4.50,
    category: 'Coffee',
    image: 'https://images.unsplash.com/photo-1485603816654-7128f731112b?auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    isPopular: true,
    shopId: 's2',
  },
  {
    id: 'p3',
    name: 'Chicken Shawarma',
    price: 6.99,
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1648212101799-a35c24941d24?auto=format&fit=crop&w=400&q=80',
    rating: 4.7,
    isPopular: true,
    shopId: 's3',
  },
  {
    id: 'p4',
    name: 'Caesar Salad',
    price: 10.50,
    category: 'Healthy',
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=400&q=80',
    rating: 4.8,
    isPopular: false,
    shopId: 's4',
  },
  {
    id: 'p5',
    name: 'Pepperoni Pizza',
    price: 14.99,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    isPopular: true,
    shopId: 's5',
  },
  {
    id: 'p6',
    name: 'French Fries',
    price: 3.50,
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=400&q=80',
    rating: 4.6,
    isPopular: true,
    shopId: 's1',
  },
  {
    id: 'p7',
    name: 'Chocolate Muffin',
    price: 3.99,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=400&q=80',
    rating: 4.7,
    isPopular: false,
    shopId: 's2',
  },
  {
    id: 'p8',
    name: 'Samosa (2 pcs)',
    price: 2.50,
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80',
    rating: 4.5,
    isPopular: true,
    shopId: 's3',
  },
];
