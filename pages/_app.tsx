import type { AppProps } from 'next/app';
import { useState, useEffect, createContext, useContext } from 'react';
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
  const [language, setLanguage] = useState('en');

  // 初始化语言设置
  useEffect(() => {
    // 从localStorage获取保存的语言设置
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  // 语言切换处理函数
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleLanguageChange }}>
      <Component {...pageProps} />
    </LanguageContext.Provider>
  );
} 