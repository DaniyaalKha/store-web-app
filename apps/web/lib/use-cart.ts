'use client';

import { useState, useCallback, useEffect } from 'react';

export interface CartItem {
  id: string;
  image: string;
  productName: string;
  brandName: string;
  quantity: number;
  cost: string;
  pricePerUnit: number;
}

export interface UseCartReturn {
  cartItems: CartItem[];
  cartCount: number;
  isLoading: boolean;
  error: string | null;
  addToCart: (productId: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  fetchCart: () => Promise<void>;
}

export function useCart(): UseCartReturn {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/user/cart', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      const data = await response.json();
      setCartItems(data.cartItems);
      setCartCount(data.cartCount);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch cart';
      setError(message);
      console.error('Fetch cart error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch cart on mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = useCallback(
    async (productId: number) => {
      try {
        setError(null);
        const response = await fetch('/api/user/cart/add', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, quantity: 1 }),
        });

        if (!response.ok) {
          throw new Error('Failed to add to cart');
        }

        const data = await response.json();
        setCartCount(data.cartCount);
        
        // refetch cart to get updated items
        await fetchCart();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to add to cart';
        setError(message);
        console.error('Add to cart error:', err);
        throw err;
      }
    },
    [fetchCart]
  );

  const removeFromCart = useCallback(
    async (productId: string) => {
      try {
        setError(null);
        const response = await fetch(`/api/user/cart/items/${productId}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to remove from cart');
        }

        const data = await response.json();
        setCartCount(data.cartCount);
        setCartItems((prev) =>
          prev.filter((item) => item.id !== productId)
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to remove from cart';
        setError(message);
        console.error('Remove from cart error:', err);
        throw err;
      }
    },
    []
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      try {
        setError(null);
        
        if (quantity < 1) {
          await removeFromCart(productId);
          return;
        }

        const response = await fetch(`/api/user/cart/items/${productId}`, {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity }),
        });

        if (!response.ok) {
          throw new Error('Failed to update cart');
        }

        // update local state
        setCartItems((prev) =>
          prev.map((item) =>
            item.id === productId
              ? {
                  ...item,
                  quantity,
                  cost: (item.pricePerUnit * quantity).toFixed(2),
                }
              : item
          )
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update cart';
        setError(message);
        console.error('Update quantity error:', err);
        throw err;
      }
    },
    [removeFromCart]
  );

  return {
    cartItems,
    cartCount,
    isLoading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    fetchCart,
  };
}
