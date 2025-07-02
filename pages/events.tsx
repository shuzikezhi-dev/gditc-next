import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { GetStaticProps } from 'next'
import Layout from '../components/Layout'
import SEOHead from '../components/SEOHead'
import { useLanguage } from './_app'

export default function Events() {
  const router = useRouter()
  const { language } = useLanguage()

  useEffect(() => {
    // 根据当前路径判断语言并重定向到对应的第一页
    const currentPath = router.asPath
    if (currentPath.startsWith('/zh-Hans/')) {
      router.replace('/zh-Hans/events/page/1')
    } else if (currentPath.startsWith('/en/')) {
      router.replace('/en/events/page/1')
    } else {
      // 默认路径，根据语言重定向
      if (language === 'zh-Hans') {
        router.replace('/zh-Hans/events/page/1')
      } else {
        router.replace('/en/events/page/1')
      }
    }
  }, [router, language])

  const getText = (key: string) => {
    const texts = {
      'en': {
        title: 'Events',
        description: 'Join our events, summits, and competitions to advance digital infrastructure standards',
        redirecting: 'Redirecting to events...'
      },
      'zh-Hans': {
        title: '活动',
        description: '参加我们的活动、峰会和竞赛，推进数字基础设施标准',
        redirecting: '正在跳转到活动...'
      }
    }
    return texts[language as keyof typeof texts]?.[key as keyof typeof texts['en']] || texts['en'][key as keyof typeof texts['en']]
  }

  return (
    <>
      <SEOHead
        title={getText('title')}
        description={getText('description')}
      />
      <Layout>
        <div className="relative z-10 overflow-hidden pt-[120px] pb-[60px] md:pt-[130px] lg:pt-[160px] dark:bg-dark">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center -mx-4">
              <div className="w-full px-4">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-body-color dark:text-dark-6">
                    {getText('redirecting')}
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