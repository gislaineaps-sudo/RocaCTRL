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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageSquareWarning, Send, Share2, Sparkles, Bug, HelpCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BetaFeedbackModalProps {
  isOpen: boolean
  onClose: () => void
}

export function BetaFeedbackModal({ isOpen, onClose }: BetaFeedbackModalProps) {
  const { toast } = useToast()
  const [feedbackType, setFeedbackType] = useState<"sugestao" | "problema" | "duvida">("sugestao")
  const [message, setMessage] = useState("")
  const [userName, setUserName] = useState("")

  const handleSendWhatsApp = () => {
    const typeLabel =
      feedbackType === "sugestao"
        ? "💡 Sugestão de Melhoria"
        : feedbackType === "problema"
        ? "🐞 Relato de Problema (Beta)"
        : "❓ Dúvida de Uso"

    const text = [
      `🌾 *Feedback Beta - RoçaCtrl*`,
      `📌 *Tipo:* ${typeLabel}`,
      userName.trim() ? `👤 *Produtor(a):* ${userName.trim()}` : null,
      `💬 *Mensagem:* ${message.trim() || "Gostaria de falar com o suporte do RoçaCtrl."}`,
    ]
      .filter(Boolean)
      .join("\n")

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(whatsappUrl, "_blank", "noopener,noreferrer")

    toast({
      title: "Redirecionando para o WhatsApp",
      description: "Obrigado por ajudar a melhorar o RoçaCtrl!",
    })
    setMessage("")
    onClose()
  }

  const handleQuickSave = () => {
    if (!message.trim()) {
      toast({
        title: "Escreva sua mensagem",
        description: "Por favor, descreva sua sugestão ou o problema encontrado.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Feedback Beta Registrado! 🌱",
      description: "Sua contribuição foi salva e enviada para a equipe do RoçaCtrl.",
    })
    setMessage("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-headline font-bold text-slate-900">
            <MessageSquareWarning className="h-5 w-5 text-primary" />
            Relatar Problema / Sugestão (Beta)
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-600">
            Encontrou algum erro ou tem uma ideia para facilitar o dia a dia no campo? Conte para nós!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-800">O que você deseja enviar?</Label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFeedbackType("sugestao")}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  feedbackType === "sugestao"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Sparkles className="h-4 w-4" />
                <span>Sugestão</span>
              </button>

              <button
                type="button"
                onClick={() => setFeedbackType("problema")}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  feedbackType === "problema"
                    ? "border-rose-600 bg-rose-50 text-rose-800"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Bug className="h-4 w-4" />
                <span>Problema</span>
              </button>

              <button
                type="button"
                onClick={() => setFeedbackType("duvida")}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  feedbackType === "duvida"
                    ? "border-amber-600 bg-amber-50 text-amber-900"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <HelpCircle className="h-4 w-4" />
                <span>Dúvida</span>
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="fb-name" className="text-xs font-bold text-slate-800">
              Seu Nome / Sítio (Opcional)
            </Label>
            <Input
              id="fb-name"
              placeholder="Ex: João - Sítio Boa Esperança"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="h-10 border-slate-300 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="fb-msg" className="text-xs font-bold text-slate-800">
              Descrição do Problema ou Sugestão *
            </Label>
            <textarea
              id="fb-msg"
              rows={3}
              placeholder="Descreva aqui o que aconteceu ou sua sugestão de melhoria..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleSendWhatsApp}
            className="w-full sm:w-auto gap-1.5 border-emerald-300 text-emerald-800 hover:bg-emerald-50 font-semibold h-11"
          >
            <Share2 className="h-4 w-4 text-emerald-600" /> Enviar via WhatsApp
          </Button>
          <Button
            type="button"
            onClick={handleQuickSave}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-bold gap-1.5 h-11"
          >
            <Send className="h-4 w-4" /> Enviar Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
