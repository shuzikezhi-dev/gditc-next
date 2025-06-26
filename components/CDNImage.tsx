import Image from 'next/image';
import { convertToCDN, getOptimizedImageUrl } from '../lib/cdn-utils';

interface CDNImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  sizes?: string;
  fill?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

export default function CDNImage({ 
  src, 
  alt, 
  width, 
  height, 
  className,
  priority = false,
  quality = 85,
  format = 'webp',
  sizes,
  fill = false,
  placeholder,
  blurDataURL
}: CDNImageProps) {
  /**
   * 获取CDN优化后的图片URL
   */
  const getCDNUrl = (imageSrc: string): string => {
    if (!imageSrc) return '';
    
    // 首先转换为CDN地址
    const cdnUrl = convertToCDN(imageSrc);
    
    // 如果不是fill模式，应用尺寸优化
    if (!fill && width && height) {
      return getOptimizedImageUrl(cdnUrl, {
        width,
        height,
        format,
        quality
      });
    }
    
    return cdnUrl;
  };

  const optimizedSrc = getCDNUrl(src);

  // 如果是fill模式
  if (fill) {
    return (
      <Image
        src={optimizedSrc}
        alt={alt}
        fill
        className={className}
        priority={priority}
        quality={quality}
        sizes={sizes}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
      />
    );
  }

  return (
    <Image
      src={optimizedSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      quality={quality}
      sizes={sizes}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
    />
  );
}

// 专门用于响应式图片的组件
interface ResponsiveCDNImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  quality?: number;
  aspectRatio?: 'square' | '4/3' | '16/9' | '3/2';
}

export function ResponsiveCDNImage({
  src,
  alt,
  className = '',
  priority = false,
  quality = 85,
  aspectRatio = '16/9'
}: ResponsiveCDNImageProps) {
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'square': return 'aspect-square';
      case '4/3': return 'aspect-[4/3]';
      case '16/9': return 'aspect-[16/9]';
      case '3/2': return 'aspect-[3/2]';
      default: return 'aspect-[16/9]';
    }
  };

  return (
    <div className={`relative ${getAspectRatioClass()} ${className}`}>
      <CDNImage
        src={src}
        alt={alt}
        fill
        className="object-cover"
        priority={priority}
        quality={quality}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
} 