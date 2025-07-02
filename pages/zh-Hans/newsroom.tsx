import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { GetStaticProps } from 'next'
import Layout from '../../components/Layout'
import SEOHead from '../../components/SEOHead'

export default function ZhHansNewsroom() {
  const router = useRouter()

  useEffect(() => {
    // 重定向到中文版第一页
    router.replace('/zh-Hans/newsroom/page/1')
  }, [router])

  return (
    <>
      <SEOHead
        title="新闻中心"
        description="获取DITC的最新新闻、公告和见解"
      />
      <Layout>
        <div className="relative z-10 overflow-hidden pt-[120px] pb-[60px] md:pt-[130px] lg:pt-[160px] dark:bg-dark">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center -mx-4">
              <div className="w-full px-4">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-body-color dark:text-dark-6">
                    正在跳转到新闻中心...
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