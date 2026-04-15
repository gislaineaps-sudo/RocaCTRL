"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Sprout,
  PawPrint,
  Bell,
  BrainCircuit,
  Settings,
  HelpCircle,
  Library,
  Cpu,
  Wallet,
  Type,
  Contrast
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { PlaceHolderImages } from "@/lib/placeholder-images"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { usePreferences, ModuleId } from "@/contexts/preferences-context"

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
  const { state } = useSidebar()
  const { modules } = usePreferences()
  const logoImage = PlaceHolderImages.find(img => img.id === "app-logo")

  const visibleNavigation = navigation.filter(item => !item.id || modules[item.id])

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b px-4 py-4 mt-2 mb-2">
        <Link href="/" className="flex items-center justify-center w-full overflow-hidden hover:opacity-80 transition-opacity">
          <Image 
            src="/Logo lateral.png" 
            alt="Logo RoçaCtrl" 
            width={288} 
            height={80} 
            className="object-contain max-h-20 w-auto"
            priority
          />
        </Link>
      </SidebarHeader>
      <SidebarContent className="py-4">
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
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t py-4">
        <SidebarMenu className="space-y-1">
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Configurações" asChild isActive={pathname === "/settings"}>
              <Link href="/settings">
                <Settings />
                <span>Configurações</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Ajuda">
              <HelpCircle />
              <span>Ajuda</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
