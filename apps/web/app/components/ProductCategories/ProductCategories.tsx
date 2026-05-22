'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import SortModal, { SortOption } from '../SortModal/SortModal';
import styles from './ProductCategories.module.css';

const categories = ['CPU', 'Graphics', 'Memory', 'Storage', 'Motherboards', 'Power', 'Cooling', 'Cases', 'Accessories'];

interface ProductCategoriesProps {
  fullWidth?: boolean;
  onSearchChange?: (search: string) => void;
  onCategoryChange?: (category: string) => void;
  onSortChange?: (sort: SortOption) => void;
  activeCategory?: string;
  activeSort?: SortOption;
}

export default function ProductCategories({ 
  fullWidth = false,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  activeCategory = '',
  activeSort = 'none'
}: ProductCategoriesProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(activeCategory);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    onSearchChange?.(value);
  };

  const handleCategoryClick = (category: string) => {
    const newCategory = selectedCategory === category ? '' : category;
    setSelectedCategory(newCategory);
    onCategoryChange?.(newCategory);
  };

  const handleSortChange = (sort: SortOption) => {
    onSortChange?.(sort);
  };

  return (
    <div className={`${styles.wrapper} ${fullWidth ? styles.fullWidth : ''}`}>
      <div className={styles.container}>
        {/* categories bar */}
        <div className={styles.categoriesBar}>
          {categories.map((category, index) => (
            <Button
              key={index}
              variant={selectedCategory === category ? 'default' : 'ghost'}
              className={styles.categoryButton}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* search and sort */}
        <div className={styles.searchContainer}>
          <div className={styles.searchInput}>
            <Search className={styles.searchIcon} />
            <Input
              type="text"
              placeholder="Search products..."
              className={styles.input}
              value={search}
              onChange={handleSearchChange}
            />
          </div>
          <Button 
            className={styles.filtersButton}
            onClick={() => setIsSortModalOpen(true)}
          >
            Sort
          </Button>
        </div>
      </div>

      <SortModal
        isOpen={isSortModalOpen}
        activeSortOption={activeSort}
        onSortChange={handleSortChange}
        onClose={() => setIsSortModalOpen(false)}
      />
    </div>
  );
}
