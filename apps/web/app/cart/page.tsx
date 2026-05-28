'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartItem from '../components/CartItem';
import { Button } from '@/components/ui/button';
import styles from './cart.module.css';
import { useAuth } from '@/lib/use-auth';
import { useCart, type CartItem as CartItemType } from '@/lib/cart-context';

export default function CartPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { cartItems, removeFromCart, updateQuantity, isLoading: cartLoading } = useCart();
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'customer')) {
      // redirect to home if not authenticated
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || cartLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const handleQuantityChange = async (id: string, newQuantity: number) => {
    try {
      setIsUpdating(id);
      await updateQuantity(id, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      setIsRemoving(id);
      await removeFromCart(id);
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setIsRemoving(null);
    }
  };

  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true);
      const response = await fetch('/api/user/orders/checkout', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error('Failed to checkout');
      }

      const data = await response.json();
      router.push(`/order-confirmation?orderId=${data.orderId}`);
    } catch (error) {
      console.error('Error during checkout:', error);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((sum, item) => sum + parseFloat(item.cost), 0)
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
                    slug={item.slug}
                    image={item.image}
                    productName={item.productName}
                    brandName={item.brandName}
                    quantity={item.quantity}
                    cost={item.cost}
                    onQuantityChange={handleQuantityChange}
                    onDelete={handleDeleteItem}
                    isUpdating={isUpdating === item.id}
                    isRemoving={isRemoving === item.id}
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
              <Button 
                className={styles.checkoutButton}
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? 'Processing...' : 'Checkout'}
              </Button>
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
