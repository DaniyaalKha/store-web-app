'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  slug: string;
  image: string;
  brand: string;
  title: string;
  price: number;
}

export default function ProductCard({ slug, image, brand, title, price }: ProductCardProps) {
  return (
    <Link href={`/product/${slug}`} className={styles.link}>
      <Card className={styles.card}>
        <div className={styles.imageContainer}>
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={styles.image}
            loading="eager"
            unoptimized={image.startsWith('http')}
          />
          <div className={styles.imageOverlay} />
        </div>
        <div className={styles.content}>
          <p className={styles.brand}>{brand}</p>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.price}>${price}</p>
        </div>
      </Card>
    </Link>
  );
}
