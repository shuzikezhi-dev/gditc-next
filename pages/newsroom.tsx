import { useState } from 'react'
import { GetServerSideProps } from 'next'
import Layout from '../components/Layout'
import SEOHead from '../components/SEOHead'
import { getNewsroom, type Article } from '../lib/strapi'

interface NewsItem {
  id: number
  title: string
  content: string
  publishedAt: string
  type: 'press' | 'industry' | 'newsletter'
}

// 假数据
const mockNews: NewsItem[] = [
  {
    id: 1,
    title: 'DITC Announces New AI Infrastructure Standards',
    content: 'Groundbreaking standards for AI computing infrastructure approved by international committee. These standards will help organizations build more reliable and efficient AI systems.',
    publishedAt: '2024-03-15',
    type: 'press'
  },
  {
    id: 2,
    title: 'Global Data Center Efficiency Report Released',
    content: 'Annual report reveals significant improvements in data center energy efficiency worldwide. The report shows a 15% improvement in power usage effectiveness across major facilities.',
    publishedAt: '2024-03-10',
    type: 'industry'
  },
  {
    id: 3,
    title: 'Monthly Newsletter - March 2024',
    content: 'Our monthly newsletter featuring the latest updates on digital infrastructure developments, upcoming events, and member spotlights.',
    publishedAt: '2024-03-01',
    type: 'newsletter'
  },
  {
    id: 4,
    title: 'DITC Partners with Leading Tech Companies',
    content: 'Strategic partnerships formed to advance digital infrastructure standardization efforts. New collaborations will accelerate the development of next-generation standards.',
    publishedAt: '2024-02-25',
    type: 'press'
  },
  {
    id: 5,
    title: 'Industry Survey: Cloud Adoption Trends',
    content: 'Comprehensive survey reveals accelerating cloud adoption across enterprise sectors. 78% of organizations plan to increase cloud investments in the next year.',
    publishedAt: '2024-02-20',
    type: 'industry'
  }
]

export default function Newsroom({ news = mockNews }: { news?: NewsItem[] }) {
  const [filter, setFilter] = useState('all')

  const newsTypes = [
    { id: 'all', name: 'All News', icon: '📰' },
    { id: 'press', name: 'Press Releases', icon: '📢' },
    { id: 'industry', name: 'Industry News', icon: '🏭' },
    { id: 'newsletter', name: 'Newsletter', icon: '📧' }
  ]

  const filteredNews = news?.filter(item => 
    filter === 'all' || item.type === filter
  ) || []

  return (
    <>
      <SEOHead
        title="Newsroom | DITC"
        description="Latest news, press releases and industry updates from DITC"
      />
      <Layout>
        {/* Banner */}
        <div className="relative z-10 overflow-hidden pt-[120px] pb-[60px] md:pt-[130px] lg:pt-[160px] dark:bg-dark">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="mb-4 text-3xl font-bold text-dark dark:text-white sm:text-4xl md:text-[40px] md:leading-[1.2]">
                Newsroom
              </h1>
              <ul className="flex items-center justify-center gap-[10px] flex-wrap">
                <li>
                  <button
                    onClick={() => setFilter('press')}
                    className={`text-base font-medium transition-colors ${
                      filter === 'press' 
                        ? 'text-dark dark:text-white' 
                        : 'text-body-color dark:text-dark-6 hover:text-primary'
                    }`}
                  >
                    Press Releases
                  </button>
                </li>
                <li className="flex items-center">
                  <span className="text-body-color dark:text-dark-6 mr-[10px]"> / </span>
                  <button
                    onClick={() => setFilter('industry')}
                    className={`text-base font-medium transition-colors ${
                      filter === 'industry' 
                        ? 'text-dark dark:text-white' 
                        : 'text-body-color dark:text-dark-6 hover:text-primary'
                    }`}
                  >
                    Industry News
                  </button>
                </li>
                <li className="flex items-center">
                  <span className="text-body-color dark:text-dark-6 mr-[10px]"> / </span>
                  <button
                    onClick={() => setFilter('newsletter')}
                    className={`text-base font-medium transition-colors ${
                      filter === 'newsletter' 
                        ? 'text-dark dark:text-white' 
                        : 'text-body-color dark:text-dark-6 hover:text-primary'
                    }`}
                  >
                    Newsletter
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Filter */}
        {/* <section className="py-16 bg-gray-50 dark:bg-dark-2">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4">
              {newsTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setFilter(type.id)}
                  className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 ${
                    filter === type.id
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-white dark:bg-dark text-body-color dark:text-white hover:bg-primary/10 border border-gray-200 dark:border-dark-3'
                  }`}
                >
                  <span>{type.icon}</span>
                  <span className="font-medium">{type.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section> */}

        {/* News List */}
        <section className="py-20 lg:py-[120px]">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {filteredNews.map((item) => (
                <div key={item.id} className="bg-white dark:bg-dark rounded-lg shadow-lg border border-gray-200 dark:border-dark-3 p-8 mb-8 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      item.type === 'press' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                      item.type === 'industry' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                    }`}>
                      {item.type === 'press' ? 'Press Release' : item.type === 'industry' ? 'Industry News' : 'Newsletter'}
                    </span>
                    <span className="text-sm text-body-color dark:text-dark-6">
                      {new Date(item.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-dark dark:text-white mb-4">
                    {item.title}
                  </h3>
                  
                  <p className="text-body-color dark:text-dark-6 mb-6 line-clamp-3">
                    {item.content}
                  </p>
                  
                  <a href="#" className="inline-flex items-center text-primary hover:text-primary/80 font-medium">
                    Read More
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Layout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const news = await getNewsroom()
    // 将Strapi文章转换为NewsItem类型
    const newsItems: NewsItem[] = news.map((article, index) => ({
      id: index + 1,
      title: article.title,
      content: article.description || '',
      publishedAt: article.publishedAt,
      type: 'press' as const // 默认类型，可以根据article的category调整
    }))
    
    return { 
      props: { 
        news: newsItems.length > 0 ? newsItems : mockNews 
      } 
    }
  } catch (error) {
    return { 
      props: { 
        news: mockNews 
      } 
    }
  }
} 