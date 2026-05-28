'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import styles from './CartItem.module.css';

interface CartItemProps {
  id: string;
  slug: string;
  image: string;
  productName: string;
  brandName: string;
  quantity: number;
  cost: string;
  onQuantityChange: (id: string, quantity: number) => void;
  onDelete: (id: string) => void;
  isUpdating?: boolean;
  isRemoving?: boolean;
}

export default function CartItem({
  id,
  slug,
  image,
  productName,
  brandName,
  quantity,
  cost,
  onQuantityChange,
  onDelete,
  isUpdating = false,
  isRemoving = false,
}: CartItemProps) {
  const [inputValue, setInputValue] = useState(quantity.toString());

  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    onQuantityChange(id, newQuantity);
    setInputValue(newQuantity.toString());
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      onQuantityChange(id, newQuantity);
      setInputValue(newQuantity.toString());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // only update if it's a valid positive number
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) {
      onQuantityChange(id, numValue);
    }
  };

  const handleInputBlur = () => {
    // reset to current quantity if input is empty or invalid
    const numValue = parseInt(inputValue, 10);
    if (isNaN(numValue) || numValue <= 0) {
      setInputValue(quantity.toString());
    }
  };

  return (
    <div className={styles.container}>
      {/* product image */}
      <div className={styles.imageWrapper}>
        <Image
          src={image}
          alt={productName}
          width={80}
          height={80}
          className={styles.image}
        />
      </div>

      {/* product info */}
      <div className={styles.infoWrapper}>
        <Link href={`/product/${slug}`}>
          <h4 className={styles.productName} style={{ color: '#ffffff', cursor: 'pointer', textDecoration: 'none' }}>
            {productName}
          </h4>
        </Link>
        <p className={styles.brandName}>{brandName}</p>
      </div>

      {/* quantity control */}
      <div className={styles.quantityControl}>
        <button
          className={styles.quantityButton}
          onClick={handleDecrement}
          aria-label="Decrease quantity"
          disabled={isUpdating || isRemoving}
        >
          −
        </button>
        <input
          type="text"
          className={styles.quantityInput}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          disabled={isUpdating || isRemoving}
        />
        <button
          className={styles.quantityButton}
          onClick={handleIncrement}
          aria-label="Increase quantity"
          disabled={isUpdating || isRemoving}
        >
          +
        </button>
      </div>

      {/* cost */}
      <div className={styles.costWrapper}>
        <span className={styles.cost}>${cost}</span>
      </div>

      {/* delete button */}
      <button
        className={styles.deleteButton}
        onClick={() => onDelete(id)}
        aria-label={`Delete ${productName}`}
        disabled={isRemoving || isUpdating}
      >
        {isRemoving ? '...' : '✕'}
      </button>
    </div>
  );
}
