import Image from 'next/image';
import styles from './ProductInfo.module.css';

interface ProductInfoProps {
  productName?: string;
  brandName?: string;
  description?: string;
  price?: number | string;
  stockQuantity?: number;
  brandLogo?: string | null;
}

export default function ProductInfo({
  productName = 'Product name',
  brandName = 'Brand',
  description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  price = 99.99,
  stockQuantity = 0,
  brandLogo,
}: ProductInfoProps) {
  const displayPrice = typeof price === 'string' ? parseFloat(price) : price;
  const inStock = stockQuantity > 0;

  return (
    <div className={styles.content}>
        {/* product brand info */}
        <div className={styles.brand}>
          {brandLogo && (
            <div className={styles.logo}>
              <Image
                src={brandLogo}
                alt={`${brandName} Logo`}
                width={60}
                height={60}
              />
            </div>
          )}
          <p className={styles.brandName}>{brandName}</p>
        </div>

        {/* product name */}
        <h1 className={styles.title}>{productName}</h1>

        {/* product description */}
        <p className={`${styles.description} text-muted-foreground`}>{description}</p>

        {/* price and stock info */}
        <div className={styles.priceInfo}>
          <p className={`${styles.price} text-foreground`}>${displayPrice.toFixed(2)}</p>
          <p className={`${styles.stock} text-muted-foreground`}>
            {inStock ? `${stockQuantity} in stock` : 'Out of stock'}
          </p>
        </div>
    </div>
  );
}
