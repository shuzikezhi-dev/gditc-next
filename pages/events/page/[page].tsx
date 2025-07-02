import { GetStaticProps, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../../../components/Layout'
import SEOHead from '../../../components/SEOHead'
import { getEvents, Event as StrapiEvent } from '../../../lib/strapi'
import { useLanguage } from '../../_app'

// 本地Event接口，用于组件内部
interface Event {
  id: number;
  documentId: string | null;
  title: string;
  date: string;
  content: string;
  location: string | null;
  type: string | null;
  cover: {
    url: string;
    alternativeText: string | null;
  } | null;
}

interface EventsPageProps {
  events: Event[]
  currentPage: number
  totalPages: number
  totalEvents: number
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
          className="px-4 py-2 rounded-md transition-colors bg-white text-gray-700 border hover:bg-gray-50 dark:bg-dark-2 dark:text-white dark:border-dark-3 dark:hover:bg-dark-3"
        >
          {getText('previous')}
        </Link>
      ) : (
        <span className="px-4 py-2 rounded-md bg-gray-100 text-gray-400 cursor-not-allowed">
          {getText('previous')}
        </span>
      )}

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

export default function EventsPage({ 
  events, 
  currentPage, 
  totalPages, 
  totalEvents, 
  language 
}: EventsPageProps) {
  const router = useRouter()
  const { language: currentLanguage } = useLanguage()
  
  // 根据路由确定当前语言和基础路径
  const isZhHans = router.asPath.includes('/zh-Hans/')
  const isEn = router.asPath.includes('/en/')
  const actualLanguage = isZhHans ? 'zh-Hans' : (isEn ? 'en' : currentLanguage)
  const basePath = isZhHans ? '/zh-Hans/events/page' : (isEn ? '/en/events/page' : '/events/page')

  // 计算显示范围
  const eventsPerPage = 12
  const startIndex = (currentPage - 1) * eventsPerPage + 1
  const endIndex = Math.min(currentPage * eventsPerPage, totalEvents)

  // 获取本地化文本
  const getText = (key: string) => {
    const texts = {
      'en': {
        title: 'Events',
        description: 'Join our events, summits, and competitions to advance digital infrastructure standards',
        noEventsFound: 'No events found',
        noEventsDesc: 'Try selecting a different filter or check back later for updates.',
        upcoming: 'Upcoming',
        pastEvent: 'Past Event'
      },
      'zh-Hans': {
        title: '活动',
        description: '参加我们的活动、峰会和竞赛，推进数字基础设施标准',
        noEventsFound: '暂无活动',
        noEventsDesc: '请尝试选择不同的筛选条件或稍后查看更新。',
        upcoming: '即将举行',
        pastEvent: '已结束'
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

                  {/* 活动统计信息 */}
                  {totalEvents > 0 && (
                    <div className="mb-6 text-sm text-body-color dark:text-dark-6">
                      {actualLanguage === 'zh-Hans' 
                        ? `共 ${totalEvents} 个活动 | 显示 ${startIndex}-${endIndex} 个`
                        : `Showing ${startIndex}-${endIndex} of ${totalEvents} Events`
                      }
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Events List */}
        <section className="pt-20 pb-10 lg:pt-[120px] lg:pb-20 dark:bg-dark">
          <div className="container mx-auto px-4">
            {events.length > 0 ? (
              <>
                <div className="flex flex-wrap -mx-4">
                  {events.map((event, index) => (
                    <div key={event.documentId || event.id} className="w-full px-4 md:w-1/2 lg:w-1/3">
                      <div className="mb-10 wow fadeInUp group" data-wow-delay={`.${(index % 3 + 1) * 5}s`}>
                        <div className="mb-8 overflow-hidden rounded-[5px]">
                          <Link href={`/events/${event.documentId || event.id}`} className="block">
                            <img
                              src={event.cover?.url || '/images/blog/blog-01.jpg'}
                              alt={event.cover?.alternativeText || event.title}
                              className="w-full h-48 object-cover transition group-hover:rotate-6 group-hover:scale-125"
                            />
                          </Link>
                        </div>
                        <div>
                          <span className="inline-block px-4 py-0.5 mb-6 text-xs font-medium leading-loose text-center text-white rounded-[5px] bg-primary">
                            {formatDate(event.date)}
                          </span>
                          <h3>
                            <Link
                              href={`/events/${event.documentId || event.id}`}
                              className={`inline-block mb-4 text-xl font-semibold text-dark dark:text-white hover:text-primary dark:hover:text-primary sm:text-2xl lg:text-xl xl:text-2xl article-title ${actualLanguage === 'zh-Hans' ? 'zh' : 'en'}`}
                            >
                              {event.title}
                            </Link>
                          </h3>
                          <p className={`max-w-[370px] text-base text-body-color dark:text-dark-6 mb-4 article-description ${actualLanguage === 'zh-Hans' ? 'zh' : 'en'}`}>
                            {event.content}
                          </p>
                          {event.location && (
                            <p className="text-sm text-body-color dark:text-dark-6 mb-2">
                              📍 {event.location}
                            </p>
                          )}
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
                  {getText('noEventsFound')}
                </h3>
                <p className="text-body-color dark:text-dark-6">
                  {getText('noEventsDesc')}
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
    const [eventsEn, eventsZh] = await Promise.all([
      getEvents(undefined, 'en'),
      getEvents(undefined, 'zh-Hans')
    ])

    const eventsPerPage = 12
    const totalPagesEn = Math.ceil(eventsEn.length / eventsPerPage)
    const totalPagesZh = Math.ceil(eventsZh.length / eventsPerPage)
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
    console.error('生成Events分页路径失败:', error)
    return {
      paths: [{ params: { page: '1' } }],
      fallback: false
    }
  }
}

export const getStaticProps: GetStaticProps<EventsPageProps> = async ({ params }) => {
  try {
    const page = parseInt(params?.page as string) || 1
    const eventsPerPage = 12

    // 获取所有活动数据
    const [eventsEn, eventsZh] = await Promise.all([
      getEvents(undefined, 'en'),
      getEvents(undefined, 'zh-Hans')
    ])

    // 转换数据格式
    const formatEvents = (events: StrapiEvent[]): Event[] => {
      return events.map((event: StrapiEvent, index: number) => ({
        id: event.id || index + 1,
        documentId: event.documentId || null,
        title: event.title,
        date: event.date,
        content: event.content || '',
        location: event.location || null,
        type: event.type || null,
        cover: event.cover ? {
          url: event.cover.url,
          alternativeText: event.cover.alternativeText || null
        } : null
      }))
    }

    const cleanedEventsEn = formatEvents(eventsEn)
    const cleanedEventsZh = formatEvents(eventsZh)

    // 默认使用英文数据
    const allEvents = cleanedEventsEn.length > 0 ? cleanedEventsEn : cleanedEventsZh
    
    // 计算分页数据
    const totalEvents = allEvents.length
    const totalPages = Math.ceil(totalEvents / eventsPerPage)
    const startIndex = (page - 1) * eventsPerPage
    const endIndex = startIndex + eventsPerPage
    const pageEvents = allEvents.slice(startIndex, endIndex)

    return {
      props: {
        events: pageEvents,
        currentPage: page,
        totalPages,
        totalEvents,
        language: 'en'
      }
    }
  } catch (error) {
    console.error('生成Events分页数据失败:', error)
    
    return {
      props: {
        events: [],
        currentPage: 1,
        totalPages: 1,
        totalEvents: 0,
        language: 'en'
      }
    }
  }
}
