import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = '',
  fallbackLabel = 'SATosphere 1-on-1 Academy',
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#D3E3FC] via-[#FFFFFF] to-[#FFCCBC]/60 p-8 text-center text-brand-ink ${className}`}
      >
        <BookOpen className="mb-3 h-8 w-8 text-[#00887A]" aria-hidden="true" />
        <p className="font-display text-sm font-semibold tracking-tight text-brand-ink">
          {fallbackLabel}
        </p>
        <p className="mt-1 max-w-xs text-xs text-brand-muted">{alt}</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="eager"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
