"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { usePreferences, ModuleId } from "@/contexts/preferences-context"
import { useAccessibility } from "@/contexts/accessibility-context"
import { Button } from "@/components/ui/button"
import { 
  Type, 
  Contrast, 
  Settings, 
  Sprout, 
  PawPrint, 
  Wallet, 
  Library, 
  Bell, 
  Cpu, 
  BrainCircuit,
  Accessibility
} from "lucide-react"

export default function SettingsPage() {
  const { modules, toggleModule } = usePreferences()
  const { isHighContrast, toggleHighContrast, increaseFontSize, decreaseFontSize, fontSize } = useAccessibility()

  const moduleDefinitions: { id: ModuleId; name: string; description: string; icon: React.ElementType }[] = [
    { id: "animals", name: "Animais", description: "Gestão de pequenos rebanhos e colmeias.", icon: PawPrint },
    { id: "crops", name: "Culturas", description: "Horta comunitária e plantio sazonal.", icon: Sprout },
    { id: "financial", name: "Financeiro", description: "Controle de receitas e despesas.", icon: Wallet },
    { id: "categories", name: "Categorias", description: "Organização do catálogo.", icon: Library },
    { id: "alerts", name: "Tarefas e Alertas", description: "Notificações do calendário safra.", icon: Bell },
    { id: "iot", name: "Monitoramento IoT", description: "Sensores de umidade e clima.", icon: Cpu },
    { id: "ai-assistant", name: "Assistente IA", description: "Consultoria agro baseada em dados.", icon: BrainCircuit },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="flex items-center gap-4 border-b pb-6">
        <div className="p-3 bg-primary/10 rounded-full text-primary">
          <Settings className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Configurações</h1>
          <p className="text-muted-foreground">Gerencie seus módulos ativos e acessibilidade.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Accessibility className="h-5 w-5 text-primary" />
              Acessibilidade
            </CardTitle>
            <CardDescription>Opções para melhorar a sua experiência visual na plataforma.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <Label className="flex flex-col gap-1 cursor-pointer">
                  <span className="font-medium text-base">Alto Contraste</span>
                  <span className="font-normal text-sm text-muted-foreground">Melhora a legibilidade alterando as cores.</span>
                </Label>
                <Switch 
                  checked={isHighContrast}
                  onCheckedChange={toggleHighContrast}
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <Label className="flex flex-col gap-1">
                  <span className="font-medium text-base">Tamanho da Fonte</span>
                  <span className="font-normal text-sm text-muted-foreground">Ajuste o tamanho dos textos: {fontSize === 'normal' ? 'Normal' : fontSize === 'large' ? 'Grande' : 'Muito Grande'}</span>
                </Label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={decreaseFontSize} disabled={fontSize === 'normal'}>
                    <Type className="h-4 w-4" />-
                  </Button>
                  <Button variant="outline" size="icon" onClick={increaseFontSize} disabled={fontSize === 'x-large'}>
                    <Type className="h-5 w-5" />+
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Módulos Ativos
            </CardTitle>
            <CardDescription>Ligue ou desligue ferramentas que você não utiliza.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {moduleDefinitions.map((mod) => (
                <div key={mod.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                  <Label htmlFor={`module-${mod.id}`} className="flex items-center gap-3 cursor-pointer flex-1">
                    <div className="p-2 bg-primary/10 rounded-md text-primary">
                      <mod.icon className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">{mod.name}</span>
                      <span className="font-normal text-xs text-muted-foreground">{mod.description}</span>
                    </div>
                  </Label>
                  <Switch 
                    id={`module-${mod.id}`}
                    checked={modules[mod.id]}
                    onCheckedChange={() => toggleModule(mod.id)}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
