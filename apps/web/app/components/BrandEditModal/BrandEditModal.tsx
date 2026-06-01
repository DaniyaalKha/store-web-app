'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import styles from './BrandEditModal.module.css';

interface BrandEditData {
  id: number;
  name: string;
  logoUrl: string;
  isNew: boolean;
}

interface BrandEditModalProps {
  isOpen: boolean;
  brand: BrandEditData;
  onConfirm: (brand: BrandEditData) => void;
  onDelete: (brandId: number) => void;
  onClose: () => void;
}

export default function BrandEditModal({
  isOpen,
  brand,
  onConfirm,
  onDelete,
  onClose,
}: BrandEditModalProps) {
  const [formData, setFormData] = useState<BrandEditData>(brand);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData(brand);
    setErrors({});
  }, [brand]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // clear error when typing
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

    // Validate brand name
    if (!formData.name.trim()) {
      newErrors.name = 'Brand name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Brand name must be at least 2 characters';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Brand name must not exceed 100 characters';
    }

    // validate brand logo url (if provided)
    if (formData.logoUrl.trim()) {
      if (!formData.logoUrl.startsWith('/') && !formData.logoUrl.startsWith('http')) {
        newErrors.logoUrl = 'Logo path must start with "/" or be a full URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
            {formData.isNew ? 'Add Brand' : 'Edit Brand'}
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
              Brand Name:
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
              placeholder="Brand name"
            />
            {errors.name && <p className={styles.errorMessage}>{errors.name}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="logoUrl" className={styles.label}>
              Brand Logo (Filepath):
            </label>
            <input
              id="logoUrl"
              type="text"
              name="logoUrl"
              value={formData.logoUrl}
              onChange={handleChange}
              className={`${styles.input} ${errors.logoUrl ? styles.inputError : ''}`}
              placeholder="/path/to/logo.png"
            />
            {errors.logoUrl && <p className={styles.errorMessage}>{errors.logoUrl}</p>}
            {formData.logoUrl && !errors.logoUrl && (
              <div className={styles.previewContainer}>
                <div className={styles.logoPreview}>
                  <Image
                    src={formData.logoUrl}
                    alt="Brand logo preview"
                    width={100}
                    height={100}
                    className={styles.previewImage}
                  />
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
              {formData.isNew ? 'Add Brand' : 'Confirm Edit'}
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
              Are you sure you want to delete this brand? This action cannot be undone.
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
