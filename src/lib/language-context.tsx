'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { storage } from './storage'
import type { Language, TranslationKey } from './translations'
import { translations } from './translations'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('he')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = (storage.getLanguage() || 'he') as Language
    setLanguageState(saved)
    setMounted(true)

    // Update HTML direction
    const dir = saved === 'he' ? 'rtl' : 'ltr'
    document.documentElement.dir = dir
    document.documentElement.lang = saved
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    storage.setLanguage(lang)

    // Update HTML direction immediately
    const dir = lang === 'he' ? 'rtl' : 'ltr'
    document.documentElement.dir = dir
    document.documentElement.lang = lang
  }

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations['he'][key] || key
  }

  // Return default context value with Hebrew language during SSR/build time
  const contextValue = mounted
    ? { language, setLanguage, t }
    : {
        language: 'he' as Language,
        setLanguage: (lang: Language) => {},
        t: (key: TranslationKey) => translations['he'][key] || key,
      }

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    // Return default value for SSR
    return {
      language: 'he' as Language,
      setLanguage: (lang: Language) => {},
      t: (key: TranslationKey) => translations['he'][key] || key,
    }
  }
  return context
}
