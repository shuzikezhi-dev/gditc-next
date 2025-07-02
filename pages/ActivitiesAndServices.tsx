import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { GetStaticProps } from 'next'
import Layout from '../components/Layout'
import SEOHead from '../components/SEOHead'
import { t } from '../lib/translations'
import { useLanguage } from './_app'

export default function ActivitiesAndServices() {
  const router = useRouter()
  const { language } = useLanguage()

  useEffect(() => {
    // 根据当前路径判断语言并重定向到对应的第一页
    const currentPath = router.asPath
    if (currentPath.startsWith('/zh-Hans/')) {
      router.replace('/zh-Hans/ActivitiesAndServices/page/1')
    } else if (currentPath.startsWith('/en/')) {
      router.replace('/en/ActivitiesAndServices/page/1')
    } else {
      // 默认路径，根据语言重定向
      if (language === 'zh-Hans') {
        router.replace('/zh-Hans/ActivitiesAndServices/page/1')
      } else {
        router.replace('/en/ActivitiesAndServices/page/1')
      }
    }
  }, [router, language])

  return (
    <>
      <SEOHead
        title={t(language, 'activities.pageTitle')}
        description={t(language, 'activities.pageDescription')}
      />
      <Layout>
        <div className="relative z-10 overflow-hidden pt-[120px] pb-[60px] md:pt-[130px] lg:pt-[160px] dark:bg-dark">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center -mx-4">
              <div className="w-full px-4">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-body-color dark:text-dark-6">
                    {language === 'zh-Hans' ? '正在跳转到活动和服务...' : 'Redirecting to Activities & Services...'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {}
  }
} 