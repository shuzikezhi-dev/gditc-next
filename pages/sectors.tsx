import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Layout from '../components/Layout'
import SEOHead from '../components/SEOHead'
import { getSectors, Sector } from '../lib/strapi'
import { GetStaticProps } from 'next'

interface SectorsPageProps {
  initialSectors: Sector[]
}

export default function Sectors({ initialSectors }: SectorsPageProps) {
  const router = useRouter()
  const [sectors, setSectors] = useState<Sector[]>(initialSectors)
  const [activeFilter, setActiveFilter] = useState<string>('Network')
  const [currentLanguage, setCurrentLanguage] = useState<string>('en')
  const [loading, setLoading] = useState(false)

  const sectorTypes = [
    { id: 'Network', name: 'Network', icon: '🔗' },
    { id: 'Datacenter', name: 'Datacenter', icon: '🏢' },
    { id: 'Data', name: 'Data', icon: '📊' },
    { id: 'Cloud', name: 'Cloud', icon: '☁️' },
    { id: 'AI', name: 'AI', icon: '🤖' },
    { id: 'Security', name: 'Security', icon: '🔒' }
  ]

  // 从URL参数初始化状态
  useEffect(() => {
    if (router.isReady) {
      const { type, lang } = router.query
      const newType = (type as string) || 'Network'
      const newLang = (lang as string) || 'en'
      
      setActiveFilter(newType)
      setCurrentLanguage(newLang)
      
      // 如果参数与初始值不同，获取新数据
      if (newType !== 'Network' || newLang !== 'en') {
        fetchSectors(newType, newLang)
      }
    }
  }, [router.isReady, router.query])

  // 获取sectors数据的函数
  const fetchSectors = async (type: string, language: string) => {
    setLoading(true)
    try {
      console.log(`Fetching sectors for type: ${type}, language: ${language}`)
      const newSectors = await getSectors(type, language)
      setSectors(newSectors || [])
    } catch (error) {
      console.error('Error fetching sectors:', error)
      setSectors([])
    } finally {
      setLoading(false)
    }
  }

  // 处理语言切换
  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language)
    
    // 更新URL但不刷新页面
    const newUrl = `/sectors?type=${activeFilter}&lang=${language}`
    router.push(newUrl, undefined, { shallow: true })
    
    // 获取新语言的数据
    fetchSectors(activeFilter, language)
  }

  // 处理类型筛选
  const handleFilterChange = (type: string) => {
    setActiveFilter(type)
    
    // 更新URL但不刷新页面
    const newUrl = `/sectors?type=${type}&lang=${currentLanguage}`
    router.push(newUrl, undefined, { shallow: true })
    
    // 获取新类型的数据
    fetchSectors(type, currentLanguage)
  }

  // 格式化日期显示
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString(currentLanguage === 'zh-Hans' ? 'zh-CN' : 'en-US', {
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

  // 获取本地化文本
  const getText = (key: string) => {
    const texts = {
      'en': {
        title: 'Sectors',
        description: 'standards enhance innovation, safety, and interoperability in digital infrastructure technologies.',
        noSectorsFound: 'No sectors found',
        noSectorsDesc: 'Try selecting a different filter or language.',
        learnMore: 'Learn More',
        source: 'Source',
        attachments: 'attachment(s)',
        standardsProcess: 'Standards Development Process',
        processDesc: 'Our collaborative approach ensures that every standard meets the highest quality requirements and addresses real-world challenges.',
        research: 'Research & Analysis',
        researchDesc: 'Identify industry needs and gaps',
        draft: 'Draft Development', 
        draftDesc: 'Create initial standard proposals',
        review: 'Expert Review',
        reviewDesc: 'Technical committee evaluation',
        publication: 'Publication',
        publicationDesc: 'Release final approved standards'
      },
      'zh-Hans': {
        title: '行业板块',
        description: '标准促进数字基础设施技术的创新、安全和互操作性。',
        noSectorsFound: '未找到板块',
        noSectorsDesc: '请尝试选择不同的筛选条件或语言。',
        learnMore: '了解更多',
        source: '来源',
        attachments: '个附件',
        standardsProcess: '标准制定流程',
        processDesc: '我们的协作方法确保每个标准都满足最高质量要求并解决现实世界的挑战。',
        research: '研究与分析',
        researchDesc: '识别行业需求和差距',
        draft: '草案制定',
        draftDesc: '创建初始标准提案',
        review: '专家评审',
        reviewDesc: '技术委员会评估',
        publication: '发布',
        publicationDesc: '发布最终批准的标准'
      }
    }
    return texts[currentLanguage as keyof typeof texts]?.[key as keyof typeof texts['en']] || texts['en'][key as keyof typeof texts['en']]
  }

  return (
    <>
      <SEOHead
        title={`${activeFilter} ${getText('title')} | DITC`}
        description={`DITC ${activeFilter} ${getText('description')}`}
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
                    {activeFilter} {getText('title')}
                  </h1>
                  <p className="mb-5 text-base text-body-color dark:text-dark-6">
                    DITC {activeFilter} {getText('description')}
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
                            {getText('source')}: {sector.source}
                          </span>
                        </div>
                      )}

                      {/* 附件信息 */}
                      {sector.attach?.data && sector.attach.data.length > 0 && (
                        <div className="mb-4">
                          <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">
                            📎 {sector.attach.data.length} {getText('attachments')}
                          </span>
                        </div>
                      )}
                      
                      <a
                        href={`/sectors/${currentLanguage}/${sector.id || index}/${sector.artcileId || index}`}
                        className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
                      >
                        {getText('learnMore')}
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
                <h3 className="text-2xl font-bold text-dark dark:text-white mb-2">{getText('noSectorsFound')}</h3>
                <p className="text-body-color dark:text-dark-6">
                  {getText('noSectorsDesc')}
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
                {getText('standardsProcess')}
              </h2>
              <p className="text-lg text-body-color dark:text-dark-6 max-w-3xl mx-auto">
                {getText('processDesc')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: '1', title: getText('research'), description: getText('researchDesc') },
                { step: '2', title: getText('draft'), description: getText('draftDesc') },
                { step: '3', title: getText('review'), description: getText('reviewDesc') },
                { step: '4', title: getText('publication'), description: getText('publicationDesc') }
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

export const getStaticProps: GetStaticProps<SectorsPageProps> = async () => {
  try {
    // 只获取默认的英文Network数据作为初始数据
    const sectors = await getSectors('Network', 'en')
    
    return {
      props: {
        initialSectors: sectors || []
      }
    }
  } catch (error) {
    console.error('Error fetching sectors:', error)
    
    return {
      props: {
        initialSectors: []
      }
    }
  }
} 