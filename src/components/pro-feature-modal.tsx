"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Sparkles, 
  Check, 
  ShieldCheck, 
  Zap, 
  Leaf, 
  Smartphone, 
  CloudSun,
  FileSpreadsheet
} from "lucide-react"

interface ProFeatureModalProps {
  isOpen: boolean
  onClose: () => void
  featureName?: string
  limitDescription?: string
}

export function ProFeatureModal({
  isOpen,
  onClose,
  featureName = "Recurso Avançado",
  limitDescription = "Você atingiu o limite do Plano Gratuito."
}: ProFeatureModalProps) {
  const proFeatures = [
    "Culturas e Canteiros Ilimitados (sem limite de 5 canteiros)",
    "Conexão Ilimitada de Sensores IoT em tempo real",
    "Consultoria com IA Generativa 24h com Gemini 2.5 Flash",
    "Exportação de Relatórios Fiscais e Planilhas em Excel/PDF",
    "Alertas via WhatsApp e Notificações Push no Celular",
    "Suporte a Múltiplas Propriedades e Sítios"
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl p-6">
        <DialogHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-xs">
            <Sparkles className="h-6 w-6" />
          </div>
          <Badge className="mx-auto bg-amber-500/15 text-amber-700 border-amber-300 gap-1 text-xs">
            <Zap className="h-3 w-3" /> Plano Pro Rural
          </Badge>
          <DialogTitle className="text-xl font-headline font-bold text-foreground">
            Desbloqueie o {featureName}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {limitDescription} Turbine a gestão do seu sítio com automação completa.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-3 border-y border-border/60 my-2">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Tudo incluso no Plano Pro Rural:
          </p>
          <ul className="space-y-2">
            {proFeatures.map((feat, idx) => (
              <li key={idx} className="text-xs flex items-start gap-2 text-foreground font-medium">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-primary/5 p-3 rounded-xl border border-primary/15 text-center">
          <p className="text-[11px] text-muted-foreground">Apenas</p>
          <p className="text-2xl font-bold text-primary">
            R$ 29,90 <span className="text-xs font-normal text-muted-foreground">/mês</span>
          </p>
          <p className="text-[10px] text-muted-foreground">Cancele quando quiser • Sem fidelidade</p>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 mt-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto h-11 text-xs">
            Continuar no Gratuito
          </Button>
          <Button 
            className="w-full sm:w-auto h-11 text-xs bg-primary hover:bg-primary/90 text-white font-bold gap-2"
            onClick={() => {
              alert("Redirecionando para o checkout seguro do RoçaCtrl Pro...")
              onClose()
            }}
          >
            <Zap className="h-4 w-4" /> Experimentar 7 Dias Grátis
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function UpgradeBanner({ onUpgradeClick }: { onUpgradeClick: () => void }) {
  return (
    <div className="bg-gradient-to-r from-emerald-800 to-primary text-white p-4 rounded-2xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl text-amber-300 shrink-0">
          <Sparkles className="h-6 w-6" />
        </div>
        <div>
          <h4 className="text-sm font-bold">Gerencie mais de 10 canteiros e rebanho com o Pro Rural</h4>
          <p className="text-xs text-white/80">Desbloqueie previsões meteorológicas avançadas e relatórios para crédito rural.</p>
        </div>
      </div>
      <Button 
        onClick={onUpgradeClick} 
        size="sm" 
        className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold h-10 px-4 shrink-0 shadow-sm"
      >
        Conhecer Plano Pro
      </Button>
    </div>
  )
}
