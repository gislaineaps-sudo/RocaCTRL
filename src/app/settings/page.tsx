"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { usePreferences, ModuleId } from "@/contexts/preferences-context"
import { useAccessibility } from "@/contexts/accessibility-context"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Type,
  Settings,
  Sprout,
  PawPrint,
  Wallet,
  Library,
  Bell,
  Cpu,
  BrainCircuit,
  Accessibility,
  Sparkles,
  Zap,
  Check,
  Key,
  CreditCard,
  MessageSquareWarning,
  Mail,
  Copy,
} from "lucide-react"
import { ProFeatureModal } from "@/components/pro-feature-modal"
import { BetaFeedbackModal } from "@/components/beta-feedback-modal"
import { useToast } from "@/hooks/use-toast"
import { assinarPlanoGoogle, GooglePlaySkuId } from "@/lib/google-play-billing"

export default function SettingsPage() {
  const { modules, toggleModule } = usePreferences()
  const { isHighContrast, toggleHighContrast, increaseFontSize, decreaseFontSize, fontSize } = useAccessibility()
  const { user, updateCurrentUserPlan } = useAuth()
  const { toast } = useToast()

  const [isProModalOpen, setIsProModalOpen] = useState(false)
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false)
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [apiKey, setApiKey] = useState("")

  const handleDirectGooglePlaySubscribe = async (skuId: GooglePlaySkuId) => {
    await assinarPlanoGoogle(skuId, async (newPlan) => {
      await updateCurrentUserPlan(newPlan)
    })
  }

  const handleCopySupportEmail = async () => {
    try {
      await navigator.clipboard.writeText("suporte.rocactrl@gmail.com")
      setCopiedEmail(true)
      toast({
        title: "E-mail copiado!",
        description: "suporte.rocactrl@gmail.com copiado para a área de transferência.",
      })
      setTimeout(() => setCopiedEmail(false), 2500)
    } catch {
      toast({
        title: "E-mail de suporte",
        description: "suporte.rocactrl@gmail.com",
      })
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      setApiKey(localStorage.getItem("rocactrl_gemini_api_key") || "")
    }
  }, [])

  const handleSaveApiKey = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("rocactrl_gemini_api_key", apiKey.trim())
      toast({
        title: apiKey.trim() ? "Chave de IA Salva!" : "Chave Removida",
        description: apiKey.trim()
          ? "Modelo Gemini 2.5 Flash pronto para uso."
          : "Usando base agronômica local.",
      })
    }
  }

  const currentPlanLabel =
    user?.plan === "iot"
      ? "Sítio Conectado - IoT (R$ 24,90/mês)"
      : user?.plan === "pro"
      ? "Chácara Produtiva - Pro (R$ 9,90/mês)"
      : "Plano Gratuito (R$ 0/mês)"

  const moduleDefinitions: { id: ModuleId; name: string; description: string; icon: React.ElementType }[] = [
    { id: "animals", name: "Animais", description: "Gestão de pequenos rebanhos e colmeias.", icon: PawPrint },
    { id: "crops", name: "Culturas", description: "Horta comunitária e plantio sazonal.", icon: Sprout },
    { id: "financial", name: "Financeiro", description: "Controle de receitas e despesas.", icon: Wallet },
    { id: "categories", name: "Categorias", description: "Organização do catálogo e setores.", icon: Library },
    { id: "alerts", name: "Tarefas e Alertas", description: "Notificações do calendário safra.", icon: Bell },
    { id: "iot", name: "Monitoramento IoT", description: "Sensores de umidade e automação.", icon: Cpu },
    { id: "ai-assistant", name: "Assistente IA", description: "Consultoria agro baseada em dados.", icon: BrainCircuit },
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Cabeçalho */}
      <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
          <Settings className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold text-slate-900">Configurações & Planos</h1>
          <p className="text-slate-600 font-medium">
            Gerencie seu plano de assinatura, módulos ativos, acessibilidade e chave de IA.
          </p>
        </div>
      </div>

      {/* SEÇÃO 1: TABELA DE PLANOS ACESSÍVEIS */}
      <Card className="border-2 border-primary/30 bg-gradient-to-br from-emerald-50/50 via-white to-white shadow-xs overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-xl font-headline font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" /> Meu Plano & Assinatura
                </CardTitle>
                <Badge className="bg-emerald-700 text-white text-xs">
                  Plano Atual: {currentPlanLabel}
                </Badge>
              </div>
              <CardDescription className="text-xs text-slate-600 mt-1">
                Precificação justa e acessível pensada para o pequeno produtor rural e agricultura familiar.
              </CardDescription>
            </div>
            <Button
              onClick={() => setIsProModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-white font-bold h-11 px-5 rounded-xl gap-2 shadow-xs shrink-0"
            >
              <Zap className="h-4 w-4" /> Fazer Upgrade Agora
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="grid md:grid-cols-3 gap-4 text-xs">
            {/* 1. Plano Gratuito */}
            <div
              className={`p-4 bg-white rounded-2xl border flex flex-col justify-between space-y-3 ${
                (!user?.plan || user.plan === "free")
                  ? "border-2 border-slate-900 shadow-xs"
                  : "border-slate-200"
              }`}
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-sm">Plano Gratuito</span>
                  {(!user?.plan || user.plan === "free") && (
                    <Badge variant="outline" className="text-[10px] border-slate-400 text-slate-800">
                      Seu Plano
                    </Badge>
                  )}
                </div>
                <div>
                  <span className="text-2xl font-bold text-slate-900">R$ 0</span>
                  <span className="text-slate-600">/mês</span>
                </div>
                <ul className="space-y-1.5 text-slate-700 pt-1">
                  <li className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" /> Até 2 culturas cadastradas
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" /> Até 15 animais no plantel
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" /> Controle de caixa básico
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" /> 5 consultas IA / mês
                  </li>
                </ul>
              </div>
              <Button variant="outline" disabled className="w-full h-9 text-xs">
                Incluso Gratuitamente
              </Button>
            </div>

            {/* 2. Plano Chácara Produtiva - Pro */}
            <div
              className={`p-4 bg-emerald-50/60 rounded-2xl border-2 flex flex-col justify-between space-y-3 ${
                user?.plan === "pro" ? "border-emerald-700 shadow-sm" : "border-primary/40"
              }`}
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-primary text-sm">Chácara Produtiva - Pro</span>
                  <Badge className="bg-amber-500/20 text-amber-900 border-amber-400 text-[10px] font-bold">
                    Recomendado
                  </Badge>
                </div>
                <div>
                  <span className="text-2xl font-bold text-primary">R$ 9,90</span>
                  <span className="text-slate-600">/mês</span>
                  <p className="text-[11px] font-bold text-emerald-800">ou R$ 99/ano (economize 2 meses)</p>
                </div>
                <ul className="space-y-1.5 text-slate-800 font-medium pt-1">
                  <li className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" /> Culturas e animais ilimitados
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" /> Consultor IA ilimitado
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" /> Relatórios em PDF/CSV
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" /> Alertas completos de manejo
                  </li>
                </ul>
              </div>
              <Button
                onClick={() => handleDirectGooglePlaySubscribe("rocactrl_pro_mensal")}
                className="w-full h-9 text-xs bg-primary hover:bg-primary/90 text-white font-bold"
              >
                {user?.plan === "pro" ? "Plano Ativo" : "Assinar Pro (R$ 9,90/mês)"}
              </Button>
            </div>

            {/* 3. Plano Sítio Conectado - IoT */}
            <div
              className={`p-4 bg-white rounded-2xl border flex flex-col justify-between space-y-3 ${
                user?.plan === "iot" ? "border-2 border-blue-600 shadow-sm" : "border-slate-200"
              }`}
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-sm">Sítio Conectado - IoT</span>
                  <Badge className="bg-blue-600/15 text-blue-800 border-blue-300 text-[10px]">
                    Automação
                  </Badge>
                </div>
                <div>
                  <span className="text-2xl font-bold text-slate-900">R$ 24,90</span>
                  <span className="text-slate-600">/mês</span>
                  <p className="text-[11px] text-slate-500">Para propriedades automatizadas</p>
                </div>
                <ul className="space-y-1.5 text-slate-700 font-medium pt-1">
                  <li className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-blue-600 shrink-0" /> Tudo do Plano Chácara Produtiva (Pro)
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-blue-600 shrink-0" /> Integração com sensores IoT
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-blue-600 shrink-0" /> Acionamento remoto de bombas
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-blue-600 shrink-0" /> Alertas automáticos de manejo
                  </li>
                </ul>
              </div>
              <Button
                variant="outline"
                onClick={() => handleDirectGooglePlaySubscribe("rocactrl_iot_mensal")}
                className="w-full h-9 text-xs border-slate-300 text-slate-900 font-bold hover:bg-slate-50"
              >
                {user?.plan === "iot" ? "Plano Ativo" : "Assinar IoT (R$ 24,90/mês)"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEÇÃO 2: ACESSIBILIDADE & CHAVE DE IA */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Acessibilidade Outdoor */}
        <Card className="border-slate-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-slate-900 font-bold">
              <Accessibility className="h-5 w-5 text-primary" />
              Acessibilidade & Visibilidade
            </CardTitle>
            <CardDescription className="text-xs text-slate-600">
              Ajustes para leitura confortável sob o sol.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between min-h-[48px]">
                <Label className="flex flex-col gap-1 cursor-pointer">
                  <span className="font-bold text-slate-900 text-sm">Modo Alto Contraste</span>
                  <span className="font-normal text-xs text-slate-600">
                    Otimiza cores e bordas para o sol do campo.
                  </span>
                </Label>
                <Switch
                  checked={isHighContrast}
                  onCheckedChange={toggleHighContrast}
                  className="data-[state=checked]:bg-primary"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200 min-h-[48px]">
                <Label className="flex flex-col gap-1">
                  <span className="font-bold text-slate-900 text-sm">Tamanho do Texto</span>
                  <span className="font-normal text-xs text-slate-600">
                    Tamanho:{" "}
                    {fontSize === "normal"
                      ? "Padrão"
                      : fontSize === "large"
                      ? "Grande"
                      : "Muito Grande"}
                  </span>
                </Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={decreaseFontSize}
                    disabled={fontSize === "normal"}
                    className="h-11 w-11 border-slate-300 text-slate-800"
                  >
                    <Type className="h-4 w-4" />-
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={increaseFontSize}
                    disabled={fontSize === "x-large"}
                    className="h-11 w-11 border-slate-300 text-slate-800"
                  >
                    <Type className="h-5 w-5" />+
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chave de IA Google Gemini */}
        <Card className="border-slate-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-slate-900 font-bold">
              <Key className="h-5 w-5 text-primary" />
              Inteligência Artificial (Gemini)
            </CardTitle>
            <CardDescription className="text-xs text-slate-600">
              Conecte sua chave gratuita do Google AI Studio.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="settings-api-key" className="text-xs font-bold text-slate-800">
                Chave da API Gemini (Opcional)
              </Label>
              <div className="flex gap-2">
                <Input
                  id="settings-api-key"
                  type="password"
                  placeholder="AIzaSy..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="h-11 font-mono text-sm border-slate-300"
                />
                <Button
                  onClick={handleSaveApiKey}
                  className="h-11 px-4 bg-primary hover:bg-primary/90 text-white font-bold shrink-0"
                >
                  Salvar
                </Button>
              </div>
            </div>
            <p className="text-[11px] text-slate-600">
              Obtenha sua chave gratuita em{" "}
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-primary font-bold underline"
              >
                aistudio.google.com
              </a>{" "}
              para habilitar o modelo Gemini 2.5 Flash.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* SEÇÃO 3: MÓDULOS ATIVOS */}
      <Card className="border-slate-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-slate-900 font-bold">
            <Settings className="h-5 w-5 text-primary" />
            Módulos Ativos do RoçaCtrl
          </CardTitle>
          <CardDescription className="text-xs text-slate-600">
            Ligue ou desligue módulos de acordo com as atividades do seu sítio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            {moduleDefinitions.map((mod) => (
              <div
                key={mod.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white min-h-[52px]"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-100 text-primary">
                    <mod.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{mod.name}</p>
                    <p className="text-xs text-slate-600">{mod.description}</p>
                  </div>
                </div>
                <Switch
                  checked={modules[mod.id]}
                  onCheckedChange={() => toggleModule(mod.id)}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* SEÇÃO 4: SUPORTE E RELATO DE PROBLEMAS (RODAPÉ DE ATENDIMENTO) */}
      <Card className="border-slate-200 bg-slate-50/60">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-slate-900 font-bold">
            <MessageSquareWarning className="h-5 w-5 text-primary" />
            Suporte & Relato de Problemas
          </CardTitle>
          <CardDescription className="text-xs text-slate-600">
            Precisa de ajuda, quer enviar uma sugestão ou relatar um erro no sistema? Utilize nossos canais oficiais:
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-200 flex-1">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
              <Mail className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-700">E-mail Oficial de Atendimento</p>
              <a
                href="mailto:suporte.rocactrl@gmail.com"
                className="text-sm font-mono font-bold text-emerald-800 hover:underline truncate block"
              >
                suporte.rocactrl@gmail.com
              </a>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopySupportEmail}
              className="h-9 px-3 text-xs font-bold border-slate-300 text-slate-800 gap-1.5 shrink-0"
            >
              {copiedEmail ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" /> Copiado
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" /> Copiar e-mail
                </>
              )}
            </Button>
          </div>

          <Button
            type="button"
            onClick={() => setIsSupportModalOpen(true)}
            className="h-12 px-5 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl gap-2 shrink-0"
          >
            <MessageSquareWarning className="h-4 w-4" /> Abrir Formulário de Suporte
          </Button>
        </CardContent>
      </Card>

      <ProFeatureModal
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
        featureName="Plano Chácara Produtiva (Pro)"
        limitDescription="Desbloqueie todo o potencial de manejo, IA e automação para sua propriedade."
      />

      <BetaFeedbackModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />
    </div>
  )
}
