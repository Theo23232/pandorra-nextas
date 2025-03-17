import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

interface SmoothImageProps extends ImageProps {
  imageUrl?: string
  index?: number
}

export default function ImageSmooth({
  imageUrl,
  index,
  className,
  ...props
}: SmoothImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const src = imageUrl || props.src // Permet d'utiliser `imageUrl` ou `src`

  return (
    <div className="relative h-auto w-full overflow-hidden">
      {/* Image floue en arrière-plan */}
      {!isLoaded && (
        <Image
          src={src}
          width={2}
          height={2}
          className="absolute inset-0 h-full w-full object-cover opacity-50 blur-md"
          alt="Blurred background"
          onContextMenu={(e) => e.preventDefault()}
        />
      )}

      {/* Image principale */}
      <Image
        {...props}
        src={src}
        width={props.width || 400}
        height={props.height || 700}
        className={`h-full w-full object-contain transition-all duration-700 ease-in-out ${
          isLoaded ? "scale-100 opacity-100 blur-0" : "scale-95 opacity-0"
        } ${className || ""}`}
        onLoadingComplete={() => setIsLoaded(true)}
        alt={props.alt || `Random stock image ${index ? index + 1 : ""}`}
        loading="lazy"
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  )
}
