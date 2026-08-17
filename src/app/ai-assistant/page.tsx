"use client"

import React, { useState, useRef, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  BrainCircuit, 
  Loader2, 
  Mic, 
  Send, 
  User, 
  Key, 
  Sparkles, 
  Check, 
  HelpCircle,
  Sprout,
  ShieldAlert,
  Bot,
  Droplets,
  Bug,
  LineChart as LineIcon
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { submitGeneralChat } from "@/ai/flows/general-chat"
import { useToast } from "@/hooks/use-toast"

type Message = {
  id: string
  role: "user" | "assistant"
  text: string
}

const QUICK_PROMPTS = [
  { text: "Como combater lagartas em hortaliças de forma orgânica?", icon: Bug },
  { text: "Qual a umidade ideal para o solo de milho nesta época?", icon: Droplets },
  { text: "Resuma meus gastos e receitas deste mês.", icon: LineIcon },
  { text: "Quais culturas são recomendadas para o Sudeste em agosto?", icon: Sprout },
  { text: "Como melhorar a postura de ovos das galinhas caipiras?", icon: Sparkles }
]

export default function AIAssistant() {
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      role: "assistant",
      text: "Olá, produtor(a)! Sou o **Assistente Agro do RoçaCtrl**. Estou aqui para orientar sobre épocas de plantio, manejo de criações, adubação orgânica, controle agroecológico de pragas e planejamento do seu sítio. Clique em uma das perguntas rápidas abaixo ou digite sua dúvida!"
    }
  ])
  const [inputValue, setInputValue] = useState("")
  const [loading, setLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [apiKey, setApiKey] = useState("")
  const [isKeyDialogOpen, setIsKeyDialogOpen] = useState(false)
  const [tempKey, setTempKey] = useState("")
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Carrega chave de API salva no localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedKey = localStorage.getItem("rocactrl_gemini_api_key") || ""
      setApiKey(savedKey)
      setTempKey(savedKey)
    }
  }, [])

  // Auto-scroll para a última mensagem
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSaveApiKey = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("rocactrl_gemini_api_key", tempKey.trim())
      setApiKey(tempKey.trim())
      setIsKeyDialogOpen(false)
      toast({
        title: tempKey.trim() ? "Chave Gemini Conectada!" : "Chave removida",
        description: tempKey.trim() ? "O modelo Gemini 2.5 Flash foi ativado em tempo real." : "Usando a base agronômica local.",
      })
    }
  }

  const handleListen = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Seu navegador não suporta reconhecimento de voz direto.")
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'pt-BR'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => setIsListening(true)
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInputValue(prev => prev ? prev + ' ' + transcript : transcript)
    }
    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)
    recognition.start()
  }

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || inputValue).trim()
    if (!messageText || loading) return

    const newUserMsg: Message = { id: Date.now().toString(), role: "user", text: messageText }
    const updatedMessages = [...messages, newUserMsg]
    setMessages(updatedMessages)
    if (!textToSend) setInputValue("")
    setLoading(true)

    // Formata o histórico
    const historyText = messages
      .slice(-6)
      .map(m => `[${m.role === 'user' ? 'Produtor' : 'Agrônomo RoçaCtrl'}]: ${m.text}`)
      .join("\n")

    try {
      const aiResponseText = await submitGeneralChat(messageText, historyText, apiKey || undefined)
      const newAIMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", text: aiResponseText }
      setMessages(prev => [...prev, newAIMsg])
    } catch (err) {
      console.error("Erro no chat:", err)
      const errorMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: "assistant", 
        text: "Desculpe, ocorreu uma instabilidade momentânea na conexão. Tente novamente em instantes." 
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-headline font-bold text-slate-900 flex items-center gap-2.5">
            <BrainCircuit className="h-7 w-7 text-primary" /> Consultor Agrônomo IA
          </h1>
          <p className="text-sm text-slate-600 font-medium">
            Orientações de plantio, manejo zootécnico, clima e agroecologia.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {apiKey ? (
            <Badge className="bg-emerald-600/15 text-emerald-800 border-emerald-300 gap-1.5 py-1 px-3">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> Gemini 2.5 Flash Ativo
            </Badge>
          ) : (
            <Badge variant="outline" className="text-slate-700 border-slate-300 gap-1.5 py-1 px-3">
              <Bot className="h-3.5 w-3.5 text-primary" /> Base Agro Integrada
            </Badge>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsKeyDialogOpen(true)}
            className="gap-1.5 text-xs h-10 border-slate-300 text-slate-800 hover:bg-slate-50 font-semibold"
          >
            <Key className="h-3.5 w-3.5 text-primary" />
            {apiKey ? "Alterar Chave" : "Conectar Chave Gemini"}
          </Button>
        </div>
      </div>

      {/* Caixa de Mensagens */}
      <Card className="border border-slate-200 shadow-sm flex flex-col h-[520px]">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-1 border border-primary/20 shadow-2xs">
                  <BrainCircuit className="h-4 w-4" />
                </div>
              )}
              
              <div
                className={`rounded-2xl px-4 py-3 max-w-[85%] text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-primary text-white shadow-xs rounded-tr-xs font-medium'
                    : 'bg-white border border-slate-200 shadow-xs rounded-tl-xs text-slate-900 prose-sm max-w-none'
                }`}
              >
                {m.text}
              </div>

              {m.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                <BrainCircuit className="h-4 w-4" />
              </div>
              <div className="bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 rounded-tl-xs flex items-center gap-2 text-slate-700 text-sm font-medium">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span>Consultando recomendações agronômicas...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </CardContent>

        {/* CHIPS DE ATALHOS RÁPIDOS PARA O PRODUTOR */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-700 font-bold shrink-0 flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Atalhos Rápidos:
          </span>
          {QUICK_PROMPTS.map((item, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(item.text)}
              disabled={loading}
              className="bg-white border border-slate-300 hover:border-primary text-slate-800 hover:text-primary px-3.5 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all shadow-2xs hover:shadow-xs shrink-0 disabled:opacity-50 flex items-center gap-1.5 active:scale-95"
            >
              <item.icon className="h-3.5 w-3.5 text-primary" />
              <span>{item.text}</span>
            </button>
          ))}
        </div>

        {/* Input de Mensagem */}
        <div className="p-3 border-t border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
            className="flex items-center gap-2"
          >
            <Button
              type="button"
              variant="outline"
              size="icon"
              className={`shrink-0 rounded-2xl h-11 w-11 border-slate-300 ${isListening ? 'bg-rose-100 text-rose-600 border-rose-300 animate-pulse' : 'text-slate-700'}`}
              onClick={handleListen}
              title="Falar por voz"
            >
              <Mic className="h-5 w-5" />
            </Button>

            <Input
              placeholder="Digite sua dúvida sobre plantio, adubo, controle de pragas, rebanho..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={loading}
              className="flex-1 rounded-xl h-11 px-4 text-sm border-slate-300 text-slate-900"
            />

            <Button
              type="submit"
              size="icon"
              disabled={loading || !inputValue.trim()}
              className="shrink-0 rounded-2xl h-11 w-11 bg-primary hover:bg-primary/90 text-white shadow-xs"
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </Card>

      {/* Modal de Conectar Chave do Google Gemini */}
      <Dialog open={isKeyDialogOpen} onOpenChange={setIsKeyDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-headline font-bold text-slate-900">
              <Key className="h-5 w-5 text-primary" /> Chave Google Gemini API
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Ao adicionar sua chave de API do <strong>Google AI Studio</strong> (100% gratuita), o RoçaCtrl desbloqueia o modelo <strong>Gemini 2.5 Flash</strong> com respostas generativas sob medida para qualquer contexto do seu sítio.
            </p>

            <div className="space-y-1.5">
              <Label htmlFor="gemini-key" className="text-xs font-bold text-slate-800">Sua API Key do Google Gemini</Label>
              <Input
                id="gemini-key"
                type="password"
                placeholder="AIzaSy..."
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                className="h-11 font-mono text-sm border-slate-300"
              />
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-slate-700 space-y-1">
              <p className="font-bold text-emerald-800">Como obter sua chave gratuita em 1 minuto:</p>
              <ol className="list-decimal pl-4 space-y-0.5 text-[11px]">
                <li>Acesse <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="text-primary font-bold underline">aistudio.google.com/apikey</a></li>
                <li>Faça login com sua conta Google e clique em <em>Create API key</em></li>
                <li>Copie e cole sua chave no campo acima.</li>
              </ol>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsKeyDialogOpen(false)} className="h-11">
              Cancelar
            </Button>
            <Button onClick={handleSaveApiKey} className="h-11 bg-primary hover:bg-primary/90 text-white font-bold">
              Salvar Chave
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
