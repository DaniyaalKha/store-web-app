'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductImage from '../components/ProductImage';
import ProductInfo from '../components/ProductInfo';
import ProductActions from '../components/ProductActions';
import Toast from '../components/Toast/Toast';
import { useCart } from '@/lib/cart-context';

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: string | number;
  brand: {
    name: string;
    logo_url: string | null;
  };
  image_url: string | null;
  model_3d_url: string | null;
  stock_quantity: number;
}

export default function ProductView() {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data: Product[] = await response.json();
        if (data.length === 0) {
          throw new Error('No products available');
        }
        // Display the first product
        const firstProduct = data[0];
        if (firstProduct) {
          setProduct(firstProduct);
        } else {
          throw new Error('No products available');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, []);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      setIsAddingToCart(true);
      await addToCart(product.id);
      setSuccessMessage(true);
    } catch (err) {
      console.error('Error adding to cart:', err);
    } finally {
      setIsAddingToCart(false);
    }
  };

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(false), 3000); // hide after 3 secs
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleBuyNow = async () => {
    if (!product) return;
    try {
      setIsAddingToCart(true);
      const response = await fetch('/api/user/orders/buy-now', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const data = await response.json();
      router.push(`/order-confirmation?orderId=${data.orderId}`);
    } catch (err) {
      console.error('Error creating order:', err);
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p>Loading product...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p>{error || 'Product not found'}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      {/* main product content */}
      <div className="flex-1 flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 order-2 md:order-1">
          <ProductImage
            imageUrl={product.image_url}
            model3dUrl={product.model_3d_url}
            productName={product.name}
            brandLogo={product.brand.logo_url}
          />
        </div>
        <div className="w-full md:w-1/2 order-1 md:order-2 flex items-center justify-center px-8 py-8">
          <div className="w-full max-w-md">
            <ProductInfo
              productName={product.name}
              brandName={product.brand.name}
              description={product.description || undefined}
              price={product.price}
              stockQuantity={product.stock_quantity}
              brandLogo={product.brand.logo_url}
            />
            {successMessage && (
              <Toast
                message="Added to cart!"
                isVisible={successMessage}
                onClose={() => setSuccessMessage(false)}
              />
            )}
            <div className="mt-6">
              <ProductActions
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                isLoading={isAddingToCart}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
