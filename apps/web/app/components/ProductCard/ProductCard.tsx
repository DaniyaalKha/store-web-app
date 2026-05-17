'use client';

import Image from 'next/image';
import { Card } from '@/components/ui/card';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  image: string;
  brand: string;
  title: string;
  price: number;
}

export default function ProductCard({ image, brand, title, price }: ProductCardProps) {
  return (
    <Card className={styles.card}>
      <div className={styles.imageContainer}>
        <Image
          src={image}
          alt={title}
          fill
          className={styles.image}
        />
        <div className={styles.imageOverlay} />
      </div>
      <div className={styles.content}>
        <p className={styles.brand}>{brand}</p>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.price}>${price}</p>
      </div>
    </Card>
  );
}
