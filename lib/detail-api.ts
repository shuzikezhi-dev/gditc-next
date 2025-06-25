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
  
  if (token && token !== 'your_readonly_token_here' && token !== 'your_api_token_here') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 详情页面内容接口
export interface DetailContent {
  id: number;
  documentId: string;
  title: string;
  slug?: string;
  description?: string;
  content: string;
  locale: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  cover?: {
    id: number;
    documentId: string;
    name: string;
    alternativeText?: string;
    url: string;
    formats?: {
      small?: { url: string };
      thumbnail?: { url: string };
    };
  } | null;
  author?: any;
  category?: any;
  type?: string;
  date?: string;
  source?: string;
  descript?: string;
  artcileId?: string;
  attach?: any;
}

// 获取详情页面的多种方案
export class DetailPageService {
  
  /**
   * 方案1: 使用documentId直接获取详情（推荐）
   */
  static async getByDocumentId(
    contentType: string, 
    documentId: string, 
    locale: string = 'en'
  ): Promise<DetailContent | null> {
    try {
      console.log(`🔍 [方案1] 尝试获取详情: ${contentType}/${documentId} (${locale})`);
      
      const response = await strapiAPI.get(
        `/${contentType}/${documentId}?locale=${locale}&populate=*`
      );
      
      if (response.data?.data) {
        console.log('✅ [方案1] 成功获取详情');
        return response.data.data;
      }
      
      console.log('❌ [方案1] 未找到数据');
      return null;
    } catch (error: any) {
      console.log('❌ [方案1] 失败:', error.response?.status, error.message);
      return null;
    }
  }

  /**
   * 方案2: 查询列表并筛选documentId
   */
  static async getByDocumentIdFilter(
    contentType: string, 
    documentId: string, 
    locale: string = 'en'
  ): Promise<DetailContent | null> {
    try {
      console.log(`🔍 [方案2] 尝试筛选获取详情: ${contentType} documentId=${documentId} (${locale})`);
      
      const response = await strapiAPI.get(
        `/${contentType}?filters[documentId][$eq]=${documentId}&locale=${locale}&populate=*`
      );
      
      if (response.data?.data && response.data.data.length > 0) {
        console.log('✅ [方案2] 成功获取详情');
        return response.data.data[0];
      }
      
      console.log('❌ [方案2] 未找到数据');
      return null;
    } catch (error: any) {
      console.log('❌ [方案2] 失败:', error.response?.status, error.message);
      return null;
    }
  }

  /**
   * 智能获取详情 - 尝试多种方案直到成功
   */
  static async getDetailContent(
    contentType: string,
    identifier: string,
    locale: string = 'en'
  ): Promise<DetailContent | null> {
    console.log(`🚀 开始智能获取详情: ${contentType}/${identifier} (${locale})`);
    
    // 方案1: 尝试documentId直接获取
    let result = await this.getByDocumentId(contentType, identifier, locale);
    if (result) return result;
    
    // 方案2: 尝试documentId筛选
    result = await this.getByDocumentIdFilter(contentType, identifier, locale);
    if (result) return result;
    
    console.log('❌ 所有方案都失败，未找到内容');
    return null;
  }
}

// 便捷函数
export const getDetailContent = (
  contentType: string,
  identifier: string,
  locale: string = 'en'
): Promise<DetailContent | null> => {
  return DetailPageService.getDetailContent(contentType, identifier, locale);
};

// 针对特定内容类型的便捷函数
export const getSectorDetail = (documentId: string, locale: string = 'en') => 
  DetailPageService.getDetailContent('sectors', documentId, locale);

export const getArticleDetail = (documentId: string, locale: string = 'en') => 
  DetailPageService.getDetailContent('articles', documentId, locale);

// 列表获取函数（带语言筛选）
export const getContentList = async (
  contentType: string,
  locale: string = 'en',
  limit?: number
): Promise<DetailContent[]> => {
  try {
    console.log(`📋 获取${contentType}列表 (${locale})`);
    
    let url = `/${contentType}?locale=${locale}&populate=*&sort=publishedAt:desc`;
    if (limit) {
      url += `&pagination[limit]=${limit}`;
    }
    
    const response = await strapiAPI.get(url);
    
    if (response.data?.data) {
      console.log(`✅ 获取到 ${response.data.data.length} 条数据`);
      return response.data.data;
    }
    
    console.log('❌ 未获取到数据');
    return [];
  } catch (error: any) {
    console.log('❌ 获取列表失败:', error.response?.status, error.message);
    return [];
  }
}; 