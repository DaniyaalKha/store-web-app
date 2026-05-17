'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { RegistrationForm } from '../components/RegistrationForm';
import { AuthCoverSection } from '../components/AuthCoverSection';
import { AuthFormContainer } from '../components/AuthFormContainer';
import type { RegistrationData } from '../components/RegistrationForm';

export default function RegistrationPage() {
  const handleRegistrationSubmit = async (formData: RegistrationData) => {
    // TODO: Implement registration API call here
  };

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
          <RegistrationForm onSubmit={handleRegistrationSubmit} />
        </AuthFormContainer>
      </div>

      <Footer />
    </div>
  );
}
