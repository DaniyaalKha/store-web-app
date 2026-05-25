'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingCart, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import styles from './Header.module.css';
import { useAuth } from '@/lib/use-auth';

export default function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* logo */}
        <div className={styles.logoContainer}>
          <Link href="/" className={styles.logo}>
            <Image
              src="/store-branding/logo.png"
              alt="Daniyaal's Tech Store logo"
              width={40}
              height={40}
              priority
            />
          </Link>
        </div>

        {/* navigation */}
        <nav className={styles.navigation}>
          {/* For unauthenticated users: show Home and Store */}
          {!user && (
            <>
              <Link href="/" className={styles.navLink}>
                <Button variant="ghost" className={styles.navButton}>
                  Store
                </Button>
              </Link>
            </>
          )}

          {/* For customers: show Home, Store, and Profile */}
          {user && user.role === 'customer' && (
            <>
              <Link href="/" className={styles.navLink}>
                <Button variant="ghost" className={styles.navButton}>
                  Store
                </Button>
              </Link>
              <Link href="/profile" className={styles.navLink}>
                <Button variant="ghost" className={styles.navButton}>
                  Profile
                </Button>
              </Link>
            </>
          )}

          {/* For admins: show Store and Admin */}
          {user && user.role === 'admin' && (
            <>
              <Link href="/" className={styles.navLink}>
                <Button variant="ghost" className={styles.navButton}>
                  Store
                </Button>
              </Link>
              <Link href="/admin" className={styles.navLink}>
                <Button variant="ghost" className={styles.navButton}>
                  Admin
                </Button>
              </Link>
            </>
          )}

          {/* Authentication section */}
          {user ? (
            <>
              {/* Sign out button for authenticated users */}
              <Button
                className={styles.loginButton}
                onClick={handleLogout}
              >
                <LogOut size={18} className="mr-2" />
                Sign out
              </Button>
            </>
          ) : (
            <>
              {/* Login button for unauthenticated users */}
              <Link href="/login">
                <Button className={styles.loginButton}>
                  Login
                </Button>
              </Link>
            </>
          )}

          {/* Cart - only for customers */}
          {user && user.role === 'customer' && (
            <Link href="/cart" className={styles.cartLink}>
              <div className={styles.cartIcon}>
                <ShoppingCart size={20} />
                <span className={styles.cartBadge}>123</span>
              </div>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
