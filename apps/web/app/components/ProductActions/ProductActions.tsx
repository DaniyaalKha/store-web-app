'use client';

import { Button } from '@/components/ui/button';
import styles from './ProductActions.module.css';

interface ProductActionsProps {
  onAddToCart?: () => void;
  onBuyNow?: () => void;
}

export default function ProductActions({
  onAddToCart,
  onBuyNow,
}: ProductActionsProps) {
  return (
    <div className={styles.container}>
      {/* Add to Cart button */}
      <Button
        className={styles.addToCart}
        onClick={onAddToCart}
      >
        Add to cart
      </Button>

      {/* Buy Now button */}
      <Button
        variant="outline"
        className={styles.buyNow}
        onClick={onBuyNow}
      >
        Buy now
      </Button>
    </div>
  );
}
