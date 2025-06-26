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
  const [language, setLanguage] = useState(router.locale || 'en');

  // 监听路由变化，同步语言设置
  useEffect(() => {
    if (router.locale && router.locale !== language) {
      setLanguage(router.locale);
    }
  }, [router.locale]);

  // 语言切换处理函数
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    
    // 使用Next.js的路由推送来切换语言
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: newLanguage });
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleLanguageChange }}>
      <Component {...pageProps} />
    </LanguageContext.Provider>
  );
} 