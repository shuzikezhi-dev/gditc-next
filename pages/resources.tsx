import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import SEOHead from '../components/SEOHead'
import { getResources, Resource as StrapiResource } from '../lib/strapi'
import { t, getTranslation } from '../lib/translations'
import { useLanguage } from './_app'

// 扩展Resource类型，添加id字段
interface Resource {
  id: number;
  documentId?: string;
  title: string;
  description?: string;
  descript?: string;
  type?: string;
  downloadUrl?: string;
  publishDate?: string;
  fileSize?: string;
  format?: string;
  cover?: string | {
    id?: number;
    documentId?: string;
    name?: string;
    alternativeText?: string;
    caption?: string;
    width?: number;
    height?: number;
    formats?: any;
    hash?: string;
    ext?: string;
    mime?: string;
    size?: number;
    url: string;
    previewUrl?: string;
    provider?: string;
    provider_metadata?: any;
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
  };
}

interface ResourcesProps {
  resourcesData?: { [key: string]: Resource[] };
}

export default function Resources({ resourcesData = {} }: ResourcesProps) {
  const { language } = useLanguage()
  const router = useRouter()
  const { type } = router.query
  
  const [activeType, setActiveType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // 从URL参数初始化状态
  useEffect(() => {
    if (router.isReady) {
      const urlType = (type as string) || 'all'
      console.log('🔗 URL Type Debug:', {
        routerQuery: router.query,
        type,
        urlType,
        currentActiveType: activeType
      })
      setActiveType(urlType)
    }
  }, [router.isReady, router.query])

  // 获取当前语言的资源数据
  const getMockResources = () => {
    // 调试信息
    console.log('🔍 Resources Debug:', {
      language,
      resourcesData,
      hasResourcesData: !!resourcesData,
      currentResources: resourcesData[language],
      englishResources: resourcesData['en']
    })
    
    // 优先使用预生成的数据，如果没有则使用翻译
    const currentResources = resourcesData[language] || resourcesData['en'] || []
    
    if (currentResources.length > 0) {
      console.log('✅ Using pregenerated resources:', currentResources.length)
      return currentResources
    }
    
    console.log('📋 Using fallback translation data')
    // 降级到翻译数据
    const translations = getTranslation(language)
    return [
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
      },
      {
        id: 4,
        documentId: 'industry-standards-white-paper',
        type: 'white-papers',
        title: translations.resources.data.title4,
        description: translations.resources.data.description4,
        downloadUrl: '#',
        publishDate: '2024-02-10',
        fileSize: '2.7 MB',
        format: 'PDF',
        cover: '/images/blog/blog-01.jpg'
      },
      {
        id: 5,
        documentId: 'technology-trends-report',
        type: 'technical-reports',
        title: translations.resources.data.title5,
        description: translations.resources.data.description5,
        downloadUrl: '#',
        publishDate: '2024-02-15',
        fileSize: '4.2 MB',
        format: 'PDF',
        cover: '/images/blog/blog-02.jpg'
      },
      {
        id: 6,
        documentId: 'implementation-best-practices',
        type: 'case-studies',
        title: translations.resources.data.title6,
        description: translations.resources.data.description6,
        downloadUrl: '#',
        publishDate: '2024-02-20',
        fileSize: '2.3 MB',
        format: 'PDF',
        cover: '/images/blog/blog-03.jpg'
      }
    ]
  }

  const resourcesDataArray = getMockResources()
  
  // 处理类型筛选
  const handleTypeChange = (newType: string) => {
    setActiveType(newType)
    
    // 更新URL参数
    const newUrl = newType === 'all' ? '/resources' : `/resources?type=${newType}`
    router.push(newUrl, undefined, { shallow: true })
  }

  // 类型映射函数 - 处理不同格式的类型名称
  const normalizeType = (type: string) => {
    if (!type) return ''
    return type.toLowerCase().replace(/\s+/g, '-')
  }

  const filteredResources = resourcesDataArray?.filter(resource => {
    const description = resource.description || resource.descript || ''
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         description.toLowerCase().includes(searchTerm.toLowerCase())
    
    // 标准化类型比较
    const normalizedResourceType = normalizeType(resource.type || '')
    const normalizedActiveType = normalizeType(activeType)
    const matchesCategory = activeType === 'all' || normalizedResourceType === normalizedActiveType
    
    console.log('🔍 Filter Debug:', {
      originalResourceType: resource.type,
      normalizedResourceType,
      activeType,
      normalizedActiveType,
      matchesCategory,
      matchesSearch,
      resourceTitle: resource.title
    })
    
    return matchesSearch && matchesCategory
  }) || []
  
  console.log('📊 Filter Results:', {
    totalResources: resourcesDataArray.length,
    filteredCount: filteredResources.length,
    activeType,
    searchTerm
  })

  // 格式化日期
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString(language === 'zh-Hans' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <>
      <SEOHead
        title={t(language, 'resources.pageTitle')}
        description={t(language, 'resources.pageDescription')}
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
                    {t(language, 'resources.title')}
                  </h1>

                  <ul className="flex items-center justify-center gap-[10px] flex-wrap">
                    <li>
                      <button
                        onClick={() => handleTypeChange('white-papers')}
                        className={`text-base font-medium transition-colors ${
                          activeType === 'white-papers' 
                            ? 'text-dark dark:text-white' 
                            : 'text-body-color dark:text-dark-6 hover:text-primary'
                        }`}
                      >
                        {t(language, 'resources.types.whitePapers')}
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleTypeChange('technical-reports')}
                        className={`flex items-center gap-[10px] text-base font-medium ${
                          activeType === 'technical-reports' 
                            ? 'text-dark dark:text-white' 
                            : 'text-body-color dark:text-dark-6 hover:text-primary'
                        }`}
                      >
                        <span className="text-body-color dark:text-dark-6"> / </span>
                        {t(language, 'resources.types.technicalReports')}
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleTypeChange('case-studies')}
                        className={`flex items-center gap-[10px] text-base font-medium ${
                          activeType === 'case-studies' 
                            ? 'text-dark dark:text-white' 
                            : 'text-body-color dark:text-dark-6 hover:text-primary'
                        }`}
                      >
                        <span className="text-body-color dark:text-dark-6"> / </span>
                        {t(language, 'resources.types.caseStudies')}
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resources Grid - HTML样式 */}
        <section className="pt-20 pb-10 lg:pt-[120px] lg:pb-20 dark:bg-dark">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap -mx-4">
              {filteredResources.map((resource, index) => (
                <div key={resource.id} className="w-full px-4 md:w-1/2 lg:w-1/3">
                  <div className="mb-10 wow fadeInUp group" data-wow-delay={`.${(index % 3 + 1) * 5}s`}>
                    {/* 只有当有有效封面时才显示图片 */}
                    {resource.cover && (
                      <div className="mb-8 overflow-hidden rounded-[5px]">
                        <Link href={`/resources/${resource.documentId || resource.id}`} className="block">
                          <img
                            src={
                              typeof resource.cover === 'object' && resource.cover 
                                ? (resource.cover as any).url
                                : typeof resource.cover === 'string' 
                                  ? resource.cover 
                                  : '/images/blog/blog-01.jpg'
                            }
                            alt={
                              typeof resource.cover === 'object' && resource.cover 
                                ? (resource.cover as any).alternativeText || resource.title
                                : resource.title
                            }
                            className="w-full h-48 object-cover transition group-hover:rotate-6 group-hover:scale-125"
                          />
                        </Link>
                      </div>
                    )}
                    <div>
                      <span className="inline-block px-4 py-0.5 mb-6 text-xs font-medium leading-loose text-center text-white rounded-[5px] bg-primary">
                        {formatDate(resource.publishDate)}
                      </span>
                      <h3>
                        <Link
                          href={`/resources/${resource.documentId || resource.id}`}
                          className={`inline-block mb-4 text-xl font-semibold text-dark dark:text-white hover:text-primary dark:hover:text-primary sm:text-2xl lg:text-xl xl:text-2xl article-title ${language === 'zh-Hans' ? 'zh' : 'en'}`}
                        >
                          {resource.title}
                        </Link>
                      </h3>
                      <p className={`max-w-[370px] text-base text-body-color dark:text-dark-6 mb-4 article-description ${language === 'zh-Hans' ? 'zh' : 'en'}`}>
                        {resource.description || resource.descript || ''}
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
                            {language === 'zh-Hans' ? '下载' : 'Download'}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredResources.length === 0 && (
              <div className="text-center py-20">
                <h3 className="text-xl font-semibold text-dark dark:text-white mb-4">
                  {language === 'zh-Hans' ? '未找到资源' : 'No Resources Found'}
                </h3>
                <p className="text-body-color dark:text-dark-6">
                  {language === 'zh-Hans' 
                    ? '请尝试选择不同的分类或稍后再查看更新。' 
                    : 'Try selecting a different category or check back later for updates.'
                  }
                </p>
                <div className="mt-4 text-sm text-gray-500">
                  调试信息 - 总资源数: {resourcesDataArray.length}, 筛选结果: {filteredResources.length}, 当前类型: {activeType}
                </div>
              </div>
            )}
          </div>
        </section>
      </Layout>
    </>
  )
}

export const getStaticProps: GetStaticProps<ResourcesProps> = async ({ locale }) => {
  try {
    console.log('🔄 正在预生成Resources页面数据...');
    
    const resourcesData: { [key: string]: Resource[] } = {}
    const locales = ['en', 'zh-Hans']
    
         // 并行获取所有语言的资源数据
     const dataPromises = locales.map(async (lang) => {
       try {
         // 尝试从API获取资源数据 (getResources目前不支持语言参数)
         const apiResources = await getResources();
         if (apiResources && apiResources.length > 0) {
           // 过滤匹配语言的资源
           const languageFilteredResources = apiResources.filter(item => 
             item.locale === lang || (lang === 'en' && !item.locale)
           );
           
           const resources: Resource[] = languageFilteredResources.map((item, index) => ({
             id: (item as any).id || index + 1,
             documentId: (item as any).documentId || `resource-${(item as any).id || index + 1}`,
             title: item.title,
             description: (item as any).description || '',
             descript: (item as any).descript || '',
             type: item.type || 'White Papers',
             downloadUrl: (item as any).downloadUrl || '#',
             publishDate: (item as any).publishDate || item.publishedAt || new Date().toISOString().split('T')[0],
             fileSize: (item as any).fileSize || '1.0 MB',
             format: (item as any).format || 'PDF',
             cover: item.cover
           }));
           return { lang, resources };
         }
       } catch (error) {
         console.error(`❌ 获取${lang}语言Resources API数据失败:`, error);
       }
      
      // 如果API失败，使用默认数据
      const defaultResources: Resource[] = [
        {
          id: 1,
          documentId: 'ditc-membership-system',
          type: 'White Papers',
          title: lang === 'zh-Hans' ? 'DITC会员制度与费用标准' : 'DITC Membership System and Fee Standards',
          description: lang === 'zh-Hans' ? '详细介绍DITC的会员制度、权益和费用结构。' : 'Comprehensive guide to DITC membership benefits and fee structure.',
          descript: lang === 'zh-Hans' ? '详细介绍DITC的会员制度、权益和费用结构。' : 'Comprehensive guide to DITC membership benefits and fee structure.',
          downloadUrl: '/DITC-CM-001：DITC Membership System and Fee Standards.pdf',
          publishDate: '2024-01-15',
          fileSize: '2.1 MB',
          format: 'PDF',
          cover: '/images/blog/blog-01.jpg'
        },
        {
          id: 2,
          documentId: 'digital-infrastructure-report',
          type: 'Technical Reports',
          title: lang === 'zh-Hans' ? '数字基础设施技术报告' : 'Digital Infrastructure Technical Report',
          description: lang === 'zh-Hans' ? '最新的数字基础设施技术发展趋势和分析。' : 'Latest trends and analysis in digital infrastructure technology.',
          descript: lang === 'zh-Hans' ? '最新的数字基础设施技术发展趋势和分析。' : 'Latest trends and analysis in digital infrastructure technology.',
          downloadUrl: '#',
          publishDate: '2024-01-20',
          fileSize: '3.5 MB',
          format: 'PDF',
          cover: '/images/blog/blog-02.jpg'
        },
        {
          id: 3,
          documentId: 'standardization-case-study',
          type: 'Case Studies',
          title: lang === 'zh-Hans' ? '标准化实施案例研究' : 'Standardization Implementation Case Study',
          description: lang === 'zh-Hans' ? '成功的标准化实施案例和经验分享。' : 'Successful standardization implementation cases and experience sharing.',
          descript: lang === 'zh-Hans' ? '成功的标准化实施案例和经验分享。' : 'Successful standardization implementation cases and experience sharing.',
          downloadUrl: '#',
          publishDate: '2024-02-01',
          fileSize: '1.8 MB',
          format: 'PDF',
          cover: '/images/blog/blog-03.jpg'
        },
        {
          id: 4,
          documentId: 'industry-standards-white-paper',
          type: 'White Papers',
          title: lang === 'zh-Hans' ? '行业标准化白皮书' : 'Industry Standardization White Paper',
          description: lang === 'zh-Hans' ? '深入分析行业标准化的现状与未来发展方向。' : 'In-depth analysis of industry standardization current status and future development.',
          descript: lang === 'zh-Hans' ? '深入分析行业标准化的现状与未来发展方向。' : 'In-depth analysis of industry standardization current status and future development.',
          downloadUrl: '#',
          publishDate: '2024-02-10',
          fileSize: '2.7 MB',
          format: 'PDF',
          cover: '/images/blog/blog-01.jpg'
        },
        {
          id: 5,
          documentId: 'technology-trends-report',
          type: 'Technical Reports',
          title: lang === 'zh-Hans' ? '技术发展趋势报告' : 'Technology Development Trends Report',
          description: lang === 'zh-Hans' ? '全面解析当前技术发展的主要趋势和挑战。' : 'Comprehensive analysis of current technology development trends and challenges.',
          descript: lang === 'zh-Hans' ? '全面解析当前技术发展的主要趋势和挑战。' : 'Comprehensive analysis of current technology development trends and challenges.',
          downloadUrl: '#',
          publishDate: '2024-02-15',
          fileSize: '4.2 MB',
          format: 'PDF',
          cover: '/images/blog/blog-02.jpg'
        },
        {
          id: 6,
          documentId: 'implementation-best-practices',
          type: 'Case Studies',
          title: lang === 'zh-Hans' ? '实施最佳实践案例' : 'Implementation Best Practices Case Study',
          description: lang === 'zh-Hans' ? '总结项目实施过程中的最佳实践和经验教训。' : 'Summary of best practices and lessons learned in project implementation.',
          descript: lang === 'zh-Hans' ? '总结项目实施过程中的最佳实践和经验教训。' : 'Summary of best practices and lessons learned in project implementation.',
          downloadUrl: '#',
          publishDate: '2024-02-20',
          fileSize: '2.3 MB',
          format: 'PDF',
          cover: '/images/blog/blog-03.jpg'
        }
      ];
      
      return { lang, resources: defaultResources };
    });
    
    const results = await Promise.all(dataPromises);
    results.forEach(({ lang, resources }) => {
      resourcesData[lang] = resources;
    });

    const totalResources = Object.values(resourcesData).reduce((sum, resources) => sum + resources.length, 0);
    console.log(`✅ 成功获取 ${totalResources} 条Resources数据`);

    return {
      props: {
        resourcesData
      },
      revalidate: 3600 // 每小时重新生成
    };
  } catch (error) {
    console.error('❌ 预生成Resources页面数据失败:', error);
    
    return {
      props: {
        resourcesData: {
          'en': [],
          'zh-Hans': []
        }
      },
      revalidate: 3600
    };
  }
} 