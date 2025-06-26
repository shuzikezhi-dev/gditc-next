import type { AppProps } from 'next/app';
import { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/router';
import '../styles/globals.css';

// 创建语言上下文
interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [language, setLanguage] = useState(() => {
    // 从路径中提取语言
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      if (pathname.startsWith('/zh-Hans')) return 'zh-Hans';
      if (pathname.startsWith('/en')) return 'en';
    }
    return 'en';
  });

  // 监听路由变化，同步语言设置
  useEffect(() => {
    const pathname = router.pathname;
    if (pathname.startsWith('/zh-Hans')) {
      setLanguage('zh-Hans');
    } else if (pathname.startsWith('/en')) {
      setLanguage('en');
    } else {
      setLanguage('en');
    }
  }, [router.pathname]);

  // 语言切换处理函数
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    
    // 手动处理语言路由切换
    const currentPath = router.asPath;
    let newPath = currentPath;
    
    // 移除当前语言前缀
    if (currentPath.startsWith('/zh-Hans')) {
      newPath = currentPath.replace('/zh-Hans', '');
    } else if (currentPath.startsWith('/en')) {
      newPath = currentPath.replace('/en', '');
    }
    
    // 添加新语言前缀
    newPath = `/${newLanguage}${newPath}`;
    
    router.push(newPath);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleLanguageChange }}>
      <Component {...pageProps} />
    </LanguageContext.Provider>
  );
} 