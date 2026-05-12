'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* logo */}
        <div className={styles.logoContainer}>
          <Link href="/" className={styles.logo}>
            <Image
              src="/next.svg"
              alt="Daniyaal's Tech Store logo"
              width={40}
              height={40}
              priority
            />
          </Link>
        </div>

        {/* navigation */}
        <nav className={styles.navigation}>
          <Link href="/" className={styles.navLink}>
            <Button variant="ghost" className={styles.navButton}>
              Home
            </Button>
          </Link>
          <Link href="/store" className={styles.navLink}>
            <Button variant="ghost" className={styles.navButton}>
              Store
            </Button>
          </Link>
          <Link href="/login">
            <Button className={styles.loginButton}>
              Login
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
