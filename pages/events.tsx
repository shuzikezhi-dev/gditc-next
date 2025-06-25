import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Layout from '../components/Layout'
import SEOHead from '../components/SEOHead'
import { getEvents, Event as StrapiEvent } from '../lib/strapi'
import { useLanguage } from './_app'

// 本地Event接口，用于组件内部
interface Event {
  id: number;
  documentId?: string;
  title: string;
  date: string;
  content: string;
  location?: string;
  type?: string;
  cover?: {
    url: string;
    alternativeText?: string;
  };
}

export default function Events() {
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all')

  // 监听全局语言变化
  useEffect(() => {
    fetchEvents(language)
  }, [language])

  // 获取events数据的函数
  const fetchEvents = async (language: string) => {
    setLoading(true)
    try {
      console.log(`🔄 获取Events数据 (${language})...`)
      
      const eventsData = await getEvents(undefined, language)
      
      // 转换数据格式以匹配本地Event接口
      const formattedEvents: Event[] = eventsData.map((event: StrapiEvent, index: number) => ({
        id: event.id || index + 1,
        documentId: event.documentId,
        title: event.title,
        date: event.date,
        content: event.content,
        location: event.location,
        type: event.type,
        cover: event.cover ? {
          url: event.cover.url,
          alternativeText: event.cover.alternativeText
        } : undefined
      }))
      
      console.log(`✅ 成功获取 ${formattedEvents.length} 条Events数据`)
      setEvents(formattedEvents)
    } catch (error) {
      console.error('❌ 获取Events数据失败:', error)
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  const upcomingEvents = events?.filter(event => new Date(event.date) > new Date()) || []
  const pastEvents = events?.filter(event => new Date(event.date) <= new Date()) || []

  const displayEvents = filter === 'upcoming' ? upcomingEvents : 
                      filter === 'past' ? pastEvents : events || []

  // 获取本地化文本
  const getText = (key: string) => {
    const texts = {
      'en': {
        title: 'Events',
        description: 'Join our events, summits, and competitions to advance digital infrastructure standards',
        allEvents: 'All Events',
        upcomingEvents: 'Upcoming Events',
        pastEvents: 'Past Events',
        upcoming: 'Upcoming',
        pastEvent: 'Past Event',
        register: 'Register',
        viewDetails: 'View Details',
        noEventsFound: 'No events found',
        noEventsDesc: 'Try selecting a different filter or check back later for updates.',
        loading: 'Loading...'
      },
      'zh-Hans': {
        title: '活动',
        description: '参加我们的活动、峰会和竞赛，推进数字基础设施标准',
        allEvents: '所有活动',
        upcomingEvents: '即将举行',
        pastEvents: '往期活动',
        upcoming: '即将举行',
        pastEvent: '已结束',
        register: '立即报名',
        viewDetails: '查看详情',
        noEventsFound: '暂无活动',
        noEventsDesc: '请尝试选择不同的筛选条件或稍后查看更新。',
        loading: '加载中...'
      }
    }
    return texts[language as keyof typeof texts]?.[key as keyof typeof texts['en']] || texts['en'][key as keyof typeof texts['en']]
  }

  const getStatusLabel = (date: string) => {
    const isUpcoming = new Date(date) > new Date()
    return isUpcoming ? getText('upcoming') : getText('pastEvent')
  }

  const getActionLabel = (date: string) => {
    const isUpcoming = new Date(date) > new Date()
    return isUpcoming ? getText('register') : getText('viewDetails')
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
                        {getText('allEvents')}
                      </button>
                    </li>
                    <li className="flex items-center">
                      <span className="text-body-color dark:text-dark-6 mr-[10px]"> / </span>
                      <button
                        onClick={() => setFilter('upcoming')}
                        className={`text-base font-medium transition-colors ${
                          filter === 'upcoming' 
                            ? 'text-dark dark:text-white' 
                            : 'text-body-color dark:text-dark-6 hover:text-primary'
                        }`}
                        disabled={loading}
                      >
                        {getText('upcomingEvents')}
                      </button>
                    </li>
                    <li className="flex items-center">
                      <span className="text-body-color dark:text-dark-6 mr-[10px]"> / </span>
                      <button
                        onClick={() => setFilter('past')}
                        className={`text-base font-medium transition-colors ${
                          filter === 'past' 
                            ? 'text-dark dark:text-white' 
                            : 'text-body-color dark:text-dark-6 hover:text-primary'
                        }`}
                        disabled={loading}
                      >
                        {getText('pastEvents')}
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

        {/* Events List */}
        <section className="pt-20 pb-10 lg:pt-[120px] lg:pb-20 dark:bg-dark">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-4 text-body-color dark:text-dark-6">
                  {getText('loading')}
                </p>
              </div>
            ) : displayEvents.length > 0 ? (
              <div className="flex flex-wrap -mx-4">
                {displayEvents.map((event, index) => (
                  <div key={event.documentId || event.id} className="w-full px-4 md:w-1/2 lg:w-1/3">
                    <div className="mb-10 wow fadeInUp group" data-wow-delay={`.${(index % 3 + 1) * 5}s`}>
                      <div className="mb-8 overflow-hidden rounded-[5px]">
                        <a href={`/events/${event.documentId || event.id}`} className="block">
                          <img
                            src={event.cover?.url || '/images/blog/blog-01.jpg'}
                            alt={event.cover?.alternativeText || event.title}
                            className="w-full h-48 object-cover transition group-hover:rotate-6 group-hover:scale-125"
                          />
                        </a>
                      </div>
                      <div>
                        <span className={`inline-block px-4 py-0.5 mb-6 text-xs font-medium leading-loose text-center text-white rounded-[5px] ${
                          new Date(event.date) > new Date() ? 'bg-primary' : 'bg-gray-400'
                        }`}>
                          {formatDate(event.date)}
                        </span>
                        <h3>
                          <a
                            href={`/events/${event.documentId || event.id}`}
                            className="inline-block mb-4 text-xl font-semibold text-dark dark:text-white hover:text-primary dark:hover:text-primary sm:text-2xl lg:text-xl xl:text-2xl"
                          >
                            {event.title}
                          </a>
                        </h3>
                        <p className="max-w-[370px] text-base text-body-color dark:text-dark-6 mb-4">
                          {event.content && event.content.length > 150 
                            ? `${event.content.substring(0, 150)}...` 
                            : event.content}
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