import Image from 'next/image';
import { convertToCDN } from '../lib/cdn-utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  quality?: number;
}

export default function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = '',
  priority = false,
  quality = 85
}: OptimizedImageProps) {
  const strapiURL = process.env.NEXT_PUBLIC_STRAPI_API_URL?.replace('/api', '');
  
  // 处理图片URL：先拼接完整URL，再转换为CDN
  let imageSrc = src;
  if (!src.startsWith('http')) {
    imageSrc = `${strapiURL}${src}`;
  }
  
  // 转换为CDN URL
  const cdnImageSrc = convertToCDN(imageSrc);

  return (
    <Image
      src={cdnImageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      quality={quality}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
} 