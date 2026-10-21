"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Sprout,
  Cpu,
  BrainCircuit,
  Menu,
  PawPrint,
  Wallet,
  Bell,
  Layers,
  Settings,
  MessageSquareWarning,
  ShieldCheck,
  LogOut,
  LogIn,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { BetaFeedbackModal } from "@/components/beta-feedback-modal"
import { useAuth } from "@/context/AuthContext"

export function MobileNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAdmin, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)

  const mainTabs = [
    { name: "Início", href: "/", icon: LayoutDashboard },
    { name: "Culturas", href: "/crops", icon: Sprout },
    { name: "IoT", href: "/iot", icon: Cpu },
    { name: "Assistente IA", href: "/ai-assistant", icon: BrainCircuit },
  ]

  const extraTabs = [
    { name: "Criações & Animais", href: "/animals", icon: PawPrint, desc: "Manejo zootécnico e saúde" },
    { name: "Controle Financeiro", href: "/financial", icon: Wallet, desc: "Receitas, despesas e margens" },
    { name: "Banco de Categorias", href: "/categories", icon: Layers, desc: "Setores e espécies típicas" },
    { name: "Tarefas e Alertas", href: "/alerts", icon: Bell, desc: "Rotinas e calendário safra" },
    { name: "Configurações & Planos", href: "/settings", icon: Settings, desc: "Planos R$ 9,90 e preferências" },
  ]

  const handleLogout = async () => {
    setIsMenuOpen(false)
    await signOut()
    router.push("/login")
  }

  return (
    <>
      {/* Barra de Navegação Inferior Fixa com Alvos de Toque Mínimos de 48px */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-1 safe-area-pb">
        <div className="flex items-center justify-around">
          {mainTabs.map((tab) => {
            const isActive = pathname === tab.href
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`flex flex-col items-center justify-center min-h-[48px] min-w-[48px] px-2 rounded-xl transition-colors ${
                  isActive ? "text-primary font-bold" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <tab.icon className={`h-5 w-5 ${isActive ? "text-primary stroke-[2.5]" : "text-slate-600"}`} />
                <span className="text-[10px] font-semibold mt-0.5">{tab.name}</span>
              </Link>
            )
          })}

          {/* Botão de Menu Mais */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className={`flex flex-col items-center justify-center min-h-[48px] min-w-[48px] px-2 rounded-xl transition-colors ${
              isMenuOpen ? "text-primary font-bold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Menu className="h-5 w-5" />
            <span className="text-[10px] font-semibold mt-0.5">Mais</span>
          </button>
        </div>
      </nav>

      {/* Modal de Todas as Funcionalidades */}
      <Dialog open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DialogContent className="max-w-sm rounded-2xl p-5">
          <DialogHeader className="pb-2 border-b border-slate-200">
            <DialogTitle className="text-lg font-headline font-bold text-slate-900 flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" /> Mais Módulos
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-2 pt-2">
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 p-3.5 rounded-xl border-2 border-emerald-600 bg-emerald-50 text-emerald-950 transition-all min-h-[52px]"
              >
                <div className="p-2 rounded-xl bg-emerald-700 text-white">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Painel da Administradora</p>
                  <p className="text-xs text-emerald-800 font-medium">Gestão de usuários, planos e MRR</p>
                </div>
              </Link>
            )}

            {extraTabs.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all min-h-[52px] ${
                    isActive
                      ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                      : "border-slate-200 hover:bg-slate-50 text-slate-800"
                  }`}
                >
                  <div className={`p-2 rounded-xl ${isActive ? "bg-primary text-white" : "bg-slate-100 text-primary"}`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-600">{item.desc}</p>
                  </div>
                </Link>
              )
            })}

            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false)
                setIsFeedbackOpen(true)
              }}
              className="flex items-center gap-3 p-3.5 rounded-xl border border-amber-200 bg-amber-50/70 hover:bg-amber-100/70 text-amber-950 transition-all min-h-[52px] text-left"
            >
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-700">
                <MessageSquareWarning className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Relatar Problema / Sugestão</p>
                <p className="text-xs text-slate-600">Canal direto de suporte e feedback Beta</p>
              </div>
            </button>

            {user && user.uid !== "demo" ? (
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-3 p-3.5 rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100/60 text-rose-900 transition-all min-h-[52px] text-left"
              >
                <div className="p-2 rounded-xl bg-rose-600 text-white">
                  <LogOut className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-rose-900">Sair da Conta</p>
                  <p className="text-xs text-rose-700">{user.email}</p>
                </div>
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 p-3.5 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary transition-all min-h-[52px]"
              >
                <div className="p-2 rounded-xl bg-primary text-white">
                  <LogIn className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Entrar / Criar Conta Grátis</p>
                  <p className="text-xs text-slate-600">Sincronizar dados da sua propriedade</p>
                </div>
              </Link>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <BetaFeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </>
  )
}
