'use client';

import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BillingInfo from '../components/BillingInfo';
import OrderSummary from '../components/OrderSummary';

export default function OrderConfirmationPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      {/* main content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* LEFT - billing info summary */}
        <div className="w-full md:w-1/2 order-2 md:order-1 px-8 py-8 flex items-center justify-center">
          <div className="w-full max-w-md">
            <BillingInfo />
          </div>
        </div>

        {/* RIGHT - order summary */}
        <div className="w-full md:w-1/2 order-1 md:order-2 px-8 py-8 flex items-center justify-center">
          <div className="w-full max-w-md">
            <OrderSummary />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
