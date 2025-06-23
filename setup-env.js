const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');

// 检查是否已存在 .env.local 文件
if (fs.existsSync(envPath)) {
  console.log('✅ .env.local file already exists');
  const content = fs.readFileSync(envPath, 'utf8');
  if (content.includes('STRAPI_API_TOKEN=your_readonly_token_here')) {
    console.log('⚠️  Please update STRAPI_API_TOKEN in .env.local with your actual Strapi readonly token');
  } else {
    console.log('✅ STRAPI_API_TOKEN appears to be configured');
  }
} else {
  // 创建 .env.local 文件
  const envContent = `# Strapi CMS 配置
NEXT_PUBLIC_STRAPI_API_URL=https://wonderful-serenity-47deffe3a2.strapiapp.com/api
STRAPI_API_TOKEN=your_readonly_token_here

# 站点配置
NEXT_PUBLIC_SITE_URL=https://gditc.org
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local file');
  console.log('⚠️  Please update STRAPI_API_TOKEN in .env.local with your actual Strapi readonly token');
}

console.log('\n📝 To get your Strapi API token:');
console.log('1. Go to your Strapi admin panel');
console.log('2. Navigate to Settings > API Tokens');
console.log('3. Create a new token with "Read-only" permissions');
console.log('4. Copy the token and replace "your_readonly_token_here" in .env.local');
console.log('5. Restart your development server'); 