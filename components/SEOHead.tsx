import Head from 'next/head';

interface SEOHeadProps {
  title: string;
  description: string;
  ogImage?: string;
  canonical?: string;
}

export default function SEOHead({ title, description, ogImage, canonical }: SEOHeadProps) {
  const siteURL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gditc.org';
  const fullTitle = `${title} | DITC - Digital Infrastructure Technical Council`;
  
  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="DITC" />
      {ogImage && <meta property="og:image" content={ogImage} />}
      
      {/* Twitter */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:card" content="summary_large_image" />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      
      {/* Canonical */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      
      {/* Language */}
      <meta httpEquiv="content-language" content="zh-CN" />
      <meta name="language" content="Chinese" />
    </Head>
  );
} 