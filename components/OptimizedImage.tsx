import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

export default function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = '',
  priority = false 
}: OptimizedImageProps) {
  const strapiURL = process.env.NEXT_PUBLIC_STRAPI_API_URL?.replace('/api', '');
  
  // 如果src已经是完整URL，直接使用；否则拼接Strapi base URL
  const imageSrc = src.startsWith('http') ? src : `${strapiURL}${src}`;

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      quality={85}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
} 