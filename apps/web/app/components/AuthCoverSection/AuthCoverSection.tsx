'use client';

import Image from 'next/image';

interface AuthCoverSectionProps {
  imageSrc: string;
  imageAlt: string;
}

export default function AuthCoverSection({
  imageSrc,
  imageAlt,
}: AuthCoverSectionProps) {
  return (
    <div className="hidden md:flex w-full md:w-1/2 h-full order-2 md:order-1">
      <Image
        src={imageSrc}
        alt={imageAlt}
        width={600}
        height={800}
        priority
        className="w-full h-full object-cover"
      />
    </div>
  );
}
