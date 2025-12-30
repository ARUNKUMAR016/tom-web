import React, { useState, useEffect } from "react";
import { ImageOff } from "lucide-react";

export default function ImageLoader({
  src,
  alt,
  className = "",
  placeholderClassName = "bg-brand-cream",
  errorClassName = "bg-brand-cream",
  ...props
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setError(false);
  }, [src]);

  if (!src || error) {
    return (
      <div
        className={`flex items-center justify-center ${errorClassName} ${className
          .replace(
            /object-cover|transition-\w+|duration-\w+|group-hover:\w+|scale-\w+/g,
            ""
          )
          .trim()}`}
      >
        <div
          className={`w-full h-full flex items-center justify-center ${errorClassName}`}
        >
          <ImageOff className="w-8 h-8 text-brand-dark/20" />
        </div>
      </div>
    );
  }

  return (
    <>
      {!loaded && (
        <div
          className={`absolute inset-0 animate-pulse z-0 ${placeholderClassName}`}
        />
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        loading="lazy"
        {...props}
      />
    </>
  );
}
