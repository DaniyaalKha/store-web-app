'use client';

import { useEffect, useState, use } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductImage from '../../components/ProductImage';
import ProductInfo from '../../components/ProductInfo';
import ProductActions from '../../components/ProductActions';
import Toast from '../../components/Toast/Toast';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/use-auth';

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

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ProductViewPage({ params }: PageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { slug } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const canAddToCart = !authLoading && user?.role === 'customer';

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products/by-slug/${slug}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data: Product = await response.json();
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [slug]);

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
      const timer = setTimeout(() => setSuccessMessage(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleBuyNow = async () => {
    if (!product) return;
    if (authLoading) {
      return;
    }

    if (!user || user.role !== 'customer') {
      router.push(`/login?returnTo=${encodeURIComponent(pathname)}`);
      return;
    }

    try {
      setPurchaseError(null);
      setIsAddingToCart(true);
      const response = await fetch('/api/user/orders/buy-now', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        setPurchaseError(errorBody?.error ?? 'Failed to create order');
        return;
      }

      const data = await response.json();
      router.push(`/order-confirmation?orderId=${data.orderId}`);
    } catch (err) {
      console.error('Error creating order:', err);
      setPurchaseError(err instanceof Error ? err.message : 'Failed to create order');
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
              price={typeof product.price === 'string' ? parseFloat(product.price) : product.price}
              description={product.description || undefined}
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
            {purchaseError && (
              <p className="mt-3 text-sm text-red-500">{purchaseError}</p>
            )}
            <div className="mt-6">
              <ProductActions
                onAddToCart={canAddToCart ? handleAddToCart : undefined}
                onBuyNow={handleBuyNow}
                isLoading={isAddingToCart || authLoading}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
