const axios = require('axios');

/**
 * CDN测试脚本
 * 验证CDN配置是否正常工作
 */

const CDN_BASE_URL = 'https://cdn.gditc.org';
const STRAPI_BASE_URL = 'https://wonderful-serenity-47deffe3a2.strapiapp.com';

async function testCDN() {
  console.log('🚀 开始CDN测试...\n');

  // 测试URLs - 可以根据实际情况调整
  const testPaths = [
    '/uploads/', // 基础路径测试
    // 可以添加更多实际的图片路径
  ];

  for (const path of testPaths) {
    const cdnUrl = `${CDN_BASE_URL}${path}`;
    const originalUrl = `${STRAPI_BASE_URL}${path}`;

    console.log(`测试路径: ${path}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // 测试CDN URL
    await testUrl(cdnUrl, 'CDN');
    
    // 测试原始URL
    await testUrl(originalUrl, '原始');
    
    console.log('');
  }

  console.log('✅ CDN测试完成！');
}

async function testUrl(url, type) {
  try {
    const start = Date.now();
    const response = await axios.head(url, { 
      timeout: 10000,
      validateStatus: function (status) {
        return status < 500; // 接受所有非5xx状态码
      }
    });
    const duration = Date.now() - start;
    
    console.log(`${getStatusIcon(response.status)} ${type} URL: ${url}`);
    console.log(`   状态码: ${response.status}`);
    console.log(`   响应时间: ${duration}ms`);
    
    // Cloudflare特有的响应头
    const cfHeaders = {
      'CF-Cache-Status': response.headers['cf-cache-status'],
      'CF-Ray': response.headers['cf-ray'],
      'Server': response.headers['server'],
    };
    
    Object.entries(cfHeaders).forEach(([key, value]) => {
      if (value) {
        console.log(`   ${key}: ${value}`);
      }
    });
    
  } catch (error) {
    console.log(`❌ ${type} URL: ${url}`);
    console.log(`   错误: ${error.message}`);
    if (error.code === 'ENOTFOUND') {
      console.log(`   提示: DNS解析失败，请检查域名配置`);
    }
  }
}

function getStatusIcon(status) {
  if (status >= 200 && status < 300) {
    return '✅';
  } else if (status >= 300 && status < 400) {
    return '🔄';
  } else if (status >= 400 && status < 500) {
    return '⚠️';
  } else {
    return '❌';
  }
}

/**
 * 测试图片转换功能
 */
async function testImageConversion() {
  console.log('\n🖼️ 测试图片URL转换...\n');

  const testUrls = [
    '/uploads/sample.jpg',
    'https://wonderful-serenity-47deffe3a2.strapiapp.com/uploads/test.png',
    'https://cdn.gditc.org/uploads/already-cdn.webp'
  ];

  // 模拟convertToCDN函数
  const convertToCDN = (url) => {
    if (!url) return '';
    
    if (url.startsWith('/uploads/')) {
      return `${CDN_BASE_URL}${url}`;
    }
    
    if (url.includes('wonderful-serenity-47deffe3a2.strapiapp.com')) {
      return url.replace('wonderful-serenity-47deffe3a2.strapiapp.com', 'cdn.gditc.org');
    }
    
    return url;
  };

  testUrls.forEach(url => {
    const converted = convertToCDN(url);
    console.log(`原始: ${url}`);
    console.log(`转换: ${converted}`);
    console.log(`✅ ${url === converted ? '无需转换' : '转换成功'}`);
    console.log('');
  });
}

/**
 * 检查DNS解析
 */
async function checkDNS() {
  console.log('\n🌐 检查DNS解析...\n');
  
  try {
    const response = await axios.get(`${CDN_BASE_URL}/`, {
      timeout: 5000,
      validateStatus: () => true
    });
    
    console.log('✅ DNS解析正常');
    console.log(`   响应状态: ${response.status}`);
    
    if (response.headers['cf-ray']) {
      console.log('✅ Cloudflare代理正常工作');
      console.log(`   CF-Ray: ${response.headers['cf-ray']}`);
    }
    
  } catch (error) {
    console.log('❌ DNS解析失败');
    console.log(`   错误: ${error.message}`);
    
    if (error.code === 'ENOTFOUND') {
      console.log('\n🔧 故障排除建议:');
      console.log('   1. 检查Cloudflare中的CNAME记录是否正确');
      console.log('   2. 确认代理状态已启用（橙色云朵）');
      console.log('   3. 等待DNS传播完成（可能需要24-48小时）');
    }
  }
}

// 主函数
async function main() {
  console.log('🏗️ DITC CDN配置测试工具');
  console.log('═══════════════════════════════════════\n');

  await checkDNS();
  await testImageConversion();
  await testCDN();

  console.log('\n📊 测试总结:');
  console.log('═══════════════════════════════════════');
  console.log('如果所有测试都通过，CDN配置应该正常工作。');
  console.log('如果有错误，请参考故障排除部分。');
}

// 运行测试
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  testCDN,
  testImageConversion,
  checkDNS
}; 