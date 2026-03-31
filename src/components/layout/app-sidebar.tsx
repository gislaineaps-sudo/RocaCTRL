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
import { Button } from "@/components/ui/button"
import { useAccessibility } from "@/contexts/accessibility-context"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Animais", href: "/animals", icon: PawPrint },
  { name: "Culturas", href: "/crops", icon: Sprout },
  { name: "Financeiro", href: "/financial", icon: Wallet },
  { name: "Categorias", href: "/categories", icon: Library },
  { name: "Tarefas e Alertas", href: "/alerts", icon: Bell },
  { name: "Monitoramento IoT", href: "/iot", icon: Cpu },
  { name: "Assistente IA", href: "/ai-assistant", icon: BrainCircuit },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { state } = useSidebar()
  const { isHighContrast, toggleHighContrast, increaseFontSize, decreaseFontSize } = useAccessibility()
  const logoImage = PlaceHolderImages.find(img => img.id === "app-logo")

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b px-4 py-4">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-primary/20 bg-primary/10">
            <Image 
              src="/logo.jpg" 
              alt="Logo RoçaCtrl" 
              width={32} 
              height={32} 
              className="object-cover h-full w-full scale-[1.3]"
            />
          </div>
          {state === "expanded" && (
            <span className="font-headline font-bold text-lg text-primary truncate">
              RoçaCtrl
            </span>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="py-4">
        <SidebarMenu>
          {navigation.map((item) => (
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
            <div className="flex w-full items-center gap-2 px-2 py-1.5">
              <Button variant="outline" size="icon" className="h-8 flex-1" onClick={decreaseFontSize} title="Diminuir Letra">
                <Type className="h-3 w-3" />-
              </Button>
              <Button variant="outline" size="icon" className="h-8 flex-1" onClick={increaseFontSize} title="Aumentar Letra">
                <Type className="h-4 w-4" />+
              </Button>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Alto Contraste" onClick={toggleHighContrast} isActive={isHighContrast}>
              <Contrast />
              <span>Alto Contraste</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <div className="my-2 h-px bg-border" />
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Configurações">
              <Settings />
              <span>Configurações</span>
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
