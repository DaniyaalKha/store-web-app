'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { RegistrationForm } from '../components/RegistrationForm';
import { AuthCoverSection } from '../components/AuthCoverSection';
import { AuthFormContainer } from '../components/AuthFormContainer';
import type { RegistrationData } from '../components/RegistrationForm';
import { useAuth } from '@/lib/use-auth';

export default function RegistrationPage() {
  const router = useRouter();
  const { user, loading, signup } = useAuth();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!loading && user) {
      // redirect to home after signup
      router.push('/');
    }
  }, [user, loading, router]);

  const handleRegistrationSubmit = async (formData: RegistrationData) => {
    try {
      setError('');
      await signup(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      {/* main registration content */}
      <div className="flex-1 flex flex-col md:flex-row">
        <AuthCoverSection
          imageSrc="/ui/cover-images/LoginCover.png"
          imageAlt="Registration page cover image"
        />
        <AuthFormContainer allowScroll={true}>
          <RegistrationForm onSubmit={handleRegistrationSubmit} error={error} />
        </AuthFormContainer>
      </div>

      <Footer />
    </div>
  );
}
