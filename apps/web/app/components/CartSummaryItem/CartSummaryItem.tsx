'use client';

import Image from 'next/image';
import styles from './CartSummaryItem.module.css';

interface CartSummaryItemProps {
  image: string;
  productName: string;
  brandName: string;
  quantity: string;
  cost: string;
}

export default function CartSummaryItem({
  image,
  productName,
  brandName,
  quantity,
  cost,
}: CartSummaryItemProps) {
  return (
    <div className={styles.container}>
      {/* product image */}
      <div className={styles.imageWrapper}>
        <Image
          src={image}
          alt={productName}
          width={80}
          height={80}
          className={styles.image}
        />
      </div>

      {/* product info */}
      <div className={styles.infoWrapper}>
        <h4 className={styles.productName}>{productName}</h4>
        <p className={styles.brandName}>{brandName}</p>
        <p className={styles.quantity}>Qty: {quantity}</p>
      </div>

      {/* cost */}
      <div className={styles.costWrapper}>
        <span className={styles.cost}>{cost}</span>
      </div>
    </div>
  );
}
