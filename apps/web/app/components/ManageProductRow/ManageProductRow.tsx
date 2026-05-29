'use client';

import Image from 'next/image';
import styles from './ManageProductRow.module.css';

interface Product {
  id: number;
  name: string;
  image: string;
  brandName: string;
}

interface ManageProductRowProps {
  product: Product;
  onEdit: (product: Product) => void;
}

export default function ManageProductRow({ product, onEdit }: ManageProductRowProps) {
  return (
    <div
      className={styles.row}
      onClick={() => onEdit(product)}
    >
      <div className={styles.imageWrapper}>
        <Image
          src={product.image}
          alt={product.name}
          width={60}
          height={60}
          className={styles.image}
        />
      </div>
      <div className={styles.info}>
        <p className={styles.id}>ID: {product.id}</p>
        <p className={styles.name}>{product.brandName} {product.name}</p>
      </div>
      <div className={styles.arrow}>→</div>
    </div>
  );
}
