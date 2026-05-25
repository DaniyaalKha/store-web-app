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
  // Use brand logo as primary image, fallback to product image, then fallback to placeholder
  const displayImage = brandLogo || imageUrl || '/vercel.svg';
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
            className={styles.image}
            priority
          />
        </div>
      )}
    </div>
  );
}
