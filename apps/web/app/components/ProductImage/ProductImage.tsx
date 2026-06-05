'use client';

import Image from 'next/image';
import styles from './ProductImage.module.css';
import ModelViewer from './ModelViewer';

interface ProductImageProps {
  imageUrl?: string | null;
  model3dUrl?: string | null;
  productName?: string;
  brandLogo?: string | null;
}

export default function ProductImage({
  imageUrl,
  model3dUrl,
  productName = 'Product',
  brandLogo,
}: ProductImageProps) {
  // Use product image as primary image, fallback to brand logo, then fallback to placeholder
  const displayImage = imageUrl || brandLogo || '/vercel.svg';
  const showModel = !!model3dUrl;

  return (
    <div className={styles.container}>
      {showModel ? (
        <ModelViewer modelUrl={model3dUrl} />
      ) : (
        <div className={styles.imageWrapper}>
          <Image
            src={displayImage}
            alt={productName}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.image}
            priority
            loading="eager"
          />
        </div>
      )}
    </div>
  );
}
