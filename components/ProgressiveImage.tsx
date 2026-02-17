'use client';

import { useState, useRef, useEffect } from 'react';

interface Props {
  src: string;
  alt?: string;
  className?: string;
  onClick?: () => void;
  loading?: 'lazy' | 'eager';
}

export default function ProgressiveImage({ src, alt = '', className = '', onClick, loading = 'lazy' }: Props) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // If image is already cached
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true);
    }
  }, []);

  return (
    <div className="progressive-image-wrapper" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Blurry placeholder */}
      <img
        src={src}
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'blur(20px)',
          transform: 'scale(1.1)',
          opacity: loaded ? 0 : 1,
          transition: 'opacity 0.5s ease',
        }}
      />
      {/* Real image */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={loading}
        className={className}
        onClick={onClick}
        onLoad={() => setLoaded(true)}
        style={{
          position: 'relative',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.5s ease',
          display: 'block',
          width: '100%',
        }}
      />
    </div>
  );
}
