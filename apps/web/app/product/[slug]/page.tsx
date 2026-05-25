'use client';

import { useEffect, useState, use } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductImage from '../../components/ProductImage';
import ProductInfo from '../../components/ProductInfo';
import ProductActions from '../../components/ProductActions';

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
  const { slug } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleAddToCart = () => {
    console.log('Added to cart');
  };

  const handleBuyNow = () => {
    console.log('Buy now clicked');
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
              description={product.description}
              stockQuantity={product.stock_quantity}
              brandLogo={product.brand.logo_url}
            />
            <div className="mt-6">
              <ProductActions
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
