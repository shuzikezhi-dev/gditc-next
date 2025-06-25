import { GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import SEOHead from '../components/SEOHead';
import { useLanguage } from './_app';
import { getDetailContent, getContentList, DetailContent } from '../lib/detail-api';

interface DetailPageProps {
  channelType: string;
  documentId: string;
  initialContent: {
    title: string;
    description: string;
    content: string | null;
    locale: string;
    createdAt: string;
    cover?: string | null;
  };
}

export default function DetailPage({ channelType, documentId, initialContent }: DetailPageProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const [content, setContent] = useState(initialContent);
  const [relatedArticles, setRelatedArticles] = useState<DetailContent[]>([]);
  const [loading, setLoading] = useState(false);

  // 当语言切换时，重新获取对应语言的内容
  useEffect(() => {
    const fetchContentForLanguage = async () => {
      if (language !== content.locale) {
        setLoading(true);
        try {
          const targetLocale = language === 'zh-Hans' ? 'zh-Hans' : 'en';
          const newContent = await getDetailContent(channelType, documentId, targetLocale);
          
          if (newContent) {
            setContent({
              title: newContent.title,
              description: newContent.description || newContent.descript || '',
              content: newContent.content || '',
              locale: newContent.locale,
              createdAt: newContent.createdAt,
              cover: newContent.cover?.url || null,
            });
          }
        } catch (error) {
          console.error('Failed to fetch content for language:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchContentForLanguage();
  }, [language, channelType, documentId]);

  // 获取相关文章
  useEffect(() => {
    const fetchRelatedArticles = async () => {
      try {
        const articles = await getContentList(channelType, language === 'zh-Hans' ? 'zh-Hans' : 'en', 4);
        setRelatedArticles(articles.filter(item => item.documentId !== documentId));
      } catch (error) {
        console.error('Failed to fetch related articles:', error);
      }
    };

    fetchRelatedArticles();
  }, [channelType, language, documentId]);

  if (!content) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-dark dark:text-white mb-4">
              {language === 'zh-Hans' ? '内容未找到' : 'Content Not Found'}
            </h1>
            <p className="text-lg text-body-color dark:text-dark-6 mb-8">
              {language === 'zh-Hans' ? '抱歉，您查找的内容不存在。' : 'Sorry, the content you\'re looking for doesn\'t exist.'}
            </p>
            <button
              onClick={() => router.back()}
              className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition duration-300"
            >
              {language === 'zh-Hans' ? '返回' : 'Go Back'}
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'zh-Hans' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getChannelDisplayName = (channel: string) => {
    const channelNames = {
      'zh-Hans': {
        sectors: '行业板块',
        articles: '文章',
        events: '活动',
        resources: '资源',
        newsroom: '新闻'
      } as { [key: string]: string },
      'en': {
        sectors: 'Sectors',
        articles: 'Articles', 
        events: 'Events',
        resources: 'Resources',
        newsroom: 'Newsroom'
      } as { [key: string]: string }
    };
    
    const locale = language === 'zh-Hans' ? 'zh-Hans' : 'en';
    return channelNames[locale][channel] || channel;
  };

  return (
    <Layout>
      <SEOHead
        title={`${content.title} - DITC`}
        description={content.description}
      />

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark p-6 rounded-lg">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-dark dark:text-white">
              {language === 'zh-Hans' ? '正在加载内容...' : 'Loading content...'}
            </p>
          </div>
        </div>
      )}

      {/* Banner Section */}
      <div className="relative z-10 overflow-hidden pb-[30px] pt-[100px] dark:bg-dark md:pt-[110px] lg:pt-[130px]">
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-stroke/0 via-stroke to-stroke/0 dark:via-dark-3"></div>
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center -mx-4">
            <div className="w-full px-4">
              <div className="text-center">
                <h1 className="mb-4 text-3xl font-bold text-dark dark:text-white sm:text-4xl md:text-[40px] md:leading-[1.2]">
                  {language === 'zh-Hans' ? '详情页面' : 'Detail Page'}
                </h1>
                <p className="mb-5 text-base text-body-color dark:text-dark-6">
                  {language === 'zh-Hans' 
                    ? '了解更多DITC的最新资讯和见解' 
                    : 'Learn more about DITC\'s latest news and insights'
                  }
                </p>
                <ul className="flex items-center justify-center gap-[10px]">
                  <li>
                    <a
                      href="/"
                      className="flex items-center gap-[10px] text-base font-medium text-dark dark:text-white"
                    >
                      {language === 'zh-Hans' ? '首页' : 'Home'}
                    </a>
                  </li>
                  <li>
                    <span className="text-body-color dark:text-dark-6"> / </span>
                    <span className="capitalize">{getChannelDisplayName(channelType)}</span>
                  </li>
                  <li>
                    <span className="text-body-color dark:text-dark-6"> / </span>
                    {language === 'zh-Hans' ? '详情' : 'Details'}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <section className="pb-10 pt-10 dark:bg-dark lg:pb-20 lg:pt-[60px]">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center -mx-4">
            <div className="w-full px-4 lg:w-8/12">
              <div>
                {/* Featured Image */}
                {content.cover && (
                  <div className="wow fadeInUp relative z-20 mb-[50px] h-[300px] overflow-hidden rounded-[5px] md:h-[400px] lg:h-[500px]" data-wow-delay=".1s">
                    <img
                      src={content.cover}
                      alt={content.title}
                      className="object-cover object-center w-full h-full"
                    />
                  </div>
                )}

                <h2 className="wow fadeInUp mb-8 text-2xl font-bold text-dark dark:text-white sm:text-3xl md:text-[35px] md:leading-[1.28]" data-wow-delay=".1s">
                  {content.title}
                </h2>

                <p className="mb-6 text-base wow fadeInUp text-body-color dark:text-dark-6" data-wow-delay=".1s">
                  {content.description}
                </p>

                <div className="prose prose-lg max-w-none dark:prose-invert mb-10 wow fadeInUp" data-wow-delay=".1s">
                  {content.content ? (
                    <div dangerouslySetInnerHTML={{ __html: content.content }} />
                  ) : (
                    <p className="text-body-color dark:text-dark-6">
                      {language === 'zh-Hans' ? '暂无内容' : 'No content available'}
                    </p>
                  )}
                </div>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center mb-8 p-4 bg-gray-50 dark:bg-dark-2 rounded-lg">
                  <div className="w-full md:w-1/2 mb-4 md:mb-0">
                    <p className="text-sm text-body-color dark:text-dark-6">
                      <strong>{language === 'zh-Hans' ? '发布时间：' : 'Published:'}</strong> {formatDate(content.createdAt)}
                    </p>
                  </div>
                  <div className="w-full md:w-1/2">
                    <p className="text-sm text-body-color dark:text-dark-6">
                      <strong>{language === 'zh-Hans' ? '分类：' : 'Category:'}</strong> {getChannelDisplayName(channelType)}
                    </p>
                  </div>
                </div>

                {/* Share Section */}
                <div className="flex flex-wrap items-center mb-12 -mx-4">
                  <div className="w-full px-4 md:w-1/2">
                    <div className="flex flex-wrap items-center gap-3 mb-8 wow fadeInUp md:mb-0" data-wow-delay=".1s">
                      <span className="block rounded-md bg-primary/[0.08] px-[14px] py-[5px] text-base text-dark dark:text-white">
                        {getChannelDisplayName(channelType)}
                      </span>
                    </div>
                  </div>
                  <div className="w-full px-4 md:w-1/2">
                    <div className="flex items-center wow fadeInUp md:justify-end" data-wow-delay=".1s">
                      <span className="mr-5 text-sm font-medium text-body-color dark:text-dark-6">
                        {language === 'zh-Hans' ? '分享此文章' : 'Share This Post'}
                      </span>
                      <div className="flex items-center gap-[10px]">
                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${typeof window !== 'undefined' ? window.location.href : ''}`} target="_blank" rel="noopener noreferrer">
                          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="#1877F2"/>
                            <path d="M17 15.5399V12.7518C17 11.6726 17.8954 10.7976 19 10.7976H21V7.86631L18.285 7.67682C15.9695 7.51522 14 9.30709 14 11.5753V15.5399H11V18.4712H14V24.3334H17V18.4712H20L21 15.5399H17Z" fill="white"/>
                          </svg>
                        </a>
                        <a href={`https://twitter.com/intent/tweet?url=${typeof window !== 'undefined' ? window.location.href : ''}&text=${content.title}`} target="_blank" rel="noopener noreferrer">
                          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="#55ACEE"/>
                            <path d="M24.2945 11.375C24.4059 11.2451 24.2607 11.0755 24.0958 11.1362C23.728 11.2719 23.3918 11.3614 22.8947 11.4166C23.5062 11.0761 23.7906 10.5895 24.0219 9.99339C24.0777 9.84961 23.9094 9.71915 23.7645 9.78783C23.1759 10.0669 22.5408 10.274 21.873 10.3963C21.2129 9.7421 20.272 9.33331 19.2312 9.33331C17.2325 9.33331 15.6117 10.8406 15.6117 12.6993C15.6117 12.9632 15.6441 13.2202 15.7051 13.4663C12.832 13.3324 10.2702 12.1034 8.49031 10.2188C8.36832 10.0897 8.14696 10.1068 8.071 10.2643C7.86837 10.6846 7.7554 11.1509 7.7554 11.6418C7.7554 12.8093 8.39417 13.8395 9.36518 14.4431C8.92981 14.4301 8.51344 14.3452 8.12974 14.2013C7.94292 14.1312 7.72877 14.2543 7.75387 14.4427C7.94657 15.8893 9.11775 17.0827 10.6295 17.3647C10.3259 17.442 10.0061 17.483 9.67537 17.483C9.59517 17.483 9.51567 17.4805 9.43688 17.4756C9.23641 17.4632 9.07347 17.6426 9.15942 17.8141C9.72652 18.946 10.951 19.7361 12.376 19.7607C11.1374 20.6637 9.57687 21.2017 7.88109 21.2017C7.672 21.2017 7.5823 21.4706 7.7678 21.5617C9.20049 22.266 10.832 22.6666 12.5656 22.6666C19.2231 22.6666 22.8631 17.5377 22.8631 13.0896C22.8631 12.944 22.8594 12.7984 22.8528 12.6542C23.3932 12.2911 23.8789 11.8595 24.2945 11.375Z" fill="white"/>
                          </svg>
                        </a>
                        <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${typeof window !== 'undefined' ? window.location.href : ''}`} target="_blank" rel="noopener noreferrer">
                          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="#007AB9"/>
                            <path d="M11.7836 10.1666C11.7833 10.8452 11.3716 11.4559 10.7426 11.7106C10.1137 11.9654 9.39306 11.8134 8.92059 11.3263C8.44811 10.8392 8.31813 10.1143 8.59192 9.49341C8.86572 8.87251 9.48862 8.4796 10.1669 8.49996C11.0678 8.527 11.784 9.26533 11.7836 10.1666ZM11.8336 13.0666H8.50024V23.4999H11.8336V13.0666ZM17.1003 13.0666H13.7836V23.4999H17.0669V18.0249C17.0669 14.9749 21.0419 14.6916 21.0419 18.0249V23.4999H24.3336V16.8916C24.3336 11.75 18.4503 11.9416 17.0669 14.4666L17.1003 13.0666Z" fill="white"/>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 mb-12">
                  <button
                    onClick={() => router.back()}
                    className="bg-secondary text-white px-6 py-3 rounded-md hover:bg-secondary/90 transition duration-300"
                  >
                    {language === 'zh-Hans' ? '返回' : 'Go Back'}
                  </button>
                  <a
                    href={`/${channelType}`}
                    className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition duration-300 inline-block"
                  >
                    {language === 'zh-Hans' ? `浏览更多${getChannelDisplayName(channelType)}` : `View More ${getChannelDisplayName(channelType)}`}
                  </a>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-full px-4 lg:w-4/12">
              <div>
                {/* Popular Articles */}
                <div className="mb-8">
                  <h2 className="wow fadeInUp relative pb-5 text-2xl font-semibold text-dark dark:text-white sm:text-[28px]" data-wow-delay=".1s">
                    {language === 'zh-Hans' ? '推荐阅读' : 'Popular Articles'}
                  </h2>
                  <span className="mb-10 inline-block h-[2px] w-20 bg-primary"></span>

                  {relatedArticles.slice(0, 4).map((article, index) => (
                    <div key={article.documentId} className="w-full">
                      <div className={`flex items-center w-full pb-5 mb-5 wow fadeInUp border-stroke dark:border-dark-3 ${index === 3 ? 'border-0' : 'border-b'}`} data-wow-delay=".1s">
                        <div className="mr-5 h-20 w-full max-w-[80px] overflow-hidden rounded-full">
                          {article.cover?.url ? (
                            <img
                              src={article.cover.url}
                              alt={article.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img
                              src="/images/blog/article-author-01.png"
                              alt="default"
                              className="w-full"
                            />
                          )}
                        </div>
                        <div className="w-full">
                          <h4>
                            <a
                              href={`/${channelType}/${article.documentId}`}
                              className="inline-block mb-1 text-lg font-medium leading-snug text-dark hover:text-primary dark:text-dark-6 dark:hover:text-primary lg:text-base xl:text-lg"
                            >
                              {article.title.length > 40 ? `${article.title.substring(0, 40)}…` : article.title}
                            </a>
                          </h4>
                          <p className="text-sm text-body-color dark:text-dark-6">
                            {formatDate(article.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Show placeholder articles if no related articles */}
                  {relatedArticles.length === 0 && (
                    <>
                      <div className="w-full">
                        <div className="flex items-center w-full pb-5 mb-5 border-b wow fadeInUp border-stroke dark:border-dark-3" data-wow-delay=".1s">
                          <div className="mr-5 h-20 w-full max-w-[80px] overflow-hidden rounded-full">
                            <img
                              src="/images/blog/article-author-01.png"
                              alt="image"
                              className="w-full"
                            />
                          </div>
                          <div className="w-full">
                            <h4>
                              <a
                                href="javascript:void(0)"
                                className="inline-block mb-1 text-lg font-medium leading-snug text-dark hover:text-primary dark:text-dark-6 dark:hover:text-primary lg:text-base xl:text-lg"
                              >
                                {language === 'zh-Hans' ? '创建引人入胜的在线课程…' : 'Create engaging online courses your student…'}
                              </a>
                            </h4>
                            <p className="text-sm text-body-color dark:text-dark-6">
                              {language === 'zh-Hans' ? 'DITC 团队' : 'DITC Team'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="w-full">
                        <div className="flex items-center w-full pb-5 mb-5 border-b wow fadeInUp border-stroke dark:border-dark-3" data-wow-delay=".1s">
                          <div className="mr-5 h-20 w-full max-w-[80px] overflow-hidden rounded-full">
                            <img
                              src="/images/blog/article-author-02.png"
                              alt="image"
                              className="w-full"
                            />
                          </div>
                          <div className="w-full">
                            <h4>
                              <a
                                href="javascript:void(0)"
                                className="inline-block mb-1 text-lg font-medium leading-snug text-dark hover:text-primary dark:text-dark-6 dark:hover:text-primary lg:text-base xl:text-lg"
                              >
                                {language === 'zh-Hans' ? '数字基础设施标准化最佳实践' : 'The ultimate formula for digital infrastructure'}
                              </a>
                            </h4>
                            <p className="text-sm text-body-color dark:text-dark-6">
                              {language === 'zh-Hans' ? 'DITC 专家' : 'DITC Expert'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="w-full">
                        <div className="flex items-center w-full pb-5 mb-5 border-b wow fadeInUp border-stroke dark:border-dark-3" data-wow-delay=".1s">
                          <div className="mr-5 h-20 w-full max-w-[80px] overflow-hidden rounded-full">
                            <img
                              src="/images/blog/article-author-03.png"
                              alt="image"
                              className="w-full"
                            />
                          </div>
                          <div className="w-full">
                            <h4>
                              <a
                                href="javascript:void(0)"
                                className="inline-block mb-1 text-lg font-medium leading-snug text-dark hover:text-primary dark:text-dark-6 dark:hover:text-primary lg:text-base xl:text-lg"
                              >
                                {language === 'zh-Hans' ? '50个最佳数字化转型技巧' : '50 Best digital transformation tips & tricks'}
                              </a>
                            </h4>
                            <p className="text-sm text-body-color dark:text-dark-6">
                              {language === 'zh-Hans' ? 'DITC 顾问' : 'DITC Consultant'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="w-full">
                        <div className="flex items-center w-full pb-5 mb-5 border-0 wow fadeInUp border-stroke dark:border-dark-3" data-wow-delay=".1s">
                          <div className="mr-5 h-20 w-full max-w-[80px] overflow-hidden rounded-full">
                            <img
                              src="/images/blog/article-author-04.png"
                              alt="image"
                              className="w-full"
                            />
                          </div>
                          <div className="w-full">
                            <h4>
                              <a
                                href="javascript:void(0)"
                                className="inline-block mb-1 text-lg font-medium leading-snug text-dark hover:text-primary dark:text-dark-6 dark:hover:text-primary lg:text-base xl:text-lg"
                              >
                                {language === 'zh-Hans' ? '8个最佳基础设施建设方案' : 'The 8 best infrastructure builders, reviewed'}
                              </a>
                            </h4>
                            <p className="text-sm text-body-color dark:text-dark-6">
                              {language === 'zh-Hans' ? 'DITC 研究员' : 'DITC Researcher'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Banner Ad */}
                <div className="wow fadeInUp mb-12 overflow-hidden rounded-[5px]" data-wow-delay=".1s">
                  <img
                    src="/images/blog/bannder-ad.png"
                    alt="image"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap -mx-4">
              <div className="w-full px-4 wow fadeInUp mt-14" data-wow-delay=".2s">
                <h2 className="relative pb-5 text-2xl font-semibold text-dark dark:text-white sm:text-[36px]">
                  {language === 'zh-Hans' ? '相关文章' : 'Related Articles'}
                </h2>
                <span className="mb-10 inline-block h-[2px] w-20 bg-primary"></span>
              </div>
              
              {relatedArticles.slice(0, 3).map((article, index) => (
                <div key={article.documentId} className="w-full px-4 md:w-1/2 lg:w-1/3">
                  <div className="mb-10 wow fadeInUp group" data-wow-delay={`.${1 + index}s`}>
                    <div className="mb-8 overflow-hidden rounded-[5px]">
                      <a href={`/${channelType}/${article.documentId}`} className="block">
                        {article.cover?.url ? (
                          <img
                            src={article.cover.url}
                            alt={article.title}
                            className="w-full h-48 object-cover transition group-hover:rotate-6 group-hover:scale-125"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center transition group-hover:rotate-6 group-hover:scale-125">
                            <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </a>
                    </div>
                    <div>
                      <span className="mb-6 inline-block rounded-[5px] bg-primary px-4 py-0.5 text-center text-xs font-medium leading-loose text-white">
                        {formatDate(article.createdAt)}
                      </span>
                      <h3>
                        <a
                          href={`/${channelType}/${article.documentId}`}
                          className="inline-block mb-4 text-xl font-semibold text-dark hover:text-primary dark:text-white sm:text-2xl lg:text-xl xl:text-2xl"
                        >
                          {article.title}
                        </a>
                      </h3>
                      <p className="max-w-[370px] text-base text-body-color dark:text-dark-6">
                        {article.description || article.descript || ''}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const paths: any[] = [];
    const validChannels = ['articles', 'sectors', 'events', 'resources', 'newsroom'];
    
    // 为每个内容类型获取记录来生成路径
    for (const channelType of validChannels) {
      try {
        console.log(`📋 获取${channelType}的路径...`);
        
        // 获取英文内容
        const enContent = await getContentList(channelType, 'en', 20);
        enContent.forEach(item => {
          if (item.documentId) {
            paths.push({ params: { params: [channelType, item.documentId] } });
          }
        });
        
        // 获取中文内容
        const zhContent = await getContentList(channelType, 'zh-Hans', 20);
        zhContent.forEach(item => {
          if (item.documentId) {
            // 避免重复添加相同的documentId
            const exists = paths.some(p => 
              p.params.params[0] === channelType && 
              p.params.params[1] === item.documentId
            );
            if (!exists) {
              paths.push({ params: { params: [channelType, item.documentId] } });
            }
          }
        });
        
        console.log(`✅ ${channelType}: 生成了 ${paths.filter(p => p.params.params[0] === channelType).length} 个路径`);
      } catch (error) {
        console.log(`❌ 获取${channelType}失败:`, error);
        // 如果API调用失败，至少添加一个示例路径
        if (channelType === 'sectors') {
          paths.push({ params: { params: [channelType, 'wt9v3cvkbqgpp4z2cj902ect'] } });
        }
      }
    }
    
    console.log(`🚀 总共生成了 ${paths.length} 个静态路径`);
    
    return {
      paths,
      // 静态导出模式下必须使用 fallback: false
      fallback: false,
    };
  } catch (error) {
    console.error('Error in getStaticPaths:', error);
    
    // 如果API调用失败，返回基本的示例路径，包括我们知道存在的documentId
          return {
        paths: [
          { params: { params: ['sectors', 'wt9v3cvkbqgpp4z2cj902ect'] } }, // 使用真实的documentId
          { params: { params: ['sectors', 'sample-sector-doc-id'] } },
          { params: { params: ['articles', 'sample-article-doc-id'] } },
        ],
        fallback: false,
      };
  }
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  try {
    const pathParams = params?.params as string[];

    // 路由格式: /{channel}/{documentId}
    if (!pathParams || pathParams.length !== 2) {
      return {
        notFound: true,
      };
    }

    const [channelType, documentId] = pathParams;

    // 验证channelType
    const validChannels = ['articles', 'sectors', 'events', 'resources', 'newsroom'];
    if (!validChannels.includes(channelType)) {
      return {
        notFound: true,
      };
    }

    // 确定语言，优先使用locale参数，然后是查询参数
    const requestedLocale = locale || 'en';
    console.log(`🌐 请求的语言: ${requestedLocale}, 内容类型: ${channelType}, documentId: ${documentId}`);

    // 首先尝试获取英文内容
    let content = await getDetailContent(channelType, documentId, 'en');
    
    // 如果请求的是中文，则尝试获取中文内容
    if (requestedLocale === 'zh-Hans' || requestedLocale === 'zh') {
      const chineseContent = await getDetailContent(channelType, documentId, 'zh-Hans');
      if (chineseContent) {
        content = chineseContent;
      }
    }

    // 如果都没有找到，返回404
    if (!content) {
      console.log(`❌ 未找到内容: ${channelType}/${documentId}`);
      return {
        notFound: true,
      };
    }

    console.log(`✅ 成功获取内容: ${content.title} (${content.locale})`);

              return {
      props: {
        channelType,
        documentId,
        initialContent: {
          title: content.title || 'Untitled',
          description: content.description || content.descript || '',
          content: content.content || null,
          locale: content.locale || 'en',
          createdAt: content.createdAt || new Date().toISOString(),
          cover: content.cover?.url || null,
        },
      },
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      notFound: true,
    };
  }
}; 