import { NextApiRequest, NextApiResponse } from 'next'
import { getEvents } from '../../lib/strapi'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { locale = 'en' } = req.query
    
    console.log(`🔄 API: 获取Events数据 (${locale})...`)
    
    const events = await getEvents(undefined, locale as string)
    
    // 将Strapi事件转换为带有id的Event类型
    const eventsWithId = events.map((event, index) => ({
      ...event,
      id: event.id || index + 1
    }))
    
    console.log(`✅ API: 成功获取 ${eventsWithId.length} 条Events数据`)
    
    res.status(200).json(eventsWithId)
  } catch (error) {
    console.error('❌ API: 获取Events数据失败:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
} 