"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Smartphone, Download, X, Share } from "lucide-react"

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Detecta se já está rodando como app instalado
    const isApp = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone
    setIsStandalone(Boolean(isApp))

    // Detecta se é iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase()
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent)
    setIsIOS(isIosDevice)

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // Se for iOS e não estiver instalado, mostra após alguns segundos
    if (isIosDevice && !isApp) {
      const timer = setTimeout(() => setShowPrompt(true), 3000)
      return () => clearTimeout(timer)
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      if (isIOS) {
        alert("No iPhone/iPad: Toque no botão 'Compartilhar' (ícone de quadrado com seta para cima) no Safari e selecione 'Adicionar à Tela de Início'.")
      }
      return
    }

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setShowPrompt(false)
    }
    setDeferredPrompt(null)
  }

  if (isStandalone || !showPrompt) return null

  return (
    <div className="fixed top-4 right-4 left-4 md:left-auto md:w-96 z-50 bg-white dark:bg-zinc-900 border border-primary/20 rounded-2xl shadow-xl p-4 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-primary/10 text-primary rounded-xl shrink-0">
          <Smartphone className="h-6 w-6" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-foreground">Instalar RoçaCtrl no Celular</h4>
          <p className="text-[11px] text-muted-foreground">Acesse offline e direto da sua tela inicial.</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <Button
          size="sm"
          className="h-8 text-xs bg-primary hover:bg-primary/90 text-white gap-1"
          onClick={handleInstallClick}
        >
          {isIOS ? <Share className="h-3.5 w-3.5" /> : <Download className="h-3.5 w-3.5" />}
          {isIOS ? "Como Instalar" : "Instalar"}
        </Button>
        <button
          onClick={() => setShowPrompt(false)}
          className="text-muted-foreground hover:text-foreground p-1 rounded-full"
          title="Fechar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
