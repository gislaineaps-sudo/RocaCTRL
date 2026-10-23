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
import {
  MessageSquareWarning,
  Send,
  Sparkles,
  Bug,
  HelpCircle,
  Mail,
  Copy,
  Check,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { doc, setDoc } from "firebase/firestore"
import { db, isFirebaseConfigured } from "@/lib/firebase"
import { RocaDB } from "@/lib/db"
import { useAuth } from "@/context/AuthContext"

interface BetaFeedbackModalProps {
  isOpen: boolean
  onClose: () => void
}

export function BetaFeedbackModal({ isOpen, onClose }: BetaFeedbackModalProps) {
  const { toast } = useToast()
  const { user } = useAuth()
  const [feedbackType, setFeedbackType] = useState<"duvida" | "sugestao" | "problema">("duvida")
  const [message, setMessage] = useState("")
  const [userName, setUserName] = useState("")
  const [copied, setCopied] = useState(false)

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("suporte.rocactrl@gmail.com")
      setCopied(true)
      toast({
        title: "E-mail copiado!",
        description: "suporte.rocactrl@gmail.com copiado para a área de transferência.",
      })
      setTimeout(() => setCopied(false), 2500)
    } catch {
      toast({
        title: "E-mail de suporte",
        description: "suporte.rocactrl@gmail.com",
      })
    }
  }

  const handleSubmitForm = (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!message.trim()) {
      toast({
        title: "Escreva sua mensagem",
        description: "Por favor, descreva sua dúvida, sugestão ou erro no sistema.",
        variant: "destructive",
      })
      return
    }

    const saved = RocaDB.saveFeedback({
      userId: user?.uid || "demo",
      uid: user?.uid || "demo",
      userName: userName.trim() || user?.name || "Produtor(a)",
      userEmail: user?.email || "visitante@rocactrl.com.br",
      farmName: user?.farmName || "Meu Sítio",
      type: feedbackType,
      message: message.trim(),
      status: "pending",
    })

    if (isFirebaseConfigured && db) {
      setDoc(doc(db, "feedbacks", saved.id), saved, { merge: true }).catch(() => {})
    }

    toast({
      title: "Mensagem enviada com sucesso! 🌱",
      description: "Mensagem enviada com sucesso! Nossa equipe responderá em breve.",
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
            Suporte & Relato de Problemas
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-600">
            Envie sua mensagem diretamente para nossa equipe ou entre em contato pelo e-mail oficial.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmitForm} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-800">Qual o tipo do seu contato?</Label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFeedbackType("duvida")}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  feedbackType === "duvida"
                    ? "border-amber-600 bg-amber-50 text-amber-900 shadow-2xs"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <HelpCircle className="h-4 w-4" />
                <span>Dúvida</span>
              </button>

              <button
                type="button"
                onClick={() => setFeedbackType("sugestao")}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  feedbackType === "sugestao"
                    ? "border-primary bg-primary/10 text-primary shadow-2xs"
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
                    ? "border-rose-600 bg-rose-50 text-rose-800 shadow-2xs"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Bug className="h-4 w-4" />
                <span>Erro no Sistema</span>
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="fb-name" className="text-xs font-bold text-slate-800">
              Seu Nome / Sítio (Opcional)
            </Label>
            <Input
              id="fb-name"
              placeholder={user ? `${user.name} - ${user.farmName}` : "Ex: João - Meu Sítio"}
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="h-11 bg-white border border-gray-300 text-gray-800 font-medium placeholder:text-gray-400 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="fb-msg" className="text-xs font-bold text-slate-800">
              Sua Mensagem *
            </Label>
            <textarea
              id="fb-msg"
              rows={3}
              placeholder="Escreva aqui sua dúvida, sugestão ou descreva o erro encontrado..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-xl bg-white border border-gray-300 p-3 text-sm text-gray-800 font-medium placeholder:text-gray-400 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              required
            />
          </div>

          <DialogFooter className="pt-1">
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold gap-2 h-11 rounded-xl"
            >
              <Send className="h-4 w-4" /> Enviar Mensagem para o Suporte
            </Button>
          </DialogFooter>
        </form>

        {/* Canal 2: E-mail Oficial com botão de Copiar */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 shrink-0">
              <Mail className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-slate-700">E-mail Oficial de Atendimento:</p>
              <a
                href="mailto:suporte.rocactrl@gmail.com"
                className="text-xs font-mono font-bold text-emerald-800 hover:underline truncate block"
              >
                suporte.rocactrl@gmail.com
              </a>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopyEmail}
            className="h-9 px-3 text-xs font-bold border-slate-300 text-slate-800 hover:bg-slate-100 gap-1.5 shrink-0"
          >
            {copied ? (
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
      </DialogContent>
    </Dialog>
  )
}
