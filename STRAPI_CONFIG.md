# Strapi API 配置说明

## 环境变量设置

在 `.env.local` 文件中添加以下配置：

```bash
# Strapi Configuration
NEXT_PUBLIC_STRAPI_API_URL=https://wonderful-serenity-47deffe3a2.strapiapp.com/api
STRAPI_API_TOKEN=your_api_token_here
```

## 获取API Token

1. 登录到Strapi管理后台
2. 进入 **Settings > API Tokens > Create new API Token**
3. 设置Token名称，选择 **"Read-only"** 类型
4. 复制生成的Token替换 `your_api_token_here`

## 测试API连接

使用提供的Postman集合文件测试API：

1. 在Postman中导入 `DITC-Strapi-API.postman_collection.json`
2. 设置集合变量中的 `api_token` 为你的实际Token
3. 按顺序测试各个接口

## 详情页面路由

新的路由格式：`/{channel}/{documentId}`

支持的频道类型：
- `sectors` - 板块内容
- `articles` - 文章内容  
- `events` - 活动内容
- `resources` - 资源内容
- `newsroom` - 新闻内容

## 多语言支持

系统会自动根据用户的语言设置获取对应语言的内容：
- 英文：`en`
- 中文：`zh-Hans`

## API调用方案

系统使用多重方案确保API调用成功：

1. **方案1**：直接使用documentId获取 `/api/{channel}/{documentId}?locale={locale}`
2. **方案2**：使用过滤器查询 `/api/{channel}?filters[documentId][$eq]={documentId}&locale={locale}`

## 故障排除

### 404错误
1. 检查API Token是否正确设置
2. 检查Strapi服务是否正常运行
3. 检查documentId是否存在
4. 查看控制台日志获取详细错误信息

### API连接失败
1. 确认 `NEXT_PUBLIC_STRAPI_API_URL` 是否正确
2. 确认 `STRAPI_API_TOKEN` 是否有效
3. 检查网络连接
4. 使用Postman集合诊断问题

### 语言切换不生效
1. 确认内容在Strapi中存在对应语言版本
2. 检查i18n插件是否正确配置
3. 确认locale参数传递正确 