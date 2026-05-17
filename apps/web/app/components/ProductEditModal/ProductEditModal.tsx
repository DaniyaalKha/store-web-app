'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import styles from './ProductEditModal.module.css';

interface ProductEditData {
  id: string;
  name: string;
  brand: string;
  category: string;
  image: string;
  model3D: string;
  price: string;
}

interface ProductEditModalProps {
  isOpen: boolean;
  product: ProductEditData;
  onConfirm: (product: ProductEditData) => void;
  onDelete: (productId: string) => void;
  onClose: () => void;
}

const brands = [
  'Brand A',
  'Brand B',
  'Brand C',
  'Brand D',
  'Brand E',
];

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

  useEffect(() => {
    setFormData(product);
  }, [product]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleConfirm = () => {
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
            {formData.id.startsWith('PROD-') && formData.name === ''
              ? 'Add Product'
              : 'Edit Product'}
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
              className={styles.input}
              placeholder="Product name"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="brand" className={styles.label}>
              Brand:
            </label>
            <select
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Select a brand</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
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
              className={styles.select}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="image" className={styles.label}>
              Image (Filepath):
            </label>
            <input
              id="image"
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className={styles.input}
              placeholder="/path/to/image.jpg"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="model3D" className={styles.label}>
              3D Model (Filepath):
            </label>
            <input
              id="model3D"
              type="text"
              name="model3D"
              value={formData.model3D}
              onChange={handleChange}
              className={styles.input}
              placeholder="/path/to/model.gltf"
            />
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
              className={styles.input}
              placeholder="0.00"
            />
          </div>
        </div>

        <div className={styles.footer}>
          <Button
            onClick={handleDeleteClick}
            variant="destructive"
            className={styles.deleteButton}
          >
            Delete
          </Button>
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
              Confirm Edit
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
