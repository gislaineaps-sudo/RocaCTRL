"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { usePreferences, ModuleId } from "@/contexts/preferences-context"
import { useAccessibility } from "@/contexts/accessibility-context"
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
  ShieldCheck,
  CreditCard
} from "lucide-react"
import { ProFeatureModal } from "@/components/pro-feature-modal"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { modules, toggleModule } = usePreferences()
  const { isHighContrast, toggleHighContrast, increaseFontSize, decreaseFontSize, fontSize } = useAccessibility()
  const { toast } = useToast()

  const [isProModalOpen, setIsProModalOpen] = useState(false)
  const [apiKey, setApiKey] = useState("")

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
        description: apiKey.trim() ? "Modelo Gemini 2.5 Flash pronto para uso." : "Usando base agronômica local.",
      })
    }
  }

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
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Cabeçalho */}
      <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
          <Settings className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold text-slate-900">Configurações do Sistema</h1>
          <p className="text-slate-600 font-medium">Gerencie seus módulos ativos, plano de assinatura, acessibilidade e IA.</p>
        </div>
      </div>

      {/* SEÇÃO 1: MEU PLANO & ASSINATURA (MONETIZAÇÃO) */}
      <Card className="border-2 border-primary/30 bg-gradient-to-br from-emerald-50/50 via-white to-white shadow-xs overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl font-headline font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" /> Meu Plano & Assinatura
                </CardTitle>
                <Badge className="bg-slate-200 text-slate-800 border-slate-300 text-xs">
                  Plano Atual: Sítio Básico (Gratuito)
                </Badge>
              </div>
              <CardDescription className="text-xs text-slate-600 mt-1">
                Recursos para pequenas propriedades e agricultura familiar.
              </CardDescription>
            </div>
            <Button 
              onClick={() => setIsProModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-white font-bold h-11 px-5 rounded-xl gap-2 shadow-xs shrink-0"
            >
              <Zap className="h-4 w-4" /> Assinar Plano Pro Rural
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-0">
          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 block text-xs">Plano Atual (Gratuito)</span>
              <ul className="space-y-1.5 text-slate-600">
                <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-600" /> Até 5 canteiros e 4 lotes</li>
                <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-600" /> Banco de dados local reativo</li>
                <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-600" /> Consultoria IA com Base Agro</li>
              </ul>
            </div>

            <div className="p-3 bg-primary/5 rounded-xl border border-primary/20 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-primary block text-xs">Plano Pro Rural (R$ 29,90/mês)</span>
                <Badge className="bg-amber-500/15 text-amber-700 border-amber-300 text-[10px]">Recomendado</Badge>
              </div>
              <ul className="space-y-1.5 text-slate-700 font-medium">
                <li className="flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-primary" /> Culturas e animais ilimitados</li>
                <li className="flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-primary" /> Sensores IoT e automação ilimitada</li>
                <li className="flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-primary" /> Relatórios fiscais e suporte WhatsApp</li>
              </ul>
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
            <CardDescription className="text-xs text-slate-600">Ajustes para leitura confortável sob o sol.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between min-h-[48px]">
                <Label className="flex flex-col gap-1 cursor-pointer">
                  <span className="font-bold text-slate-900 text-sm">Modo Alto Contraste</span>
                  <span className="font-normal text-xs text-slate-600">Otimiza cores e bordas para o sol do campo.</span>
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
                    Tamanho: {fontSize === 'normal' ? 'Padrão' : fontSize === 'large' ? 'Grande' : 'Muito Grande'}
                  </span>
                </Label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={decreaseFontSize} disabled={fontSize === 'normal'} className="h-11 w-11 border-slate-300 text-slate-800">
                    <Type className="h-4 w-4" />-
                  </Button>
                  <Button variant="outline" size="icon" onClick={increaseFontSize} disabled={fontSize === 'x-large'} className="h-11 w-11 border-slate-300 text-slate-800">
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
            <CardDescription className="text-xs text-slate-600">Conecte sua chave gratuita do Google AI Studio.</CardDescription>
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
                <Button onClick={handleSaveApiKey} className="h-11 px-4 bg-primary hover:bg-primary/90 text-white font-bold shrink-0">
                  Salvar
                </Button>
              </div>
            </div>
            <p className="text-[11px] text-slate-600">
              Obtenha sua chave gratuita em <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="text-primary font-bold underline">aistudio.google.com</a> para habilitar o modelo Gemini 2.5 Flash.
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
              <div key={mod.id} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white min-h-[52px]">
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

      <ProFeatureModal 
        isOpen={isProModalOpen} 
        onClose={() => setIsProModalOpen(false)} 
        featureName="Plano Pro Rural"
        limitDescription="Desbloqueie todo o potencial de automação e consultoria para o seu sítio."
      />
    </div>
  )
}
