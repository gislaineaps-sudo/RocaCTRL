
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
  Library
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

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Animais", href: "/animals", icon: PawPrint },
  { name: "Culturas", href: "/crops", icon: Sprout },
  { name: "Categorias", href: "/categories", icon: Library },
  { name: "Alertas", href: "/alerts", icon: Bell },
  { name: "Assistente IA", href: "/ai-assistant", icon: BrainCircuit },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { state } = useSidebar()
  const logoImage = PlaceHolderImages.find(img => img.id === "app-logo")

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b px-4 py-4">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary/10">
            {logoImage ? (
              <Image 
                src={logoImage.imageUrl} 
                alt={logoImage.description} 
                width={32} 
                height={32} 
                className="object-cover"
                data-ai-hint={logoImage.imageHint}
              />
            ) : (
              <Sprout className="h-5 w-5 text-primary" />
            )}
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
        <SidebarMenu>
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
