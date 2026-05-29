'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import ModelViewer from '../ProductImage/ModelViewer';
import styles from './ProductEditModal.module.css';

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

  useEffect(() => {
    setFormData(product);
  }, [product]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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
              className={styles.input}
              placeholder="Product name"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="brandName" className={styles.label}>
              Brand:
            </label>
            <input
              id="brandName"
              type="text"
              name="brandName"
              value={formData.brandName}
              onChange={handleChange}
              className={styles.input}
              placeholder="Brand name"
            />
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
              className={styles.input}
              placeholder="0"
            />
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
              className={styles.input}
              placeholder="/path/to/image.jpg"
            />
            {formData.imageUrl && (
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
              className={styles.input}
              placeholder="/path/to/model.gltf"
            />
            {formData.modelUrl && (
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
