'use client';

import { useEffect, useState } from 'react';
import ProductCard from '../ProductCard';
import styles from './ProductGallery.module.css';

interface Product {
  id: number;
  image_url: string | null;
  brand: {
    name: string;
  };
  name: string;
  price: string | number;
}

interface DisplayProduct {
  id: number;
  image: string;
  brand: string;
  title: string;
  price: number;
}

export default function ProductGallery() {
  const [products, setProducts] = useState<DisplayProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data: Product[] = await response.json();
        
        const displayProducts = data.map((product) => ({
          id: product.id,
          image: product.image_url || '/vercel.svg',
          brand: product.brand.name,
          title: product.name,
          price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
        }));
        
        setProducts(displayProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.gallery}>
          <div className={styles.grid}>
            <p>Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.gallery}>
          <div className={styles.grid}>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

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
