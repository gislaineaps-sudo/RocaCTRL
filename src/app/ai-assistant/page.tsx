"use client"

import React, { useState, useRef, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BrainCircuit, Loader2, Mic, Send, User } from "lucide-react"
import { submitGeneralChat } from "@/ai/flows/general-chat"

type Message = {
  id: string
  role: "user" | "assistant"
  text: string
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      role: "assistant",
      text: "Olá! Sou o Assistente IA do RoçaCtrl. Você pode me perguntar livremente sobre o manejo do seu rebanho, como começar a horta comunitária, análise climática, ou dúvidas curtas sobre o sítio. Como posso ajudar agora?"
    }
  ])
  const [inputValue, setInputValue] = useState("")
  const [loading, setLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

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

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInputValue(prev => prev ? prev + ' ' + transcript : transcript)
    }

    recognition.onerror = (event: any) => {
      console.error("Erro no reconhecimento de voz:", event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    const userMessageText = inputValue.trim()
    if (!userMessageText || loading) return

    const newUserMsg: Message = { id: Date.now().toString(), role: "user", text: userMessageText }
    
    // Add user message to UI
    const updatedMessages = [...messages, newUserMsg]
    setMessages(updatedMessages)
    setInputValue("")
    setLoading(true)

    // Format History for the backend
    const historyText = messages
      .map(m => `[${m.role === 'user' ? 'Gendeiro' : 'IA'}]: ${m.text}`)
      .join("\n")

    try {
      const aiResponseText = await submitGeneralChat(userMessageText, historyText)
      const newAIMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", text: aiResponseText }
      setMessages(prev => [...prev, newAIMsg])
    } catch (err) {
      console.error(err)
      const errorMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", text: "Me desculpe, ocorreu um erro ao conectar aos servidores de dados. Tente novamente em instantes." }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col space-y-4 pb-4">
      {/* Header */}
      <Card className="flex-none shadow-sm pb-4">
        <CardHeader className="text-center space-y-2 pb-0">
          <div className="flex justify-center">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 text-primary">
              <BrainCircuit className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-3xl font-headline font-bold text-primary">
            Assistente IA RoçaCtrl
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Sua consultoria agrônoma em tempo real por chat de voz e texto.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto rounded-xl border bg-card p-4 shadow-inner space-y-6">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`flex-none p-2 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-accent/20 text-foreground' : 'bg-primary/20 text-primary'}`}>
              {msg.role === 'user' ? <User className="h-5 w-5" /> : <BrainCircuit className="h-5 w-5" />}
            </div>
            
            <div className={`max-w-[80%] p-4 rounded-2xl text-[15px] shadow-sm whitespace-pre-wrap leading-relaxed ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-white border rounded-tl-sm'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-start gap-4">
            <div className="flex-none p-2 rounded-full bg-primary/20 text-primary flex items-center justify-center">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div className="flex items-center p-4 rounded-2xl bg-white border rounded-tl-sm">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="ml-2 text-sm text-muted-foreground font-medium">Analisando dados do campo...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex-none bg-card p-2 rounded-xl border shadow-sm">
        <form onSubmit={handleSendMessage} className="flex gap-2 relative">
          <Button 
            type="button" 
            size="icon"
            variant="outline"
            className={`rounded-full h-12 w-12 flex-none ${isListening ? 'bg-red-100 border-red-500 text-red-500 animate-pulse' : 'text-primary border-primary/20 bg-primary/5 hover:bg-primary/10'}`}
            onClick={handleListen}
            title={isListening ? "Ouvindo..." : "Falar no Microfone"}
          >
            <Mic className="h-5 w-5" />
          </Button>

          <Input 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Digite algo longo ou clique no microfone para falar..."
            className="flex-1 h-12 text-base px-5 shadow-inner border-border/50 rounded-full"
            disabled={loading}
          />
          
          <Button 
            type="submit" 
            size="icon"
            disabled={!inputValue.trim() || loading}
            className="rounded-full h-12 w-12 flex-none bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  )
}
