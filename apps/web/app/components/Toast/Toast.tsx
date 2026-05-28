'use client';

import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import styles from './Toast.module.css';

interface ToastProps {
  message: string;
  isVisible: boolean;
  duration?: number;
  onClose: () => void;
}

// 3 sec duration toast
export default function Toast({ message, isVisible, duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  return (
    <div className={`${styles.toast} ${isVisible ? styles.visible : styles.hidden}`}>
      <Check size={18} /> {message}
    </div>
  );
}
