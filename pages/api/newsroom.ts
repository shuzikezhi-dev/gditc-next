import { NextApiRequest, NextApiResponse } from 'next'
import { getNewsroom } from '../../lib/strapi'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { locale = 'en' } = req.query
    
    console.log(`🔄 API: 获取Newsroom数据 (${locale})...`)
    
    const articles = await getNewsroom(undefined, locale as string)
    
    // 清理undefined值，防止序列化错误
    const serializedArticles = JSON.parse(JSON.stringify(articles || []))
    
    console.log(`✅ API: 成功获取 ${serializedArticles.length} 条Newsroom数据`)
    
    res.status(200).json(serializedArticles)
  } catch (error) {
    console.error('❌ API: 获取Newsroom数据失败:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
} 