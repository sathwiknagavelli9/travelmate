"use client";
import Image from "next/image";
import { useState } from "react";
export function TravelImage({
  src,
  alt,
  priority = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <Image
      src={failed ? "/travel-fallback.svg" : src}
      alt={alt}
      fill
      sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 40vw"
      className="travel-image"
      priority={priority}
      onError={() => setFailed(true)}
      unoptimized={!src.includes("images.unsplash.com")}
    />
  );
}
