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
  if (token && token !== 'your_readonly_token_here') {
    config.headers.Authorization = `Bearer ${token}`;
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

// 响应数据类型定义
export interface StrapiResponse<T> {
  data: {
    id: number;
    attributes: T;
  }[];
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
  data: {
    id: number;
    attributes: T;
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
    data: {
      attributes: {
        url: string;
        alternativeText?: string;
      };
    };
  };
}

export interface Article {
  title: string;
  slug: string;
  description: string;
  cover?: {
    data: {
      attributes: {
        url: string;
        alternativeText?: string;
      };
    };
  };
  author?: {
    data: {
      attributes: {
        name: string;
        email: string;
      };
    };
  };
  category?: {
    data: {
      attributes: {
        name: string;
        slug: string;
      };
    };
  };
  blocks?: any[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Sector {
  id?: number;
  title: string;
  date: string;
  content: string;
  source?: string;
  descript?: string;
  artcileId?: string;
  type: 'Network' | 'Datacenter' | 'Data' | 'Cloud' | 'AI' | 'Security';
  attach?: {
    data: {
      attributes: {
        url: string;
        alternativeText?: string;
      };
    }[];
  };
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface Event {
  title: string;
  date: string;
  content: string;
  location?: string;
  type?: string;
  featured_image?: {
    data: {
      attributes: {
        url: string;
        alternativeText?: string;
      };
    };
  };
}

export interface Resource {
  title: string;
  content: string;
  type?: string;
  attachments?: {
    data: {
      attributes: {
        url: string;
        name: string;
        ext: string;
      };
    }[];
  };
}

export interface About {
  title: string;
  blocks?: any[];
}

export interface Global {
  siteName: string;
  siteDescription: string;
  logo?: {
    data: {
      attributes: {
        url: string;
        alternativeText?: string;
      };
    };
  };
  favicon?: {
    data: {
      attributes: {
        url: string;
      };
    };
  };
}

// 获取页面内容
export const getPageContent = async (slug: string): Promise<Page | null> => {
  try {
    const response = await strapiAPI.get<StrapiResponse<Page>>(
      `/pages?filters[slug][$eq]=${slug}&populate=*`
    );
    
    if (response.data.data.length === 0) {
      return null;
    }
    
    return response.data.data[0].attributes;
  } catch (error) {
    console.error('Error fetching page content:', error);
    return null;
  }
};

// 获取所有页面（用于静态路径生成）
export const getAllPages = async (): Promise<{ slug: string }[]> => {
  try {
    const response = await strapiAPI.get<StrapiResponse<{ slug: string }>>(
      '/pages?fields[0]=slug'
    );
    
    return response.data.data.map((page: { attributes: { slug: string } }) => ({
      slug: page.attributes.slug,
    }));
  } catch (error) {
    console.error('Error fetching all pages:', error);
    return [];
  }
};

// 获取文章列表
export const getArticles = async (limit?: number): Promise<Article[]> => {
  try {
    const queryParams = limit 
      ? `?pagination[limit]=${limit}&populate=*&sort=publishedAt:desc` 
      : '?populate=*&sort=publishedAt:desc';
    const response = await strapiAPI.get<StrapiResponse<Article>>(
      `/articles${queryParams}`
    );
    
    return response.data.data.map((article: { attributes: Article }) => article.attributes);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
};

// 根据slug获取文章
export const getArticleBySlug = async (slug: string): Promise<Article | null> => {
  try {
    const response = await strapiAPI.get<StrapiResponse<Article>>(
      `/articles?filters[slug][$eq]=${slug}&populate=*`
    );
    
    if (response.data.data.length === 0) {
      return null;
    }
    
    return response.data.data[0].attributes;
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
    
    return response.data.data.map((article: { attributes: { slug: string } }) => ({
      slug: article.attributes.slug,
    }));
  } catch (error) {
    console.error('Error fetching all articles:', error);
    return [];
  }
};

// 获取板块信息
export const getSectors = async (type?: string, locale: string = 'en'): Promise<Sector[]> => {
  try {
    // 简化查询参数，减少过度筛选
    const params = new URLSearchParams();
    params.append('populate', '*');
    params.append('sort', 'date:desc');
    
    // 暂时不使用locale筛选，因为可能导致数据过滤过度
    // params.append('locale', locale);
    
    // 暂时不使用type筛选，在前端进行筛选
    // if (type) {
    //   params.append('filters[type][$eq]', type);
    // }
    
    const queryString = params.toString();
    console.log('Fetching sectors with URL:', `${strapiAPI.defaults.baseURL}/sectors?${queryString}`);
    
    const response = await strapiAPI.get(`/sectors?${queryString}`);
    
    console.log('Sectors API response:', {
      status: response.status,
      dataLength: response.data.data?.length || 0,
      allData: response.data.data,
      firstItem: response.data.data?.[0] || null
    });
    
    if (!response.data.data || !Array.isArray(response.data.data)) {
      console.warn('Invalid sectors data structure:', response.data);
      return [];
    }
    
    // 修复数据结构映射
    let sectors = response.data.data.map((sector: any) => {
      // 检查是否有attributes结构（标准Strapi格式）
      if (sector.attributes) {
        return {
          ...sector.attributes,
          id: sector.id
        };
      } else {
        // 直接使用sector对象（当前API返回的格式）
        return {
          id: sector.id,
          title: sector.title,
          date: sector.date,
          content: sector.content,
          source: sector.source,
          descript: sector.descript,
          artcileId: sector.artcileId,
          type: sector.type,
          attach: sector.attach,
          createdAt: sector.createdAt,
          updatedAt: sector.updatedAt,
          publishedAt: sector.publishedAt
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
    
    // 如果是认证错误，返回空数组而不是假数据
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn('🔒 Authentication error. Please check your API token.');
      return [];
    }
    
    return [];
  }
};

// 获取事件列表
export const getEvents = async (limit?: number): Promise<Event[]> => {
  try {
    const queryParams = limit 
      ? `?pagination[limit]=${limit}&populate=*&sort=date:desc`
      : '?populate=*&sort=date:desc';
    const response = await strapiAPI.get<StrapiResponse<Event>>(
      `/events${queryParams}`
    );
    
    return response.data.data.map((event: { attributes: Event }) => event.attributes);
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

// 获取资源列表
export const getResources = async (type?: string): Promise<Resource[]> => {
  try {
    const queryParams = type 
      ? `?filters[type][$eq]=${type}&populate=*`
      : '?populate=*';
    const response = await strapiAPI.get<StrapiResponse<Resource>>(
      `/resources${queryParams}`
    );
    
    return response.data.data.map((resource: { attributes: Resource }) => resource.attributes);
  } catch (error) {
    console.error('Error fetching resources:', error);
    return [];
  }
};

// 获取关于我们信息
export const getAbout = async (): Promise<About | null> => {
  try {
    const response = await strapiAPI.get<StrapiSingleResponse<About>>(
      '/about?populate=*'
    );
    
    return response.data.data.attributes;
  } catch (error) {
    console.error('Error fetching about:', error);
    return null;
  }
};

// 获取全局设置
export const getGlobal = async (): Promise<Global | null> => {
  try {
    const response = await strapiAPI.get<StrapiSingleResponse<Global>>(
      '/global?populate=*'
    );
    
    return response.data.data.attributes;
  } catch (error) {
    console.error('Error fetching global settings:', error);
    return null;
  }
};

// 获取新闻资讯
export const getNewsroom = async (limit?: number): Promise<Article[]> => {
  try {
    const queryParams = limit 
      ? `?pagination[limit]=${limit}&populate=*&sort=publishedAt:desc`
      : '?populate=*&sort=publishedAt:desc';
    const response = await strapiAPI.get<StrapiResponse<Article>>(
      `/newsroom${queryParams}`
    );
    
    return response.data.data.map((news: { attributes: Article }) => news.attributes);
  } catch (error) {
    console.error('Error fetching newsroom:', error);
    return [];
  }
};

export default strapiAPI; 