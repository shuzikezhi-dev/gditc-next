import { useState } from 'react'
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import Layout from '../components/Layout'
import SEOHead from '../components/SEOHead'
import { getEvents, type Event as StrapiEvent } from '../lib/strapi'

// 扩展Event类型，添加id字段
interface Event extends StrapiEvent {
  id: number;
}

// 假数据
const mockEvents: Event[] = [
  {
    id: 1,
    title: 'DITC Annual Conference 2024',
    date: '2024-12-15',
    content: 'Join us for the premier digital infrastructure conference featuring keynotes from industry leaders, technical sessions, and networking opportunities.',
    location: 'Singapore Convention Centre'
  },
  {
    id: 2,
    title: 'AI Standards Workshop',
    date: '2024-11-20',
    content: 'A comprehensive workshop on developing AI standards for digital infrastructure, including hands-on sessions and expert panels.',
    location: 'Virtual Event'
  },
  {
    id: 3,
    title: 'Cybersecurity Summit 2024',
    date: '2024-10-25',
    content: 'Explore the latest cybersecurity standards and best practices for protecting digital infrastructure in an evolving threat landscape.',
    location: 'Tokyo International Forum'
  },
  {
    id: 4,
    title: 'Data Center Efficiency Forum',
    date: '2024-09-18',
    content: 'Discuss sustainable data center practices, energy efficiency standards, and green technology innovations.',
    location: 'Amsterdam RAI'
  },
  {
    id: 5,
    title: 'Network Infrastructure Symposium',
    date: '2024-08-22',
    content: 'Technical deep-dive into next-generation network infrastructure standards, 5G deployment, and edge computing.',
    location: 'San Francisco Moscone Center'
  },
  {
    id: 6,
    title: 'Digital Standards Bootcamp',
    date: '2024-07-30',
    content: 'Intensive training program for professionals looking to understand and implement digital infrastructure standards.',
    location: 'London Excel Centre'
  }
]

export default function Events({ events = mockEvents }: { events?: Event[] }) {
  const [filter, setFilter] = useState('all')

  const upcomingEvents = events?.filter(event => new Date(event.date) > new Date()) || []
  const pastEvents = events?.filter(event => new Date(event.date) <= new Date()) || []

  const displayEvents = filter === 'upcoming' ? upcomingEvents : 
                      filter === 'past' ? pastEvents : events || []

  return (
    <>
      <SEOHead
        title="Events | DITC"
        description="Join our events, summits, and competitions to advance digital infrastructure standards"
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
                    Events
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
                        All Events
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
                        Upcoming Events
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
                        Past Events
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        {/* <section className="py-16 bg-gray-50 dark:bg-dark-2">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {[
                { id: 'all', name: 'All Events', count: events?.length || 0 },
                { id: 'upcoming', name: 'Upcoming Events', count: upcomingEvents.length },
                { id: 'past', name: 'Past Events', count: pastEvents.length }
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setFilter(type.id)}
                  className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 ${
                    filter === type.id
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-white dark:bg-dark text-body-color dark:text-white hover:bg-primary/10 dark:hover:bg-primary/20 border border-gray-200 dark:border-dark-3'
                  }`}
                >
                  <span className="font-medium">{type.name}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    filter === type.id ? 'bg-white text-primary' : 'bg-gray-200 dark:bg-dark-3 text-gray-600 dark:text-gray-400'
                  }`}>
                    {type.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section> */}

        {/* Featured Event - Summit 2024 */}
        {/* <section className="py-20 lg:py-[120px]">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 md:p-16 text-white mb-16">
              <div className="max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">
                  <span className="mr-2">🎉</span>
                  Featured Event
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-6">
                  DITC Global Summit 2024
                </h2>
                <p className="text-xl mb-8 opacity-90">
                  Join industry leaders, researchers, and innovators for the premier digital infrastructure conference of the year.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-2xl mb-2">📅</div>
                    <div className="font-semibold">Date</div>
                    <div className="opacity-90">November 15-17, 2024</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-2xl mb-2">📍</div>
                    <div className="font-semibold">Location</div>
                    <div className="opacity-90">Singapore</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-2xl mb-2">👥</div>
                    <div className="font-semibold">Attendees</div>
                    <div className="opacity-90">1000+ Professionals</div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="#" className="px-8 py-4 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    Register Now
                  </a>
                  <a href="#" className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors">
                    View Agenda
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section> */}

        {/* Events List */}
        <section className="pb-20 lg:pb-[120px]">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {displayEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white dark:bg-dark rounded-lg shadow-lg border border-gray-200 dark:border-dark-3 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            new Date(event.date) > new Date()
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                          }`}>
                            {new Date(event.date) > new Date() ? 'Upcoming' : 'Past Event'}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-dark dark:text-white mb-2">
                          {event.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4 text-sm text-body-color dark:text-dark-6">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.location}
                      </div>
                    </div>

                    <p className="text-body-color dark:text-dark-6 mb-6 line-clamp-3">
                      {event.content}
                    </p>

                    <div className="flex items-center justify-between">
                      <a
                        href="#"
                        className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
                      >
                        {new Date(event.date) > new Date() ? 'Register' : 'View Details'}
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {displayEvents.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-2xl font-bold text-dark dark:text-white mb-2">No events found</h3>
                <p className="text-body-color dark:text-dark-6">
                  Try selecting a different filter or check back later for updates.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Signup */}
        {/* <section className="bg-gray-1 py-20 dark:bg-dark-2 lg:py-[120px]">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-dark dark:text-white mb-4">
                Stay Updated
              </h2>
              <p className="text-lg text-body-color dark:text-dark-6 mb-8">
                Subscribe to our newsletter to receive updates about upcoming events, announcements, and industry insights.
              </p>
              <form className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-4 rounded-lg border border-gray-200 dark:border-dark-3 bg-white dark:bg-dark text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </section> */}
      </Layout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const events = await getEvents()
    // 将Strapi事件转换为带有id的Event类型
    const eventsWithId: Event[] = events.map((event, index) => ({
      ...event,
      id: index + 1 // 临时ID，实际应该从Strapi获取
    }))
    
    return {
      props: {
        events: eventsWithId.length > 0 ? eventsWithId : mockEvents
      }
    }
  } catch (error) {
    console.error('Error fetching events:', error)
    return {
      props: {
        events: mockEvents
      }
    }
  }
} 