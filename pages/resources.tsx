import { useState } from 'react'
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import Layout from '../components/Layout'
import SEOHead from '../components/SEOHead'
import { getResources, type Resource as StrapiResource } from '../lib/strapi'

// 扩展Resource类型，添加id字段
interface Resource extends StrapiResource {
  id: number;
}

// 假数据
const mockResources: Resource[] = [
  {
    id: 1,
    title: 'AI Infrastructure Benchmarking Guide',
    content: 'Comprehensive guide for evaluating AI computing infrastructure performance and efficiency metrics.',
    type: 'whitepaper'
  },
  {
    id: 2,
    title: 'Data Center Sustainability Report 2024',
    content: 'Annual report on sustainable data center practices and environmental impact reduction strategies.',
    type: 'report'
  },
  {
    id: 3,
    title: 'Cloud Security Implementation Case Study',
    content: 'Real-world case study demonstrating successful cloud security architecture deployment.',
    type: 'case'
  },
  {
    id: 4,
    title: 'Network Standards Compliance Guidelines',
    content: 'Step-by-step guidelines for achieving compliance with international network infrastructure standards.',
    type: 'guide'
  },
  {
    id: 5,
    title: 'Cybersecurity Framework White Paper',
    content: 'Technical white paper outlining comprehensive cybersecurity frameworks for digital infrastructure.',
    type: 'whitepaper'
  },
  {
    id: 6,
    title: 'Digital Transformation Technical Report',
    content: 'In-depth technical analysis of digital transformation trends and implementation strategies.',
    type: 'report'
  }
]

export default function Resources({ resources = mockResources }: { resources?: Resource[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const categories = [
    { id: 'all', name: 'All Resources', icon: '📚' },
    { id: 'whitepaper', name: 'White Papers', icon: '📄' },
    { id: 'report', name: 'Technical Reports', icon: '📊' },
    { id: 'case', name: 'Case Studies', icon: '💼' },
    { id: 'guide', name: 'Guidelines', icon: '📖' }
  ]

  const filteredResources = resources?.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || resource.type === categoryFilter
    return matchesSearch && matchesCategory
  }) || []

  return (
    <>
      <SEOHead
        title="Resources | DITC"
        description="Access white papers, technical reports, case studies and other valuable resources"
      />
      <Layout>
        {/* Banner */}
        <div className="relative z-10 overflow-hidden pt-[120px] pb-[60px] md:pt-[130px] lg:pt-[160px] dark:bg-dark">
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-stroke/0 via-stroke dark:via-dark-3 to-stroke/0"></div>
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="mb-4 text-3xl font-bold text-dark dark:text-white sm:text-4xl md:text-[40px] md:leading-[1.2]">
                Resources
              </h1>
              <ul className="flex items-center justify-center gap-[10px] flex-wrap">
                <li>
                  <button
                    onClick={() => setCategoryFilter('whitepaper')}
                    className={`text-base font-medium transition-colors ${
                      categoryFilter === 'whitepaper' 
                        ? 'text-dark dark:text-white' 
                        : 'text-body-color dark:text-dark-6 hover:text-primary'
                    }`}
                  >
                    White Papers
                  </button>
                </li>
                <li className="flex items-center">
                  <span className="text-body-color dark:text-dark-6 mr-[10px]"> / </span>
                  <button
                    onClick={() => setCategoryFilter('report')}
                    className={`text-base font-medium transition-colors ${
                      categoryFilter === 'report' 
                        ? 'text-dark dark:text-white' 
                        : 'text-body-color dark:text-dark-6 hover:text-primary'
                    }`}
                  >
                    Technical Reports
                  </button>
                </li>
                <li className="flex items-center">
                  <span className="text-body-color dark:text-dark-6 mr-[10px]"> / </span>
                  <button
                    onClick={() => setCategoryFilter('case')}
                    className={`text-base font-medium transition-colors ${
                      categoryFilter === 'case' 
                        ? 'text-dark dark:text-white' 
                        : 'text-body-color dark:text-dark-6 hover:text-primary'
                    }`}
                  >
                    Case Studies
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        {/* <section className="py-16 bg-gray-50 dark:bg-dark-2">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 pl-12 rounded-lg border border-gray-200 dark:border-dark-3 bg-white dark:bg-dark text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setCategoryFilter(category.id)}
                  className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 ${
                    categoryFilter === category.id
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-white dark:bg-dark text-body-color dark:text-white hover:bg-primary/10 border border-gray-200 dark:border-dark-3'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span className="font-medium">{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section> */}

        {/* Resources Grid */}
        <section className="py-20 lg:py-[120px]">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredResources.map((resource) => (
                <div key={resource.id} className="bg-white dark:bg-dark rounded-lg shadow-lg border border-gray-200 dark:border-dark-3 overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-dark dark:text-white mb-4 line-clamp-2">
                      {resource.title}
                    </h3>
                    <p className="text-body-color dark:text-dark-6 mb-6 line-clamp-3">
                      {resource.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-body-color dark:text-dark-6">
                        PDF Document
                      </span>
                      <a href="#" className="inline-flex items-center text-primary hover:text-primary/80 font-medium">
                        Download
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Layout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const resources = await getResources()
    // 将Strapi资源转换为带有id的Resource类型
    const resourcesWithId: Resource[] = resources.map((resource, index) => ({
      ...resource,
      id: index + 1 // 临时ID，实际应该从Strapi获取
    }))
    
    return { 
      props: { 
        resources: resourcesWithId.length > 0 ? resourcesWithId : mockResources 
      } 
    }
  } catch (error) {
    return { 
      props: { 
        resources: mockResources 
      } 
    }
  }
} 