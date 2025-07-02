import { GetStaticProps, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../../../components/Layout'
import SEOHead from '../../../components/SEOHead'
import { getNewsroom, Article } from '../../../lib/strapi'
import { useLanguage } from '../../_app'

interface NewsroomPageProps {
  articles: Article[]
  currentPage: number
  totalPages: number
  totalArticles: number
  language: string
}

// 分页导航组件
const Pagination = ({ 
  currentPage, 
  totalPages, 
  language,
  basePath
}: { 
  currentPage: number
  totalPages: number 
  language: string
  basePath: string
}) => {
  const getText = (key: string) => {
    const texts = {
      'en': {
        previous: 'Previous',
        next: 'Next',
        page: 'Page'
      },
      'zh-Hans': {
        previous: '上一页',
        next: '下一页',
        page: '第'
      }
    }
    return texts[language as keyof typeof texts]?.[key as keyof typeof texts['en']] || texts['en'][key as keyof typeof texts['en']]
  }

  const getVisiblePages = () => {
    const maxVisible = 5
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages, start + maxVisible - 1)
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }
    
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex justify-center items-center mt-12 space-x-2">
      {/* 上一页按钮 */}
      {currentPage > 1 ? (
        <Link 
          href={`${basePath}/${currentPage - 1}`}
          className="px-4 py-2 rounded-md transition-colors bg-white text-gray-700 border hover:bg-gray-50 dark:bg-dark-2 dark:text-white dark:border-dark-3 dark:hover:bg-dark-3"
        >
          {getText('previous')}
        </Link>
      ) : (
        <span className="px-4 py-2 rounded-md bg-gray-100 text-gray-400 cursor-not-allowed">
          {getText('previous')}
        </span>
      )}

      {/* 页码按钮 */}
      {getVisiblePages().map(page => (
        page === currentPage ? (
          <span 
            key={page}
            className="px-4 py-2 rounded-md bg-primary text-white"
          >
            {page}
          </span>
        ) : (
          <Link
            key={page}
            href={`${basePath}/${page}`}
            className="px-4 py-2 rounded-md transition-colors bg-white text-gray-700 border hover:bg-gray-50 dark:bg-dark-2 dark:text-white dark:border-dark-3 dark:hover:bg-dark-3"
          >
            {page}
          </Link>
        )
      ))}

      {/* 下一页按钮 */}
      {currentPage < totalPages ? (
        <Link 
          href={`${basePath}/${currentPage + 1}`}
          className="px-4 py-2 rounded-md transition-colors bg-white text-gray-700 border hover:bg-gray-50 dark:bg-dark-2 dark:text-white dark:border-dark-3 dark:hover:bg-dark-3"
        >
          {getText('next')}
        </Link>
      ) : (
        <span className="px-4 py-2 rounded-md bg-gray-100 text-gray-400 cursor-not-allowed">
          {getText('next')}
        </span>
      )}
    </div>
  )
}

export default function NewsroomPage({ 
  articles, 
  currentPage, 
  totalPages, 
  totalArticles, 
  language 
}: NewsroomPageProps) {
  const router = useRouter()
  const { language: currentLanguage } = useLanguage()
  
  // 根据路由确定当前语言和基础路径
  const isZhHans = router.asPath.includes('/zh-Hans/')
  const isEn = router.asPath.includes('/en/')
  const actualLanguage = isZhHans ? 'zh-Hans' : (isEn ? 'en' : currentLanguage)
  const basePath = isZhHans ? '/zh-Hans/newsroom/page' : (isEn ? '/en/newsroom/page' : '/newsroom/page')

  // 获取本地化文本
  const getText = (key: string) => {
    const texts = {
      'en': {
        title: 'Newsroom',
        description: 'Stay updated with the latest news, announcements, and insights from DITC',
        noNewsFound: 'No news found',
        noNewsDesc: 'Try selecting a different filter or check back later for updates.',
        publishedOn: 'Published on',
        totalArticles: 'Total Articles',
        showingResults: 'Showing'
      },
      'zh-Hans': {
        title: '新闻中心',
        description: '获取DITC的最新新闻、公告和见解',
        noNewsFound: '暂无新闻',
        noNewsDesc: '请尝试选择不同的筛选条件或稍后查看更新。',
        publishedOn: '发布于',
        totalArticles: '共',
        showingResults: '显示'
      }
    }
    return texts[actualLanguage as keyof typeof texts]?.[key as keyof typeof texts['en']] || texts['en'][key as keyof typeof texts['en']]
  }

  // 格式化日期显示
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString(actualLanguage === 'zh-Hans' ? 'zh-CN' : 'en-US', {
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

  // 计算显示范围
  const articlesPerPage = 12
  const startIndex = (currentPage - 1) * articlesPerPage + 1
  const endIndex = Math.min(currentPage * articlesPerPage, totalArticles)

  return (
    <>
      <SEOHead
        title={`${getText('title')} - ${actualLanguage === 'zh-Hans' ? `第${currentPage}页` : `Page ${currentPage}`}`}
        description={getText('description')}
        canonical={`https://gditc.org${basePath}/${currentPage}`}
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

                  {/* 文章统计信息 */}
                  {totalArticles > 0 && (
                    <div className="mb-6 text-sm text-body-color dark:text-dark-6">
                      {actualLanguage === 'zh-Hans' 
                        ? `${getText('totalArticles')} ${totalArticles} 篇文章 | ${getText('showingResults')} ${startIndex}-${endIndex} 篇`
                        : `${getText('showingResults')} ${startIndex}-${endIndex} of ${totalArticles} ${getText('totalArticles')}`
                      }
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
            {articles.length > 0 ? (
              <>
                <div className="flex flex-wrap -mx-4">
                  {articles.map((article, index) => (
                    <div key={article.documentId} className="w-full px-4 md:w-1/2 lg:w-1/3">
                      <div className="mb-10 wow fadeInUp group" data-wow-delay={`.${(index % 3 + 1) * 5}s`}>
                        <div className="mb-8 overflow-hidden rounded-[5px]">
                          <Link href={`/newsroom/${article.documentId}`} className="block">
                            {article.cover && article.cover.url && (
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
                          {article.category && article.category.name && (
                            <span className="inline-block px-3 py-1 mb-4 ml-2 text-xs font-medium text-primary border border-primary rounded-full">
                              {article.category.name}
                            </span>
                          )}
                          <h3>
                            <Link
                              href={`/newsroom/${article.documentId}`}
                              className={`inline-block mb-4 text-xl font-semibold text-dark dark:text-white hover:text-primary dark:hover:text-primary sm:text-2xl lg:text-xl xl:text-2xl article-title ${actualLanguage === 'zh-Hans' ? 'zh' : 'en'}`}
                            >
                              {article.title}
                            </Link>
                          </h3>
                          <p className={`max-w-[370px] text-base text-body-color dark:text-dark-6 article-description ${actualLanguage === 'zh-Hans' ? 'zh' : 'en'}`}>
                            {extractTextFromContent(article.description || article.descript || article.content || '')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 分页导航 */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  language={actualLanguage}
                  basePath={basePath}
                />
              </>
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

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    // 获取所有文章数据来计算总页数
    const [articlesEn, articlesZh] = await Promise.all([
      getNewsroom(undefined, 'en'),
      getNewsroom(undefined, 'zh-Hans')
    ])

    const articlesPerPage = 12
    const totalPagesEn = Math.ceil(articlesEn.length / articlesPerPage)
    const totalPagesZh = Math.ceil(articlesZh.length / articlesPerPage)
    const maxPages = Math.max(totalPagesEn, totalPagesZh)

    // 生成所有页面路径
    const paths = []
    for (let page = 1; page <= maxPages; page++) {
      paths.push({ params: { page: page.toString() } })
    }

    return {
      paths,
      fallback: false
    }
  } catch (error) {
    console.error('生成分页路径失败:', error)
    return {
      paths: [{ params: { page: '1' } }],
      fallback: false
    }
  }
}

export const getStaticProps: GetStaticProps<NewsroomPageProps> = async ({ params }) => {
  try {
    const page = parseInt(params?.page as string) || 1
    const articlesPerPage = 12

    // 获取所有文章数据
    const [articlesEn, articlesZh] = await Promise.all([
      getNewsroom(undefined, 'en'),
      getNewsroom(undefined, 'zh-Hans')
    ])

    // 清理数据
    const cleanArticles = (articles: Article[]): Article[] => {
      return articles.map(article => ({
        documentId: article.documentId || `article-${Date.now()}`,
        title: article.title || '',
        slug: article.slug || '',
        description: article.description || '',
        descript: article.descript || '',
        content: article.content || '',
        cover: article.cover || null,
        author: article.author || null,
        category: article.category || null,
        blocks: article.blocks || null,
        locale: article.locale || 'en',
        createdAt: article.createdAt || new Date().toISOString(),
        updatedAt: article.updatedAt || new Date().toISOString(),
        publishedAt: article.publishedAt || new Date().toISOString(),
      }))
    }

    const cleanedArticlesEn = cleanArticles(articlesEn)
    const cleanedArticlesZh = cleanArticles(articlesZh)

    // 根据当前语言选择文章（这里默认使用英文，实际应该根据路由参数确定）
    // 在实际应用中可能需要根据路由包含语言信息
    const allArticles = cleanedArticlesEn.length > 0 ? cleanedArticlesEn : cleanedArticlesZh
    
    // 计算分页数据
    const totalArticles = allArticles.length
    const totalPages = Math.ceil(totalArticles / articlesPerPage)
    const startIndex = (page - 1) * articlesPerPage
    const endIndex = startIndex + articlesPerPage
    const pageArticles = allArticles.slice(startIndex, endIndex)

    return {
      props: {
        articles: pageArticles,
        currentPage: page,
        totalPages,
        totalArticles,
        language: 'en' // 这里可以根据实际需求调整
      }
    }
  } catch (error) {
    console.error('生成分页数据失败:', error)
    
    return {
      props: {
        articles: [],
        currentPage: 1,
        totalPages: 1,
        totalArticles: 0,
        language: 'en'
      }
    }
  }
} 