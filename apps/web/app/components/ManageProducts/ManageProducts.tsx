'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import ManageProductRow from '../ManageProductRow';
import ProductEditModal from '../ProductEditModal';
import ProductCategories from '../ProductCategories';
import { SortOption } from '../SortModal/SortModal';
import styles from './ManageProducts.module.css';

interface DBProduct {
  id: number;
  name: string;
  slug: string;
  image_url: string | null;
  model_3d_url: string | null;
  price: string | number;
  stock_quantity: number;
  brand: {
    name: string;
  };
  category: {
    name: string;
  };
}

interface DisplayProduct {
  id: number;
  name: string;
  image: string;
  brandName: string;
}

interface ProductEditData {
  id: number;
  name: string;
  brandName: string;
  category: string;
  imageUrl: string;
  modelUrl: string;
  price: string;
  description: string;
  stockQuantity: string;
  isNew: boolean;
}

export default function ManageProducts() {
  const [allProducts, setAllProducts] = useState<DBProduct[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<DisplayProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductEditData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sort, setSort] = useState<SortOption>('none');

  // fetch products from db
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (selectedCategory) params.append('category', selectedCategory);

        const url = `/api/products${params.toString() ? `?${params.toString()}` : ''}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data: DBProduct[] = await response.json();
        setAllProducts(data);

        // convert to display format
        const displayProducts = data.map((product) => ({
          id: product.id,
          name: product.name,
          image: product.image_url || '/vercel.svg',
          brandName: product.brand.name,
        }));

        // apply sorting
        const sortedProducts = applySorting(displayProducts, sort);
        setDisplayedProducts(sortedProducts);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [search, selectedCategory, sort]);

  const applySorting = (productsToSort: DisplayProduct[], sortOption: SortOption) => {
    const sorted = [...productsToSort];
    
    switch (sortOption) {
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'price-low':
      case 'price-high':
      case 'stock-low':
      case 'stock-high':
        return sorted;
      case 'none':
      default:
        return sorted;
    }
  };

  const handleAddProduct = () => {
    const newProduct: ProductEditData = {
      id: 0,
      name: '',
      brandName: '',
      category: '',
      imageUrl: '',
      modelUrl: '',
      price: '',
      description: '',
      stockQuantity: '0',
      isNew: true,
    };
    setSelectedProduct(newProduct);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: DisplayProduct) => {
    // find product data
    const fullProduct = allProducts.find((p) => p.id === product.id);
    if (!fullProduct) return;

    const editData: ProductEditData = {
      id: fullProduct.id,
      name: fullProduct.name,
      brandName: fullProduct.brand.name,
      category: fullProduct.category.name,
      imageUrl: fullProduct.image_url || '',
      modelUrl: fullProduct.model_3d_url || '',
      price: String(fullProduct.price),
      description: '',
      stockQuantity: String(fullProduct.stock_quantity),
      isNew: false,
    };
    setSelectedProduct(editData);
    setIsModalOpen(true);
  };

  const handleConfirmEdit = async (editedProduct: ProductEditData) => {
    try {
      const payload = {
        productName: editedProduct.name,
        brandName: editedProduct.brandName,
        category: editedProduct.category,
        imageUrl: editedProduct.imageUrl,
        modelUrl: editedProduct.modelUrl,
        price: editedProduct.price,
        description: editedProduct.description,
        stockQuantity: editedProduct.stockQuantity,
      };

      let response;
      if (editedProduct.isNew) {
        response = await fetch('/api/products/admin', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch(`/api/products/admin/${editedProduct.id}`, {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save product');
      }

      // refresh products list
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedCategory) params.append('category', selectedCategory);

      const url = `/api/products${params.toString() ? `?${params.toString()}` : ''}`;
      const refreshResponse = await fetch(url);
      const refreshedData: DBProduct[] = await refreshResponse.json();
      
      const displayProducts = refreshedData.map((product) => ({
        id: product.id,
        name: product.name,
        image: product.image_url || '/vercel.svg',
        brandName: product.brand.name,
      }));

      const sortedProducts = applySorting(displayProducts, sort);
      setDisplayedProducts(sortedProducts);
      setAllProducts(refreshedData);

      setIsModalOpen(false);
      setSelectedProduct(null);
    } catch (err) {
      console.error('Error saving product:', err);
      alert(err instanceof Error ? err.message : 'Failed to save product');
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      const response = await fetch(`/api/products/admin/${productId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete product');
      }

      // refresh products list
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedCategory) params.append('category', selectedCategory);

      const url = `/api/products${params.toString() ? `?${params.toString()}` : ''}`;
      const refreshResponse = await fetch(url);
      const refreshedData: DBProduct[] = await refreshResponse.json();
      
      const displayProducts = refreshedData.map((product) => ({
        id: product.id,
        name: product.name,
        image: product.image_url || '/vercel.svg',
        brandName: product.brand.name,
      }));

      const sortedProducts = applySorting(displayProducts, sort);
      setDisplayedProducts(sortedProducts);
      setAllProducts(refreshedData);

      setIsModalOpen(false);
      setSelectedProduct(null);
    } catch (err) {
      console.error('Error deleting product:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSearchChange = (searchValue: string) => {
    setSearch(searchValue);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSortChange = (sortOption: SortOption) => {
    setSort(sortOption);
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

        <ProductCategories 
          fullWidth={true}
          onSearchChange={handleSearchChange}
          onCategoryChange={handleCategoryChange}
          onSortChange={handleSortChange}
          activeCategory={selectedCategory}
          activeSort={sort}
        />

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {loading && <p>Loading products...</p>}

        {/* products list */}
        <div className={styles.productsContainer}>
          {displayedProducts.map((product) => (
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
