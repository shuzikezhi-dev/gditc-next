import { GetStaticProps } from 'next';
import Layout from '../../components/Layout';
import SEOHead from '../../components/SEOHead';
import { getArticles, Article } from '../../lib/strapi';

interface NewsPageProps {
  articles: Article[];
}

export default function NewsPage({ articles }: NewsPageProps) {
  return (
    <Layout>
      <SEOHead
        title="新闻动态"
        description="了解DITC最新资讯和行业动态"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            新闻动态
          </h1>
          <p className="text-xl text-gray-600">
            了解协会最新资讯和行业动态
          </p>
        </div>

        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <article key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    {article.category && (
                      <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs font-medium mr-3">
                        {article.category.data.attributes.name}
                      </span>
                    )}
                    <time dateTime={article.publishedAt}>
                      {new Date(article.publishedAt).toLocaleDateString('zh-CN')}
                    </time>
                  </div>
                  
                  <h2 className="text-xl font-semibold mb-3">
                    <a 
                      href={`/news/${article.slug}`}
                      className="hover:text-primary-600 transition-colors"
                    >
                      {article.title}
                    </a>
                  </h2>
                  
                  {article.description && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.description}
                    </p>
                  )}
                  
                  <a
                    href={`/news/${article.slug}`}
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                  >
                    阅读更多
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📰</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">暂无新闻</h3>
            <p className="text-gray-600">请稍后查看最新资讯</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const articles = await getArticles();

    return {
      props: {
        articles,
      },
      revalidate: 3600, // 1小时重新生成
    };
  } catch (error) {
    console.error('Error fetching articles:', error);
    return {
      props: {
        articles: [],
      },
      revalidate: 3600,
    };
  }
}; 