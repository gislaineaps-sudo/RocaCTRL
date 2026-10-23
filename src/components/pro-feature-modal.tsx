"use client"

import React from "react"
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
import { Sparkles, Check, Zap, Cpu, Mail } from "lucide-react"
import { doc, setDoc } from "firebase/firestore"
import { db, isFirebaseConfigured } from "@/lib/firebase"
import { RocaDB } from "@/lib/db"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { assinarPlanoGoogle, GooglePlaySkuId } from "@/lib/google-play-billing"

interface ProFeatureModalProps {
  isOpen: boolean
  onClose: () => void
  featureName?: string
  limitDescription?: string
}

export function ProFeatureModal({
  isOpen,
  onClose,
  featureName = "Plano Chácara Produtiva",
  limitDescription = "Você atingiu o limite do Plano Gratuito (até 2 culturas / 15 animais).",
}: ProFeatureModalProps) {
  const { user, updateCurrentUserPlan } = useAuth()
  const { toast } = useToast()

  const handleSubscribeGooglePlay = async (skuId: GooglePlaySkuId, planName: string) => {
    const purchased = await assinarPlanoGoogle(skuId, async (newPlan, purchaseToken) => {
      await updateCurrentUserPlan(newPlan)
      if (isFirebaseConfigured && db && user?.uid) {
        await setDoc(
          doc(db, "users", user.uid),
          {
            plan: newPlan,
            lastSkuId: skuId,
            purchaseToken: purchaseToken || null,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        ).catch(() => {})
      }
    })

    if (!purchased) {
      // Registra também o interesse na coleção feedbacks para acompanhamento no /admin
      const saved = RocaDB.saveFeedback({
        userId: user?.uid || "demo",
        uid: user?.uid || "demo",
        userName: user?.name || "Produtor(a)",
        userEmail: user?.email || "visitante@rocactrl.com.br",
        farmName: user?.farmName || "Meu Sítio",
        type: "sugestao",
        message: `Interesse de assinatura no plano: ${planName} (${skuId})`,
        status: "pending",
      })
      if (isFirebaseConfigured && db) {
        setDoc(doc(db, "feedbacks", saved.id), saved, { merge: true }).catch(() => {})
      }
      toast({
        title: "Assinatura via Google Play",
        description: "Para assinar com 1 clique via Google Play, abra o aplicativo Android do RoçaCtrl.",
      })
    }

    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg rounded-2xl p-6">
        <DialogHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-xs">
            <Sparkles className="h-6 w-6" />
          </div>
          <Badge className="mx-auto bg-amber-500/15 text-amber-800 border-amber-300 gap-1 text-xs font-bold">
            <Zap className="h-3 w-3" /> Planos Acessíveis RoçaCtrl
          </Badge>
          <DialogTitle className="text-xl font-headline font-bold text-slate-900">
            Desbloqueie o {featureName}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-600">
            {limitDescription} Escolha o plano ideal para o tamanho da sua produção:
          </DialogDescription>
        </DialogHeader>

        <div className="grid sm:grid-cols-2 gap-3 py-3">
          {/* Plano Chácara Produtiva - Pro */}
          <div className="p-4 rounded-2xl border-2 border-primary bg-emerald-50/40 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-primary">Mais Popular</span>
                <Badge className="bg-primary text-white text-[10px]">Google Play</Badge>
              </div>
              <h4 className="font-headline font-bold text-base text-slate-900">
                Chácara Produtiva (Pro)
              </h4>
              <div>
                <span className="text-2xl font-bold text-primary">R$ 9,90</span>
                <span className="text-xs text-slate-600">/mês</span>
                <p className="text-[11px] font-semibold text-emerald-800">ou R$ 99,00/ano (2 meses grátis)</p>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-800 pt-1">
                <li className="flex items-start gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Culturas e animais ilimitados</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Consultor IA ilimitado</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Relatórios em PDF/CSV e alertas</span>
                </li>
              </ul>
            </div>

            <Button
              className="w-full h-10 text-xs bg-primary hover:bg-primary/90 text-white font-bold"
              onClick={() =>
                handleSubscribeGooglePlay("rocactrl_pro_mensal", "Chácara Produtiva - Pro (R$ 9,90/mês)")
              }
            >
              Assinar Pro (R$ 9,90)
            </Button>
          </div>

          {/* Plano Sítio Conectado - IoT */}
          <div className="p-4 rounded-2xl border border-slate-300 bg-white flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1">
                  <Cpu className="h-3.5 w-3.5 text-blue-600" /> Automação Total
                </span>
              </div>
              <h4 className="font-headline font-bold text-base text-slate-900">
                Sítio Conectado (IoT)
              </h4>
              <div>
                <span className="text-2xl font-bold text-slate-900">R$ 24,90</span>
                <span className="text-xs text-slate-600">/mês</span>
                <p className="text-[11px] text-slate-500">Para sítios automatizados</p>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-800 pt-1">
                <li className="flex items-start gap-1.5">
                  <Check className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>Tudo do Plano Chácara Produtiva (Pro)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>Integração com sensores IoT e bombas</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>Alertas automáticos de manejo</span>
                </li>
              </ul>
            </div>

            <Button
              variant="outline"
              className="w-full h-10 text-xs border-slate-300 text-slate-900 font-bold hover:bg-slate-100"
              onClick={() =>
                handleSubscribeGooglePlay("rocactrl_iot_mensal", "Sítio Conectado - IoT (R$ 24,90/mês)")
              }
            >
              Assinar IoT (R$ 24,90)
            </Button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-600 flex items-center justify-center gap-1.5 pt-1">
          <Mail className="h-3.5 w-3.5 text-emerald-700" />
          <span>Dúvidas sobre planos?</span>
          <a
            href="mailto:suporte.rocactrl@gmail.com"
            className="font-mono font-bold text-emerald-800 hover:underline"
          >
            suporte.rocactrl@gmail.com
          </a>
        </div>

        <DialogFooter className="mt-1">
          <Button variant="ghost" onClick={onClose} className="w-full text-xs text-slate-600">
            Continuar no Plano Gratuito (R$ 0/mês)
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
          <h4 className="text-sm font-bold">Plano Chácara Produtiva Pro por apenas R$ 9,90/mês</h4>
          <p className="text-xs text-white/85">
            Libere culturas e animais ilimitados, IA sem limites e relatórios completos para sua chácara.
          </p>
        </div>
      </div>
      <Button
        onClick={onUpgradeClick}
        size="sm"
        className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold h-10 px-4 shrink-0 shadow-sm"
      >
        Ver Planos
      </Button>
    </div>
  )
}
