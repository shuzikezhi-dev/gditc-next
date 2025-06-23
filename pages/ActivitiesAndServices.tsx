import { useState } from 'react'
import Head from 'next/head'
import Layout from '../components/Layout'
import SEOHead from '../components/SEOHead'

export default function ActivitiesAndServices() {
  const [activeCategory, setActiveCategory] = useState('benchmarks')

  // 活动和服务数据
  const activitiesData = [
    {
      id: 1,
      title: 'AI Infrastructure Benchmarking Framework',
      description: 'Comprehensive testing framework for AI computing infrastructure with standardized protocols and quality assurance.',
      image: '/images/blog/blog-01.jpg',
      date: 'Dec 22, 2023',
      category: 'benchmarks'
    },
    {
      id: 2,
      title: 'International Standard Development Program',
      description: 'Collaborative platform for developing global standards in digital infrastructure technologies.',
      image: '/images/blog/blog-details-01.jpg',
      date: 'Mar 15, 2023',
      category: 'standards'
    },
    {
      id: 3,
      title: 'Testing & Certification Services',
      description: 'Professional testing and certification services for infrastructure compliance and quality validation.',
      image: '/images/blog/blog-02.jpg',
      date: 'Jan 05, 2023',
      category: 'certification'
    },
    {
      id: 4,
      title: 'Academic Research Publications',
      description: 'Cutting-edge research papers and academic publications in digital infrastructure technologies.',
      image: '/images/about/about-image-01.jpg',
      date: 'Nov 18, 2023',
      category: 'research'
    },
    {
      id: 5,
      title: 'Performance Optimization Tools',
      description: 'Advanced tools and methodologies for optimizing digital infrastructure performance.',
      image: '/images/blog/blog-03.jpg',
      date: 'Oct 10, 2023',
      category: 'benchmarks'
    },
    {
      id: 6,
      title: 'Global Standards Harmonization',
      description: 'Initiative to harmonize international standards across different regions and industries.',
      image: '/images/hero/hero-image.jpg',
      date: 'Sep 28, 2023',
      category: 'standards'
    },
    {
      id: 7,
      title: 'Quality Assurance Frameworks',
      description: 'Comprehensive quality assurance frameworks for digital infrastructure deployment.',
      image: '/images/about/about-image-02.jpg',
      date: 'Aug 15, 2023',
      category: 'certification'
    },
    {
      id: 8,
      title: 'Innovation Research Program',
      description: 'Collaborative research program focusing on emerging technologies and innovation.',
      image: '/images/blog/blog-01.jpg',
      date: 'Jul 22, 2023',
      category: 'research'
    },
    {
      id: 9,
      title: 'Infrastructure Testing Protocols',
      description: 'Standardized testing protocols for various types of digital infrastructure components.',
      image: '/images/blog/blog-02.jpg',
      date: 'Jun 05, 2023',
      category: 'benchmarks'
    },
    {
      id: 10,
      title: 'Digital Infrastructure Security Standards',
      description: 'Comprehensive security standards and protocols for digital infrastructure protection.',
      image: '/images/blog/blog-03.jpg',
      date: 'May 20, 2023',
      category: 'standards'
    },
    {
      id: 11,
      title: 'Cloud Infrastructure Certification',
      description: 'Professional certification programs for cloud infrastructure deployment and management.',
      image: '/images/blog/blog-details-01.jpg',
      date: 'Apr 12, 2023',
      category: 'certification'
    },
    {
      id: 12,
      title: 'Emerging Technologies Research',
      description: 'Research initiatives focusing on emerging technologies in digital infrastructure.',
      image: '/images/about/about-image-01.jpg',
      date: 'Mar 08, 2023',
      category: 'research'
    }
  ]

  const categories = [
    { id: 'benchmarks', label: 'AI Infrastructure Benchmarks' },
    { id: 'standards', label: 'International Standards' },
    { id: 'certification', label: 'Testing & Certification' },
    { id: 'research', label: 'Academic Publications' }
  ]

  const filteredActivities = activitiesData.filter(activity => activity.category === activeCategory)

  return (
    <>
      <SEOHead
        title="Activities & Services | DITC"
        description="Comprehensive activities and services for digital infrastructure development and standardization"
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
                    Activities & Services
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
            <div className="flex flex-wrap -mx-4">
              {filteredActivities.map((activity, index) => (
                <div key={activity.id} className="w-full px-4 md:w-1/2 lg:w-1/3">
                  <div className={`mb-10 wow fadeInUp group`} data-wow-delay={`.${(index % 3 + 1) * 5}s`}>
                    <div className="mb-8 overflow-hidden rounded-[5px]">
                      <a href="#" className="block">
                        <img
                          src={activity.image}
                          alt={activity.title}
                          className="w-full transition group-hover:rotate-6 group-hover:scale-125"
                        />
                      </a>
                    </div>
                    <div>
                      <span className="inline-block px-4 py-0.5 mb-6 text-xs font-medium leading-loose text-center text-white rounded-[5px] bg-primary">
                        {activity.date}
                      </span>
                      <h3>
                        <a
                          href="#"
                          className="inline-block mb-4 text-xl font-semibold text-dark dark:text-white hover:text-primary dark:hover:text-primary sm:text-2xl lg:text-xl xl:text-2xl"
                        >
                          {activity.title}
                        </a>
                      </h3>
                      <p className="max-w-[370px] text-base text-body-color dark:text-dark-6">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 text-center wow fadeInUp" data-wow-delay=".2s">
              <div className="inline-flex p-3 bg-white dark:bg-dark-2 border rounded-[10px] border-stroke dark:border-dark-3">
                <ul className="flex items-center -mx-1">
                  <li className="px-1">
                    <a
                      href="javascript:void(0)"
                      className="flex items-center justify-center text-base bg-transparent border rounded-md hover:border-primary hover:bg-primary h-[34px] w-[34px] border-stroke dark:border-dark-3 text-body-color dark:text-dark-6 hover:text-white dark:hover:border-primary dark:hover:text-white"
                    >
                      <span>
                        <svg
                          width="8"
                          height="15"
                          viewBox="0 0 8 15"
                          className="fill-current stroke-current"
                        >
                          <path
                            d="M7.12979 1.91389L7.1299 1.914L7.1344 1.90875C7.31476 1.69833 7.31528 1.36878 7.1047 1.15819C7.01062 1.06412 6.86296 1.00488 6.73613 1.00488C6.57736 1.00488 6.4537 1.07206 6.34569 1.18007L6.34564 1.18001L6.34229 1.18358L0.830207 7.06752C0.830152 7.06757 0.830098 7.06763 0.830043 7.06769C0.402311 7.52078 0.406126 8.26524 0.827473 8.73615L0.827439 8.73618L0.829982 8.73889L6.34248 14.6014L6.34243 14.6014L6.34569 14.6047C6.546 14.805 6.88221 14.8491 7.1047 14.6266C7.30447 14.4268 7.34883 14.0918 7.12833 13.8693L1.62078 8.01209C1.55579 7.93114 1.56859 7.82519 1.61408 7.7797L1.61413 7.77975L1.61729 7.77639L7.12979 1.91389Z"
                            strokeWidth="0.3"
                          />
                        </svg>
                      </span>
                    </a>
                  </li>
                  <li className="px-1">
                    <a
                      href="javascript:void(0)"
                      className="flex items-center justify-center text-base bg-transparent border rounded-md hover:border-primary hover:bg-primary h-[34px] w-[34px] border-stroke dark:border-dark-3 text-body-color dark:text-dark-6 hover:text-white dark:hover:border-primary dark:hover:text-white"
                    >
                      1
                    </a>
                  </li>
                  <li className="px-1">
                    <a
                      href="javascript:void(0)"
                      className="flex items-center justify-center text-base bg-transparent border rounded-md hover:border-primary hover:bg-primary h-[34px] w-[34px] border-stroke dark:border-dark-3 text-body-color dark:text-dark-6 hover:text-white dark:hover:border-primary dark:hover:text-white"
                    >
                      2
                    </a>
                  </li>
                  <li className="px-1">
                    <a
                      href="javascript:void(0)"
                      className="flex items-center justify-center text-base bg-transparent border rounded-md hover:border-primary hover:bg-primary h-[34px] w-[34px] border-stroke dark:border-dark-3 text-body-color dark:text-dark-6 hover:text-white dark:hover:border-primary dark:hover:text-white"
                    >
                      3
                    </a>
                  </li>
                  <li className="px-1">
                    <a
                      href="javascript:void(0)"
                      className="flex items-center justify-center text-base bg-transparent border rounded-md hover:border-primary hover:bg-primary h-[34px] w-[34px] border-stroke dark:border-dark-3 text-body-color dark:text-dark-6 hover:text-white dark:hover:border-primary dark:hover:text-white"
                    >
                      4
                    </a>
                  </li>
                  <li className="px-1">
                    <a
                      href="javascript:void(0)"
                      className="flex items-center justify-center text-base bg-transparent border rounded-md hover:border-primary hover:bg-primary h-[34px] w-[34px] border-stroke dark:border-dark-3 text-body-color dark:text-dark-6 hover:text-white dark:hover:border-primary dark:hover:text-white"
                    >
                      <span>
                        <svg
                          width="8"
                          height="15"
                          viewBox="0 0 8 15"
                          className="fill-current stroke-current"
                        >
                          <path
                            d="M0.870212 13.0861L0.870097 13.086L0.865602 13.0912C0.685237 13.3017 0.684716 13.6312 0.895299 13.8418C0.989374 13.9359 1.13704 13.9951 1.26387 13.9951C1.42264 13.9951 1.5463 13.9279 1.65431 13.8199L1.65436 13.82L1.65771 13.8164L7.16979 7.93248C7.16985 7.93243 7.1699 7.93237 7.16996 7.93231C7.59769 7.47923 7.59387 6.73477 7.17253 6.26385L7.17256 6.26382L7.17002 6.26111L1.65752 0.398611L1.65757 0.398563L1.65431 0.395299C1.454 0.194997 1.11779 0.150934 0.895299 0.373424C0.695526 0.573197 0.651169 0.908167 0.871667 1.13067L6.37922 6.98791C6.4442 7.06886 6.43141 7.17481 6.38592 7.2203L6.38587 7.22025L6.38271 7.22361L0.870212 13.0861Z"
                            strokeWidth="0.3"
                          />
                        </svg>
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  )
} 