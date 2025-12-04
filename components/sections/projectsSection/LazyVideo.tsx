"use client";

import { useState, useRef, useEffect } from "react";

export function LazyVideo({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [canPlay, setCanPlay] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) setCanPlay(true);
    });

    const el = ref.current;
    if (el) observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="w-full h-full">
      {canPlay ? (
        <video
          src={src}
          muted
          autoPlay
          playsInline
          loop
          preload="metadata"
          aria-label={alt}
          className="w-full h-full object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="w-full h-full bg-white/10 animate-pulse"
        />
      )}
    </div>
  );
}
