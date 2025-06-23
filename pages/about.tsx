import { useState, useEffect } from 'react'
import Head from 'next/head'
import { GetStaticProps } from 'next'
import Layout from '../components/Layout'
import SEOHead from '../components/SEOHead'
import { getAbout } from '../lib/strapi'

interface AboutData {
  title: string
  blocks: any[]
}

export default function About({ aboutData }: { aboutData: AboutData }) {
  return (
    <>
      <SEOHead
        title="关于我们 | DITC"
        description="Digital Infrastructure Technical Council - Advancing Global Digital Infrastructure Quality"
      />
      <Layout>
        {/* Banner Section */}
        <div className="relative z-10 overflow-hidden pb-[60px] pt-[120px] dark:bg-dark md:pt-[130px] lg:pt-[160px]">
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-stroke/0 via-stroke to-stroke/0 dark:via-dark-3"></div>
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center -mx-4">
              <div className="w-full px-4">
                <div className="text-center">
                  <h1 className="mb-4 text-3xl font-bold text-dark dark:text-white sm:text-4xl md:text-[40px] md:leading-[1.2]">
                    About DITC
                  </h1>
                  <p className="mb-5 text-base text-body-color dark:text-dark-6">
                    Digital Infrastructure Technical Council - Advancing Global Digital Infrastructure Quality
                  </p>
                  <ul className="flex items-center justify-center gap-[10px]">
                    <li>
                      <a href="/" className="flex items-center gap-[10px] text-base font-medium text-dark dark:text-white">
                        Home
                      </a>
                    </li>
                    <li>
                      <span className="flex items-center gap-[10px] text-base font-medium text-body-color dark:text-dark-6">
                        <span className="text-body-color dark:text-dark-6"> / </span>
                        About
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Who We Are Section */}
        <section className="bg-gray-1 pb-8 dark:bg-dark-2 lg:pb-[70px]">
          <div className="container mx-auto px-4">
            <div className="wow fadeInUp" data-wow-delay=".2s">
              <div className="flex flex-wrap -mx-4">
                <div className="w-full px-4">
                  <div className="mx-auto max-w-[1200px]">
                    <h2 className="mb-8 text-3xl font-bold leading-tight text-dark dark:text-white sm:text-[40px] sm:leading-[1.2] text-center">
                      Who We Are
                    </h2>
                    
                    <div className="mb-12">
                      <p className="mb-6 text-lg leading-relaxed text-body-color dark:text-dark-6 text-left">
                        The Digital Infrastructure Technical Council (DITC) is an international non-profit organization headquartered in Singapore, dedicated to advancing the quality and reliability of digital infrastructure worldwide.
                      </p>
                      <p className="mb-8 text-lg leading-relaxed text-body-color dark:text-dark-6 text-left">
                        Founded in Singapore, DITC serves as a neutral platform where governments, enterprises, and research institutions collaborate to build trusted standards, benchmarks, and ecosystems for AI, cloud, data centers, and beyond.
                      </p>
                      
                      <div className="flex justify-center">
                        <div className="w-4/5 aspect-video bg-gray-200 dark:bg-dark-3 rounded-lg flex items-center justify-center">
                          <div className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors cursor-pointer">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                            <span>▶ 2-Minute Intro Video</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="py-20 lg:py-[140px]">
          <div className="container mx-auto px-4">
            <div className="wow fadeInUp" data-wow-delay=".4s">
              <h2 className="mb-16 text-3xl font-bold leading-tight text-dark dark:text-white sm:text-[40px] sm:leading-[1.2] text-center">
                Our Mission & Vision
              </h2>
              
              <div className="flex flex-wrap justify-center gap-8">
                <div className="w-full max-w-lg px-4 mb-8 p-12 bg-white dark:bg-dark rounded-lg shadow-lg border border-gray-200 dark:border-dark-3">
                  <div className="mb-6 flex items-center justify-center">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-dark dark:text-white">Mission</h3>
                  </div>
                  <p className="text-base leading-relaxed text-body-color dark:text-dark-6 text-center">
                    To establish universal quality benchmarks and foster cross-border collaboration in digital infrastructure, enabling safer, greener, and more interoperable technologies.
                  </p>
                </div>
                
                <div className="w-full max-w-lg px-4 mb-8 p-12 bg-white dark:bg-dark rounded-lg shadow-lg border border-gray-200 dark:border-dark-3">
                  <div className="mb-6 flex items-center justify-center">
                    <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-dark dark:text-white">Vision</h3>
                  </div>
                  <p className="text-base leading-relaxed text-body-color dark:text-dark-6 text-center">
                    A world where every digital innovation is built on measurable, trustworthy foundations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Governance Framework Section */}
        <section className="bg-gray-1 py-20 dark:bg-dark-2 lg:py-[120px]">
          <div className="container mx-auto px-4">
            <div className="wow fadeInUp" data-wow-delay=".6s">
              <h2 className="mb-8 text-3xl font-bold leading-tight text-dark dark:text-white sm:text-[40px] sm:leading-[1.2] text-center">
                Governance Framework
              </h2>
              
              <div className="mb-12 text-center">
                <p className="mx-auto max-w-4xl text-lg leading-relaxed text-body-color dark:text-dark-6">
                  DITC operates under a constitutionally defined multi-tier governance system designed to ensure technical excellence, global collaboration, and operational efficiency in digital infrastructure development.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                {/* Decision-making Board */}
                <div className="p-20 bg-white dark:bg-dark rounded-lg shadow-lg border border-gray-200 dark:border-dark-3 hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out">
                  <div className="flex items-center mb-8">
                    <div className="w-14 h-14 bg-primary rounded-lg flex items-center justify-center mr-4">
                      <span className="text-white font-bold text-xl">1</span>
                    </div>
                    <h3 className="text-2xl font-bold text-dark dark:text-white">Decision-making Board</h3>
                  </div>
                  
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-dark dark:text-white mb-4">Composition</h4>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-body-color dark:text-dark-6">3–5 members elected by founding units</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-body-color dark:text-dark-6">Fixed-term appointments</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-dark dark:text-white mb-4">Key Powers</h4>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-body-color dark:text-dark-6">Establishes and dissolves Technical Committees (TCs)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-body-color dark:text-dark-6">Appoints TC Chairs and Senior Advisors</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-body-color dark:text-dark-6">Approves annual budgets and strategic plans</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-body-color dark:text-dark-6">Oversees constitutional amendments (requires a two-thirds majority vote)</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Expert Committee */}
                <div className="p-20 bg-white dark:bg-dark rounded-lg shadow-lg border border-gray-200 dark:border-dark-3 hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out">
                  <div className="flex items-center mb-8">
                    <div className="w-14 h-14 bg-secondary rounded-lg flex items-center justify-center mr-4">
                      <span className="text-white font-bold text-xl">2</span>
                    </div>
                    <h3 className="text-2xl font-bold text-dark dark:text-white">Expert Committee (EC)</h3>
                  </div>
                  
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-dark dark:text-white mb-4">Structure</h4>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-secondary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-body-color dark:text-dark-6">1 Chairman + Vice Chairpersons (elected by the Decision-making Board)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-secondary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-body-color dark:text-dark-6">Composed of technical and management experts delegated by member organizations</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-dark dark:text-white mb-4">Core Functions</h4>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-secondary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-body-color dark:text-dark-6">Manages TC and project committee working groups</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-secondary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-body-color dark:text-dark-6">Reviews and approves draft technical standards</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-secondary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-body-color dark:text-dark-6">Publishes the annual Global Digital Infrastructure Quality Report</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Technical Committees */}
                <div className="p-20 bg-white dark:bg-dark rounded-lg shadow-lg border border-gray-200 dark:border-dark-3 hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out">
                  <div className="flex items-center mb-8">
                    <div className="w-14 h-14 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-white font-bold text-xl">3</span>
                    </div>
                    <h3 className="text-2xl font-bold text-dark dark:text-white">Technical Committees (TCs)</h3>
                  </div>
                  
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-dark dark:text-white mb-4">Operating Model</h4>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-body-color dark:text-dark-6">Each TC is led by a Chair, supported by Vice Chairs and Senior Advisors</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-body-color dark:text-dark-6">Standards development conducted through specialized working groups</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-dark dark:text-white mb-4">Active Technical Committees</h4>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-body-color dark:text-dark-6"><strong>AI Infrastructure Committee:</strong> Develops benchmarks for AI computing power and algorithms</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-body-color dark:text-dark-6"><strong>Data Center Standards Committee:</strong> Establishes green data center certification frameworks</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Secretariat */}
                <div className="p-20 bg-white dark:bg-dark rounded-lg shadow-lg border border-gray-200 dark:border-dark-3 hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out">
                  <div className="flex items-center mb-8">
                    <div className="w-14 h-14 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-white font-bold text-xl">4</span>
                    </div>
                    <h3 className="text-2xl font-bold text-dark dark:text-white">Secretariat</h3>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-dark dark:text-white mb-4">Leadership</h4>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-body-color dark:text-dark-6">Secretary-General (appointed by the Decision-making Board)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-body-color dark:text-dark-6">Deputy Secretaries-General (nominated by the Secretary-General)</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-dark dark:text-white mb-4">Key Units</h4>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-body-color dark:text-dark-6">Standards Promotion Division</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-body-color dark:text-dark-6">Certification Center</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-body-color dark:text-dark-6">Digital Community Platform</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-dark dark:text-white mb-4">Daily Operations</h4>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-body-color dark:text-dark-6">Implements annual work plans</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-body-color dark:text-dark-6">Coordinates cross-committee collaboration</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-body-color dark:text-dark-6">Maintains member records and meeting archives</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="text-center mb-16 mt-8">
                <a href="#" className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                  <svg className="w-5 h-5 mr-2" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                  Download Governance Structure Chart
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Core Mandates Section */}
        <section className="py-20 lg:py-[120px]">
          <div className="container mx-auto px-4">
            <div className="wow fadeInUp" data-wow-delay=".8s">
              <h2 className="mb-8 text-3xl font-bold leading-tight text-dark dark:text-white sm:text-[40px] sm:leading-[1.2] text-center">
                Core Mandates
              </h2>
              
              <div className="mb-12 text-center">
                <div className="mx-auto max-w-4xl p-8 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                  <h3 className="mb-4 text-2xl font-bold text-dark dark:text-white">Vision</h3>
                  <p className="text-lg text-body-color dark:text-dark-6 italic">
                    "To build a global digital infrastructure technology ecosystem that enables all stakeholders to collaboratively develop and benefit from high-quality digital foundations."
                  </p>
                </div>
              </div>

              <div className="mb-12">
                <h3 className="mb-8 text-2xl font-bold text-dark dark:text-white text-center">Key Objectives</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full bg-white dark:bg-dark rounded-lg shadow-lg">
                    <thead className="bg-gray-200 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-6 text-center text-lg font-semibold text-dark dark:text-white border-b-2 border-gray-200 dark:border-dark-3 leading-6">
                          Strategic Pillars
                        </th>
                        <th className="px-6 py-6 text-center text-lg font-semibold text-dark dark:text-white border-b-2 border-gray-200 dark:border-dark-3 leading-6">
                          Concrete Deliverables
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white dark:bg-dark hover:bg-gray-50 dark:hover:bg-dark-2 transition-colors">
                        <td className="px-6 py-6 text-center text-base font-medium text-dark dark:text-white border-b border-gray-200 dark:border-dark-3 leading-6">
                          Standardization
                        </td>
                        <td className="px-6 py-6 text-center text-base text-body-color dark:text-dark-6 border-b border-gray-200 dark:border-dark-3 leading-6">
                          Develop international standards for AI, data centers, and networking
                        </td>
                      </tr>
                      <tr className="bg-gray-100 dark:bg-dark-2 hover:bg-gray-150 dark:hover:bg-dark-3 transition-colors">
                        <td className="px-6 py-6 text-center text-base font-medium text-dark dark:text-white border-b border-gray-200 dark:border-dark-3 leading-6">
                          Quality Assurance
                        </td>
                        <td className="px-6 py-6 text-center text-base text-body-color dark:text-dark-6 border-b border-gray-200 dark:border-dark-3 leading-6">
                          Provide testing, measurement, and certification services (e.g., DITC-AI Trust Mark)
                        </td>
                      </tr>
                      <tr className="bg-white dark:bg-dark hover:bg-gray-50 dark:hover:bg-dark-2 transition-colors">
                        <td className="px-6 py-6 text-center text-base font-medium text-dark dark:text-white border-b border-gray-200 dark:border-dark-3 leading-6">
                          Knowledge Hub
                        </td>
                        <td className="px-6 py-6 text-center text-base text-body-color dark:text-dark-6 border-b border-gray-200 dark:border-dark-3 leading-6">
                          Publish journals, manage technical communities, and host global industry summits
                        </td>
                      </tr>
                      <tr className="bg-gray-100 dark:bg-dark-2 hover:bg-gray-150 dark:hover:bg-dark-3 transition-colors">
                        <td className="px-6 py-6 text-center text-base font-medium text-dark dark:text-white border-b border-gray-200 dark:border-dark-3 leading-6">
                          Ecosystem Building
                        </td>
                        <td className="px-6 py-6 text-center text-base text-body-color dark:text-dark-6 border-b border-gray-200 dark:border-dark-3 leading-6">
                          Collaborate with ISO, IEEE, and other international organizations on joint standards
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="text-center mt-8">
                <a 
                  href="/DITC-CM-001：DITC Membership System and Fee Standards.pdf" 
                  download="DITC-Active-Standards-Projects.pdf"
                  className="inline-flex items-center px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z M12,11L16,15H13.5V19H10.5V15H8L12,11Z"/>
                  </svg>
                  View Our Active Standards Projects
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="bg-gray-1 py-20 dark:bg-dark-2 lg:py-[120px]">
          <div className="container mx-auto px-4">
            <div className="wow fadeInUp" data-wow-delay="1s">
              <h2 className="mb-12 text-3xl font-bold leading-tight text-dark dark:text-white sm:text-[40px] sm:leading-[1.2] text-center">
                Key Features of DITC Governance
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="px-12 py-8 bg-white dark:bg-dark rounded-lg">
                  <div className="flex items-start mb-4">
                    <span className="text-green-600 dark:text-green-400 text-2xl mr-4">✅</span>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-dark dark:text-white mb-2 text-left">Multi-stakeholder representation</h3>
                      <p className="text-base text-body-color dark:text-dark-6 text-left">
                        Ensures balanced input from industry, academia, and government
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-12 py-8 bg-white dark:bg-dark rounded-lg">
                  <div className="flex items-start mb-4">
                    <span className="text-green-600 dark:text-green-400 text-2xl mr-4">✅</span>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-dark dark:text-white mb-2 text-left">Transparent decision-making</h3>
                      <p className="text-base text-body-color dark:text-dark-6 text-left">
                        Clear approval processes for standards and policies
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-12 py-8 bg-white dark:bg-dark rounded-lg">
                  <div className="flex items-start mb-4">
                    <span className="text-green-600 dark:text-green-400 text-2xl mr-4">✅</span>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-dark dark:text-white mb-2 text-left">Global alignment</h3>
                      <p className="text-base text-body-color dark:text-dark-6 text-left">
                        Works in partnership with leading international standards bodies
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 text-center">
                <p className="text-lg text-body-color dark:text-dark-6 italic">
                  
                </p>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const aboutData = await getAbout()
    return {
      props: {
        aboutData: aboutData || null
      }
    }
  } catch (error) {
    console.error('Error fetching about data:', error)
    return {
      props: {
        aboutData: null
      }
    }
  }
} 