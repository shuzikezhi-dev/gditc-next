import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Layout from '../components/Layout';
import SEOHead from '../components/SEOHead';
import AnimatedNumber from '../components/AnimatedNumber';
import { getPageContent, getArticles, Page, Article } from '../lib/strapi';

interface HomeProps {
  pageData: Page | null;
  articles: Article[];
}

export default function Home({ pageData, articles }: HomeProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // 轮播图数据
  const slides = [
    {
      image: '/images/hero/ai-summit.jpg',
      title: 'World-first International AI Standards Summit 2025',
      description: 'Join us at the groundbreaking summit shaping the future of AI standardization',
      link: '#'
    },
    {
      image: '/images/hero/child-services.jpg',
      title: 'New Global Standard for Child-Friendly Services',
      description: 'Transforming care and protection for young victims of violence',
      link: '#'
    }
  ];

  // 统计数据
  const stats = [
    { number: 25821, label: 'International Standards and other deliverables covering almost all aspects of technology, management and manufacturing.' },
    { number: 173, label: 'Members representing ISO in their country. There is only one member per country.' },
    { number: 824, label: 'Technical committees and subcommittees to take care of standards development.' }
  ];

  // 板块数据
  const sectors = [
    { title: 'Standards Development', icon: 'heart' },
    { title: 'Benchmark Tools', icon: 'chart' },
    { title: 'Certification Service', icon: 'certificate' },
    { title: 'Journal Submission', icon: 'journal' },
    { title: 'Event Calendar', icon: 'event' },
    { title: 'Member Portal', icon: 'member' }
  ];

  // 自动轮播
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <Layout>
      <SEOHead
        title={pageData?.seo_title || pageData?.title || 'Home | GDITE'}
        description={pageData?.seo_description || '数字化国际贸易与商务协会官方网站'}
      />
      


      {/* 轮播图区域 */}
      <section className="relative h-[600px] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="container mx-auto">
                  <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>
                  <p className="text-lg mb-4 max-w-2xl">{slide.description}</p>
                  <a 
                    href={slide.link}
                    className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* 轮播指示器 */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
        
        {/* 轮播控制按钮 */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </section>

      {/* 统计数据区域 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Practical solutions for real-world problems
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              ISO, the International Organization for Standardization, brings global experts together to agree on the
              best way of doing things – for anything from making a product to managing a process. As one of the oldest
              non-governmental international organizations, ISO has enabled trade and cooperation between people and
              companies all over the world since 1946.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <AnimatedNumber value={stat.number} />
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 板块展示区域 */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore by sector
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {sectors.map((sector, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow group hover:bg-primary hover:text-white cursor-pointer">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-12 h-12" viewBox="0 0 96 96" fill="none" stroke="currentColor">
                    {/* 这里可以根据不同的icon类型显示不同的SVG */}
                    <circle cx="48" cy="48" r="40" strokeWidth="2"/>
                    <path d="M48 32v32M32 48h32" strokeWidth="2"/>
                  </svg>
                </div>
                <h4 className="text-center font-semibold">{sector.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 标准展示区域 */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ISO: the International Organization for Standardization
            </h2>
            <p className="text-lg mb-6">
              ISO is an independent, non-governmental international organization. It brings global experts together to
              agree on the best ways of doing things. From AI to quality management, to climate change and renewable
              energy, to healthcare, our mission is to make lives easier, safer and better – for everyone, everywhere.
            </p>
            <h4 className="text-2xl font-bold mb-6">Top standards</h4>
            <button className="bg-secondary px-8 py-3 rounded-md hover:bg-secondary/90 transition-colors">
              Discover more
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white text-gray-900 p-6 rounded-xl">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold">ISO</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">ISO 9001:2015</h3>
                <p className="text-gray-600">Quality management systems — Requirements</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 最新动态 */}
      {articles.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured insights
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {articles.slice(0, 3).map((article, index) => (
                <div key={index} className="group">
                  <div className="mb-6 overflow-hidden rounded-lg">
                    <div className="w-full h-48 bg-gray-200 rounded-lg group-hover:scale-105 transition-transform"></div>
                  </div>
                  <div className="mb-4">
                    <span className="inline-block bg-primary text-white px-3 py-1 rounded text-sm">
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    <a href={`/news/${article.slug}`}>
                      {article.title}
                    </a>
                  </h3>
                  <p className="text-gray-600 line-clamp-3">
                    {article.description}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <a
                href="/news"
                className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                查看more
              </a>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const [pageData, articles] = await Promise.all([
      getPageContent('home'),
      getArticles(6)
    ]);

    return {
      props: {
        pageData,
        articles,
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        pageData: null,
        articles: [],
      },
    };
  }
}; 