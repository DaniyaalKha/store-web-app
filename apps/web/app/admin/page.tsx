'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Profile from '../components/Profile';
import ManageProducts from '../components/ManageProducts';
import styles from '../profile/profile.module.css';
import { useAuth } from '@/lib/use-auth';

export default function AdminPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      // redirect to home if not authenticated or not admin
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <main className="flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* profile container */}
          <Profile
            firstName={user.firstName}
            lastName={user.lastName}
            role="Administrator"
          />

          {/* manage products container */}
          <ManageProducts />
        </div>
      </main>

      <Footer />
    </div>
  );
}
