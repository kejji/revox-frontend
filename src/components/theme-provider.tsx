import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  resolvedTheme: "dark" | "light"
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  resolvedTheme: "light",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>("system")
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">("light")

  useEffect(() => {
    const root = window.document.documentElement
    
    root.classList.remove("light", "dark")

    const applySystemTheme = () => {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"
      
      root.classList.add(systemTheme)
      setResolvedTheme(systemTheme)
    }

    if (theme === "system") {
      applySystemTheme()
      
      // Listen for system theme changes
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      const handleChange = () => {
        root.classList.remove("light", "dark")
        applySystemTheme()
      }
      
      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    }

    root.classList.add(theme)
    setResolvedTheme(theme === "dark" ? "dark" : "light")
  }, [theme])

  const value = {
    theme,
    resolvedTheme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
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