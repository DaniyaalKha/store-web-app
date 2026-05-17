'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartItem from '../components/CartItem';
import { Button } from '@/components/ui/button';
import styles from './cart.module.css';

interface CartProduct {
  id: string;
  image: string;
  productName: string;
  brandName: string;
  quantity: number;
  cost: string;
  pricePerUnit: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartProduct[]>([
    {
      id: '1',
      image: '/vercel.svg',
      productName: 'Product',
      brandName: 'Brand',
      quantity: 1,
      cost: '$100',
      pricePerUnit: 100,
    },
    {
      id: '2',
      image: '/vercel.svg',
      productName: 'Product',
      brandName: 'Brand',
      quantity: 1,
      cost: '$100',
      pricePerUnit: 100,
    },
    {
      id: '3',
      image: '/vercel.svg',
      productName: 'Product',
      brandName: 'Brand',
      quantity: 1,
      cost: '$100',
      pricePerUnit: 100,
    },
    {
      id: '4',
      image: '/vercel.svg',
      productName: 'Product',
      brandName: 'Brand',
      quantity: 1,
      cost: '$100',
      pricePerUnit: 100,
    },    
  ]);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    setCartItems(
      cartItems.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            quantity: newQuantity,
            cost: `$${(item.pricePerUnit * newQuantity).toFixed(2)}`,
          };
        }
        return item;
      })
    );
  };

  const handleDeleteItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((sum, item) => sum + item.pricePerUnit * item.quantity, 0)
      .toFixed(2);
  };

  const total = calculateTotal();
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <div className="flex-1 px-8 py-8">
        <div className="max-w-2xl mx-auto">
          {/* heading */}
          <div className={styles.headingSection}>
            <h1 className={styles.heading}>Shopping Cart</h1>
            <p className={styles.itemCount}>
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </p>
          </div>

          {/* cart items */}
          {cartItems.length > 0 ? (
            <>
              <div className={styles.itemsContainer}>
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    id={item.id}
                    image={item.image}
                    productName={item.productName}
                    brandName={item.brandName}
                    quantity={item.quantity}
                    cost={item.cost}
                    onQuantityChange={handleQuantityChange}
                    onDelete={handleDeleteItem}
                  />
                ))}
              </div>

              <div className={styles.divider} />

              {/* cart summary */}
              <div className={styles.cartSummary}>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Subtotal:</span>
                  <span className={styles.summaryValue}>${total}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Shipping:</span>
                  <span className={styles.summaryValue}>$0</span>
                </div>
                <div className={styles.summaryDivider} />
                <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                  <span className={styles.totalLabel}>Total:</span>
                  <span className={styles.totalValue}>${total}</span>
                </div>
              </div>

              {/* checkout button */}
              <Button className={styles.checkoutButton}>Checkout</Button>
            </>
          ) : (
            <div className={styles.emptyCart}>
              <p className={styles.emptyMessage}>Your cart is empty</p>
              <Link href="/product" className={styles.continueShoppingLink}>
                Continue Shopping
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
