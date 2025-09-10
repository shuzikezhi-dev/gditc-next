import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { GetStaticProps } from 'next'
import Layout from '../components/Layout'
import SEOHead from '../components/SEOHead'
import { useLanguage } from './_app'

export default function Training() {
  const router = useRouter()

  useEffect(() => {
    // 重定向到培训页面
    router.replace('/training/page/1')
  }, [router])

  return (
    <>
      <SEOHead
        title="Training"
        description="Digital Infrastructure Technology Training Programs"
      />
      <Layout>
        <div className="relative z-10 overflow-hidden pt-[120px] pb-[60px] md:pt-[130px] lg:pt-[160px] dark:bg-dark">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center -mx-4">
              <div className="w-full px-4">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-body-color dark:text-dark-6">
                    Redirecting to training...
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