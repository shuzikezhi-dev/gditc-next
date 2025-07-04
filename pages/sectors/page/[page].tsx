import { GetStaticProps, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../../../components/Layout'
import SEOHead from '../../../components/SEOHead'
import { getSectors, Sector } from '../../../lib/strapi'
import { useLanguage } from '../../_app'

interface SectorsPageProps {
  sectors: Sector[]
  currentPage: number
  totalPages: number
  totalSectors: number
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

export default function SectorsPage({ 
  sectors, 
  currentPage, 
  totalPages, 
  totalSectors, 
  language 
}: SectorsPageProps) {
  const router = useRouter()
  const { language: currentLanguage } = useLanguage()
  
  // 根据路由确定当前语言和基础路径
  const isZhHans = router.asPath.includes('/zh-Hans/')
  const isEn = router.asPath.includes('/en/')
  const actualLanguage = isZhHans ? 'zh-Hans' : (isEn ? 'en' : currentLanguage)
  const basePath = isZhHans ? '/zh-Hans/sectors/page' : (isEn ? '/en/sectors/page' : '/sectors/page')

  // 计算显示范围
  const sectorsPerPage = 12
  const startIndex = (currentPage - 1) * sectorsPerPage + 1
  const endIndex = Math.min(currentPage * sectorsPerPage, totalSectors)

  // 获取本地化文本
  const getText = (key: string) => {
    const texts = {
      'en': {
        title: 'Sectors',
        description: 'standards enhance innovation, safety, and interoperability in digital infrastructure technologies.',
        noSectorsFound: 'No sectors found',
        noSectorsDesc: 'Try selecting a different filter or language.'
      },
      'zh-Hans': {
        title: '行业板块',
        description: '标准促进数字基础设施技术的创新、安全和互操作性。',
        noSectorsFound: '未找到板块',
        noSectorsDesc: '请尝试选择不同的筛选条件或语言。'
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

  return (
    <>
      <SEOHead
        title={`${getText('title')} - ${actualLanguage === 'zh-Hans' ? `第${currentPage}页` : `Page ${currentPage}`}`}
        description={`DITC ${getText('description')}`}
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
                    DITC {getText('description')}
                  </p>

                  {/* 行业板块统计信息 */}
                  {totalSectors > 0 && (
                    <div className="mb-6 text-sm text-body-color dark:text-dark-6">
                      {actualLanguage === 'zh-Hans' 
                        ? `共 ${totalSectors} 个行业板块 | 显示 ${startIndex}-${endIndex} 个`
                        : `Showing ${startIndex}-${endIndex} of ${totalSectors} Sectors`
                      }
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
            {sectors.length > 0 ? (
              <>
                <div className="flex flex-wrap -mx-4">
                  {sectors.map((sector, index) => (
                    <div key={sector.id} className="w-full px-4 md:w-1/2 lg:w-1/3">
                      <div className="mb-10 wow fadeInUp group" data-wow-delay={`.${(index % 3 + 1) * 5}s`}>
                        <div className="mb-8 overflow-hidden rounded-[5px]">
                          <Link href={`/sectors/${sector.documentId || sector.id}`} className="block">
                            <img
                              src={sector.cover?.url || '/images/blog/blog-01.jpg'}
                              alt={sector.title}
                              className="w-full h-48 object-cover transition group-hover:rotate-6 group-hover:scale-125"
                            />
                          </Link>
                        </div>
                        <div>
                          <span className="inline-block px-4 py-0.5 mb-6 text-xs font-medium leading-loose text-center text-white rounded-[5px] bg-primary">
                            {formatDate(sector.publishedAt || sector.date)}
                          </span>
                          <h3>
                            <Link
                              href={`/sectors/${sector.documentId || sector.id}`}
                              className={`inline-block mb-4 text-xl font-semibold text-dark dark:text-white hover:text-primary dark:hover:text-primary sm:text-2xl lg:text-xl xl:text-2xl article-title ${actualLanguage === 'zh-Hans' ? 'zh' : 'en'}`}
                            >
                              {sector.title}
                            </Link>
                          </h3>
                          <p className={`max-w-[370px] text-base text-body-color dark:text-dark-6 article-description ${actualLanguage === 'zh-Hans' ? 'zh' : 'en'}`}>
                            {extractTextFromContent(sector.descript || sector.content)}
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
                  {getText('noSectorsFound')}
                </h3>
                <p className="text-body-color dark:text-dark-6">
                  {getText('noSectorsDesc')}
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
    // 获取所有行业板块数据来计算总页数
    const [sectorsEn, sectorsZh] = await Promise.all([
      getSectors(undefined, 'en'),
      getSectors(undefined, 'zh-Hans')
    ])

    const sectorsPerPage = 12
    const totalPagesEn = Math.ceil(sectorsEn.length / sectorsPerPage)
    const totalPagesZh = Math.ceil(sectorsZh.length / sectorsPerPage)
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
    console.error('生成Sectors分页路径失败:', error)
    return {
      paths: [{ params: { page: '1' } }],
      fallback: false
    }
  }
}

export const getStaticProps: GetStaticProps<SectorsPageProps> = async ({ params }) => {
  try {
    const page = parseInt(params?.page as string) || 1
    const sectorsPerPage = 12

    // 获取所有行业板块数据
    const [sectorsEn, sectorsZh] = await Promise.all([
      getSectors(undefined, 'en'),
      getSectors(undefined, 'zh-Hans')
    ])

    // 默认使用英文数据
    const allSectors = sectorsEn.length > 0 ? sectorsEn : sectorsZh
    
    // 计算分页数据
    const totalSectors = allSectors.length
    const totalPages = Math.ceil(totalSectors / sectorsPerPage)
    const startIndex = (page - 1) * sectorsPerPage
    const endIndex = startIndex + sectorsPerPage
    const pageSectors = allSectors.slice(startIndex, endIndex)

    return {
      props: {
        sectors: pageSectors,
        currentPage: page,
        totalPages,
        totalSectors,
        language: 'en'
      }
    }
  } catch (error) {
    console.error('生成Sectors分页数据失败:', error)
    
    return {
      props: {
        sectors: [],
        currentPage: 1,
        totalPages: 1,
        totalSectors: 0,
        language: 'en'
      }
    }
  }
}
