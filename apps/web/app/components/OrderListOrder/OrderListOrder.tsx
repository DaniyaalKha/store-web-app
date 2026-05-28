'use client';

import OrderSummary from '../OrderSummary';
import styles from './OrderListOrder.module.css';

interface OrderProduct {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  date: string;
  orderNumber: string;
  status?: string;
  total: string;
  paymentMethod?: string;
  products?: OrderProduct[];
  orderTime?: string;
}

interface OrderListOrderProps {
  order: Order;
  isExpanded: boolean;
  onToggleExpand: (orderId: string) => void;
}

export default function OrderListOrder({
  order,
  isExpanded,
  onToggleExpand,
}: OrderListOrderProps) {
  return (
    <div className={styles.orderItem}>
      <button
        className={styles.orderHeader}
        onClick={() => onToggleExpand(order.id)}
      >
        <span className={styles.orderDate}>{order.date}</span>
        <span
          className={`${styles.expandIcon} ${isExpanded ? styles.expanded : ''}`}
        >
          ▼
        </span>
      </button>

      {isExpanded && (
        <div className={styles.orderContent}>
          <OrderSummary
            date={order.date}
            orderNumber={order.orderNumber}
            paymentMethod={order.paymentMethod}
            total={order.total}
            status={order.status}
            products={order.products}
          />
        </div>
      )}
    </div>
  );
}
