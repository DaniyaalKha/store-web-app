'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Profile from '../components/Profile';
import ManageProducts from '../components/ManageProducts';
import styles from '../profile/profile.module.css';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <main className="flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* profile container */}
          <Profile
            firstName="Admin"
            lastName="User"
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
