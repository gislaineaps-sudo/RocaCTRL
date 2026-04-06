import React, { createContext, useContext, useEffect, useState } from "react"

export type ModuleId = 
  | "animals"
  | "crops"
  | "financial"
  | "categories"
  | "alerts"
  | "iot"
  | "ai-assistant"

export type ModulesState = Record<ModuleId, boolean>

const defaultModules: ModulesState = {
  "animals": true,
  "crops": true,
  "financial": true,
  "categories": true,
  "alerts": true,
  "iot": true,
  "ai-assistant": true,
}

interface PreferencesContextType {
  modules: ModulesState
  toggleModule: (id: ModuleId) => void
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined)

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [modules, setModules] = useState<ModulesState>(defaultModules)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("roca-modules-preferences")
    if (saved) {
      try {
        setModules(JSON.parse(saved))
      } catch (e) {
        console.error("Erro ao carregar preferências de módulos")
      }
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("roca-modules-preferences", JSON.stringify(modules))
    }
  }, [modules, isLoaded])

  const toggleModule = (id: ModuleId) => {
    setModules(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  return (
    <PreferencesContext.Provider value={{ modules, toggleModule }}>
      {children}
    </PreferencesContext.Provider>
  )
}

export function usePreferences() {
  const context = useContext(PreferencesContext)
  if (context === undefined) {
    throw new Error("usePreferences must be used within a PreferencesProvider")
  }
  return context
}
