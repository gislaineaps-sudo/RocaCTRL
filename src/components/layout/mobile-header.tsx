"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Home, LogIn, LogOut, ShieldCheck } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

export function MobileHeader() {
  const router = useRouter()
  const { user, isAdmin, signOut } = useAuth()

  const handleLogout = async () => {
    await signOut()
    router.push("/login")
  }

  return (
    <header className="flex h-14 md:hidden items-center justify-between border-b border-slate-200 px-3 shrink-0 bg-white sticky top-0 z-40">
      <div className="flex items-center gap-2 min-w-0">
        <SidebarTrigger className="text-primary focus:ring-primary shrink-0" />
        <Link href="/" className="flex items-center gap-2 min-w-0">
          <span className="font-headline font-bold text-base text-primary shrink-0">RoçaCtrl</span>
          {user && (
            <span className="text-xs font-semibold text-slate-700 truncate flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
              <Home className="h-3 w-3 text-primary shrink-0" />
              <span className="truncate max-w-[110px]">{user.farmName || "Minha Chácara"}</span>
            </span>
          )}
        </Link>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {isAdmin && (
          <Button asChild variant="ghost" size="sm" className="h-8 px-2 text-xs text-emerald-800 font-bold">
            <Link href="/admin">
              <ShieldCheck className="h-4 w-4 mr-1 text-emerald-700" /> Admin
            </Link>
          </Button>
        )}

        {user && user.uid !== "demo" ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="h-8 px-2 text-xs text-rose-700 hover:bg-rose-50 font-semibold"
            title="Sair da Conta"
          >
            <LogOut className="h-4 w-4 mr-1" /> Sair
          </Button>
        ) : (
          <Button asChild variant="outline" size="sm" className="h-8 px-2.5 text-xs border-primary/30 text-primary font-bold">
            <Link href="/login">
              <LogIn className="h-3.5 w-3.5 mr-1" /> Entrar
            </Link>
          </Button>
        )}
      </div>
    </header>
  )
}
