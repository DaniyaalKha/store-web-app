'use client';

import { Button } from '@/components/ui/button';
import styles from './ProductActions.module.css';

interface ProductActionsProps {
  onAddToCart?: () => void;
  onBuyNow?: () => void;
  isLoading?: boolean;
}

export default function ProductActions({
  onAddToCart,
  onBuyNow,
  isLoading = false,
}: ProductActionsProps) {
  return (
    <div className={styles.container}>
      {/* Add to Cart button */}
      <Button
        className={styles.addToCart}
        onClick={onAddToCart}
        disabled={isLoading}
      >
        {isLoading ? 'Adding...' : 'Add to cart'}
      </Button>

      {/* Buy Now button */}
      <Button
        variant="outline"
        className={styles.buyNow}
        onClick={onBuyNow}
        disabled={isLoading}
      >
        Buy now
      </Button>
    </div>
  );
}
