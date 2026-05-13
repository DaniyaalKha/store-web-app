'use client';

import React from 'react';

interface AuthFormContainerProps {
  children: React.ReactNode;
  allowScroll?: boolean;
}

export default function AuthFormContainer({
  children,
  allowScroll = false,
}: AuthFormContainerProps) {
  return (
    <div className={`w-full md:w-1/2 order-1 md:order-2 flex items-center justify-center px-8 py-8 md:py-0 ${allowScroll ? 'md:h-full md:overflow-y-auto' : 'md:h-full'}`}>
      <div className={`w-full max-w-md ${allowScroll ? 'md:overflow-visible' : 'overflow-y-auto md:overflow-visible'}`}>
        {children}
      </div>
    </div>
  );
}
