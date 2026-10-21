"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Sprout,
  PawPrint,
  Bell,
  BrainCircuit,
  Settings,
  Library,
  Cpu,
  Wallet,
  MessageSquareWarning,
  ShieldCheck,
  LogOut,
  LogIn,
  Home,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { usePreferences, ModuleId } from "@/contexts/preferences-context"
import { useAuth } from "@/context/AuthContext"
import { BetaFeedbackModal } from "@/components/beta-feedback-modal"
import { Badge } from "@/components/ui/badge"

type NavItem = {
  name: string
  href: string
  icon: React.ElementType
  id?: ModuleId
}

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Animais", href: "/animals", icon: PawPrint, id: "animals" },
  { name: "Culturas", href: "/crops", icon: Sprout, id: "crops" },
  { name: "Financeiro", href: "/financial", icon: Wallet, id: "financial" },
  { name: "Categorias", href: "/categories", icon: Library, id: "categories" },
  { name: "Tarefas e Alertas", href: "/alerts", icon: Bell, id: "alerts" },
  { name: "Monitoramento IoT", href: "/iot", icon: Cpu, id: "iot" },
  { name: "Assistente IA", href: "/ai-assistant", icon: BrainCircuit, id: "ai-assistant" },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { modules } = usePreferences()
  const { user, isAdmin, signOut } = useAuth()
  const [isFeedbackOpen, setIsFeedbackOpen] = React.useState(false)

  const visibleNavigation = navigation.filter((item) => !item.id || modules[item.id])

  const handleLogout = async () => {
    await signOut()
    router.push("/login")
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b px-3 py-3 mt-1">
        <Link
          href="/"
          className="flex items-center justify-center w-full overflow-hidden hover:opacity-80 transition-opacity"
        >
          <Image
            src="/Logo lateral.png"
            alt="Logo RoçaCtrl"
            width={288}
            height={80}
            className="object-contain max-h-16 w-auto"
            priority
          />
        </Link>

        {/* Identificação da Propriedade / Usuário Logado */}
        {user && (
          <div className="mt-2 px-2.5 py-2 rounded-xl bg-emerald-50/80 border border-emerald-200/70 group-data-[collapsible=icon]:hidden">
            <div className="flex items-center justify-between gap-1">
              <p className="text-xs font-bold text-slate-900 truncate flex items-center gap-1.5">
                <Home className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="truncate">{user.farmName || "Minha Chácara"}</span>
              </p>
              <Badge className="bg-primary/15 text-primary border-primary/20 text-[9px] px-1.5 py-0 uppercase font-bold shrink-0">
                {user.plan === "iot" ? "IoT" : user.plan === "pro" ? "Pro" : "Free"}
              </Badge>
            </div>
            <p className="text-[11px] text-slate-600 truncate mt-0.5">{user.name}</p>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="py-3">
        <SidebarMenu>
          {visibleNavigation.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.name}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}

          {/* Rota /admin visível APENAS para a Administradora */}
          {isAdmin && (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/admin"}
                tooltip="Painel Admin"
                className="text-emerald-900 bg-emerald-100/70 hover:bg-emerald-100 font-bold mt-1"
              >
                <Link href="/admin">
                  <ShieldCheck className="text-emerald-700" />
                  <span>Painel Admin</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t py-3">
        <SidebarMenu className="space-y-1">
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Relatar Problema / Sugestão"
              onClick={() => setIsFeedbackOpen(true)}
              className="text-amber-800 hover:bg-amber-50 hover:text-amber-900 font-medium"
            >
              <MessageSquareWarning className="text-amber-600" />
              <span>Relatar Problema / Sugestão</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Configurações & Planos"
              asChild
              isActive={pathname === "/settings"}
            >
              <Link href="/settings">
                <Settings />
                <span>Configurações & Planos</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {user && user.uid !== "demo" ? (
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Sair da Conta"
                onClick={handleLogout}
                className="text-rose-700 hover:bg-rose-50 hover:text-rose-800 font-medium"
              >
                <LogOut className="text-rose-600" />
                <span>Sair da Conta</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : (
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Entrar / Criar Conta"
                asChild
                isActive={pathname === "/login"}
                className="text-primary font-bold hover:bg-primary/10"
              >
                <Link href="/login">
                  <LogIn className="text-primary" />
                  <span>Entrar / Criar Conta</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>

      <BetaFeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </Sidebar>
  )
}
