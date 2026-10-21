"use client"

import React, { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Sprout,
  Lock,
  Mail,
  User,
  Home,
  ArrowRight,
  Loader2,
  CheckCircle2,
  WifiOff,
  Sparkles,
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword } = useAuth()
  const { toast } = useToast()

  const [mode, setMode] = useState<"login" | "register">("login")
  const [loading, setLoading] = useState(false)

  const [name, setName] = useState("")
  const [farmName, setFarmName] = useState("Meu Sítio")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      toast({
        title: "Informe seu e-mail primeiro",
        description: "Digite seu e-mail no campo acima e clique em 'Esqueci minha senha'.",
        variant: "destructive",
      })
      return
    }
    try {
      await resetPassword(email)
      toast({
        title: "E-mail de recuperação enviado! 📩",
        description: `Enviamos um link para redefinir sua senha em ${email.trim()}.`,
      })
    } catch (error: any) {
      toast({
        title: "Erro ao recuperar senha",
        description: error?.message || "Verifique o e-mail informado e tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      await signInWithGoogle()
      toast({
        title: "Bem-vindo(a) ao RoçaCtrl! 🌾",
        description: "Login com Google realizado e banco de dados sincronizado.",
      })
      router.push("/")
    } catch (error: any) {
      toast({
        title: "Não foi possível entrar com o Google",
        description: error?.message || "Tente novamente ou entre com seu e-mail.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Preencha os campos obrigatórios",
        description: "Informe seu e-mail e sua senha para continuar.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      if (mode === "login") {
        await signInWithEmail(email, password)
        toast({
          title: "Acesso liberado! 🌱",
          description: "Bom trabalho hoje na sua propriedade!",
        })
      } else {
        await signUpWithEmail(name || "Produtor(a)", email, password, farmName || "Minha Chácara")
        toast({
          title: "Conta criada com sucesso! 🎉",
          description: "Suas categorias padrão e exemplos iniciais já foram configurados!",
        })
      }
      router.push("/")
    } catch (error: any) {
      toast({
        title: "Erro na autenticação",
        description: error?.message || "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center py-6 px-2">
      <div className="w-full max-w-md space-y-6">
        {/* Identidade Visual Acolhedora */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-1.5 bg-white rounded-3xl shadow-md border-2 border-primary/20">
            <Image
              src="/logo.jpg"
              alt="Logo RoçaCtrl"
              width={84}
              height={84}
              className="w-20 h-20 rounded-2xl object-cover"
              priority
            />
          </div>
          <div className="space-y-1">
            <Badge className="bg-emerald-700 text-white text-xs px-3 py-0.5">
              Plataforma Oficial do Produtor Rural
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-headline font-bold text-slate-900 pt-1">
              Bem-vindo ao RoçaCtrl
            </h1>
            <p className="text-sm text-slate-700 font-medium">
              Controle suas hortas, rebanho e finanças mesmo sem internet no campo.
            </p>
          </div>
        </div>

        <Card className="border-2 border-slate-200 shadow-lg rounded-2xl overflow-hidden bg-white">
          <CardHeader className="pb-4 bg-slate-50/70 border-b border-slate-200">
            {/* Botão Principal: Entrar com Google (1 Clique) */}
            <Button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full h-12 bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-300 font-bold text-sm rounded-xl shadow-xs flex items-center justify-center gap-3 transition-all"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Entrar com o Google (1 clique)</span>
            </Button>

            <div className="relative my-3 flex items-center justify-center">
              <div className="border-t border-slate-300 w-full" />
              <span className="bg-slate-50 px-3 text-[11px] font-bold uppercase text-slate-500 shrink-0">
                ou use seu e-mail
              </span>
              <div className="border-t border-slate-300 w-full" />
            </div>

            {/* Seletor de Abas: Entrar vs Criar Conta Grátis */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-200/80 rounded-xl">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all min-h-[44px] ${
                  mode === "login"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-700 hover:text-slate-900"
                }`}
              >
                Entrar com E-mail
              </button>
              <button
                type="button"
                onClick={() => setMode("register")}
                className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all min-h-[44px] ${
                  mode === "register"
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "text-slate-700 hover:text-slate-900"
                }`}
              >
                Criar Conta Grátis
              </button>
            </div>
          </CardHeader>

          <CardContent className="p-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-name" className="text-xs font-bold text-slate-900">
                      Seu Nome Completo *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <Input
                        id="reg-name"
                        placeholder="Ex: João da Silva"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10 h-12 border-slate-300 text-slate-900 text-sm font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="reg-farm" className="text-xs font-bold text-slate-900">
                      Nome da Chácara / Sítio *
                    </Label>
                    <div className="relative">
                      <Home className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <Input
                        id="reg-farm"
                        placeholder="Ex: Minha Chácara, Sítio São José..."
                        value={farmName}
                        onChange={(e) => setFarmName(e.target.value)}
                        className="pl-10 h-12 border-slate-300 text-slate-900 text-sm font-medium"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="login-email" className="text-xs font-bold text-slate-900">
                  E-mail *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="seuemail@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 border-slate-300 text-slate-900 text-sm font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-pass" className="text-xs font-bold text-slate-900">
                    Senha *
                  </Label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-xs font-bold text-emerald-800 hover:underline"
                    >
                      Esqueci minha senha
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="login-pass"
                    type="password"
                    placeholder="Mínimo de 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12 border-slate-300 text-slate-900 text-sm font-medium"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl gap-2 shadow-sm"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <span>
                      {mode === "login" ? "Entrar na Minha Propriedade" : "Criar Minha Conta Grátis"}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Benefícios claros */}
            <div className="mt-5 pt-4 border-t border-slate-200 grid grid-cols-2 gap-2 text-[11px] text-slate-700 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Comece 100% Grátis</span>
              </div>
              <div className="flex items-center gap-1.5">
                <WifiOff className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Funciona Offline no Campo</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
