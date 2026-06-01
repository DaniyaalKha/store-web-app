'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import ModelViewer from '../ProductImage/ModelViewer';
import styles from './ProductEditModal.module.css';

interface Brand {
  id: number;
  name: string;
  logo_url: string | null;
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

interface ProductEditModalProps {
  isOpen: boolean;
  product: ProductEditData;
  onConfirm: (product: ProductEditData) => void;
  onDelete: (productId: number) => void;
  onClose: () => void;
}

const categories = ['CPU', 'Graphics', 'Memory', 'Storage', 'Motherboards', 'Power', 'Cooling', 'Cases', 'Accessories'];

export default function ProductEditModal({
  isOpen,
  product,
  onConfirm,
  onDelete,
  onClose,
}: ProductEditModalProps) {
  const [formData, setFormData] = useState<ProductEditData>(product);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);
  const [brandsLoading, setBrandsLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData(product);
    setErrors({});
  }, [product]);

  // Fetch brands on mount
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setBrandsLoading(true);
        const response = await fetch('/api/brands');
        if (!response.ok) throw new Error('Failed to fetch brands');
        const data: Brand[] = await response.json();
        setBrands(data);
      } catch (err) {
        console.error('Error fetching brands:', err);
      } finally {
        setBrandsLoading(false);
      }
    };
    if (isOpen) {
      fetchBrands();
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Product name must be at least 2 characters';
    } else if (formData.name.trim().length > 200) {
      newErrors.name = 'Product name must not exceed 200 characters';
    }

    // Validate brand
    if (!formData.brandName.trim()) {
      newErrors.brandName = 'Brand selection is required';
    }

    // validate category
    if (!formData.category.trim()) {
      newErrors.category = 'Category selection is required';
    }

    // validate price
    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0) {
      newErrors.price = 'Price must be a valid positive number';
    }

    // validate stock quantity
    if (!formData.stockQuantity.trim()) {
      newErrors.stockQuantity = 'Stock quantity is required';
    } else if (isNaN(parseInt(formData.stockQuantity)) || parseInt(formData.stockQuantity) < 0) {
      newErrors.stockQuantity = 'Stock quantity must be a valid non-negative number';
    }

    // validate image URL if provided
    if (formData.imageUrl.trim()) {
      if (!formData.imageUrl.startsWith('/') && !formData.imageUrl.startsWith('http')) {
        newErrors.imageUrl = 'Image path must start with "/" or be a full URL';
      }
    }

    // validate model URL if provided
    if (formData.modelUrl.trim()) {
      if (!formData.modelUrl.startsWith('/') && !formData.modelUrl.startsWith('http')) {
        newErrors.modelUrl = '3D model path must start with "/" or be a full URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBrandSelect = (brandName: string) => {
    setFormData((prev) => ({
      ...prev,
      brandName,
    }));
    setIsBrandDropdownOpen(false);
    // clear brand error when selected
    if (errors.brandName) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.brandName;
        return newErrors;
      });
    }
  };

  const handleConfirm = () => {
    if (!validateForm()) {
      return;
    }
    onConfirm(formData);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDelete(formData.id);
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {formData.isNew ? 'Add Product' : 'Edit Product'}
          </h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Name:
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
              placeholder="Product name"
            />
            {errors.name && <p className={styles.errorMessage}>{errors.name}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="brandName" className={styles.label}>
              Brand:
            </label>
            <div className={styles.brandDropdownContainer}>
              <button
                type="button"
                className={styles.brandDropdownButton}
                onClick={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}
              >
                <span className={styles.brandDropdownValue}>
                  {formData.brandName || 'Select a brand'}
                </span>
                <span className={styles.brandDropdownArrow}>
                  {isBrandDropdownOpen ? '▲' : '▼'}
                </span>
              </button>
              {isBrandDropdownOpen && (
                <div className={styles.brandDropdownMenu}>
                  {brandsLoading ? (
                    <div className={styles.brandDropdownItem}>Loading brands...</div>
                  ) : brands.length === 0 ? (
                    <div className={styles.brandDropdownItem}>No brands available</div>
                  ) : (
                    brands.map((brand) => (
                      <button
                        key={brand.id}
                        type="button"
                        className={`${styles.brandDropdownItem} ${
                          formData.brandName === brand.name ? styles.brandDropdownItemActive : ''
                        }`}
                        onClick={() => handleBrandSelect(brand.name)}
                      >
                        <div className={styles.brandOptionContent}>
                          {brand.logo_url && (
                            <Image
                              src={brand.logo_url}
                              alt={brand.name}
                              width={24}
                              height={24}
                              className={styles.brandLogo}
                            />
                          )}
                          <span className={styles.brandName}>{brand.name}</span>
                        </div>
                        {formData.brandName === brand.name && (
                          <Check className={styles.checkIcon} size={18} />
                        )}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
            {errors.brandName && <p className={styles.errorMessage}>{errors.brandName}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="category" className={styles.label}>
              Category:
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`${styles.select} ${errors.category ? styles.inputError : ''}`}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && <p className={styles.errorMessage}>{errors.category}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="price" className={styles.label}>
              Price:
            </label>
            <input
              id="price"
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={`${styles.input} ${errors.price ? styles.inputError : ''}`}
              placeholder="0.00"
            />
            {errors.price && <p className={styles.errorMessage}>{errors.price}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="stockQuantity" className={styles.label}>
              Stock Quantity:
            </label>
            <input
              id="stockQuantity"
              type="number"
              name="stockQuantity"
              value={formData.stockQuantity}
              onChange={handleChange}
              className={`${styles.input} ${errors.stockQuantity ? styles.inputError : ''}`}
              placeholder="0"
            />
            {errors.stockQuantity && <p className={styles.errorMessage}>{errors.stockQuantity}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={styles.textarea}
              placeholder="Product description"
              rows={3}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="imageUrl" className={styles.label}>
              Image (Filepath):
            </label>
            <input
              id="imageUrl"
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className={`${styles.input} ${errors.imageUrl ? styles.inputError : ''}`}
              placeholder="/path/to/image.jpg"
            />
            {errors.imageUrl && <p className={styles.errorMessage}>{errors.imageUrl}</p>}
            {formData.imageUrl && !errors.imageUrl && (
              <div className={styles.previewContainer}>
                <div className={styles.imagePreview}>
                  <Image
                    src={formData.imageUrl}
                    alt="Product preview"
                    width={150}
                    height={150}
                    className={styles.previewImage}
                  />
                </div>
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="modelUrl" className={styles.label}>
              3D Model (Filepath):
            </label>
            <input
              id="modelUrl"
              type="text"
              name="modelUrl"
              value={formData.modelUrl}
              onChange={handleChange}
              className={`${styles.input} ${errors.modelUrl ? styles.inputError : ''}`}
              placeholder="/path/to/model.gltf"
            />
            {errors.modelUrl && <p className={styles.errorMessage}>{errors.modelUrl}</p>}
            {formData.modelUrl && !errors.modelUrl && (
              <div className={styles.previewContainer}>
                <div className={styles.modelPreview}>
                  <ModelViewer modelUrl={formData.modelUrl} />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.footer}>
          {!formData.isNew && (
            <Button
              onClick={handleDeleteClick}
              variant="destructive"
              className={styles.deleteButton}
            >
              Delete
            </Button>
          )}
          <div className={styles.buttonGroup}>
            <Button
              onClick={onClose}
              variant="outline"
              className={styles.cancelButton}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              className={styles.confirmButton}
            >
              {formData.isNew ? 'Add Product' : 'Confirm Edit'}
            </Button>
          </div>
        </div>
      </div>

      {/* delete confirmation modal */}
      {showDeleteConfirm && (
        <div className={styles.deleteOverlay} onClick={handleCancelDelete}>
          <div className={styles.deleteModal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.deleteTitle}>Confirm Delete</h3>
            <p className={styles.deleteMessage}>
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className={styles.deleteFooter}>
              <Button
                onClick={handleCancelDelete}
                variant="outline"
                className={styles.deleteCancelButton}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDelete}
                variant="destructive"
                className={styles.deleteConfirmButton}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
