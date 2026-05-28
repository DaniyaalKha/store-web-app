'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import FormInput from '../FormInput/FormInput';
import styles from './EditProfileModal.module.css';

interface UserProfile {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  country: string;
}

interface EditProfileModalProps {
  isOpen: boolean;
  user: UserProfile | null;
  onConfirm: (profile: UserProfile, currentPassword?: string, newPassword?: string) => Promise<void>;
  onClose: () => void;
}

export default function EditProfileModal({
  isOpen,
  user,
  onConfirm,
  onClose,
}: EditProfileModalProps) {
  const [profileData, setProfileData] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    country: '',
  });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        country: user.country || '',
      });
    }
    setCurrentPassword('');
    setNewPassword('');
    setErrors({});
    setSuccessMessage('');
  }, [user, isOpen]);

  const handleProfileInputChange = (field: keyof UserProfile, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!profileData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!profileData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!profileData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!profileData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!profileData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!profileData.country.trim()) {
      newErrors.country = 'Country is required';
    }

    // validate password if either field is filled
    if (currentPassword || newPassword) {
      if (!currentPassword.trim()) {
        newErrors.currentPassword = 'Current password is required to change password';
      }
      if (!newPassword.trim()) {
        newErrors.newPassword = 'New password is required';
      } else if (newPassword.length < 8) {
        newErrors.newPassword = 'Password must be at least 8 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSuccessMessage('');

    try {
      await onConfirm(
        profileData,
        currentPassword || undefined,
        newPassword || undefined
      );
      setSuccessMessage('Profile updated successfully');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update profile';
      setErrors({ submit: message });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Edit Profile</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className={styles.content}>
          {/* profile details */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Personal Information</h3>

            <div className={styles.formGroup}>
              <label htmlFor="firstName" className={styles.label}>
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                value={profileData.firstName}
                onChange={(e) => handleProfileInputChange('firstName', e.target.value)}
                className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
                placeholder="First name"
                disabled={isLoading}
              />
              {errors.firstName && (
                <p className={styles.errorMessage}>{errors.firstName}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="lastName" className={styles.label}>
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={profileData.lastName}
                onChange={(e) => handleProfileInputChange('lastName', e.target.value)}
                className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
                placeholder="Last name"
                disabled={isLoading}
              />
              {errors.lastName && (
                <p className={styles.errorMessage}>{errors.lastName}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="address" className={styles.label}>
                Address
              </label>
              <input
                id="address"
                type="text"
                value={profileData.address}
                onChange={(e) => handleProfileInputChange('address', e.target.value)}
                className={`${styles.input} ${errors.address ? styles.inputError : ''}`}
                placeholder="Street address"
                disabled={isLoading}
              />
              {errors.address && (
                <p className={styles.errorMessage}>{errors.address}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="city" className={styles.label}>
                City
              </label>
              <input
                id="city"
                type="text"
                value={profileData.city}
                onChange={(e) => handleProfileInputChange('city', e.target.value)}
                className={`${styles.input} ${errors.city ? styles.inputError : ''}`}
                placeholder="City"
                disabled={isLoading}
              />
              {errors.city && (
                <p className={styles.errorMessage}>{errors.city}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="state" className={styles.label}>
                State
              </label>
              <input
                id="state"
                type="text"
                value={profileData.state}
                onChange={(e) => handleProfileInputChange('state', e.target.value)}
                className={`${styles.input} ${errors.state ? styles.inputError : ''}`}
                placeholder="State"
                disabled={isLoading}
              />
              {errors.state && (
                <p className={styles.errorMessage}>{errors.state}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="country" className={styles.label}>
                Country
              </label>
              <input
                id="country"
                type="text"
                value={profileData.country}
                onChange={(e) => handleProfileInputChange('country', e.target.value)}
                className={`${styles.input} ${errors.country ? styles.inputError : ''}`}
                placeholder="Country"
                disabled={isLoading}
              />
              {errors.country && (
                <p className={styles.errorMessage}>{errors.country}</p>
              )}
            </div>
          </div>

          {/* password change section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Change Password (Optional)</h3>
            <p className={styles.sectionDescription}>
              Leave blank if you don't want to change your password
            </p>

            <div className={styles.formGroup}>
              <label htmlFor="currentPassword" className={styles.label}>
                Current Password
              </label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={`${styles.input} ${errors.currentPassword ? styles.inputError : ''}`}
                placeholder="Enter current password"
                disabled={isLoading}
              />
              {errors.currentPassword && (
                <p className={styles.errorMessage}>{errors.currentPassword}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="newPassword" className={styles.label}>
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`${styles.input} ${errors.newPassword ? styles.inputError : ''}`}
                placeholder="Enter new password"
                disabled={isLoading}
              />
              {errors.newPassword && (
                <p className={styles.errorMessage}>{errors.newPassword}</p>
              )}
            </div>
          </div>

          {errors.submit && (
            <div className={styles.errorAlert}>{errors.submit}</div>
          )}

          {successMessage && (
            <div className={styles.successAlert}>{successMessage}</div>
          )}
        </div>

        <div className={styles.footer}>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
