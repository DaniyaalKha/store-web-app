'use client';

import Image from 'next/image';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import styles from './Profile.module.css';

interface ProfileProps {
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  onEditClick?: () => void;
}

export default function Profile({
  firstName = 'FIRSTNAME',
  lastName = 'LASTNAME',
  imageUrl = '/vercel.svg',
  onEditClick,
}: ProfileProps) {
  return (
    <section className={styles.container}>
      <h1 className={styles.heading}>My Profile</h1>
      <div className={styles.profileContent}>
        <div className={styles.profileImageWrapper}>
          <Image
            src={imageUrl}
            alt="Profile"
            width={120}
            height={120}
            className={styles.profileImage}
          />
        </div>
        <div className={styles.profileInfo}>
          <h2 className={styles.profileName}>
            {firstName} {lastName}
          </h2>
          <Button
            onClick={onEditClick}
            variant="outline"
            className={styles.editButton}
          >
            <Pencil className={styles.editIcon} />
            Edit Details
          </Button>
        </div>
      </div>
    </section>
  );
}
