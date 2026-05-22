'use client';

import { Button } from '@/components/ui/button';
import styles from './SortModal.module.css';

export type SortOption = 'none' | 'name-asc' | 'price-low' | 'price-high' | 'stock-low' | 'stock-high';

interface SortModalProps {
  isOpen: boolean;
  activeSortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  onClose: () => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'none', label: 'Default' },
  { value: 'name-asc', label: 'A - Z (Alphabetically)' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'stock-low', label: 'Stock: Low to High' },
  { value: 'stock-high', label: 'Stock: High to Low' },
];

export default function SortModal({
  isOpen,
  activeSortOption,
  onSortChange,
  onClose,
}: SortModalProps) {
  if (!isOpen) return null;

  const handleSortClick = (sortOption: SortOption) => {
    onSortChange(sortOption);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Sort Products</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.sortOptions}>
            {sortOptions.map((option) => (
              <button
                key={option.value}
                className={`${styles.sortOption} ${
                  activeSortOption === option.value ? styles.active : ''
                }`}
                onClick={() => handleSortClick(option.value)}
              >
                <span className={styles.radioButton}>
                  {activeSortOption === option.value && (
                    <span className={styles.radioDot}></span>
                  )}
                </span>
                <span className={styles.sortLabel}>{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.footer}>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
