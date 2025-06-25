import { NextApiRequest, NextApiResponse } from 'next'
import { getNewsroom } from '../../lib/strapi'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { documentId, locale = 'en' } = req.query
    
    if (!documentId) {
      return res.status(400).json({ message: 'documentId is required' })
    }
    
    console.log(`🔄 API: 获取文章详情 (documentId: ${documentId}, locale: ${locale})...`)
    
    const articles = await getNewsroom(undefined, locale as string)
    const article = articles.find(a => a.documentId === documentId)
    
    if (!article) {
      console.warn(`❌ API: 未找到documentId为 "${documentId}" 的文章`)
      return res.status(404).json({ message: 'Article not found' })
    }
    
    // 清理undefined值，防止序列化错误
    const serializedArticle = JSON.parse(JSON.stringify(article))
    
    console.log(`✅ API: 成功获取文章详情: ${article.title}`)
    
    res.status(200).json(serializedArticle)
  } catch (error) {
    console.error('❌ API: 获取文章详情失败:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
} 