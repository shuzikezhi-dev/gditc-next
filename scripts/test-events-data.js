#!/usr/bin/env node

// 加载环境变量
require('./load-env').setEnvVars();

// 使用 axios 直接调用 API
const axios = require('axios');

async function getEvents(limit, locale = 'en') {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  if (!strapiUrl) {
    throw new Error('NEXT_PUBLIC_STRAPI_API_URL not configured');
  }

  const queryParams = new URLSearchParams();
  
  if (locale && locale !== 'en') {
    queryParams.append('locale', locale);
  }
  
  // 设置默认 limit 为 100 确保获取所有数据
  const actualLimit = limit || 100;
  queryParams.append('pagination[limit]', actualLimit.toString());
  
  queryParams.append('sort', 'date:desc');
  queryParams.append('populate', '*');
  
  const url = `${strapiUrl}/events?${queryParams.toString()}`;
  
  console.log(`🌐 Events API URL: ${url}`);
  console.log(`🔍 查询参数:`, Object.fromEntries(queryParams.entries()));
  
  const response = await axios.get(url);
  
  const events = response.data.data || [];
  console.log(`📊 API 返回分页信息:`, response.data.meta?.pagination);
  console.log(`✅ 获取到 ${events.length} 条 Events 数据`);
  
  return events;
}

async function testEventsData() {
  console.log('🧪 开始测试 Events 数据获取...\n');
  
  try {
    // 测试英文数据
    console.log('📝 测试英文 Events 数据:');
    const eventsEn = await getEvents(undefined, 'en');
    console.log(`✅ 英文 Events 数量: ${eventsEn.length}`);
    
    if (eventsEn.length > 0) {
      console.log('📋 英文 Events 列表:');
      eventsEn.forEach((event, index) => {
        console.log(`  ${index + 1}. ${event.attributes?.title || event.title} (ID: ${event.id || event.documentId})`);
      });
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // 测试中文数据
    console.log('📝 测试中文 Events 数据:');
    const eventsZh = await getEvents(undefined, 'zh-Hans');
    console.log(`✅ 中文 Events 数量: ${eventsZh.length}`);
    
    if (eventsZh.length > 0) {
      console.log('📋 中文 Events 列表:');
      eventsZh.forEach((event, index) => {
        console.log(`  ${index + 1}. ${event.attributes?.title || event.title} (ID: ${event.id || event.documentId})`);
      });
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // 测试带 limit 参数
    console.log('📝 测试带 limit=5 的 Events 数据:');
    const eventsLimited = await getEvents(5, 'en');
    console.log(`✅ 限制数量 Events: ${eventsLimited.length}`);
    
    console.log('\n🎉 Events 数据测试完成!');
    
  } catch (error) {
    console.error('❌ Events 数据测试失败:', error);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  testEventsData();
}

module.exports = testEventsData;
