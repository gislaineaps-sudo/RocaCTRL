"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

type FontSize = "normal" | "large" | "x-large"

interface AccessibilityContextType {
  isHighContrast: boolean
  toggleHighContrast: () => void
  fontSize: FontSize
  increaseFontSize: () => void
  decreaseFontSize: () => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [isHighContrast, setIsHighContrast] = useState(false)
  const [fontSize, setFontSize] = useState<FontSize>("normal")

  // Carrega as preferências do localStorage ao montar (apenas no cliente)
  useEffect(() => {
    const savedContrast = localStorage.getItem("roca-high-contrast")
    const savedFont = localStorage.getItem("roca-font-size") as FontSize

    if (savedContrast === "true") setIsHighContrast(true)
    if (savedFont && ["normal", "large", "x-large"].includes(savedFont)) {
      setFontSize(savedFont)
    }
  }, [])

  // Aplica as classes no HTML sempre que o estado mudar
  useEffect(() => {
    const html = document.documentElement

    // Modo Alto Contraste
    if (isHighContrast) {
      html.classList.add("high-contrast")
      localStorage.setItem("roca-high-contrast", "true")
    } else {
      html.classList.remove("high-contrast")
      localStorage.setItem("roca-high-contrast", "false")
    }

    // Tamanho das Fontes
    html.classList.remove("font-scale-large", "font-scale-x-large")
    if (fontSize === "large") {
      html.classList.add("font-scale-large")
    } else if (fontSize === "x-large") {
      html.classList.add("font-scale-x-large")
    }
    localStorage.setItem("roca-font-size", fontSize)
  }, [isHighContrast, fontSize])

  const toggleHighContrast = () => setIsHighContrast((prev) => !prev)

  const increaseFontSize = () => {
    if (fontSize === "normal") setFontSize("large")
    else if (fontSize === "large") setFontSize("x-large")
  }

  const decreaseFontSize = () => {
    if (fontSize === "x-large") setFontSize("large")
    else if (fontSize === "large") setFontSize("normal")
  }

  return (
    <AccessibilityContext.Provider
      value={{
        isHighContrast,
        toggleHighContrast,
        fontSize,
        increaseFontSize,
        decreaseFontSize,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider")
  }
  return context
}
