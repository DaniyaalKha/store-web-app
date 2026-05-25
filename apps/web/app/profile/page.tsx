'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Profile from '../components/Profile';
import OrderListOrder from '../components/OrderListOrder';
import { Button } from '@/components/ui/button';
import styles from './profile.module.css';
import { useAuth } from '@/lib/use-auth';

interface Order {
  id: string;
  date: string;
  orderNumber: string;
  paymentMethod: string;
  total: string;
}

const placeholderOrders: Order[] = [
  {
    id: '1',
    date: '15 May 2026',
    orderNumber: 'ORD-001',
    paymentMethod: 'Credit Card',
    total: '$299.99',
  },
  {
    id: '2',
    date: '01 May 2026',
    orderNumber: 'ORD-002',
    paymentMethod: 'PayPal',
    total: '$149.99',
  },
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'customer')) {
      // redirect to home if not authenticated
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <main className="flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* profile container */}
          <Profile />

          {/* orders container */}
          <section className={styles.container}>
            <h1 className={styles.heading}>My Orders</h1>

            {/* date range filter */}
            <div className={styles.dateFilterContainer}>
              <div className={styles.dateFilterGroup}>
                <label htmlFor="startDate" className={styles.dateLabel}>
                  Start Date:
                </label>
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={styles.dateInput}
                />
              </div>
              <div className={styles.dateFilterGroup}>
                <label htmlFor="endDate" className={styles.dateLabel}>
                  End Date:
                </label>
                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={styles.dateInput}
                />
              </div>
              <Button className={styles.filterButton}>Filter</Button>
            </div>

            {/* orders list */}
            <div className={styles.ordersContainer}>
              {placeholderOrders.map((order) => (
                <OrderListOrder
                  key={order.id}
                  order={order}
                  isExpanded={expandedOrders[order.id] || false}
                  onToggleExpand={toggleOrderExpand}
                />
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
