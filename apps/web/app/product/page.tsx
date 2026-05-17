'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductImage from '../components/ProductImage';
import ProductInfo from '../components/ProductInfo';
import ProductActions from '../components/ProductActions';

export default function ProductView() {
  /* placeholder functions*/
  const handleAddToCart = () => {
    console.log('Added to cart');
  };

  const handleBuyNow = () => {
    console.log('Buy now clicked');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      {/* main product content */}
      <div className="flex-1 flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 order-2 md:order-1">
          <ProductImage />
        </div>
        <div className="w-full md:w-1/2 order-1 md:order-2 flex items-center justify-center px-8 py-8">
          <div className="w-full max-w-md">
            <ProductInfo />
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
