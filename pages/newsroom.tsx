import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { GetStaticProps } from 'next'
import Layout from '../components/Layout'
import SEOHead from '../components/SEOHead'
import { useLanguage } from './_app'

export default function Newsroom() {
  const router = useRouter()
  const { language } = useLanguage()

  useEffect(() => {
    // 重定向到第一页
    router.replace('/newsroom/page/1')
  }, [router])

  const getText = (key: string) => {
    const texts = {
      'en': {
        title: 'Newsroom',
        description: 'Stay updated with the latest news, announcements, and insights from DITC',
        redirecting: 'Redirecting to newsroom...'
      },
      'zh-Hans': {
        title: '新闻中心',
        description: '获取DITC的最新新闻、公告和见解',
        redirecting: '正在跳转到新闻中心...'
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