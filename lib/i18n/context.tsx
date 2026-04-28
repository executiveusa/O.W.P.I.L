"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type Locale = "en" | "es" | "sr"

interface LocaleConfig {
  code: Locale
  name: string
  nativeName: string
  flag: string
}

export const locales: LocaleConfig[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇲🇽" },
  { code: "sr", name: "Serbian", nativeName: "Srpski", flag: "🇷🇸" },
]

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en")

  useEffect(() => {
    const saved = localStorage.getItem("owpil-locale") as Locale
    if (saved && ["en", "es", "sr"].includes(saved)) {
      setLocaleState(saved)
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem("owpil-locale", newLocale)
  }

  const t = (key: string): string => {
    const keys = key.split(".")
    let value: unknown = translations[locale]
    
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = (value as Record<string, unknown>)[k]
      } else {
        // Fallback to English
        value = translations.en
        for (const fallbackKey of keys) {
          if (value && typeof value === "object" && fallbackKey in value) {
            value = (value as Record<string, unknown>)[fallbackKey]
          } else {
            return key
          }
        }
        break
      }
    }
    
    return typeof value === "string" ? value : key
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}

// Translations
const translations: Record<Locale, Record<string, unknown>> = {
  en: {
    nav: {
      journey: "Journey",
      gallery: "Gallery",
      philosophy: "Philosophy",
      connect: "Connect",
    },
    hero: {
      tagline: "One Without Purpose Is Lost",
      subtitle: "Artist • Storyteller • Creator",
      scroll: "Scroll to explore",
    },
    timeline: {
      title: "The Journey",
      past: {
        title: "The Past",
        subtitle: "Where it all began",
        description: "Growing up with a vision, finding purpose through anime and art.",
      },
      present: {
        title: "The Present",
        subtitle: "Living the dream",
        description: "Traveling the world, capturing moments, sharing stories.",
      },
      future: {
        title: "The Future",
        subtitle: "What lies ahead",
        description: "Building a legacy, inspiring others to find their purpose.",
      },
    },
    gallery: {
      title: "Gallery",
      subtitle: "Moments captured across the world",
      viewAll: "View All",
      categories: {
        all: "All",
        travel: "Travel",
        art: "Art",
        anime: "Anime",
      },
    },
    philosophy: {
      title: "Philosophy",
      subtitle: "Core beliefs that guide the journey",
      cards: {
        purpose: {
          title: "Purpose",
          description: "Without purpose, we wander aimlessly. Find yours and let it guide every step.",
        },
        growth: {
          title: "Growth",
          description: "Every challenge is an opportunity. Embrace discomfort as the path to evolution.",
        },
        authenticity: {
          title: "Authenticity",
          description: "Be unapologetically yourself. The world needs your unique perspective.",
        },
        legacy: {
          title: "Legacy",
          description: "What you create outlives you. Build something that matters.",
        },
      },
    },
    connect: {
      title: "Connect",
      subtitle: "Join the journey",
      newsletter: {
        title: "Stay Updated",
        placeholder: "Enter your email",
        button: "Subscribe",
        success: "Welcome to the journey!",
      },
      social: {
        title: "Follow Along",
      },
    },
    footer: {
      rights: "All rights reserved",
      tagline: "One Without Purpose Is Lost",
    },
  },
  es: {
    nav: {
      journey: "Viaje",
      gallery: "Galería",
      philosophy: "Filosofía",
      connect: "Conectar",
    },
    hero: {
      tagline: "Uno Sin Propósito Está Perdido",
      subtitle: "Artista • Narrador • Creador",
      scroll: "Desplázate para explorar",
    },
    timeline: {
      title: "El Viaje",
      past: {
        title: "El Pasado",
        subtitle: "Donde todo comenzó",
        description: "Creciendo con una visión, encontrando propósito a través del anime y el arte.",
      },
      present: {
        title: "El Presente",
        subtitle: "Viviendo el sueño",
        description: "Viajando por el mundo, capturando momentos, compartiendo historias.",
      },
      future: {
        title: "El Futuro",
        subtitle: "Lo que viene",
        description: "Construyendo un legado, inspirando a otros a encontrar su propósito.",
      },
    },
    gallery: {
      title: "Galería",
      subtitle: "Momentos capturados alrededor del mundo",
      viewAll: "Ver Todo",
      categories: {
        all: "Todo",
        travel: "Viajes",
        art: "Arte",
        anime: "Anime",
      },
    },
    philosophy: {
      title: "Filosofía",
      subtitle: "Creencias fundamentales que guían el viaje",
      cards: {
        purpose: {
          title: "Propósito",
          description: "Sin propósito, vagamos sin rumbo. Encuentra el tuyo y deja que guíe cada paso.",
        },
        growth: {
          title: "Crecimiento",
          description: "Cada desafío es una oportunidad. Abraza la incomodidad como el camino hacia la evolución.",
        },
        authenticity: {
          title: "Autenticidad",
          description: "Sé tú mismo sin disculpas. El mundo necesita tu perspectiva única.",
        },
        legacy: {
          title: "Legado",
          description: "Lo que creas te sobrevive. Construye algo que importe.",
        },
      },
    },
    connect: {
      title: "Conectar",
      subtitle: "Únete al viaje",
      newsletter: {
        title: "Mantente Actualizado",
        placeholder: "Ingresa tu correo",
        button: "Suscribirse",
        success: "¡Bienvenido al viaje!",
      },
      social: {
        title: "Síguenos",
      },
    },
    footer: {
      rights: "Todos los derechos reservados",
      tagline: "Uno Sin Propósito Está Perdido",
    },
  },
  sr: {
    nav: {
      journey: "Putovanje",
      gallery: "Galerija",
      philosophy: "Filozofija",
      connect: "Kontakt",
    },
    hero: {
      tagline: "Onaj Bez Svrhe Je Izgubljen",
      subtitle: "Umetnik • Pripovedač • Kreator",
      scroll: "Skroluj da istražiš",
    },
    timeline: {
      title: "Putovanje",
      past: {
        title: "Prošlost",
        subtitle: "Gde je sve počelo",
        description: "Odrastanje sa vizijom, pronalaženje svrhe kroz anime i umetnost.",
      },
      present: {
        title: "Sadašnjost",
        subtitle: "Živeti san",
        description: "Putovanje svetom, hvatanje trenutaka, deljenje priča.",
      },
      future: {
        title: "Budućnost",
        subtitle: "Šta nas čeka",
        description: "Graditi nasleđe, inspirisati druge da pronađu svoju svrhu.",
      },
    },
    gallery: {
      title: "Galerija",
      subtitle: "Trenuci uhvaćeni širom sveta",
      viewAll: "Pogledaj Sve",
      categories: {
        all: "Sve",
        travel: "Putovanja",
        art: "Umetnost",
        anime: "Anime",
      },
    },
    philosophy: {
      title: "Filozofija",
      subtitle: "Osnovna uverenja koja vode putovanje",
      cards: {
        purpose: {
          title: "Svrha",
          description: "Bez svrhe, lutamo besciljno. Pronađi svoju i neka vodi svaki tvoj korak.",
        },
        growth: {
          title: "Rast",
          description: "Svaki izazov je prilika. Prihvati nelagodnost kao put ka evoluciji.",
        },
        authenticity: {
          title: "Autentičnost",
          description: "Budi bez izvinjenja ono što jesi. Svetu je potrebna tvoja jedinstvena perspektiva.",
        },
        legacy: {
          title: "Nasleđe",
          description: "Ono što stvaraš nadživljuje te. Izgradi nešto što je važno.",
        },
      },
    },
    connect: {
      title: "Kontakt",
      subtitle: "Pridruži se putovanju",
      newsletter: {
        title: "Budi U Toku",
        placeholder: "Unesi svoj email",
        button: "Pretplati se",
        success: "Dobrodošao na putovanje!",
      },
      social: {
        title: "Prati Nas",
      },
    },
    footer: {
      rights: "Sva prava zadržana",
      tagline: "Onaj Bez Svrhe Je Izgubljen",
    },
  },
}
