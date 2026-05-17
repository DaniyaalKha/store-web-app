'use client';

import ProductCard from '../ProductCard';
import styles from './ProductGallery.module.css';

interface Product {
  id: number;
  image: string;
  brand: string;
  title: string;
  price: number;
}

const products: Product[] = [
  { id: 1, image: '/vercel.svg', brand: 'Brand', title: 'Model name', price: 999 },
  { id: 2, image: '/vercel.svg', brand: 'Brand', title: 'Model name', price: 999 },
  { id: 3, image: '/vercel.svg', brand: 'Brand', title: 'Model name', price: 999 },
  { id: 4, image: '/vercel.svg', brand: 'Brand', title: 'Model name', price: 999 },
  { id: 5, image: '/vercel.svg', brand: 'Brand', title: 'Model name', price: 999 },
  { id: 6, image: '/vercel.svg', brand: 'Brand', title: 'Model name', price: 999 },
  { id: 7, image: '/vercel.svg', brand: 'Brand', title: 'Model name', price: 999 },
  { id: 8, image: '/vercel.svg', brand: 'Brand', title: 'Model name', price: 999 },
  { id: 9, image: '/vercel.svg', brand: 'Brand', title: 'Model name', price: 999 },
  { id: 10, image: '/vercel.svg', brand: 'Brand', title: 'Model name', price: 999 },
  { id: 11, image: '/vercel.svg', brand: 'Brand', title: 'Model name', price: 999 },
  { id: 12, image: '/vercel.svg', brand: 'Brand', title: 'Model name', price: 999 },
];

export default function ProductGallery() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.gallery}>
        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              image={product.image}
              brand={product.brand}
              title={product.title}
              price={product.price}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
