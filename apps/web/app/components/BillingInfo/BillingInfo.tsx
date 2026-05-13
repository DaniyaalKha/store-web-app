'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import styles from './BillingInfo.module.css';

interface BillingInfoProps {
  customerName?: string;
}

export default function BillingInfo({
  customerName = '(Name)',
}: BillingInfoProps) {
  return (
    <div className={styles.container}>
      {/* Thank you message */}
      <h1 className={styles.title}>
        Thank you for your purchase, {customerName}!
      </h1>

      {/* Processing message */}
      <p className={styles.notification}>
        Your order will be processed within 24 hours and we will notify you by email.
      </p>

      {/* Billing address section */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Billing address</h2>

        {/* Billing table */}
        <table className={styles.table}>
          <tbody>
            <tr>
              <td className={styles.label}>Name:</td>
              <td className={styles.value}>Lorem ipsum</td>
            </tr>
            <tr>
              <td className={styles.label}>Address:</td>
              <td className={styles.value}>Lorem ipsum</td>
            </tr>
            <tr>
              <td className={styles.label}>Email:</td>
              <td className={styles.value}>Lorem ipsum</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Return to store button */}
      <Link href="/store">
        <Button className={styles.returnButton} variant="outline">
          Return to store
        </Button>
      </Link>
    </div>
  );
}
