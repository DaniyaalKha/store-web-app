'use client';

import Image from 'next/image';
import styles from './Profile.module.css';

interface ProfileProps {
  firstName?: string;
  lastName?: string;
  role?: string;
  imageUrl?: string;
}

export default function Profile({
  firstName = 'FIRSTNAME',
  lastName = 'LASTNAME',
  role = 'ROLE',
  imageUrl = '/vercel.svg',
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
          <p className={styles.profileRole}>{role}</p>
        </div>
      </div>
    </section>
  );
}
