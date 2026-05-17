'use client';

import CartSummaryItem from '../CartSummaryItem';
import styles from './OrderSummary.module.css';

interface OrderSummaryProps {
  date?: string;
  orderNumber?: string;
  paymentMethod?: string;
  total?: string;
}

export default function OrderSummary({
  date = 'Lorem ipsum',
  orderNumber = 'Lorem ipsum',
  paymentMethod = 'Lorem ipsum',
  total = '$100',
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
            <td className={styles.detailLabel}>Payment Method</td>
            </tr>
            <tr>
            <td className={styles.detailValue}>{date}</td>
            <td className={styles.detailValue}>{orderNumber}</td>
            <td className={styles.detailValue}>{paymentMethod}</td>
            </tr>
        </tbody>
        </table>

      {/* cart items section */}
      <div className={styles.itemsSection}>
        <CartSummaryItem
          image="/vercel.svg"
          productName="Product name"
          brandName="Brand name"
          quantity="1"
          cost="$100"
        />
        <CartSummaryItem
          image="/vercel.svg"
          productName="Product name 2"
          brandName="Brand name"
          quantity="1"
          cost="$100"
        />
      </div>

      {/* order total */}
      <div className={styles.totalRow}>
        <span className={styles.totalLabel}>Order total:</span>
        <span className={styles.totalAmount}>{total}</span>
      </div>
    </div>
  );
}
