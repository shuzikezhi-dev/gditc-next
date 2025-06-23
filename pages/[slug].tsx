import { GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import SEOHead from '../components/SEOHead';
import { getPageContent, getAllPages, Page } from '../lib/strapi';

interface PageProps {
  pageData: Page | null;
}

export default function DynamicPage({ pageData }: PageProps) {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">加载中...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!pageData) {
    return (
      <Layout>
        <SEOHead
          title="页面未找到"
          description="抱歉，您访问的页面不存在。"
        />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-8">页面未找到</p>
            <a
              href="/"
              className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              返回首页
            </a>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead
        title={pageData.seo_title || pageData.title}
        description={pageData.seo_description || '数字化国际贸易与商务协会'}
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="prose prose-lg mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            {pageData.title}
          </h1>
          
          {pageData.content && (
            <div 
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: pageData.content }}
            />
          )}
        </article>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  
  if (!slug) {
    return {
      notFound: true,
    };
  }

  try {
    const pageData = await getPageContent(slug);

    if (!pageData) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        pageData,
      },
      revalidate: 3600, // 1小时重新生成
    };
  } catch (error) {
    console.error('Error fetching page:', error);
    return {
      notFound: true,
    };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const pages = await getAllPages();
    
    const paths = pages.map((page) => ({
      params: { slug: page.slug },
    }));

    return {
      paths,
      fallback: 'blocking',
    };
  } catch (error) {
    console.error('Error fetching pages for static paths:', error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
}; 