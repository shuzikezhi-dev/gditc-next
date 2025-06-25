import { useState } from 'react'
import Head from 'next/head'
import { GetStaticProps } from 'next'
import Layout from '../components/Layout'
import SEOHead from '../components/SEOHead'
import { t, getTranslation } from '../lib/translations'
import { useLanguage } from './_app'
import { getContentList, DetailContent } from '../lib/detail-api'

// 活动类型接口
interface Activity {
  id: number;
  documentId: string;
  category: string;
  title: string;
  description: string;
  content: string;
  image?: string;
  date: string;
  status: 'ongoing' | 'upcoming' | 'completed';
  locale: string;
  cover?: {
    url: string;
  } | null;
}

interface ActivitiesAndServicesProps {
  activities: Activity[];
  locale: string;
}

export default function ActivitiesAndServices({ activities = [], locale }: ActivitiesAndServicesProps) {
  const { language } = useLanguage()
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = [
    { id: 'all', label: t(language, 'activities.categories.all') },
    { id: 'standardization', label: t(language, 'activities.categories.standardization') },
    { id: 'certification', label: t(language, 'activities.categories.certification') },
    { id: 'research', label: t(language, 'activities.categories.research') },
    { id: 'training', label: t(language, 'activities.categories.training') },
    { id: 'consulting', label: t(language, 'activities.categories.consulting') },
    { id: 'events', label: t(language, 'activities.categories.events') }
  ]

  const filteredActivities = activeCategory === 'all' 
    ? activities 
    : activities.filter(activity => activity.category === activeCategory)

  return (
    <>
      <SEOHead
        title={t(language, 'activities.pageTitle')}
        description={t(language, 'activities.pageDescription')}
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
                    {t(language, 'activities.title')}
                  </h1>
                  
                  <ul className="flex items-center justify-center gap-[10px] flex-wrap">
                    {categories.map((category, index) => (
                      <li key={category.id} className="flex items-center">
                        {index > 0 && (
                          <span className="text-body-color dark:text-dark-6 mr-[10px]"> / </span>
                        )}
                        <button
                          onClick={() => setActiveCategory(category.id)}
                          className={`text-base font-medium transition-colors ${
                            activeCategory === category.id 
                              ? 'text-dark dark:text-white' 
                              : 'text-body-color dark:text-dark-6 hover:text-primary'
                          }`}
                        >
                          {category.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activities Grid Section */}
        <section className="pt-20 pb-10 lg:pt-[120px] lg:pb-20 dark:bg-dark">
          <div className="container mx-auto px-4">
            {filteredActivities.length > 0 ? (
              <div className="flex flex-wrap -mx-4">
                {filteredActivities.map((activity, index) => (
                  <div key={activity.documentId} className="w-full px-4 md:w-1/2 lg:w-1/3">
                    <div className={`mb-10 wow fadeInUp group`} data-wow-delay={`.${(index % 3 + 1) * 5}s`}>
                      <div className="mb-8 overflow-hidden rounded-[5px]">
                        <a href={`/activities-services/${activity.documentId}`} className="block">
                          <img
                            src={activity.cover?.url || activity.image || '/images/blog/blog-01.jpg'}
                            alt={activity.title}
                            className="w-full h-48 object-cover transition group-hover:rotate-6 group-hover:scale-125"
                          />
                        </a>
                      </div>
                      <div>
                        <span className="inline-block px-4 py-0.5 mb-6 text-xs font-medium leading-loose text-center text-white rounded-[5px] bg-primary">
                          {new Date(activity.date).toLocaleDateString(language === 'zh-Hans' ? 'zh-CN' : 'en-US')}
                        </span>
                        <h3>
                          <a
                            href={`/activities-services/${activity.documentId}`}
                            className="inline-block mb-4 text-xl font-semibold text-dark dark:text-white hover:text-primary dark:hover:text-primary sm:text-2xl lg:text-xl xl:text-2xl"
                          >
                            {activity.title}
                          </a>
                        </h3>
                        <p className="max-w-[370px] text-base text-body-color dark:text-dark-6">
                          {activity.description.length > 150 
                            ? `${activity.description.substring(0, 150)}...` 
                            : activity.description
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🚀</div>
                <h3 className="text-2xl font-bold text-dark dark:text-white mb-2">
                  {language === 'zh-Hans' ? '暂无活动和服务' : 'No Activities & Services Found'}
                </h3>
                <p className="text-body-color dark:text-dark-6">
                  {language === 'zh-Hans' 
                    ? '尝试选择不同的分类或稍后再查看更新。' 
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

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  try {
    console.log('🔄 正在获取Activities & Services数据...');
    
    // 获取activities-and-service数据
    const activitiesData = await getContentList('activities-and-services', locale === 'zh-Hans' ? 'zh-Hans' : 'en');
    
    // 转换数据格式
    const activities: Activity[] = activitiesData.map((item: DetailContent, index: number) => ({
      id: item.id || index + 1,
      documentId: item.documentId,
      category: item.type || 'standardization', // 从type字段获取分类
      title: item.title,
      description: item.description || item.descript || '',
      content: item.content,
      image: item.cover?.url,
      date: item.publishedAt || item.createdAt,
      status: 'ongoing' as const,
      locale: item.locale,
      cover: item.cover
    }));

    console.log(`✅ 成功获取 ${activities.length} 条Activities & Services数据`);

    return {
      props: {
        activities,
        locale: locale === 'zh-Hans' ? 'zh-Hans' : 'en'
      },
      revalidate: 3600, // 1小时重新生成
    };
  } catch (error) {
    console.error('❌ 获取Activities & Services数据失败:', error);
    
    return {
      props: {
        activities: [],
        locale: locale === 'zh-Hans' ? 'zh-Hans' : 'en'
      },
      revalidate: 60, // 出错时1分钟后重试
    };
  }
}; 