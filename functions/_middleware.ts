export async function onRequest(context: any) {
  const { request } = context;
  const url = new URL(request.url);
  
  // 如果访问根路径，重定向到英文首页
  if (url.pathname === '/') {
    return Response.redirect(new URL('/en', request.url), 302);
  }
  
  // 其他请求正常处理
  return context.next();
} 