'use client';

import CartSummaryItem from '../CartSummaryItem';
import styles from './OrderSummary.module.css';

interface OrderProduct {
  id: number;
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

interface OrderSummaryProps {
  date?: string;
  orderNumber?: string;
  paymentMethod?: string;
  total?: string;
  status?: string;
  products?: OrderProduct[];
}

export default function OrderSummary({
  date = 'Loading',
  orderNumber = 'Loading',
  paymentMethod = 'Loading',
  total = '$100',
  status = 'pending',
  products = [],
}: OrderSummaryProps) {
  return (
    <div className={styles.container}>
      {/* order summary heading */}
      <h2 className={styles.title}>Order Summary</h2>

      {/* order details table */}
      <table className={styles.detailsTable}>
        <tbody>
            <tr>
            <td className={styles.detailLabel}>Date</td>
            <td className={styles.detailLabel}>Order Number</td>
            <td className={styles.detailLabel}>Status</td>
            </tr>
            <tr>
            <td className={styles.detailValue}>{date}</td>
            <td className={styles.detailValue}>{orderNumber}</td>
            <td className={styles.detailValue}>{status}</td>
            </tr>
        </tbody>
        </table>

      {/* cart items section */}
      <div className={styles.itemsSection}>
        {products && products.length > 0 ? (
          products.map((product) => (
            <CartSummaryItem
              key={product.id}
              image={product.imageUrl || '/store-branding/logo.png'}
              productName={product.name}
              brandName="Brand name"
              quantity={String(product.quantity)}
              cost={`$${(product.price * product.quantity).toFixed(2)}`}
            />
          ))
        ) : (
          <CartSummaryItem
            image="/store-branding/logo.png"
            productName="Product name"
            brandName="Brand name"
            quantity="1"
            cost="$100"
          />
        )}
      </div>

      {/* order total */}
      <div className={styles.totalRow}>
        <span className={styles.totalLabel}>Order total:</span>
        <span className={styles.totalAmount}>{total}</span>
      </div>
    </div>
  );
}
