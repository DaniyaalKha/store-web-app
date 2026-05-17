'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import styles from './ProductCategories.module.css';

const categories = ['CPU', 'Graphics', 'Memory', 'Storage', 'Motherboards', 'Power', 'Cooling', 'Cases', 'Accessories'];

interface ProductCategoriesProps {
  fullWidth?: boolean;
}

export default function ProductCategories({ fullWidth = false }: ProductCategoriesProps) {
  return (
    <div className={`${styles.wrapper} ${fullWidth ? styles.fullWidth : ''}`}>
      <div className={styles.container}>
        {/* categories bar */}
        <div className={styles.categoriesBar}>
          {categories.map((category, index) => (
            <Button
              key={index}
              variant="ghost"
              className={styles.categoryButton}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* search and filters */}
        <div className={styles.searchContainer}>
          <div className={styles.searchInput}>
            <Search className={styles.searchIcon} />
            <Input
              type="text"
              placeholder="Search products..."
              className={styles.input}
            />
          </div>
          <Button className={styles.filtersButton}>
            Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
