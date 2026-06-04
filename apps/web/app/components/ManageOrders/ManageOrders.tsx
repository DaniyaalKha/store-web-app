'use client';

import { useState, useEffect } from 'react';
import styles from './ManageOrders.module.css';

interface OrderProduct {
  product_id: number;
  product_name: string;
  quantity: number;
  price: string | number;
}

interface OrderUser {
  email: string;
  firstName: string | null;
  lastName: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
}

interface Order {
  id: number;
  user: OrderUser;
  status: string;
  order_time: string;
  products: OrderProduct[];
}

export default function ManageOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [emailFilter, setEmailFilter] = useState('');

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const response = await fetch('/api/orders');

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data: Order[] = await response.json();
        setOrders(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  const calculateTotal = (products: OrderProduct[]): number => {
    return products.reduce((total, item) => {
      const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredOrders = orders.filter((order) =>
    order.user.email.toLowerCase().includes(emailFilter.toLowerCase())
  );

  const formatBillingInfo = (user: OrderUser): string => {
    const parts = [];
    if (user.address) parts.push(user.address);
    if (user.city) parts.push(user.city);
    if (user.state) parts.push(user.state);
    if (user.country) parts.push(user.country);
    return parts.length > 0 ? parts.join(', ') : 'No address provided';
  };

  return (
    <section className={styles.container}>
      <div className={styles.headerContainer}>
        <h1 className={styles.heading}>Manage Orders</h1>
        <div className={styles.filterContainer}>
          <input
            type="text"
            placeholder="Filter by email..."
            value={emailFilter}
            onChange={(e) => setEmailFilter(e.target.value)}
            className={styles.emailInput}
          />
        </div>
      </div>

      {error && <p style={{ color: 'hsl(var(--destructive))' }}>{error}</p>}
      {loading && <p>Loading orders...</p>}

      {!loading && !error && filteredOrders.length === 0 && (
        <p className={styles.noOrders}>
          {emailFilter ? 'No orders found for this email' : 'No orders found'}
        </p>
      )}

      {!loading && !error && filteredOrders.length > 0 && (
        <div className={styles.ordersContainer}>
          {filteredOrders.map((order) => (
            <div key={order.id} className={styles.orderRow}>
              <div className={styles.orderHeader}>
                <div className={styles.orderInfo}>
                  <span className={styles.label}>Order ID:</span>
                  <span className={styles.value}>#{order.id}</span>
                </div>
                <div className={styles.orderInfo}>
                  <span className={styles.label}>Date:</span>
                  <span className={styles.value}>{formatDate(order.order_time)}</span>
                </div>
                <div className={styles.orderInfo}>
                  <span className={styles.label}>Status:</span>
                  <span className={`${styles.value} ${styles[`status-${order.status}`.toLowerCase()]}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className={styles.orderDetails}>
                <div className={styles.column}>
                  <div className={styles.detailSection}>
                    <h3 className={styles.sectionTitle}>Email</h3>
                    <p className={styles.sectionContent}>{order.user.email}</p>
                  </div>
                </div>

                <div className={styles.column}>
                  <div className={styles.detailSection}>
                    <h3 className={styles.sectionTitle}>Billing Information</h3>
                    <p className={styles.sectionContent}>{formatBillingInfo(order.user)}</p>
                  </div>
                </div>
              </div>

              <div className={styles.itemsSection}>
                <h3 className={styles.sectionTitle}>Items</h3>
                <div className={styles.itemsList}>
                  {order.products.map((item, index) => (
                    <div key={`${order.id}-${index}`} className={styles.item}>
                      <span className={styles.itemName}>{item.product_name}</span>
                      <span className={styles.itemQuantity}>Qty: {item.quantity}</span>
                      <span className={styles.itemPrice}>
                        ${(typeof item.price === 'string' ? parseFloat(item.price) : item.price).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.totalSection}>
                <span className={styles.totalLabel}>Total:</span>
                <span className={styles.totalAmount}>
                  ${calculateTotal(order.products).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
