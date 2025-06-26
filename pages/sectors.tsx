import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Layout from '../components/Layout'
import SEOHead from '../components/SEOHead'
import { getSectors, Sector } from '../lib/strapi'
import { GetStaticProps } from 'next'
import { useLanguage } from './_app'

interface SectorsPageProps {
  sectors: Sector[]
  currentType: string
}

export default function Sectors({ sectors: initialSectors, currentType }: SectorsPageProps) {
  const router = useRouter()
  const { language } = useLanguage()
  const [sectors, setSectors] = useState<Sector[]>(initialSectors)
  const [activeFilter, setActiveFilter] = useState<string>(currentType)
  const [loading, setLoading] = useState(false)

  const sectorTypes = [
    { 
      id: 'Network', 
      name: { en: 'Network', 'zh-Hans': '网络' }, 
      icon: '🔗' 
    },
    { 
      id: 'Datacenter', 
      name: { en: 'Datacenter', 'zh-Hans': '数据中心' }, 
      icon: '🏢' 
    },
    { 
      id: 'Data', 
      name: { en: 'Data', 'zh-Hans': '数据' }, 
      icon: '📊' 
    },
    { 
      id: 'Cloud', 
      name: { en: 'Cloud', 'zh-Hans': '云计算' }, 
      icon: '☁️' 
    },
    { 
      id: 'AI', 
      name: { en: 'AI', 'zh-Hans': '人工智能' }, 
      icon: '🤖' 
    },
    { 
      id: 'Security', 
      name: { en: 'Security', 'zh-Hans': '安全' }, 
      icon: '🔒' 
    }
  ]

  // 监听全局语言变化时重新获取数据
  useEffect(() => {
    if (language !== router.locale) {
      // 语言发生变化，需要获取新数据
      fetchSectors(activeFilter, language)
    }
  }, [language])

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

  // 处理类型筛选
  const handleFilterChange = (type: string) => {
    setActiveFilter(type)
    
    // 更新URL但不刷新页面
    const newUrl = `/sectors?type=${type}`
    router.push(newUrl, undefined, { shallow: true })
    
    // 获取新类型的数据
    fetchSectors(type, language)
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
    return texts[language as keyof typeof texts]?.[key as keyof typeof texts['en']] || texts['en'][key as keyof typeof texts['en']]
  }

  // 获取当前活跃类型的显示名称
  const getActiveFilterDisplayName = () => {
    const activeType = sectorTypes.find(type => type.id === activeFilter)
    return activeType ? activeType.name[language as keyof typeof activeType.name] || activeType.name.en : activeFilter
  }

  return (
    <>
      <SEOHead
        title={`${getActiveFilterDisplayName()} ${getText('title')}`}
        description={`DITC ${getActiveFilterDisplayName()} ${getText('description')}`}
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
                    {getActiveFilterDisplayName()} {getText('title')}
                  </h1>
                  <p className="mb-5 text-base text-body-color dark:text-dark-6">
                    DITC {getActiveFilterDisplayName()} {getText('description')}
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
                          {type.name[language as keyof typeof type.name] || type.name.en}
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

        {/* Main Content */}
        <section className="pt-20 pb-10 lg:pt-[120px] lg:pb-20 dark:bg-dark">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-4 text-body-color dark:text-dark-6">Loading...</p>
              </div>
            ) : sectors.length > 0 ? (
              <div className="flex flex-wrap -mx-4">
                {sectors.map((sector, index) => {
                  return (
                  <div key={sector.id} className="w-full px-4 md:w-1/2 lg:w-1/3">
                    <div className="mb-10 wow fadeInUp group" data-wow-delay={`.${(index % 3 + 1) * 5}s`}>
                      <div className="mb-8 overflow-hidden rounded-[5px]">
                        <a href={`/sectors/${sector.documentId || sector.id}`} className="block">
                          <img
                            src={sector.cover?.url || '/images/blog/blog-01.jpg'}
                            alt={sector.title}
                            className="w-full h-48 object-cover transition group-hover:rotate-6 group-hover:scale-125"
                          />
                        </a>
                      </div>
                      <div>
                        <span className="inline-block px-4 py-0.5 mb-6 text-xs font-medium leading-loose text-center text-white rounded-[5px] bg-primary">
                          {formatDate(sector.publishedAt || sector.date)}
                        </span>
                        <h3>
                          <a
                            href={`/sectors/${sector.documentId || sector.id}`}
                            className={`inline-block mb-4 text-xl font-semibold text-dark dark:text-white hover:text-primary dark:hover:text-primary sm:text-2xl lg:text-xl xl:text-2xl article-title ${language === 'zh-Hans' ? 'zh' : 'en'}`}
                          >
                            {sector.title}
                          </a>
                        </h3>
                        <p className={`max-w-[370px] text-base text-body-color dark:text-dark-6 article-description ${language === 'zh-Hans' ? 'zh' : 'en'}`}>
                          {extractTextFromContent(sector.descript || sector.content)}
                        </p>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20">
                <h3 className="text-xl font-semibold text-dark dark:text-white mb-4">
                  {getText('noSectorsFound')}
                </h3>
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

// 注意：静态路由 /sectors 不需要 getStaticPaths 函数
// getStaticPaths 只用于动态路由（如 [id].tsx）

export const getStaticProps: GetStaticProps<SectorsPageProps> = async ({ locale, params }) => {
  try {
    // 从URL params获取type，如果没有则默认为Network
    const type = 'Network' // 暂时固定为Network，因为我们使用查询参数处理类型切换
    const language = locale || 'en'
    
    console.log(`SSG: Generating page for type: ${type}, locale: ${language}`)
    
    const sectors = await getSectors(type, language)
    
    return {
      props: {
        sectors: sectors || [],
        currentType: type
      },
      revalidate: 3600 // 每小时重新生成
    }
  } catch (error) {
    console.error('Error fetching sectors:', error)
    
    return {
      props: {
        sectors: [],
        currentType: 'Network'
      },
      revalidate: 3600
    }
  }
} 