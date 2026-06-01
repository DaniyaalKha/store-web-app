'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import styles from './BrandFilterModal.module.css';

interface Brand {
  id: number;
  name: string;
  logo_url: string | null;
}

interface BrandFilterModalProps {
  isOpen: boolean;
  selectedBrand: string;
  onBrandChange: (brand: string) => void;
  onClose: () => void;
}

export default function BrandFilterModal({
  isOpen,
  selectedBrand,
  onBrandChange,
  onClose,
}: BrandFilterModalProps) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/brands');
        if (!response.ok) throw new Error('Failed to fetch brands');
        const data: Brand[] = await response.json();
        setBrands(data);
      } catch (err) {
        console.error('Error fetching brands:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchBrands();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBrandClick = (brandName: string) => {
    const newBrand = selectedBrand === brandName ? '' : brandName;
    onBrandChange(newBrand);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Filter by Brand</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.brandOptions}>
            <button
              className={`${styles.brandOption} ${selectedBrand === '' ? styles.active : ''}`}
              onClick={() => handleBrandClick('')}
            >
              <span className={styles.radioButton}>
                {selectedBrand === '' && <span className={styles.radioDot}></span>}
              </span>
              <span className={styles.brandLabel}>All Brands</span>
            </button>

            {loading ? (
              <p className={styles.loadingText}>Loading brands...</p>
            ) : brands.length === 0 ? (
              <p className={styles.emptyText}>No brands available</p>
            ) : (
              brands.map((brand) => (
                <button
                  key={brand.id}
                  className={`${styles.brandOption} ${
                    selectedBrand === brand.name ? styles.active : ''
                  }`}
                  onClick={() => handleBrandClick(brand.name)}
                >
                  <span className={styles.radioButton}>
                    {selectedBrand === brand.name && (
                      <span className={styles.radioDot}></span>
                    )}
                  </span>
                  <div className={styles.brandContent}>
                    {brand.logo_url && (
                      <Image
                        src={brand.logo_url}
                        alt={brand.name}
                        width={24}
                        height={24}
                        className={styles.brandLogo}
                      />
                    )}
                    <span className={styles.brandLabel}>{brand.name}</span>
                  </div>
                </button>
              ))
            )}
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
