'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BillingInfo from '../components/BillingInfo';
import OrderSummary from '../components/OrderSummary';

interface OrderData {
  id: number;
  orderNumber: string;
  date: string;
  status: string;
  customerName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  products: Array<{
    id: number;
    name: string;
    quantity: number;
    price: number;
    imageUrl?: string;
  }>;
  total: string;
}

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) {
        setError('No order ID provided');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/user/orders/${orderId}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch order');
        }

        const data: OrderData = await response.json();
        setOrder(data);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError(err instanceof Error ? err.message : 'Failed to load order');
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p>Loading order confirmation...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center flex-col gap-4">
          <p>{error || 'Order not found'}</p>
          <Link href="/">
            <button className="text-blue-500 hover:underline">Return to store</button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      {/* main content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* LEFT - billing info summary */}
        <div className="w-full md:w-1/2 order-2 md:order-1 px-8 py-8 flex items-center justify-center">
          <div className="w-full max-w-md">
            <BillingInfo
              customerName={order.customerName}
              address={order.address}
              email={order.email}
            />
          </div>
        </div>

        {/* RIGHT - order summary */}
        <div className="w-full md:w-1/2 order-1 md:order-2 px-8 py-8 flex items-center justify-center">
          <div className="w-full max-w-md">
            <OrderSummary
              date={order.date}
              orderNumber={order.orderNumber}
              status={order.status}
              total={order.total}
              products={order.products}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
