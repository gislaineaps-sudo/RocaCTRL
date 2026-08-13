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
  Bot
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  "Quais culturas são recomendadas para o Sudeste em agosto?",
  "Como controlar pulgões e lagartas na horta orgânica?",
  "Qual a quantidade diária de ração para galinhas poedeiras?",
  "Como fazer biofertilizante líquido caseiro?",
  "Dicas de rotação de culturas para canteiros pequenos"
]

export default function AIAssistant() {
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      role: "assistant",
      text: "Olá, produtor(a)! Sou o **Assistente Agro do RoçaCtrl**. Estou aqui para orientar sobre épocas de plantio, manejo de criações, adubação orgânica, controle agroecológico de pragas e planejamento do seu sítio. Como posso te ajudar hoje?"
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
      alert("Seu navegador não suporta reconhecimento de voz.")
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
        text: "Desculpe, ocorreu uma instabilidade na conexão. Tente perguntar novamente em instantes." 
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-headline font-bold text-primary flex items-center gap-2.5">
            <BrainCircuit className="h-7 w-7 text-primary" /> Consultor Agrônomo IA
          </h1>
          <p className="text-sm text-muted-foreground">
            Dúvidas zootécnicas, botânicas, calendários de plantio e receitas agroecológicas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {apiKey ? (
            <Badge className="bg-emerald-600/15 text-emerald-700 hover:bg-emerald-600/25 border-emerald-300 gap-1.5 py-1 px-3">
              <Sparkles className="h-3.5 w-3.5" /> Gemini 2.5 Flash Ativo
            </Badge>
          ) : (
            <Badge variant="outline" className="text-muted-foreground gap-1.5 py-1 px-3">
              <Bot className="h-3.5 w-3.5 text-primary" /> Base Agro Integrada
            </Badge>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsKeyDialogOpen(true)}
            className="gap-1.5 text-xs h-8"
          >
            <Key className="h-3.5 w-3.5 text-primary" />
            {apiKey ? "Alterar Chave" : "Conectar Chave Gemini"}
          </Button>
        </div>
      </div>

      {/* Caixa de Mensagens */}
      <Card className="border shadow-sm flex flex-col h-[520px]">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-1 border border-primary/20">
                  <BrainCircuit className="h-4 w-4" />
                </div>
              )}
              
              <div
                className={`rounded-2xl px-4 py-3 max-w-[85%] text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-primary text-white shadow-xs rounded-tr-xs'
                    : 'bg-card border border-border/80 shadow-xs rounded-tl-xs text-foreground prose-sm max-w-none'
                }`}
              >
                {m.text}
              </div>

              {m.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                <BrainCircuit className="h-4 w-4" />
              </div>
              <div className="bg-muted/50 border rounded-2xl px-4 py-3 rounded-tl-xs flex items-center gap-2 text-muted-foreground text-sm">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span>Analisando recomendações agronômicas...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </CardContent>

        {/* Sugestões Rápidas */}
        <div className="px-4 py-2 bg-muted/20 border-t flex items-center gap-2 overflow-x-auto text-xs pb-2">
          <span className="text-muted-foreground font-medium shrink-0 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-primary" /> Sugestões:
          </span>
          {QUICK_PROMPTS.map((promptText, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(promptText)}
              disabled={loading}
              className="bg-card border hover:border-primary/50 text-muted-foreground hover:text-primary px-3 py-1 rounded-full whitespace-nowrap transition-colors shrink-0 disabled:opacity-50"
            >
              {promptText}
            </button>
          ))}
        </div>

        {/* Input de Mensagem */}
        <div className="p-3 border-t bg-card">
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
              className={`shrink-0 rounded-full h-10 w-10 ${isListening ? 'bg-red-100 text-red-600 border-red-300 animate-pulse' : ''}`}
              onClick={handleListen}
              title="Falar por voz"
            >
              <Mic className="h-4 w-4" />
            </Button>

            <Input
              placeholder="Digite sua dúvida sobre cultivo, animais, clima, adubação..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={loading}
              className="flex-1 rounded-full h-10 px-4 text-sm"
            />

            <Button
              type="submit"
              size="icon"
              disabled={loading || !inputValue.trim()}
              className="shrink-0 rounded-full h-10 w-10 bg-primary hover:bg-primary/90 text-white shadow-xs"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>

      {/* Modal de Conectar Chave do Google Gemini */}
      <Dialog open={isKeyDialogOpen} onOpenChange={setIsKeyDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-headline">
              <Key className="h-5 w-5 text-primary" /> Chave Google Gemini API
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Ao adicionar sua chave de API do <strong>Google AI Studio</strong> (100% gratuita), o RoçaCtrl desbloqueia o modelo <strong>Gemini 2.5 Flash</strong> com respostas generativas sob medida para qualquer contexto do seu sítio.
            </p>

            <div className="space-y-1.5">
              <Label htmlFor="gemini-key">Sua API Key do Google Gemini</Label>
              <Input
                id="gemini-key"
                type="password"
                placeholder="AIzaSy..."
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
              />
            </div>

            <div className="p-3 bg-primary/5 rounded-lg border border-primary/10 text-[11px] text-muted-foreground space-y-1">
              <p className="font-semibold text-primary">Como obter uma chave gratuita:</p>
              <ol className="list-decimal pl-4 space-y-0.5">
                <li>Acesse <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="text-primary underline">aistudio.google.com/apikey</a></li>
                <li>Faça login com sua conta Google e clique em <em>Create API key</em></li>
                <li>Copie e cole sua chave no campo acima.</li>
              </ol>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsKeyDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveApiKey} className="bg-primary hover:bg-primary/90">
              Salvar Chave
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
