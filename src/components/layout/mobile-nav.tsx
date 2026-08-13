"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  PawPrint,
  Sprout,
  Wallet,
  Menu,
  Bell,
  Cpu,
  BrainCircuit,
  Layers,
  Settings,
  X
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function MobileNav() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const mainTabs = [
    { name: "Início", href: "/", icon: LayoutDashboard },
    { name: "Animais", href: "/animals", icon: PawPrint },
    { name: "Culturas", href: "/crops", icon: Sprout },
    { name: "Finanças", href: "/financial", icon: Wallet },
  ]

  const extraTabs = [
    { name: "Banco de Categorias", href: "/categories", icon: Layers, desc: "Espécies e setores" },
    { name: "Tarefas e Alertas", href: "/alerts", icon: Bell, desc: "Rotinas e calendário" },
    { name: "Monitoramento IoT", href: "/iot", icon: Cpu, desc: "Sensores em tempo real" },
    { name: "Assistente IA", href: "/ai-assistant", icon: BrainCircuit, desc: "Consultoria agro inteligente" },
    { name: "Configurações", href: "/settings", icon: Settings, desc: "Preferências e módulos" },
  ]

  return (
    <>
      {/* Barra de Navegação Inferior Fixa (Aparece apenas em telas móveis) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-border/80 shadow-lg px-2 py-1.5 safe-area-pb">
        <div className="flex items-center justify-around">
          {mainTabs.map((tab) => {
            const isActive = pathname === tab.href
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-colors ${
                  isActive ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className={`h-5 w-5 ${isActive ? "text-primary stroke-[2.5]" : ""}`} />
                <span className="text-[10px] mt-0.5">{tab.name}</span>
              </Link>
            )
          })}

          {/* Botão de Menu Mais */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-colors ${
              isMenuOpen ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Menu className="h-5 w-5" />
            <span className="text-[10px] mt-0.5">Mais</span>
          </button>
        </div>
      </nav>

      {/* Modal / Menu de Todas as Funcionalidades Móveis */}
      <Dialog open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DialogContent className="max-w-sm rounded-2xl p-5">
          <DialogHeader className="pb-2 border-b">
            <DialogTitle className="text-lg font-headline text-primary flex items-center gap-2">
              <Layers className="h-5 w-5" /> Todos os Módulos
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-2 pt-2">
            {extraTabs.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    isActive
                      ? "border-primary bg-primary/10 text-primary font-semibold shadow-xs"
                      : "border-border/60 hover:bg-muted/40 text-foreground"
                  }`}
                >
                  <div className={`p-2 rounded-lg ${isActive ? "bg-primary text-white" : "bg-muted text-primary"}`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
