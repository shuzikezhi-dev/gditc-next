import { useState, useEffect } from 'react'
import Head from 'next/head'
import { GetStaticProps } from 'next'
import Layout from '../components/Layout'
import SEOHead from '../components/SEOHead'
import { getEvents, type Event as StrapiEvent } from '../lib/strapi'
import { t, getTranslation } from '../lib/translations'
import { useLanguage } from './_app'

// 扩展Event类型，添加id字段
interface Event extends StrapiEvent {
  id: number;
}

interface EventsProps {
  initialEvents: Event[];
  locale: string;
}

export default function Events({ initialEvents = [], locale }: EventsProps) {
  const { language } = useLanguage()
  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all')
  const [currentDataLocale, setCurrentDataLocale] = useState(locale) // 追踪当前数据的语言

  // 监听语言变化，获取对应语言的数据
  useEffect(() => {
    const fetchEventsForLanguage = async () => {
      if (language === currentDataLocale) return // 语言没变，无需重新获取
      
      setLoading(true)
      try {
        console.log(`🔄 语言切换为 ${language}，重新获取Events数据...`)
        const response = await fetch(`/api/events?locale=${language}`)
        if (response.ok) {
          const newEvents = await response.json()
          setEvents(newEvents)
          setCurrentDataLocale(language) // 更新当前数据语言
          console.log(`✅ 成功获取 ${newEvents.length} 条Events数据`)
        } else {
          console.error('❌ 获取Events数据失败')
        }
      } catch (error) {
        console.error('❌ 获取Events数据时出错:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEventsForLanguage()
  }, [language, currentDataLocale])

  const upcomingEvents = events?.filter(event => new Date(event.date) > new Date()) || []
  const pastEvents = events?.filter(event => new Date(event.date) <= new Date()) || []

  const displayEvents = filter === 'upcoming' ? upcomingEvents : 
                      filter === 'past' ? pastEvents : events || []

  const getPageTitle = () => {
    return language === 'zh-Hans' ? '活动' : 'Events'
  }

  const getPageDescription = () => {
    return language === 'zh-Hans' 
      ? '参加我们的活动、峰会和竞赛，推进数字基础设施标准' 
      : 'Join our events, summits, and competitions to advance digital infrastructure standards'
  }

  const getFilterLabel = (filterType: string) => {
    if (language === 'zh-Hans') {
      switch (filterType) {
        case 'all': return '所有活动'
        case 'upcoming': return '即将举行'
        case 'past': return '往期活动'
        default: return filterType
      }
    } else {
      switch (filterType) {
        case 'all': return 'All Events'
        case 'upcoming': return 'Upcoming Events'
        case 'past': return 'Past Events'
        default: return filterType
      }
    }
  }

  const getStatusLabel = (date: string) => {
    const isUpcoming = new Date(date) > new Date()
    if (language === 'zh-Hans') {
      return isUpcoming ? '即将举行' : '已结束'
    } else {
      return isUpcoming ? 'Upcoming' : 'Past Event'
    }
  }

  const getActionLabel = (date: string) => {
    const isUpcoming = new Date(date) > new Date()
    if (language === 'zh-Hans') {
      return isUpcoming ? '立即报名' : '查看详情'
    } else {
      return isUpcoming ? 'Register' : 'View Details'
    }
  }

  const getEmptyStateText = () => {
    if (language === 'zh-Hans') {
      return {
        title: '暂无活动',
        description: '请尝试选择不同的筛选条件或稍后查看更新。'
      }
    } else {
      return {
        title: 'No events found',
        description: 'Try selecting a different filter or check back later for updates.'
      }
    }
  }

  return (
    <>
      <SEOHead
        title={`${getPageTitle()} | DITC`}
        description={getPageDescription()}
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
                        onClick={() => setFilter('upcoming')}
                        className={`text-base font-medium transition-colors ${
                          filter === 'upcoming' 
                            ? 'text-dark dark:text-white' 
                            : 'text-body-color dark:text-dark-6 hover:text-primary'
                        }`}
                      >
                        {getFilterLabel('upcoming')}
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
                      >
                        {getFilterLabel('past')}
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Events List */}
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

            {!loading && displayEvents.length > 0 && (
              <div className="flex flex-wrap -mx-4">
                {displayEvents.map((event, index) => (
                  <div key={event.documentId || event.id} className="w-full px-4 md:w-1/2 lg:w-1/3">
                    <div className="mb-10 wow fadeInUp group" data-wow-delay={`.${(index % 3 + 1) * 5}s`}>
                      <div className="mb-8 overflow-hidden rounded-[5px]">
                        <a href={`/events/${event.documentId || event.id}`} className="block">
                          <img
                            src={event.cover?.url || '/images/blog/blog-01.jpg'}
                            alt={event.cover?.alternativeText || event.title}
                            className="w-full transition group-hover:rotate-6 group-hover:scale-125"
                            onError={(e) => {
                              console.log('Event image load error:', event.id, 'cover:', event.cover);
                            }}
                            onLoad={() => {
                              if (event.cover?.url) {
                                console.log('Event image loaded successfully:', event.id, 'URL:', event.cover.url);
                              }
                            }}
                          />
                        </a>
                      </div>
                      <div>
                        <span className="inline-block px-4 py-0.5 mb-6 text-xs font-medium leading-loose text-center text-white rounded-[5px] bg-primary">
                          {new Date(event.date).toLocaleDateString(language === 'zh-Hans' ? 'zh-CN' : 'en-US')}
                        </span>
                        <h3>
                          <a
                            href={`/events/${event.documentId || event.id}`}
                            className="inline-block mb-4 text-xl font-semibold text-dark dark:text-white hover:text-primary dark:hover:text-primary sm:text-2xl lg:text-xl xl:text-2xl"
                          >
                            {event.title}
                          </a>
                        </h3>
                        <p className="max-w-[370px] text-base text-body-color dark:text-dark-6">
                          {event.content && event.content.length > 150 
                            ? `${event.content.substring(0, 150)}...` 
                            : event.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && displayEvents.length === 0 && (
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
    console.log(`🔄 正在为 ${locale} 生成Events静态页面...`)
    
    const events = await getEvents(undefined, locale)
    
    // 将Strapi事件转换为带有id的Event类型，并清理undefined值
    const eventsWithId: Event[] = events.map((event, index) => ({
      ...event,
      id: event.id || index + 1
    }))
    
    // 使用JSON.parse(JSON.stringify())清理undefined值，防止序列化错误
    const serializedEvents = JSON.parse(JSON.stringify(eventsWithId))
    
    console.log(`✅ 成功为 ${locale} 获取 ${eventsWithId.length} 条Events数据`)
    
    return {
      props: {
        initialEvents: serializedEvents,
        locale,
      },
      revalidate: eventsWithId.length > 0 ? 3600 : 60, // 有数据时1小时，无数据时1分钟
    }
  } catch (error) {
    console.error(`❌ 为 ${locale} 生成Events静态页面失败:`, error)
    return {
      props: {
        initialEvents: [],
        locale,
      },
      revalidate: 60, // 1分钟后重试
    }
  }
} 