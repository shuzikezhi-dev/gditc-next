import { GetStaticProps, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../../../components/Layout'
import SEOHead from '../../../components/SEOHead'
import { getContentList, DetailContent } from '../../../lib/detail-api'
import { t } from '../../../lib/translations'
import { useLanguage } from '../../_app'

// 活动类型接口
interface Activity {
  id: number;
  documentId: string;
  category: string;
  title: string;
  description: string;
  content: string;
  image?: string;
  date: string;
  status: 'ongoing' | 'upcoming' | 'completed';
  locale: string;
  cover?: {
    url: string;
  } | null;
}

interface ActivitiesAndServicesPageProps {
  activities: Activity[]
  currentPage: number
  totalPages: number
  totalActivities: number
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
        next: 'Next'
      },
      'zh-Hans': {
        previous: '上一页',
        next: '下一页'
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
      {currentPage > 1 ? (
        <Link 
          href={`${basePath}/${currentPage - 1}`}
          className="px-3 py-2 rounded-md transition-colors bg-white text-gray-700 border hover:bg-blue-500 hover:text-white hover:border-blue-500 dark:bg-dark-2 dark:text-white dark:border-dark-3 dark:hover:bg-blue-500 dark:hover:border-blue-500"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
      ) : (
        <span className="px-3 py-2 rounded-md bg-gray-100 text-gray-400 cursor-not-allowed">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </span>
      )}

      {getVisiblePages().map(page => (
        page === currentPage ? (
          <span 
            key={page}
            className="px-4 py-2 rounded-md bg-blue-500 text-white"
          >
            {page}
          </span>
        ) : (
          <Link
            key={page}
            href={`${basePath}/${page}`}
            className="px-4 py-2 rounded-md transition-colors bg-white text-gray-700 border hover:bg-blue-500 hover:text-white hover:border-blue-500 dark:bg-dark-2 dark:text-white dark:border-dark-3 dark:hover:bg-blue-500 dark:hover:border-blue-500"
          >
            {page}
          </Link>
        )
      ))}

      {currentPage < totalPages ? (
        <Link 
          href={`${basePath}/${currentPage + 1}`}
          className="px-3 py-2 rounded-md transition-colors bg-white text-gray-700 border hover:bg-blue-500 hover:text-white hover:border-blue-500 dark:bg-dark-2 dark:text-white dark:border-dark-3 dark:hover:bg-blue-500 dark:hover:border-blue-500"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ) : (
        <span className="px-3 py-2 rounded-md bg-gray-100 text-gray-400 cursor-not-allowed">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      )}
    </div>
  )
}

export default function ActivitiesAndServicesPage({ 
  activities, 
  currentPage, 
  totalPages, 
  totalActivities, 
  language 
}: ActivitiesAndServicesPageProps) {
  const router = useRouter()
  const { language: currentLanguage } = useLanguage()
  
  // 根据路由确定当前语言和基础路径
  const isZhHans = router.asPath.includes('/zh-Hans/')
  const isEn = router.asPath.includes('/en/')
  const actualLanguage = isZhHans ? 'zh-Hans' : (isEn ? 'en' : currentLanguage)
  const basePath = isZhHans ? '/zh-Hans/ActivitiesAndServices/page' : (isEn ? '/en/ActivitiesAndServices/page' : '/ActivitiesAndServices/page')

  // 计算显示范围
  const activitiesPerPage = 12
  const startIndex = (currentPage - 1) * activitiesPerPage + 1
  const endIndex = Math.min(currentPage * activitiesPerPage, totalActivities)

  return (
    <>
      <SEOHead
        title={`${t(actualLanguage, 'activities.title')} - ${actualLanguage === 'zh-Hans' ? `第${currentPage}页` : `Page ${currentPage}`}`}
        description={t(actualLanguage, 'activities.pageDescription')}
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
                    {t(actualLanguage, 'activities.title')}
                  </h1>
                  <p className="mb-5 text-base text-body-color dark:text-dark-6">
                    {t(actualLanguage, 'activities.pageDescription')}
                  </p>

                  {/* 活动统计信息 */}
                  {totalActivities > 0 && (
                    <div className="mb-6 text-sm text-body-color dark:text-dark-6">
                      {actualLanguage === 'zh-Hans' 
                        ? `共 ${totalActivities} 个活动和服务 | 显示 ${startIndex}-${endIndex} 个`
                        : `Showing ${startIndex}-${endIndex} of ${totalActivities} Activities & Services`
                      }
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activities Grid Section */}
        <section className="pt-20 pb-10 lg:pt-[120px] lg:pb-20 dark:bg-dark">
          <div className="container mx-auto px-4">
            {activities.length > 0 ? (
              <>
                <div className="flex flex-wrap -mx-4">
                  {activities.map((activity, index) => (
                    <div key={activity.documentId} className="w-full px-4 md:w-1/2 lg:w-1/3">
                      <div className={`mb-10 wow fadeInUp group`} data-wow-delay={`.${(index % 3 + 1) * 5}s`}>
                        <div className="mb-8 overflow-hidden rounded-[5px]">
                          <Link href={`/activities-services/${activity.documentId}`} className="block">
                            <img
                              src={activity.cover?.url || activity.image || '/images/blog/blog-01.jpg'}
                              alt={activity.title}
                              className="w-full h-48 object-cover transition group-hover:rotate-6 group-hover:scale-125"
                            />
                          </Link>
                        </div>
                        <div>
                          <span className="inline-block px-4 py-0.5 mb-6 text-xs font-medium leading-loose text-center text-white rounded-[5px] bg-primary">
                            {new Date(activity.date).toLocaleDateString(actualLanguage === 'zh-Hans' ? 'zh-CN' : 'en-US')}
                          </span>
                          <h3>
                            <Link
                              href={`/activities-services/${activity.documentId}`}
                              className={`inline-block mb-4 text-xl font-semibold text-dark dark:text-white hover:text-primary dark:hover:text-primary sm:text-2xl lg:text-xl xl:text-2xl article-title ${actualLanguage === 'zh-Hans' ? 'zh' : 'en'}`}
                            >
                              {activity.title}
                            </Link>
                          </h3>
                          <p className={`max-w-[370px] text-base text-body-color dark:text-dark-6 article-description ${actualLanguage === 'zh-Hans' ? 'zh' : 'en'}`}>
                            {activity.description}
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
                <div className="text-6xl mb-4">🚀</div>
                <h3 className="text-2xl font-bold text-dark dark:text-white mb-2">
                  {actualLanguage === 'zh-Hans' ? '暂无活动和服务' : 'No Activities & Services Found'}
                </h3>
                <p className="text-body-color dark:text-dark-6">
                  {actualLanguage === 'zh-Hans' 
                    ? '尝试选择不同的分类或稍后再查看更新。' 
                    : 'Try selecting a different category or check back later for updates.'
                  }
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
    // 获取所有活动数据来计算总页数
    const [activitiesEn, activitiesZh] = await Promise.all([
      getContentList('activities-and-services', 'en'),
      getContentList('activities-and-services', 'zh-Hans')
    ])

    const activitiesPerPage = 12
    const totalPagesEn = Math.ceil(activitiesEn.length / activitiesPerPage)
    const totalPagesZh = Math.ceil(activitiesZh.length / activitiesPerPage)
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
    console.error('生成Activities分页路径失败:', error)
    return {
      paths: [{ params: { page: '1' } }],
      fallback: false
    }
  }
}

export const getStaticProps: GetStaticProps<ActivitiesAndServicesPageProps> = async ({ params }) => {
  try {
    const page = parseInt(params?.page as string) || 1
    const activitiesPerPage = 12

    // 获取所有活动数据
    const [activitiesEn, activitiesZh] = await Promise.all([
      getContentList('activities-and-services', 'en'),
      getContentList('activities-and-services', 'zh-Hans')
    ])

    // 清理数据
    const cleanActivities = (activities: DetailContent[]): Activity[] => {
      return activities.map((item: DetailContent, index: number) => ({
        id: item.id || index + 1,
        documentId: item.documentId,
        category: item.type || 'standardization',
        title: item.title,
        description: item.description || item.descript || '',
        content: item.content,
        image: item.cover?.url,
        date: item.publishedAt || item.createdAt,
        status: 'ongoing' as const,
        locale: item.locale,
        cover: item.cover
      }))
    }

    const cleanedActivitiesEn = cleanActivities(activitiesEn)
    const cleanedActivitiesZh = cleanActivities(activitiesZh)

    // 默认使用英文数据
    const allActivities = cleanedActivitiesEn.length > 0 ? cleanedActivitiesEn : cleanedActivitiesZh
    
    // 计算分页数据
    const totalActivities = allActivities.length
    const totalPages = Math.ceil(totalActivities / activitiesPerPage)
    const startIndex = (page - 1) * activitiesPerPage
    const endIndex = startIndex + activitiesPerPage
    const pageActivities = allActivities.slice(startIndex, endIndex)

    return {
      props: {
        activities: pageActivities,
        currentPage: page,
        totalPages,
        totalActivities,
        language: 'en'
      }
    }
  } catch (error) {
    console.error('生成Activities分页数据失败:', error)
    
    return {
      props: {
        activities: [],
        currentPage: 1,
        totalPages: 1,
        totalActivities: 0,
        language: 'en'
      }
    }
  }
}
