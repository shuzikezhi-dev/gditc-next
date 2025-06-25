import { useState, useEffect } from 'react'
import { GetStaticProps, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import SEOHead from '../../components/SEOHead'
import { getNewsroom, Article } from '../../lib/strapi'
import { useLanguage } from '../_app'

interface NewsroomDetailProps {
  article: Article | null;
  locale: string;
}

export default function NewsroomDetail({ article: initialArticle, locale }: NewsroomDetailProps) {
  const router = useRouter()
  const { language } = useLanguage()
  const [article, setArticle] = useState<Article | null>(initialArticle)
  const [loading, setLoading] = useState(false)
  const [currentDataLocale, setCurrentDataLocale] = useState(locale)

  // 如果路由正在生成或没有文章数据，显示加载状态
  if (router.isFallback || (!article && !loading)) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin mb-4"></div>
            <p className="text-body-color dark:text-dark-6">
              {language === 'zh-Hans' ? '加载中...' : 'Loading...'}
            </p>
          </div>
        </div>
      </Layout>
    )
  }

  // 监听语言变化，获取对应语言的文章
  useEffect(() => {
    const fetchArticleForLanguage = async () => {
      if (language === currentDataLocale || !article) return
      
      setLoading(true)
      try {
        console.log(`🔄 语言切换为 ${language}，重新获取文章数据...`)
        
        // 使用当前文章的documentId获取其他语言版本
        const response = await fetch(`/api/newsroom-detail?documentId=${article.documentId}&locale=${language}`)
        if (response.ok) {
          const newArticle = await response.json()
          if (newArticle) {
            setArticle(newArticle)
            setCurrentDataLocale(language)
            console.log(`✅ 成功获取${language}版本文章`)
          }
        }
      } catch (error) {
        console.error('❌ 获取文章数据时出错:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchArticleForLanguage()
  }, [language, currentDataLocale, article])

  if (!article) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="text-6xl mb-4">📰</div>
            <h1 className="text-2xl font-bold text-dark dark:text-white mb-2">
              {language === 'zh-Hans' ? '文章未找到' : 'Article Not Found'}
            </h1>
            <p className="text-body-color dark:text-dark-6 mb-6">
              {language === 'zh-Hans' 
                ? '抱歉，您要查看的文章不存在或已被删除。'
                : 'Sorry, the article you are looking for does not exist or has been removed.'
              }
            </p>
            <button 
              onClick={() => router.push('/newsroom')}
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              {language === 'zh-Hans' ? '返回新闻列表' : 'Back to News'}
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <>
      <SEOHead
        title={`${article.title} | DITC`}
        description={article.description || ''}
      />
      <Layout>
        {/* Banner Section */}
        <div className="relative z-10 overflow-hidden pt-[100px] pb-[30px] md:pt-[110px] lg:pt-[130px] dark:bg-dark">
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-stroke/0 via-stroke to-stroke/0 dark:via-dark-3"></div>
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center -mx-4">
              <div className="w-full px-4">
                <div className="text-center">
                  <h1 className="mb-4 text-3xl font-bold text-dark dark:text-white sm:text-4xl md:text-[40px] md:leading-[1.2]">
                    {article.title}
                  </h1>
                  <div className="flex items-center justify-center gap-4 text-sm text-body-color dark:text-dark-6">
                    {article.category?.name && (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {article.category.name}
                      </span>
                    )}
                    <span>
                      {new Date(article.publishedAt).toLocaleDateString(
                        language === 'zh-Hans' ? 'zh-CN' : 'en-US'
                      )}
                    </span>
                    {article.author?.name && (
                      <span>{article.author.name}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <section className="pt-10 lg:pt-[60px] pb-20 lg:pb-[120px]">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {loading && (
                <div className="text-center py-8">
                  <div className="inline-block w-6 h-6 border-4 border-gray-300 border-t-primary rounded-full animate-spin mb-2"></div>
                  <p className="text-sm text-body-color dark:text-dark-6">
                    {language === 'zh-Hans' ? '切换语言中...' : 'Switching language...'}
                  </p>
                </div>
              )}

              {/* Cover Image */}
              {article.cover?.url && (
                <div className="mb-8">
                  <img
                    src={article.cover.url}
                    alt={article.cover.alternativeText || article.title}
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                </div>
              )}

              {/* Article Description */}
              {article.description && (
                <div className="mb-8">
                  <p className="text-lg text-body-color dark:text-dark-6 leading-relaxed">
                    {article.description}
                  </p>
                </div>
              )}

              {/* Article Content */}
              <div className="prose prose-lg max-w-none dark:prose-invert">
                {/* 这里可以根据blocks字段渲染富文本内容 */}
                {article.blocks && article.blocks.length > 0 ? (
                  <div>
                    {article.blocks.map((block, index) => (
                      <div key={index} className="mb-6">
                        {/* 根据block类型渲染不同内容 */}
                        {block.type === 'paragraph' && (
                          <p className="text-body-color dark:text-dark-6 leading-relaxed">
                            {block.children?.[0]?.text || ''}
                          </p>
                        )}
                        {/* 可以扩展其他block类型 */}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-body-color dark:text-dark-6">
                    <p>{language === 'zh-Hans' ? '暂无正文内容。' : 'No content available.'}</p>
                  </div>
                )}
              </div>

              {/* Back to List */}
              <div className="mt-12 pt-8 border-t border-stroke dark:border-dark-3">
                <button 
                  onClick={() => router.push('/newsroom')}
                  className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19l-7-7 7-7m6 14l-7-7 7-7" />
                  </svg>
                  {language === 'zh-Hans' ? '返回新闻列表' : 'Back to News'}
                </button>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    // 获取所有新闻文章以生成路径
    const articles = await getNewsroom()
    
    const paths = articles.flatMap(article => {
      const slugs = []
      
      // 使用documentId作为主要路径
      if (article.documentId) {
        slugs.push({ params: { slug: article.documentId } })
      }
      
      // 如果有slug，也添加slug路径
      if (article.slug && article.slug !== article.documentId) {
        slugs.push({ params: { slug: article.slug } })
      }
      
      return slugs
    })

    return {
      paths,
      fallback: 'blocking' // 允许动态生成新路径
    }
  } catch (error) {
    console.error('Error generating static paths for newsroom:', error)
    return {
      paths: [],
      fallback: 'blocking'
    }
  }
}

export const getStaticProps: GetStaticProps = async ({ params, locale = 'en' }) => {
  try {
    const slug = params?.slug as string
    
    if (!slug) {
      return {
        notFound: true
      }
    }

    console.log(`🔄 正在为slug "${slug}" 生成文章详情页...`)
    
    // 获取所有文章，然后筛选
    const articles = await getNewsroom(undefined, locale)
    
    // 优先通过documentId匹配，然后尝试slug
    const article = articles.find(a => a.documentId === slug || a.slug === slug)
    
    if (!article) {
      console.warn(`❌ 未找到slug为 "${slug}" 的文章`)
      return {
        notFound: true
      }
    }

    console.log(`✅ 成功找到文章: ${article.title}`)
    
    // 清理undefined值
    const serializedArticle = JSON.parse(JSON.stringify(article))

    return {
      props: {
        article: serializedArticle,
        locale,
      },
      revalidate: 3600, // 1小时重新生成
    }
  } catch (error) {
    console.error(`❌ 生成文章详情页失败:`, error)
    return {
      notFound: true
    }
  }
} 