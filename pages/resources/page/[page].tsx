import { GetStaticProps, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../../../components/Layout'
import SEOHead from '../../../components/SEOHead'
import { t, getTranslation } from '../../../lib/translations'
import { useLanguage } from '../../_app'

interface Resource {
  id: number;
  documentId: string;
  type: string;
  title: string;
  description: string;
  downloadUrl: string;
  publishDate: string;
  fileSize: string;
  format: string;
  cover: string;
}

interface ResourcesPageProps {
  resources: Resource[]
  currentPage: number
  totalPages: number
  totalResources: number
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

export default function ResourcesPage({ 
  resources, 
  currentPage, 
  totalPages, 
  totalResources, 
  language 
}: ResourcesPageProps) {
  const router = useRouter()
  const { language: currentLanguage } = useLanguage()
  
  // 根据路由确定当前语言和基础路径
  const isZhHans = router.asPath.includes('/zh-Hans/')
  const isEn = router.asPath.includes('/en/')
  const actualLanguage = isZhHans ? 'zh-Hans' : (isEn ? 'en' : currentLanguage)
  const basePath = isZhHans ? '/zh-Hans/resources/page' : (isEn ? '/en/resources/page' : '/resources/page')

  // 计算显示范围
  const resourcesPerPage = 12
  const startIndex = (currentPage - 1) * resourcesPerPage + 1
  const endIndex = Math.min(currentPage * resourcesPerPage, totalResources)

  // 格式化日期
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString(actualLanguage === 'zh-Hans' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <>
      <SEOHead
        title={`${t(actualLanguage, 'resources.title')} - ${actualLanguage === 'zh-Hans' ? `第${currentPage}页` : `Page ${currentPage}`}`}
        description={t(actualLanguage, 'resources.pageDescription')}
        canonical={`https://gditc.org${basePath}/${currentPage}`}
      />
      <Layout>
        {/* Banner */}
        <div className="relative z-10 overflow-hidden pt-[120px] pb-[60px] md:pt-[130px] lg:pt-[160px] dark:bg-dark">
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-stroke/0 via-stroke dark:via-dark-3 to-stroke/0"></div>
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center -mx-4">
              <div className="w-full px-4">
                <div className="text-center">
                  <h1 className="mb-4 text-3xl font-bold text-dark dark:text-white sm:text-4xl md:text-[40px] md:leading-[1.2]">
                    {t(actualLanguage, 'resources.title')}
                  </h1>
                  <p className="mb-5 text-base text-body-color dark:text-dark-6">
                    {t(actualLanguage, 'resources.pageDescription')}
                  </p>

                  {/* 资源统计信息 */}
                  {totalResources > 0 && (
                    <div className="mb-6 text-sm text-body-color dark:text-dark-6">
                      {actualLanguage === 'zh-Hans' 
                        ? `共 ${totalResources} 个资源 | 显示 ${startIndex}-${endIndex} 个`
                        : `Showing ${startIndex}-${endIndex} of ${totalResources} Resources`
                      }
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <section className="pt-20 pb-10 lg:pt-[120px] lg:pb-20 dark:bg-dark">
          <div className="container mx-auto px-4">
            {resources.length > 0 ? (
              <>
                <div className="flex flex-wrap -mx-4">
                  {resources.map((resource, index) => (
                    <div key={resource.id} className="w-full px-4 md:w-1/2 lg:w-1/3">
                      <div className="mb-10 wow fadeInUp group" data-wow-delay={`.${(index % 3 + 1) * 5}s`}>
                        <div className="mb-8 overflow-hidden rounded-[5px]">
                          <Link href={`/resources/${resource.documentId}`} className="block">
                            <img
                              src={resource.cover}
                              alt={resource.title}
                              className="w-full h-48 object-cover transition group-hover:rotate-6 group-hover:scale-125"
                            />
                          </Link>
                        </div>
                        <div>
                          <span className="inline-block px-4 py-0.5 mb-6 text-xs font-medium leading-loose text-center text-white rounded-[5px] bg-primary">
                            {formatDate(resource.publishDate)}
                          </span>
                          <h3>
                            <Link
                              href={`/resources/${resource.documentId}`}
                              className={`inline-block mb-4 text-xl font-semibold text-dark dark:text-white hover:text-primary dark:hover:text-primary sm:text-2xl lg:text-xl xl:text-2xl article-title ${actualLanguage === 'zh-Hans' ? 'zh' : 'en'}`}
                            >
                              {resource.title}
                            </Link>
                          </h3>
                          <p className={`max-w-[370px] text-base text-body-color dark:text-dark-6 mb-4 article-description ${actualLanguage === 'zh-Hans' ? 'zh' : 'en'}`}>
                            {resource.description}
                          </p>
                          
                          {/* 下载按钮 */}
                          {resource.downloadUrl && resource.downloadUrl !== '#' && (
                            <div className="flex items-center gap-3">
                              <a
                                href={resource.downloadUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors"
                              >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                {actualLanguage === 'zh-Hans' ? '下载' : 'Download'}
                              </a>
                            </div>
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
                  {actualLanguage === 'zh-Hans' ? '未找到资源' : 'No Resources Found'}
                </h3>
                <p className="text-body-color dark:text-dark-6">
                  {actualLanguage === 'zh-Hans' 
                    ? '请尝试选择不同的分类或稍后再查看更新。' 
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
    // 创建示例资源数据（每种语言18个资源，需要2页）
    const totalResources = 18
    const resourcesPerPage = 12
    const totalPages = Math.ceil(totalResources / resourcesPerPage)

    // 生成所有页面路径
    const paths = []
    for (let page = 1; page <= totalPages; page++) {
      paths.push({ params: { page: page.toString() } })
    }

    return {
      paths,
      fallback: false
    }
  } catch (error) {
    console.error('生成Resources分页路径失败:', error)
    return {
      paths: [{ params: { page: '1' } }],
      fallback: false
    }
  }
}

export const getStaticProps: GetStaticProps<ResourcesPageProps> = async ({ params }) => {
  try {
    const page = parseInt(params?.page as string) || 1
    const resourcesPerPage = 12

    // 生成示例资源数据 - 使用翻译数据
    const generateResources = (lang: string): Resource[] => {
      const translations = getTranslation(lang)
      const baseResources = [
        {
          id: 1,
          documentId: 'ditc-membership-system',
          type: 'white-papers',
          title: translations.resources.data.title1,
          description: translations.resources.data.description1,
          downloadUrl: '/DITC-CM-001：DITC Membership System and Fee Standards.pdf',
          publishDate: '2024-01-15',
          fileSize: '2.1 MB',
          format: 'PDF',
          cover: '/images/blog/blog-01.jpg'
        },
        {
          id: 2,
          documentId: 'digital-infrastructure-report',
          type: 'technical-reports',
          title: translations.resources.data.title2,
          description: translations.resources.data.description2,
          downloadUrl: '#',
          publishDate: '2024-01-20',
          fileSize: '3.5 MB',
          format: 'PDF',
          cover: '/images/blog/blog-02.jpg'
        },
        {
          id: 3,
          documentId: 'standardization-case-study',
          type: 'case-studies',
          title: translations.resources.data.title3,
          description: translations.resources.data.description3,
          downloadUrl: '#',
          publishDate: '2024-02-01',
          fileSize: '1.8 MB',
          format: 'PDF',
          cover: '/images/blog/blog-03.jpg'
        }
      ]

      // 复制数据以创建更多资源（总共18个）
      const allResources: Resource[] = []
      for (let i = 0; i < 6; i++) {
        baseResources.forEach((resource, index) => {
          allResources.push({
            ...resource,
            id: i * baseResources.length + index + 1,
            documentId: `${resource.documentId}-${i + 1}`,
            title: `${resource.title} ${i + 1}`,
            publishDate: new Date(2024, i % 12, (index + 1) * 5).toISOString().split('T')[0]
          })
        })
      }

      return allResources
    }

    const allResources = generateResources('en')
    
    // 计算分页数据
    const totalResources = allResources.length
    const totalPages = Math.ceil(totalResources / resourcesPerPage)
    const startIndex = (page - 1) * resourcesPerPage
    const endIndex = startIndex + resourcesPerPage
    const pageResources = allResources.slice(startIndex, endIndex)

    return {
      props: {
        resources: pageResources,
        currentPage: page,
        totalPages,
        totalResources,
        language: 'en'
      }
    }
  } catch (error) {
    console.error('生成Resources分页数据失败:', error)
    
    return {
      props: {
        resources: [],
        currentPage: 1,
        totalPages: 1,
        totalResources: 0,
        language: 'en'
      }
    }
  }
}
