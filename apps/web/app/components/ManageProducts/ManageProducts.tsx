'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ManageProductRow from '../ManageProductRow';
import ProductEditModal from '../ProductEditModal';
import ProductCategories from '../ProductCategories';
import styles from './ManageProducts.module.css';

interface Product {
  id: string;
  name: string;
  image: string;
}

interface ProductEditData {
  id: string;
  name: string;
  brand: string;
  category: string;
  image: string;
  model3D: string;
  price: string;
}

const placeholderProducts: Product[] = [
  {
    id: 'PROD-001',
    name: 'Product One',
    image: '/vercel.svg',
  },
  {
    id: 'PROD-002',
    name: 'Product Two',
    image: '/vercel.svg',
  },
  {
    id: 'PROD-003',
    name: 'Product Three',
    image: '/vercel.svg',
  },
];

export default function ManageProducts() {
  const [products, setProducts] = useState<Product[]>(placeholderProducts);
  const [selectedProduct, setSelectedProduct] = useState<ProductEditData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddProduct = () => {
    const newProduct: ProductEditData = {
      id: `PROD-${String(products.length + 1).padStart(3, '0')}`,
      name: '',
      brand: '',
      category: '',
      image: '',
      model3D: '',
      price: '',
    };
    setSelectedProduct(newProduct);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    const editData: ProductEditData = {
      id: product.id,
      name: product.name,
      brand: '',
      category: '',
      image: product.image,
      model3D: '',
      price: '',
    };
    setSelectedProduct(editData);
    setIsModalOpen(true);
  };

  const handleConfirmEdit = (editedProduct: ProductEditData) => {
    // Check if it's a new product or edit
    const existingIndex = products.findIndex((p) => p.id === editedProduct.id);

    if (existingIndex >= 0) {
      // update existing product
      const updatedProducts = [...products];
      updatedProducts[existingIndex] = {
        id: editedProduct.id,
        name: editedProduct.name,
        image: editedProduct.image,
      };
      setProducts(updatedProducts);
    } else {
      // add new product
      const newProduct: Product = {
        id: editedProduct.id,
        name: editedProduct.name,
        image: editedProduct.image,
      };
      setProducts([...products, newProduct]);
    }

    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter((p) => p.id !== productId));
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <section className={styles.container}>
        <div className={styles.headerContainer}>
          <h1 className={styles.heading}>Manage Products</h1>
          <Button
            onClick={handleAddProduct}
            className={styles.addButton}
          >
            Add
          </Button>
        </div>

        <ProductCategories fullWidth={true} />

        {/* products list */}
        <div className={styles.productsContainer}>
          {products.map((product) => (
            <ManageProductRow
              key={product.id}
              product={product}
              onEdit={handleEditProduct}
            />
          ))}
        </div>
      </section>

      {selectedProduct && (
        <ProductEditModal
          isOpen={isModalOpen}
          product={selectedProduct}
          onConfirm={handleConfirmEdit}
          onDelete={handleDeleteProduct}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
