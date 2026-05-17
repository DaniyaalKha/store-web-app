'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { LoginForm } from '../components/LoginForm';
import { AuthCoverSection } from '../components/AuthCoverSection';
import { AuthFormContainer } from '../components/AuthFormContainer';

export default function LoginPage() {
  const handleLoginSubmit = async (email: string, password: string) => {
    // TODO: Implement login API call here
  };

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
          <LoginForm onSubmit={handleLoginSubmit} />
        </AuthFormContainer>
      </div>

      <Footer />
    </div>
  );
}
