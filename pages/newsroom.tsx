import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../components/Layout'
import SEOHead from '../components/SEOHead'
import { getNewsroom, Article } from '../lib/strapi'
import { useLanguage } from './_app'

export default function Newsroom() {
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all')

  // 监听全局语言变化
  useEffect(() => {
    fetchNewsroom(language)
  }, [language])

  // 获取newsroom数据的函数
  const fetchNewsroom = async (language: string) => {
    setLoading(true)
    try {
      console.log(`🔄 获取Newsroom数据 (${language})...`)
      
      const newsData = await getNewsroom(undefined, language)
      
      console.log(`✅ 成功获取 ${newsData.length} 条Newsroom数据`)
      setArticles(newsData)
    } catch (error) {
      console.error('❌ 获取Newsroom数据失败:', error)
      setArticles([])
    } finally {
      setLoading(false)
    }
  }

  // 获取本地化文本
  const getText = (key: string) => {
    const texts = {
      'en': {
        title: 'Newsroom',
        description: 'Stay updated with the latest news, announcements, and insights from DITC',
        allNews: 'All News',
        latestNews: 'Latest News',
        announcements: 'Announcements',
        insights: 'Insights',
        readMore: 'Read More',
        noNewsFound: 'No news found',
        noNewsDesc: 'Try selecting a different filter or check back later for updates.',
        loading: 'Loading...',
        publishedOn: 'Published on'
      },
      'zh-Hans': {
        title: '新闻中心',
        description: '获取DITC的最新新闻、公告和见解',
        allNews: '所有新闻',
        latestNews: '最新新闻',
        announcements: '公告',
        insights: '见解',
        readMore: '阅读更多',
        noNewsFound: '暂无新闻',
        noNewsDesc: '请尝试选择不同的筛选条件或稍后查看更新。',
        loading: '加载中...',
        publishedOn: '发布于'
      }
    }
    return texts[language as keyof typeof texts]?.[key as keyof typeof texts['en']] || texts['en'][key as keyof typeof texts['en']]
  }

  // 格式化日期显示
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString(language === 'zh-Hans' ? 'zh-CN' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch (error) {
      return dateString
    }
  }

  // 处理富文本内容，提取纯文本用于预览
  const extractTextFromContent = (content: string) => {
    if (!content) return ''
    return content.replace(/<[^>]*>/g, '').trim()
  }

  const displayArticles = articles || []

  return (
    <>
      <SEOHead
        title={getText('title')}
        description={getText('description')}
      />
      <Layout>
        {/* Banner Section */}
        <div className="relative z-10 overflow-hidden pt-[120px] pb-[60px] md:pt-[130px] lg:pt-[160px] dark:bg-dark">
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-stroke/0 via-stroke dark:via-dark-3 to-stroke/0"></div>
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center -mx-4">
              <div className="w-full px-4">
                <div className="text-center">
                  <h1 className="mb-4 text-3xl font-bold text-dark dark:text-white sm:text-4xl md:text-[40px] md:leading-[1.2]">
                    {getText('title')}
                  </h1>
                  <p className="mb-5 text-base text-body-color dark:text-dark-6">
                    {getText('description')}
                  </p>

                  <ul className="flex items-center justify-center gap-[10px] flex-wrap">
                    <li>
                      <button
                        onClick={() => setFilter('all')}
                        className={`text-base font-medium transition-colors ${
                          filter === 'all' 
                            ? 'text-dark dark:text-white' 
                            : 'text-body-color dark:text-dark-6 hover:text-primary'
                        }`}
                        disabled={loading}
                      >
                        {getText('allNews')}
                      </button>
                    </li>
                    <li className="flex items-center">
                      <span className="text-body-color dark:text-dark-6 mr-[10px]"> / </span>
                      <button
                        onClick={() => setFilter('latest')}
                        className={`text-base font-medium transition-colors ${
                          filter === 'latest' 
                            ? 'text-dark dark:text-white' 
                            : 'text-body-color dark:text-dark-6 hover:text-primary'
                        }`}
                        disabled={loading}
                      >
                        {getText('latestNews')}
                      </button>
                    </li>
                    <li className="flex items-center">
                      <span className="text-body-color dark:text-dark-6 mr-[10px]"> / </span>
                      <button
                        onClick={() => setFilter('announcements')}
                        className={`text-base font-medium transition-colors ${
                          filter === 'announcements' 
                            ? 'text-dark dark:text-white' 
                            : 'text-body-color dark:text-dark-6 hover:text-primary'
                        }`}
                        disabled={loading}
                      >
                        {getText('announcements')}
                      </button>
                    </li>
                    <li className="flex items-center">
                      <span className="text-body-color dark:text-dark-6 mr-[10px]"> / </span>
                      <button
                        onClick={() => setFilter('insights')}
                        className={`text-base font-medium transition-colors ${
                          filter === 'insights' 
                            ? 'text-dark dark:text-white' 
                            : 'text-body-color dark:text-dark-6 hover:text-primary'
                        }`}
                        disabled={loading}
                      >
                        {getText('insights')}
                      </button>
                    </li>
                  </ul>

                  {/* 加载状态指示器 */}
                  {loading && (
                    <div className="mt-4 flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* News List */}
        <section className="pt-20 pb-10 lg:pt-[120px] lg:pb-20 dark:bg-dark">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-4 text-body-color dark:text-dark-6">
                  {getText('loading')}
                </p>
              </div>
            ) : displayArticles.length > 0 ? (
              <div className="flex flex-wrap -mx-4">
                {displayArticles.map((article, index) => (
                  <div key={article.documentId} className="w-full px-4 md:w-1/2 lg:w-1/3">
                    <div className="mb-10 wow fadeInUp group" data-wow-delay={`.${(index % 3 + 1) * 5}s`}>
                      <div className="mb-8 overflow-hidden rounded-[5px]">
                        <Link href={`/newsroom/${article.documentId}`} className="block">
                          {article.cover && (
                            <img
                              src={article.cover.url}
                              alt={article.cover.alternativeText || article.title}
                              className="w-full h-48 object-cover transition group-hover:rotate-6 group-hover:scale-125"
                            />
                          )}
                        </Link>
                      </div>
                      <div>
                        <span className="inline-block px-4 py-0.5 mb-6 text-xs font-medium leading-loose text-center text-white rounded-[5px] bg-primary">
                          {formatDate(article.publishedAt)}
                        </span>
                        {article.category && (
                          <span className="inline-block px-3 py-1 mb-4 ml-2 text-xs font-medium text-primary border border-primary rounded-full">
                            {article.category.name}
                          </span>
                        )}
                        <h3>
                          <Link
                            href={`/newsroom/${article.documentId}`}
                            className="inline-block mb-4 text-xl font-semibold text-dark dark:text-white hover:text-primary dark:hover:text-primary sm:text-2xl lg:text-xl xl:text-2xl"
                          >
                            {article.title}
                          </Link>
                        </h3>
                        <p className="max-w-[370px] text-base text-body-color dark:text-dark-6">
                          {extractTextFromContent(article.description || article.descript || article.content || '')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <h3 className="text-xl font-semibold text-dark dark:text-white mb-4">
                  {getText('noNewsFound')}
                </h3>
                <p className="text-body-color dark:text-dark-6">
                  {getText('noNewsDesc')}
                </p>
              </div>
            )}
          </div>
        </section>
      </Layout>
    </>
  )
} 