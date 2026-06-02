'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { LoginForm } from '../components/LoginForm';
import { AuthCoverSection } from '../components/AuthCoverSection';
import { AuthFormContainer } from '../components/AuthFormContainer';
import { useAuth } from '@/lib/use-auth';

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, login } = useAuth();
  const [error, setError] = useState<string>('');
  const returnTo = (() => {
    const nextPath = searchParams.get('returnTo');
    return nextPath && nextPath.startsWith('/') ? nextPath : null;
  })();

  useEffect(() => {
    if (!loading && user) {
      router.push(returnTo || (user.role === 'admin' ? '/admin' : '/'));
    }
  }, [user, loading, router, returnTo]);

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

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen bg-background text-foreground flex flex-col items-center justify-center">
          <p>Loading...</p>
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
