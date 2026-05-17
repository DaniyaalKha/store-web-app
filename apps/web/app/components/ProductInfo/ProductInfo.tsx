import Image from 'next/image';
import styles from './ProductInfo.module.css';

interface ProductInfoProps {
  title?: string;
  description?: string;
  price?: string;
  brandLogo?: string;
}

export default function ProductInfo({
  title = 'Product name',
  description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  price = '$99.99',
  brandLogo = '/vercel.svg',
}: ProductInfoProps) {
  return (
    <div className={styles.content}>
        {/* product brand logo */}
        <div className={styles.logo}>
          <Image
            src={brandLogo}
            alt="Brand Logo"
            width={60}
            height={60}
          />
        </div>

        {/* product name */}
        <h1 className={styles.title}>{title}</h1>

        {/* product description */}
        <p className={`${styles.description} text-muted-foreground`}>{description}</p>

        {/* price */}
        <p className={`${styles.price} text-foreground`}>{price}</p>
    </div>
  );
}
