'use client';

import OrderSummary from '../OrderSummary';
import styles from './OrderListOrder.module.css';

interface Order {
  id: string;
  date: string;
  orderNumber: string;
  paymentMethod: string;
  total: string;
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
          />
        </div>
      )}
    </div>
  );
}
