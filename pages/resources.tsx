import { useState, useEffect } from 'react'
import Head from 'next/head'
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
  title: string;
  description: string;
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

export default function Resources() {
  const { language } = useLanguage()
  const router = useRouter()
  const { type } = router.query
  
  const [activeType, setActiveType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // 从URL参数初始化状态
  useEffect(() => {
    if (router.isReady) {
      const urlType = (type as string) || 'all'
      setActiveType(urlType)
    }
  }, [router.isReady, router.query])

  // 获取资源数据
  const getMockResources = () => {
    const translations = getTranslation(language)
    return [
      {
        id: 1,
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

  const resourcesData = getMockResources()
  
  // 处理类型筛选
  const handleTypeChange = (newType: string) => {
    setActiveType(newType)
    
    // 更新URL参数
    const newUrl = newType === 'all' ? '/resources' : `/resources?type=${newType}`
    router.push(newUrl, undefined, { shallow: true })
  }

  const filteredResources = resourcesData?.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeType === 'all' || resource.type === activeType
    return matchesSearch && matchesCategory
  }) || []

  // 格式化日期
  const formatDate = (dateString: string) => {
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
                        <a href={resource.downloadUrl} className="block">
                          <img
                            src={
                              typeof resource.cover === 'object' && resource.cover 
                                ? (resource.cover as any).url
                                : typeof resource.cover === 'string' 
                                  ? resource.cover 
                                  : undefined
                            }
                            alt={
                              typeof resource.cover === 'object' && resource.cover 
                                ? (resource.cover as any).alternativeText || resource.title
                                : resource.title
                            }
                            className="w-full h-48 object-cover transition group-hover:rotate-6 group-hover:scale-125"
                          />
                        </a>
                      </div>
                    )}
                    <div>
                      <span className="inline-block px-4 py-0.5 mb-6 text-xs font-medium leading-loose text-center text-white rounded-[5px] bg-primary">
                        {formatDate(resource.publishDate)}
                      </span>
                      <h3>
                        <a
                          href={resource.downloadUrl}
                          className="inline-block mb-4 text-xl font-semibold text-dark dark:text-white hover:text-primary dark:hover:text-primary sm:text-2xl lg:text-xl xl:text-2xl"
                        >
                          {resource.title}
                        </a>
                      </h3>
                      <p className="max-w-[370px] text-base text-body-color dark:text-dark-6">
                        {resource.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredResources.length === 0 && (
              <div className="text-center py-20">
                <h3 className="text-xl font-semibold text-dark dark:text-white mb-4">
                  {t(language, 'resources.noResourcesFound')}
                </h3>
                <p className="text-body-color dark:text-dark-6">
                  {t(language, 'resources.noResourcesDesc')}
                </p>
              </div>
            )}
          </div>
        </section>
      </Layout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    // 由于这个页面使用mock数据，我们只返回空对象
    return {
      props: {}
    }
  } catch (error) {
    console.error('Error in getStaticProps:', error)
    return {
      props: {}
    }
  }
} 