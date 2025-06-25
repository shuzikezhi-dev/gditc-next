import { useState, useEffect } from 'react'
import { GetStaticProps } from 'next'
import Layout from '../components/Layout'
import SEOHead from '../components/SEOHead'
import { getNewsroom, Article } from '../lib/strapi'
import { useLanguage } from './_app'

interface NewsroomProps {
  initialArticles: Article[];
  locale: string;
}

export default function Newsroom({ initialArticles = [], locale }: NewsroomProps) {
  const { language } = useLanguage()
  const [articles, setArticles] = useState<Article[]>(initialArticles)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all')
  const [currentDataLocale, setCurrentDataLocale] = useState(locale)

  // 监听语言变化，获取对应语言的数据
  useEffect(() => {
    const fetchNewsroomForLanguage = async () => {
      if (language === currentDataLocale) return
      
      setLoading(true)
      try {
        console.log(`🔄 语言切换为 ${language}，重新获取Newsroom数据...`)
        const response = await fetch(`/api/newsroom?locale=${language}`)
        if (response.ok) {
          const newArticles = await response.json()
          setArticles(newArticles)
          setCurrentDataLocale(language)
          console.log(`✅ 成功获取 ${newArticles.length} 条Newsroom数据`)
        } else {
          console.error('❌ 获取Newsroom数据失败')
        }
      } catch (error) {
        console.error('❌ 获取Newsroom数据时出错:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNewsroomForLanguage()
  }, [language, currentDataLocale])

  const getPageTitle = () => {
    return language === 'zh-Hans' ? '新闻中心' : 'Newsroom'
  }

  const getPageDescription = () => {
    return language === 'zh-Hans' 
      ? '了解DITC最新资讯和行业动态' 
      : 'Stay updated with the latest news and industry insights from DITC'
  }

  const getFilterLabel = (filterType: string) => {
    if (language === 'zh-Hans') {
      switch (filterType) {
        case 'all': return '全部新闻'
        case 'press-release': return '新闻稿'
        case 'industry-news': return '行业动态'
        case 'announcement': return '公告通知'
        default: return filterType
      }
    } else {
      switch (filterType) {
        case 'all': return 'All News'
        case 'press-release': return 'Press Releases'
        case 'industry-news': return 'Industry News'
        case 'announcement': return 'Announcements'
        default: return filterType
      }
    }
  }

  const getReadMoreText = () => {
    return language === 'zh-Hans' ? '阅读更多' : 'Read More'
  }

  const getEmptyStateText = () => {
    if (language === 'zh-Hans') {
      return {
        title: '暂无新闻',
        description: '请稍后查看最新资讯更新。'
      }
    } else {
      return {
        title: 'No news found',
        description: 'Please check back later for the latest updates.'
      }
    }
  }

  // 筛选文章
  const filteredArticles = filter === 'all' 
    ? articles 
    : articles.filter(article => article.category?.slug === filter)

  return (
    <>
      <SEOHead
        title={`${getPageTitle()} | DITC`}
        description={getPageDescription()}
      />
      <Layout>
        {/* Banner */}
        <div className="relative z-10 overflow-hidden pt-[120px] pb-[60px] md:pt-[130px] lg:pt-[160px] dark:bg-dark">
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-stroke/0 via-stroke dark:via-dark-3 to-stroke/0"></div>
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="mb-4 text-3xl font-bold text-dark dark:text-white sm:text-4xl md:text-[40px] md:leading-[1.2]">
                {getPageTitle()}
              </h1>
              <ul className="flex items-center justify-center gap-[10px] flex-wrap">
                <li>
                  <button
                    onClick={() => setFilter('all')}
                    className={`text-base font-medium transition-colors ${
                      filter === 'all' 
                        ? 'text-dark dark:text-white' 
                        : 'text-body-color dark:text-dark-6 hover:text-primary'
                    }`}
                  >
                    {getFilterLabel('all')}
                  </button>
                </li>
                <li className="flex items-center">
                  <span className="text-body-color dark:text-dark-6 mr-[10px]"> / </span>
                  <button
                    onClick={() => setFilter('press-release')}
                    className={`text-base font-medium transition-colors ${
                      filter === 'press-release' 
                        ? 'text-dark dark:text-white' 
                        : 'text-body-color dark:text-dark-6 hover:text-primary'
                    }`}
                  >
                    {getFilterLabel('press-release')}
                  </button>
                </li>
                <li className="flex items-center">
                  <span className="text-body-color dark:text-dark-6 mr-[10px]"> / </span>
                  <button
                    onClick={() => setFilter('industry-news')}
                    className={`text-base font-medium transition-colors ${
                      filter === 'industry-news' 
                        ? 'text-dark dark:text-white' 
                        : 'text-body-color dark:text-dark-6 hover:text-primary'
                    }`}
                  >
                    {getFilterLabel('industry-news')}
                  </button>
                </li>
                <li className="flex items-center">
                  <span className="text-body-color dark:text-dark-6 mr-[10px]"> / </span>
                  <button
                    onClick={() => setFilter('announcement')}
                    className={`text-base font-medium transition-colors ${
                      filter === 'announcement' 
                        ? 'text-dark dark:text-white' 
                        : 'text-body-color dark:text-dark-6 hover:text-primary'
                    }`}
                  >
                    {getFilterLabel('announcement')}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* News List */}
        <section className="pt-20 pb-10 lg:pt-[120px] lg:pb-20 dark:bg-dark">
          <div className="container mx-auto px-4">
            {loading && (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-4 text-body-color dark:text-dark-6">
                  {language === 'zh-Hans' ? '加载中...' : 'Loading...'}
                </p>
              </div>
            )}

            {!loading && filteredArticles.length > 0 && (
              <div className="flex flex-wrap -mx-4">
                {filteredArticles.map((article, index) => (
                  <div key={article.documentId || index} className="w-full px-4 md:w-1/2 lg:w-1/3">
                    <div className="mb-10 wow fadeInUp group" data-wow-delay={`.${(index % 3 + 1) * 5}s`}>
                      <div className="mb-8 overflow-hidden rounded-[5px]">
                        <a href={`/newsroom/${article.documentId || article.slug || `article-${index}`}`} className="block">
                          <img
                            src={article.cover?.url || '/images/blog/blog-01.jpg'}
                            alt={article.cover?.alternativeText || article.title}
                            className="w-full transition group-hover:rotate-6 group-hover:scale-125"
                            onError={(e) => {
                              console.log('Newsroom image load error:', article.documentId, 'cover:', article.cover);
                            }}
                            onLoad={() => {
                              if (article.cover?.url) {
                                console.log('Newsroom image loaded successfully:', article.documentId, 'URL:', article.cover.url);
                              }
                            }}
                          />
                        </a>
                      </div>
                      <div>
                        <span className="inline-block px-4 py-0.5 mb-6 text-xs font-medium leading-loose text-center text-white rounded-[5px] bg-primary">
                          {new Date(article.publishedAt).toLocaleDateString(
                            language === 'zh-Hans' ? 'zh-CN' : 'en-US'
                          )}
                        </span>
                        <h3>
                          <a
                            href={`/newsroom/${article.documentId || article.slug || `article-${index}`}`}
                            className="inline-block mb-4 text-xl font-semibold text-dark dark:text-white hover:text-primary dark:hover:text-primary sm:text-2xl lg:text-xl xl:text-2xl"
                          >
                            {article.title}
                          </a>
                        </h3>
                        <p className="max-w-[370px] text-base text-body-color dark:text-dark-6">
                          {article.description || (article.content && article.content.length > 150 
                            ? `${article.content.substring(0, 150)}...` 
                            : article.content)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && filteredArticles.length === 0 && (
              <div className="text-center py-20">
                <h3 className="text-xl font-semibold text-dark dark:text-white mb-4">
                  {getEmptyStateText().title}
                </h3>
                <p className="text-body-color dark:text-dark-6">
                  {getEmptyStateText().description}
                </p>
              </div>
            )}
          </div>
        </section>
      </Layout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  try {
    console.log(`🔄 正在为 ${locale} 生成Newsroom静态页面...`)
    
    const articles = await getNewsroom(undefined, locale)
    
    // 清理undefined值，防止序列化错误
    const serializedArticles = JSON.parse(JSON.stringify(articles || []))
    
    console.log(`✅ 成功为 ${locale} 获取 ${serializedArticles.length} 条Newsroom数据`)
    
    return {
      props: {
        initialArticles: serializedArticles,
        locale,
      },
      revalidate: serializedArticles.length > 0 ? 3600 : 60,
    }
  } catch (error) {
    console.error(`❌ 为 ${locale} 生成Newsroom静态页面失败:`, error)
    return {
      props: {
        initialArticles: [],
        locale,
      },
      revalidate: 60,
    }
  }
} 