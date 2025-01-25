import { createContext, useContext, useEffect, useState, useCallback } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  const handleThemeChange = useCallback((newTheme: Theme) => {
    // Check if browser supports View Transitions API
    if (document.startViewTransition) {
      document.documentElement.classList.add('theme-changing')

      const transition = document.startViewTransition(() => {
        localStorage.setItem(storageKey, newTheme)
        setTheme(newTheme)
      })

      transition.finished.then(() => {
        document.documentElement.classList.remove('theme-changing')
      })
    } else {
      localStorage.setItem(storageKey, newTheme)
      setTheme(newTheme)
    }
  }, [storageKey])

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove("light", "dark")

    // In preview page, we always use light theme
    const isPreviewPage = window.location.pathname.startsWith('/preview/')
    if (isPreviewPage) {
      root.classList.add("light")
      return
    }

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const value = {
    theme,
    setTheme: handleThemeChange,
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
