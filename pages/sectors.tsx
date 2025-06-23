import { useState, useEffect } from 'react'
import Head from 'next/head'
import Layout from '../components/Layout'
import SEOHead from '../components/SEOHead'
import { getSectors, Sector } from '../lib/strapi'
import { GetServerSideProps } from 'next'

interface SectorsPageProps {
  sectors: Sector[]
  currentType: string
  currentLanguage: string
}

export default function Sectors({ sectors, currentType, currentLanguage: initialLanguage }: SectorsPageProps) {
  const [activeFilter, setActiveFilter] = useState<string>(currentType)
  const [currentLanguage, setCurrentLanguage] = useState<string>(initialLanguage)
  const [loading, setLoading] = useState(false)

  const sectorTypes = [
    { id: 'Network', name: 'Network', icon: '🔗' },
    { id: 'Datacenter', name: 'Datacenter', icon: '🏢' },
    { id: 'Data', name: 'Data', icon: '📊' },
    { id: 'Cloud', name: 'Cloud', icon: '☁️' },
    { id: 'AI', name: 'AI', icon: '🤖' },
    { id: 'Security', name: 'Security', icon: '🔒' }
  ]

  // 处理语言切换 - 重新加载页面以获取服务端渲染的数据
  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
    // 重新加载页面以获取对应语言的服务端渲染数据
    window.location.href = `/sectors?type=${activeFilter}&lang=${language}`;
  };

  // 处理类型筛选 - 重新加载页面以获取服务端渲染的数据
  const handleFilterChange = (type: string) => {
    setActiveFilter(type);
    setLoading(true);
    // 重新加载页面以获取对应类型的服务端渲染数据
    window.location.href = `/sectors?type=${type}&lang=${currentLanguage}`;
  };

  // 格式化日期显示
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
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
    // 服务端安全的文本提取
    return content.replace(/<[^>]*>/g, '').trim()
  }

  return (
    <>
      <SEOHead
        title={`${activeFilter} Sectors | DITC`}
        description={`DITC ${activeFilter} standards enhance innovation, safety, and interoperability in digital infrastructure technologies.`}
      />
      <Layout currentLanguage={currentLanguage} onLanguageChange={handleLanguageChange}>
        {/* Banner Section */}
        <div className="relative z-10 overflow-hidden pt-[120px] pb-[60px] md:pt-[130px] lg:pt-[160px] dark:bg-dark">
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-stroke/0 via-stroke dark:via-dark-3 to-stroke/0"></div>
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center -mx-4">
              <div className="w-full px-4">
                <div className="text-center">
                  <h1 className="mb-4 text-3xl font-bold text-dark dark:text-white sm:text-4xl md:text-[40px] md:leading-[1.2]">
                    {activeFilter} Sectors
                  </h1>
                  <p className="mb-5 text-base text-body-color dark:text-dark-6">
                    DITC {activeFilter} standards enhance innovation, safety, and 
                    interoperability in digital infrastructure technologies.
                  </p>

                  <ul className="flex items-center justify-center gap-[10px] flex-wrap">
                    {sectorTypes.map((type, index) => (
                      <li key={type.id} className="flex items-center">
                        {index > 0 && <span className="text-body-color dark:text-dark-6 mr-[10px]"> / </span>}
                        <button
                          onClick={() => handleFilterChange(type.id)}
                          className={`text-base font-medium transition-colors ${
                            activeFilter === type.id 
                              ? 'text-dark dark:text-white' 
                              : 'text-body-color dark:text-dark-6 hover:text-primary'
                          }`}
                          disabled={loading}
                        >
                          {type.name}
                        </button>
                      </li>
                    ))}
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

        {/* Sectors Grid */}
        <section className="py-20 lg:py-[120px]">
          <div className="container mx-auto px-4">
            {sectors && sectors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sectors.map((sector, index) => (
                  <div
                    key={sector.artcileId || sector.id || index}
                    className="group bg-white dark:bg-dark rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-dark-3"
                  >
                    <div className="p-8">
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          sector.type === 'Network' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                          sector.type === 'Datacenter' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          sector.type === 'Data' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                          sector.type === 'Cloud' ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200' :
                          sector.type === 'AI' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {sector.type}
                        </span>
                        <span className="text-sm text-body-color dark:text-dark-6">
                          {formatDate(sector.date)}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-dark dark:text-white mb-4 group-hover:text-primary transition-colors">
                        {sector.title}
                      </h3>
                      
                      {/* 显示描述或内容预览 */}
                      <p className="text-body-color dark:text-dark-6 mb-6 line-clamp-3">
                        {sector.descript || extractTextFromContent(sector.content)}
                      </p>

                      {/* 来源信息 */}
                      {sector.source && (
                        <div className="mb-4">
                          <span className="text-xs text-body-color dark:text-dark-6 bg-gray-100 dark:bg-dark-2 px-2 py-1 rounded">
                            Source: {sector.source}
                          </span>
                        </div>
                      )}

                      {/* 附件信息 */}
                      {sector.attach?.data && sector.attach.data.length > 0 && (
                        <div className="mb-4">
                          <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">
                            📎 {sector.attach.data.length} attachment(s)
                          </span>
                        </div>
                      )}
                      
                      <a
                        href="#"
                        className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
                      >
                        Learn More
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-dark dark:text-white mb-2">No sectors found</h3>
                <p className="text-body-color dark:text-dark-6">
                  No {activeFilter} sectors found for {currentLanguage === 'en' ? 'English' : 'Chinese'}. Try selecting a different filter or language.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Standards Development Process */}
        <section className="bg-gray-1 py-20 dark:bg-dark-2 lg:py-[120px]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="mb-4 text-3xl font-bold leading-tight text-dark dark:text-white sm:text-[40px] sm:leading-[1.2]">
                Standards Development Process
              </h2>
              <p className="text-lg text-body-color dark:text-dark-6 max-w-3xl mx-auto">
                Our collaborative approach ensures that every standard meets the highest quality requirements and addresses real-world challenges.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: '1', title: 'Research & Analysis', description: 'Identify industry needs and gaps' },
                { step: '2', title: 'Draft Development', description: 'Create initial standard proposals' },
                { step: '3', title: 'Expert Review', description: 'Technical committee evaluation' },
                { step: '4', title: 'Publication', description: 'Release final approved standards' }
              ].map((process, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                    {process.step}
                  </div>
                  <h3 className="text-xl font-bold text-dark dark:text-white mb-2">{process.title}</h3>
                  <p className="text-body-color dark:text-dark-6">{process.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Layout>
    </>
  )
}

// 使用getServerSideProps实现服务端渲染，对SEO更友好
export const getServerSideProps: GetServerSideProps<SectorsPageProps> = async (context) => {
  try {
    // 从查询参数获取类型和语言
    const type = (context.query.type as string) || 'Network'
    const language = (context.query.lang as string) || 'en'
    
    console.log(`SSR: Fetching sectors for type: ${type}, language: ${language}`)
    
    // 在服务端获取数据
    const sectors = await getSectors(type, language)
    
    console.log(`SSR: Fetched ${sectors?.length || 0} sectors`)
    
    return {
      props: {
        sectors: sectors || [],
        currentType: type,
        currentLanguage: language
      }
    }
  } catch (error) {
    console.error('SSR: Error fetching sectors:', error)
    
    return {
      props: {
        sectors: [],
        currentType: 'Network',
        currentLanguage: 'en'
      }
    }
  }
} 