import { NextPageContext } from 'next';
import useLanguageSwitcher, { LanguageDescriptor } from '@/hooks/useLanguageSwitcher';

export type LanguageSwitcherProps = {
  context?: NextPageContext;
};

export const LanguageSwitcher = ({ context }: LanguageSwitcherProps = {}) => {
  const { currentLanguage, switchLanguage, languageConfig } = useLanguageSwitcher({ context });

  console.log('currentLanguage', currentLanguage);
  console.log('languageConfig', languageConfig);

  return (
    <div className="text-center notranslate">
      {languageConfig.languages.map((ld: LanguageDescriptor, i: number) => (
        <>
          {currentLanguage === ld.name || (currentLanguage === 'auto' && languageConfig.defaultLanguage === ld.name) ? (
            <span key={`l_s_${ld}`} className="mx-3 text-orange-300">
              {ld.title}
            </span>
          ) : (
            <a key={`l_s_${ld}`} onClick={switchLanguage(ld.name)} className="mx-3 text-blue-300 cursor-pointer hover:underline">
              {ld.title}
            </a>
          )}
        </>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
