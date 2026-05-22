'use client';

import { useEffect, useState } from 'react';
import ProductCard from '../ProductCard';
import { SortOption } from '../SortModal/SortModal';
import styles from './ProductGallery.module.css';

interface Product {
  id: number;
  image_url: string | null;
  brand: {
    name: string;
  };
  name: string;
  price: string | number;
  stock_quantity: number;
}

interface DisplayProduct {
  id: number;
  image: string;
  brand: string;
  title: string;
  price: number;
  stockQuantity: number;
}

interface ProductGalleryProps {
  search?: string;
  category?: string;
  sort?: SortOption;
}

export default function ProductGallery({ search = '', category = '', sort = 'none' }: ProductGalleryProps) {
  const [products, setProducts] = useState<DisplayProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (category) params.append('category', category);

        const url = `/api/products${params.toString() ? `?${params.toString()}` : ''}`;
        const response = await fetch(url);
        
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
          stockQuantity: product.stock_quantity,
        }));
        
        // Apply sorting
        const sortedProducts = applySorting(displayProducts, sort);
        setProducts(sortedProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [search, category, sort]);

  const applySorting = (productsToSort: DisplayProduct[], sortOption: SortOption) => {
    const sorted = [...productsToSort];
    
    switch (sortOption) {
      case 'name-asc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'stock-low':
        return sorted.sort((a, b) => a.stockQuantity - b.stockQuantity);
      case 'stock-high':
        return sorted.sort((a, b) => b.stockQuantity - a.stockQuantity);
      case 'none':
      default:
        return sorted;
    }
  };

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

  if (products.length === 0) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.gallery}>
          <div className={styles.grid}>
            <p>No products found.</p>
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
