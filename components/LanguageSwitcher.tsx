import { useState, useEffect } from 'react';

interface LanguageSwitcherProps {
  currentLanguage?: string;
  onLanguageChange?: (language: string) => void;
}

const LanguageSwitcher = ({ currentLanguage = 'en', onLanguageChange }: LanguageSwitcherProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'zh-Hans', name: '中文' }
  ];

  // 根据语言代码获取显示名称
  const getLanguageName = (code: string) => {
    const lang = languages.find(l => l.code === code);
    return lang ? lang.name : 'English';
  };

  // 当外部语言状态改变时更新内部状态
  useEffect(() => {
    setSelectedLanguage(currentLanguage);
  }, [currentLanguage]);

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    setIsDropdownOpen(false);
    
    // 调用外部回调函数
    if (onLanguageChange) {
      onLanguageChange(languageCode);
    }
    
    // 保存到localStorage
    localStorage.setItem('preferred-language', languageCode);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black text-white py-2">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {/* 会员登录入口 */}
          <a href="/signup" className="text-sm text-white hover:text-gray-300 flex items-center transition-colors">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            Sign Up
          </a>
          <a href="/signin" className="text-sm text-white hover:text-gray-300 flex items-center transition-colors">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1"></path>
            </svg>
            Sign In
          </a>
        </div>

        <div className="flex items-center space-x-6">
          {/* 多语言切换 */}
          <div className="relative">
            <button 
              className="text-sm text-white hover:text-gray-300 flex items-center transition-colors"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129">
                </path>
              </svg>
              {getLanguageName(selectedLanguage)}
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-32 bg-gray-800 rounded-md shadow-lg border border-gray-700">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    className={`block w-full text-left px-4 py-2 text-sm transition-colors first:rounded-t-md last:rounded-b-md ${
                      selectedLanguage === language.code 
                        ? 'text-white bg-gray-700' 
                        : 'text-white hover:bg-gray-700'
                    }`}
                    onClick={() => handleLanguageChange(language.code)}
                  >
                    {language.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LanguageSwitcher; 