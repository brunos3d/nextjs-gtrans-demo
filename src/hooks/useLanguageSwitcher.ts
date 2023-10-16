import { useEffect, useState } from 'react';
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import Cookies from 'universal-cookie';
import { NextPageContext } from 'next';

export const COOKIE_NAME = 'googtrans';

export interface LanguageDescriptor {
  name: string;
  title: string;
}

export interface LanguageConfig {
  languages: LanguageDescriptor[];
  defaultLanguage: string;
}

declare global {
  namespace globalThis {
    var __GOOGLE_TRANSLATION_CONFIG__: LanguageConfig;
  }
}

export type UseLanguageSwitcherResult = {
  currentLanguage: string;
  switchLanguage: (lang: string) => () => void;
  languageConfig: LanguageConfig;
};

export type UseLanguageSwitcherOptions = {
  context?: NextPageContext;
};

export const useLanguageSwitcher = ({ context }: UseLanguageSwitcherOptions = {}): UseLanguageSwitcherResult => {
  const [currentLanguage] = useState<string>(() => {
    const cookies = parseCookies(context);
    const existingLanguageCookieValue = cookies[COOKIE_NAME];

    console.log('cookies', cookies);

    let languageValue = '';
    if (existingLanguageCookieValue) {
      const sp = existingLanguageCookieValue.split('/');
      if (sp.length > 2) {
        languageValue = sp[2];
      }
    }
    if (globalThis.__GOOGLE_TRANSLATION_CONFIG__ && !languageValue) {
      languageValue = globalThis.__GOOGLE_TRANSLATION_CONFIG__.defaultLanguage;
    }
    return languageValue;
  });
  const [languageConfig] = useState<LanguageConfig>(() => {
    if (globalThis.__GOOGLE_TRANSLATION_CONFIG__) {
      return globalThis.__GOOGLE_TRANSLATION_CONFIG__;
    }
    return {
      languages: [],
      defaultLanguage: '',
    };
  });

  const switchLanguage = (lang: string) => () => {
    setCookie(context, COOKIE_NAME, '/auto/' + lang);
    window.location.reload();
  };

  return {
    currentLanguage,
    switchLanguage,
    languageConfig,
  };
};

export default useLanguageSwitcher;
