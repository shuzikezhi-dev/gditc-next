import axios from 'axios';

const strapiAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://wonderful-serenity-47deffe3a2.strapiapp.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 添加请求拦截器来处理认证
strapiAPI.interceptors.request.use((config) => {
  const token = process.env.STRAPI_API_TOKEN;
  console.log('🔑 API Token check:', {
    hasToken: !!token,
    tokenLength: token?.length || 0,
    tokenPreview: token ? `${token.substring(0, 10)}...` : 'null',
    isDefaultToken: token === 'your_readonly_token_here' || token === 'your_api_token_here'
  });
  
  if (token && token !== 'your_readonly_token_here' && token !== 'your_api_token_here') {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('✅ Authorization header added');
  } else {
    console.warn('⚠️ No valid API token found or using default placeholder');
  }
  return config;
});

// 添加响应拦截器来处理错误
strapiAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Strapi API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.error?.message || error.message,
    });
    return Promise.reject(error);
  }
);

// 响应数据类型定义 - 更新为Strapi 5格式
export interface StrapiResponse<T> {
  data: (T & {
    id: number;
    documentId: string;
    locale?: string;
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
  })[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiSingleResponse<T> {
  data: T & {
    id: number;
    documentId: string;
    locale?: string;
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
  };
  meta: {};
}

export interface Page {
  title: string;
  slug: string;
  content: string;
  seo_title?: string;
  seo_description?: string;
  featured_image?: {
    id?: number;
    documentId?: string;
    name?: string;
    alternativeText?: string;
    caption?: string;
    width?: number;
    height?: number;
    url: string;
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
  };
}

export interface Article {
  documentId?: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  cover?: {
    id?: number;
    documentId?: string;
    name?: string;
    alternativeText?: string;
    caption?: string;
    width?: number;
    height?: number;
    formats?: {
      small?: {
        ext: string;
        url: string;
        hash: string;
        mime: string;
        name: string;
        path?: string;
        size: number;
        width: number;
        height: number;
        sizeInBytes: number;
      };
      thumbnail?: {
        ext: string;
        url: string;
        hash: string;
        mime: string;
        name: string;
        path?: string;
        size: number;
        width: number;
        height: number;
        sizeInBytes: number;
      };
    };
    hash?: string;
    ext?: string;
    mime?: string;
    size?: number;
    url: string;
    previewUrl?: string;
    provider?: string;
    provider_metadata?: any;
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
  } | null;
  author?: {
    id?: number;
    documentId?: string;
    name: string;
    email: string;
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
  } | null;
  category?: {
    id?: number;
    documentId?: string;
    name: string;
    slug: string;
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
  } | null;
  blocks?: any[] | null;
  locale?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Sector {
  id?: number;
  documentId?: string;
  title: string;
  date: string;
  content: string;
  source?: string;
  descript?: string;
  artcileId?: string;
  type: 'Network' | 'Datacenter' | 'Data' | 'Cloud' | 'AI' | 'Security';
  cover?: {
    id?: number;
    documentId?: string;
    name?: string;
    alternativeText?: string;
    caption?: string;
    width?: number;
    height?: number;
    formats?: {
      small?: {
        ext: string;
        url: string;
        hash: string;
        mime: string;
        name: string;
        path?: string;
        size: number;
        width: number;
        height: number;
        sizeInBytes: number;
      };
      thumbnail?: {
        ext: string;
        url: string;
        hash: string;
        mime: string;
        name: string;
        path?: string;
        size: number;
        width: number;
        height: number;
        sizeInBytes: number;
      };
    };
    hash?: string;
    ext?: string;
    mime?: string;
    size?: number;
    url: string;
    previewUrl?: string;
    provider?: string;
    provider_metadata?: any;
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
  };
  attach?: {
    id?: number;
    documentId?: string;
    name?: string;
    alternativeText?: string;
    caption?: string;
    width?: number;
    height?: number;
    url: string;
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
  }[];
  locale?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface Event {
  id?: number;
  documentId?: string;
  title: string;
  date: string;
  content: string;
  location?: string;
  type?: string;
  cover?: {
    id?: number;
    documentId?: string;
    name?: string;
    alternativeText?: string;
    caption?: string;
    width?: number;
    height?: number;
    formats?: {
      small?: {
        ext: string;
        url: string;
        hash: string;
        mime: string;
        name: string;
        path?: string;
        size: number;
        width: number;
        height: number;
        sizeInBytes: number;
      };
      thumbnail?: {
        ext: string;
        url: string;
        hash: string;
        mime: string;
        name: string;
        path?: string;
        size: number;
        width: number;
        height: number;
        sizeInBytes: number;
      };
    };
    hash?: string;
    ext?: string;
    mime?: string;
    size?: number;
    url: string;
    previewUrl?: string;
    provider?: string;
    provider_metadata?: any;
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
  };
  locale?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface Resource {
  id?: number;
  documentId?: string;
  title: string;
  content: string;
  type?: string;
  cover?: {
    id?: number;
    documentId?: string;
    name?: string;
    alternativeText?: string;
    caption?: string;
    width?: number;
    height?: number;
    formats?: {
      small?: {
        ext: string;
        url: string;
        hash: string;
        mime: string;
        name: string;
        path?: string;
        size: number;
        width: number;
        height: number;
        sizeInBytes: number;
      };
      thumbnail?: {
        ext: string;
        url: string;
        hash: string;
        mime: string;
        name: string;
        path?: string;
        size: number;
        width: number;
        height: number;
        sizeInBytes: number;
      };
    };
    hash?: string;
    ext?: string;
    mime?: string;
    size?: number;
    url: string;
    previewUrl?: string;
    provider?: string;
    provider_metadata?: any;
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
  };
  attachments?: {
    id?: number;
    documentId?: string;
    name: string;
    alternativeText?: string;
    caption?: string;
    width?: number;
    height?: number;
    ext: string;
    url: string;
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
  }[];
  locale?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface About {
  title: string;
  blocks?: any[];
}

export interface Global {
  siteName: string;
  siteDescription: string;
  logo?: {
    id?: number;
    documentId?: string;
    name?: string;
    alternativeText?: string;
    caption?: string;
    width?: number;
    height?: number;
    url: string;
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
  };
  favicon?: {
    id?: number;
    documentId?: string;
    name?: string;
    alternativeText?: string;
    caption?: string;
    width?: number;
    height?: number;
    url: string;
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
  };
}

// 获取页面内容
export const getPageContent = async (slug: string): Promise<Page | null> => {
  try {
    const response = await strapiAPI.get<StrapiResponse<Page>>(
      `/pages?filters[slug][$eq]=${slug}`
    );
    
    if (response.data.data.length === 0) {
      return null;
    }
    
    return response.data.data[0];
  } catch (error) {
    console.error('Error fetching page content:', error);
    return null;
  }
};

// 获取所有页面（用于静态路径生成）
export const getAllPages = async (): Promise<{ slug: string }[]> => {
  try {
    // 先尝试从 articles 获取页面数据，因为 pages 端点可能不存在
    const response = await strapiAPI.get<StrapiResponse<{ slug: string }>>(
      '/articles?fields[0]=slug'
    );
    
    // 安全地处理响应数据
    if (!response.data.data || !Array.isArray(response.data.data)) {
      console.warn('Invalid articles data structure for pages:', response.data);
      return [];
    }
    
    // 过滤掉与静态页面冲突的路径
    const staticRoutes = ['about', 'join-us', 'activities-services', 'sectors', 'events', 'resources', 'news', 'newsroom'];
    
    return response.data.data
      .map((page) => {
        // 确保 slug 存在
        if (!page.slug) {
          return null;
        }
        return { slug: page.slug };
      })
      .filter((page): page is { slug: string } => 
        page !== null && 
        !staticRoutes.includes(page.slug) // 排除与静态路由冲突的路径
      );
  } catch (error) {
    console.error('Error fetching all pages:', error);
    // 如果 API 失败，返回空数组而不是固定路由（避免冲突）
    return [];
  }
};

// 获取文章列表 - 更新为Strapi 5格式
export const getArticles = async (limit?: number, locale: string = 'en'): Promise<Article[]> => {
  try {
    const queryParams = new URLSearchParams({
      'sort': 'publishedAt:desc'
    });
    
    if (limit) {
      queryParams.append('pagination[limit]', limit.toString());
    }
    
    if (locale && locale !== 'en') {
      queryParams.append('locale', locale);
    }
    
    const response = await strapiAPI.get<StrapiResponse<Article>>(
      `/articles?${queryParams.toString()}`
    );
    
    // 检查响应数据结构
    if (!response.data || !response.data.data || !Array.isArray(response.data.data)) {
      console.warn('Invalid articles data structure:', response.data);
      return [];
    }
    
    return response.data.data
      .map((article) => {
        // Strapi 5 返回平面结构
        console.log('Processing article:', article);
        
        // 确保必需字段存在
        if (!article.title || !article.slug) {
          console.warn('Article missing required fields:', article);
          return null;
        }
        
        return {
          documentId: article.documentId,
          title: article.title,
          slug: article.slug,
          description: article.description || '',
          cover: article.cover || null,
          author: article.author || null,
          category: article.category || null,
          blocks: article.blocks || null,
          locale: article.locale,
          createdAt: article.createdAt,
          updatedAt: article.updatedAt,
          publishedAt: article.publishedAt || article.createdAt,
        } as Article;
      })
      .filter((article): article is Article => article !== null);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
};

// 根据documentId获取文章 - Strapi 5版本
export const getArticleByDocumentId = async (documentId: string, locale: string = 'en'): Promise<Article | null> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (locale && locale !== 'en') {
      queryParams.append('locale', locale);
    }
    
    const url = `/articles/${documentId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await strapiAPI.get<StrapiSingleResponse<Article>>(url);
    
    if (!response.data.data) {
      return null;
    }
    
    const article = response.data.data;
    
    // 确保必需字段存在
    if (!article.title) {
      console.warn('Article missing required fields:', article);
      return null;
    }
    
    return {
      documentId: article.documentId,
      title: article.title,
      slug: article.slug || '',
      description: article.description || '',
      cover: article.cover || null,
      author: article.author || null,
      category: article.category || null,
      blocks: article.blocks || null,
      locale: article.locale,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      publishedAt: article.publishedAt || article.createdAt,
    } as Article;
  } catch (error) {
    console.error('Error fetching article by documentId:', error);
    return null;
  }
};

// 根据slug获取文章（保留兼容性）
export const getArticleBySlug = async (slug: string): Promise<Article | null> => {
  try {
    const response = await strapiAPI.get<StrapiResponse<Article>>(
      `/articles?filters[slug][$eq]=${slug}`
    );
    
    if (!response.data.data || response.data.data.length === 0) {
      return null;
    }
    
    const article = response.data.data[0];
    
    // 确保必需字段存在
    if (!article.title || !article.slug) {
      console.warn('Article missing required fields:', article);
      return null;
    }
    
    return {
      documentId: article.documentId,
      title: article.title,
      slug: article.slug,
      description: article.description || '',
      cover: article.cover || null,
      author: article.author || null,
      category: article.category || null,
      blocks: article.blocks || null,
      locale: article.locale,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      publishedAt: article.publishedAt || article.createdAt,
    } as Article;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
};

// 获取所有文章slug（用于静态路径生成）
export const getAllArticles = async (): Promise<{ slug: string }[]> => {
  try {
    const response = await strapiAPI.get<StrapiResponse<{ slug: string }>>(
      '/articles?fields[0]=slug'
    );
    
    return response.data.data.map((article) => ({
      slug: article.slug,
    }));
  } catch (error) {
    console.error('Error fetching all articles:', error);
    return [];
  }
};

// 获取板块信息
export const getSectors = async (type?: string, locale: string = 'en'): Promise<Sector[]> => {
  try {
    // 构建查询参数
    const queryParams = new URLSearchParams({
      'sort': 'createdAt:desc',
      'populate': '*'
    });
    
    // 如果指定了语言且不是默认语言，添加locale参数
    if (locale && locale !== 'en') {
      queryParams.append('locale', locale);
    }

    console.log(`Fetching sectors with locale: ${locale}, type: ${type || 'all'}`);
    
    const response = await strapiAPI.get<StrapiResponse<Sector>>(
      `/sectors?${queryParams.toString()}`
    );
    
    console.log('Sectors API response status:', response.status);
    console.log('Sectors data length:', response.data.data?.length || 0);
    
    if (!response.data.data || !Array.isArray(response.data.data)) {
      console.warn('Invalid sectors response format');
      return [];
    }
    
    let sectors = response.data.data.map((sector: any) => {
      // 调试日志：打印原始数据结构
      console.log('Raw sector data:', {
        id: sector.id,
        documentId: sector.documentId,
        artcileId: sector.artcileId || sector.attributes?.artcileId,
        hasAttributes: !!sector.attributes,
        coverFromRoot: sector.cover,
        coverFromAttributes: sector.attributes?.cover,
        finalCover: sector.cover || sector.attributes?.cover
      });
      
      // 优化数据结构处理
      if (sector.attributes) {
        return { 
          ...sector.attributes, 
          id: sector.id,
          documentId: sector.documentId,
          locale: sector.locale,
          // 确保所有可能为undefined的字段都设为null
          attach: sector.attributes.attach || null,
          cover: sector.attributes.cover || null,
          author: sector.attributes.author || null,
          createdAt: sector.attributes.createdAt || null,
          updatedAt: sector.attributes.updatedAt || null,
          publishedAt: sector.attributes.publishedAt || null
        };
      } else {
        // 对于没有attributes的情况，直接使用sector对象
        return {
          id: sector.id,
          documentId: sector.documentId,
          title: sector.title || '',
          date: sector.date || null,
          content: sector.content || '',
          source: sector.source || null,
          descript: sector.descript || '',
          artcileId: sector.artcileId || null,
          type: sector.type || 'Network',
          locale: sector.locale,
          // 直接使用sector对象中的字段
          attach: sector.attach || null,
          cover: sector.cover || null,
          author: sector.author || null,
          createdAt: sector.createdAt || null,
          updatedAt: sector.updatedAt || null,
          publishedAt: sector.publishedAt || null
        };
      }
    });
    
    // 在前端进行筛选
    if (type) {
      sectors = sectors.filter((sector: Sector) => sector.type === type);
      console.log(`Filtered sectors by type '${type}':`, sectors.length);
    }
    
    return sectors;
  } catch (error: any) {
    console.error('Error fetching sectors:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });
    
    // 如果是403错误且使用了locale参数，尝试不使用locale重新请求
    if (error.response?.status === 403 && locale !== 'en') {
      console.warn('🔒 403 error with locale, trying fallback to English...');
      try {
        return await getSectors(type, 'en');
      } catch (fallbackError) {
        console.error('Fallback request also failed:', fallbackError);
      }
    }
    
    // 如果是认证错误或网络错误，返回空数组而不是抛出错误
    if (error.response?.status === 401 || error.response?.status === 403 || error.code === 'ENOTFOUND') {
      console.warn('🔒 Authentication or network error. Returning empty array.');
      return [];
    }
    
    return [];
  }
};

// 获取事件列表
export const getEvents = async (limit?: number, locale: string = 'en'): Promise<Event[]> => {
  try {
    console.log(`🔄 正在获取Events数据 (${locale})...`);
    
    const queryParams = new URLSearchParams();
    
    if (locale && locale !== 'en') {
      queryParams.append('locale', locale);
    }
    
    if (limit) {
      queryParams.append('pagination[limit]', limit.toString());
    }
    
    queryParams.append('sort', 'date:desc');
    queryParams.append('populate', '*');
    
    const url = `/events${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await strapiAPI.get<StrapiResponse<Event>>(url);
    
    const events = response.data.data.map((event: any) => {
      // 调试日志：打印Events数据结构
      console.log('Raw event data:', {
        id: event.id,
        title: event.title,
        hasAttributes: !!event.attributes,
        cover: event.cover || event.attributes?.cover
      });
      
      // 处理数据结构
      if (event.attributes) {
        return {
          id: event.id,
          documentId: event.documentId,
          title: event.attributes.title,
          date: event.attributes.date,
          content: event.attributes.content,
          location: event.attributes.location,
          type: event.attributes.type,
          cover: event.attributes.cover,
          locale: event.locale,
          createdAt: event.attributes.createdAt,
          updatedAt: event.attributes.updatedAt,
          publishedAt: event.attributes.publishedAt,
        };
      } else {
        return {
          id: event.id,
          documentId: event.documentId,
          title: event.title,
          date: event.date,
          content: event.content,
          location: event.location,
          type: event.type,
          cover: event.cover,
          locale: event.locale,
          createdAt: event.createdAt,
          updatedAt: event.updatedAt,
          publishedAt: event.publishedAt,
        };
      }
    });
    
    console.log(`✅ 成功获取 ${events.length} 条Events数据`);
    return events;
  } catch (error: any) {
    console.error('❌ 获取Events数据失败:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });
    
    // 如果是403错误且使用了locale参数，尝试不使用locale重新请求
    if (error.response?.status === 403 && locale !== 'en') {
      console.warn('🔒 403 error with locale, trying fallback to English...');
      try {
        return await getEvents(limit, 'en');
      } catch (fallbackError) {
        console.error('Fallback request also failed:', fallbackError);
      }
    }
    
    return [];
  }
};

// 获取资源列表
export const getResources = async (type?: string): Promise<Resource[]> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (type) {
      queryParams.append('filters[type][$eq]', type);
    }
    
    queryParams.append('populate', '*');
    queryParams.append('sort', 'createdAt:desc');
    
    const response = await strapiAPI.get<StrapiResponse<Resource>>(
      `/resources?${queryParams.toString()}`
    );
    
    return response.data.data.map((resource: any) => {
      // 调试日志：打印Resources数据结构
      console.log('Raw resource data:', {
        id: resource.id,
        title: resource.title || resource.attributes?.title,
        hasAttributes: !!resource.attributes,
        cover: resource.cover || resource.attributes?.cover
      });
      
      // 处理数据结构
      if (resource.attributes) {
        return {
          id: resource.id,
          documentId: resource.documentId,
          title: resource.attributes.title,
          content: resource.attributes.content,
          type: resource.attributes.type,
          cover: resource.attributes.cover,
          attachments: resource.attributes.attachments,
          locale: resource.locale,
          createdAt: resource.attributes.createdAt,
          updatedAt: resource.attributes.updatedAt,
          publishedAt: resource.attributes.publishedAt,
        };
      } else {
        return {
          id: resource.id,
          documentId: resource.documentId,
          title: resource.title,
          content: resource.content,
          type: resource.type,
          cover: resource.cover,
          attachments: resource.attachments,
          locale: resource.locale,
          createdAt: resource.createdAt,
          updatedAt: resource.updatedAt,
          publishedAt: resource.publishedAt,
        };
      }
    });
  } catch (error) {
    console.error('Error fetching resources:', error);
    return [];
  }
};

// 获取关于我们信息
export const getAbout = async (): Promise<About | null> => {
  try {
    const response = await strapiAPI.get<StrapiSingleResponse<About>>(
      '/about'
    );
    
    return response.data.data;
  } catch (error) {
    console.error('Error fetching about:', error);
    return null;
  }
};

// 获取全局设置
export const getGlobal = async (): Promise<Global | null> => {
  try {
    const response = await strapiAPI.get<StrapiSingleResponse<Global>>(
      '/global'
    );
    
    return response.data.data;
  } catch (error) {
    console.error('Error fetching global settings:', error);
    return null;
  }
};

// 获取新闻资讯
export const getNewsroom = async (limit?: number, locale: string = 'en'): Promise<Article[]> => {
  try {
    console.log(`🔄 正在获取Newsroom数据 (${locale})...`);
    
    const queryParams = new URLSearchParams();
    
    if (locale && locale !== 'en') {
      queryParams.append('locale', locale);
    }
    
    if (limit) {
      queryParams.append('pagination[limit]', limit.toString());
    }
    
    queryParams.append('sort', 'publishedAt:desc');
    queryParams.append('populate', '*');
    
    const url = `/newsrooms${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await strapiAPI.get<StrapiResponse<Article>>(url);
    
    const articles = response.data.data.map((news: any) => {
      // 调试日志：打印Newsroom数据结构
      console.log('Raw newsroom data:', {
        id: news.id,
        title: news.title || news.attributes?.title,
        hasAttributes: !!news.attributes,
        cover: news.cover || news.attributes?.cover
      });
      
      // 处理数据结构
      if (news.attributes) {
        return {
          documentId: news.documentId,
          title: news.attributes.title,
          slug: news.attributes.slug,
          description: news.attributes.description,
          content: news.attributes.content,
          cover: news.attributes.cover,
          author: news.attributes.author,
          category: news.attributes.category,
          blocks: news.attributes.blocks,
          locale: news.locale,
          createdAt: news.attributes.createdAt,
          updatedAt: news.attributes.updatedAt,
          publishedAt: news.attributes.publishedAt,
        };
      } else {
        return {
          documentId: news.documentId,
          title: news.title,
          slug: news.slug,
          description: news.description,
          content: news.content,
          cover: news.cover,
          author: news.author,
          category: news.category,
          blocks: news.blocks,
          locale: news.locale,
          createdAt: news.createdAt,
          updatedAt: news.updatedAt,
          publishedAt: news.publishedAt,
        };
      }
    });
    
    console.log(`✅ 成功获取 ${articles.length} 条Newsroom数据`);
    return articles;
  } catch (error: any) {
    console.error('❌ 获取Newsroom数据失败:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });
    
    // 如果是403错误且使用了locale参数，尝试不使用locale重新请求
    if (error.response?.status === 403 && locale !== 'en') {
      console.warn('🔒 403 error with locale, trying fallback to English...');
      try {
        return await getNewsroom(limit, 'en');
      } catch (fallbackError) {
        console.error('Fallback request also failed:', fallbackError);
      }
    }
    
    return [];
  }
};

// 获取单个sector by artcileId
export const getSectorById = async (artcileId: string): Promise<Sector | null> => {
  try {
    // 先尝试获取所有sectors，然后在客户端筛选
    const allSectors = await getSectors();
    const sector = allSectors.find(s => s.artcileId === artcileId);
    
    console.log('Finding sector by artcileId:', artcileId, 'Found:', !!sector);
    
    return sector || null;
  } catch (error: any) {
    console.error('Error fetching sector by ID:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    
    return null;
  }
};

// 根据documentId获取Sector - Strapi 5版本
export const getSectorByDocumentId = async (documentId: string, locale: string = 'en'): Promise<Sector | null> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (locale && locale !== 'en') {
      queryParams.append('locale', locale);
    }
    
    const url = `/sectors/${documentId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await strapiAPI.get<StrapiSingleResponse<Sector>>(url);
    
    if (!response.data.data) {
      return null;
    }
    
    const sector = response.data.data;
    
    return {
      id: sector.id,
      documentId: sector.documentId,
      title: sector.title,
      date: sector.date,
      content: sector.content,
      source: sector.source,
      descript: sector.descript,
      artcileId: sector.artcileId,
      type: sector.type,
      attach: sector.attach,
      locale: sector.locale,
      createdAt: sector.createdAt,
      updatedAt: sector.updatedAt,
      publishedAt: sector.publishedAt,
    } as Sector;
  } catch (error) {
    console.error('Error fetching sector by documentId:', error);
    return null;
  }
};

// 根据articleId和语言获取对应的sector
export const getSectorByArticleIdAndLanguage = async (artcileId: string, language: string): Promise<Sector | null> => {
  try {
    const sectors = await getSectors(undefined, language);
    return sectors.find(sector => sector.artcileId === artcileId) || null;
  } catch (error) {
    console.error('Error fetching sector by articleId and language:', error);
    return null;
  }
};

export default strapiAPI; 