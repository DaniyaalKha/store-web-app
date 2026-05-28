'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { LoginForm } from '../components/LoginForm';
import { AuthCoverSection } from '../components/AuthCoverSection';
import { AuthFormContainer } from '../components/AuthFormContainer';
import { useAuth } from '@/lib/use-auth';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, login } = useAuth();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!loading && user) {
      // redirect based on role
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    }
  }, [user, loading, router]);

  const handleLoginSubmit = async (email: string, password: string) => {
    try {
      setError('');
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-background text-foreground flex flex-col items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background text-foreground flex flex-col">
      <Header />

      {/* main login content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <AuthCoverSection
          imageSrc="/ui/cover-images/LoginCover.png"
          imageAlt="Login page cover image"
        />
        <AuthFormContainer>
          <LoginForm onSubmit={handleLoginSubmit} error={error} />
        </AuthFormContainer>
      </div>

      <Footer />
    </div>
  );
}
