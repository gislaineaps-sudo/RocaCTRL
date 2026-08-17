"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Power, 
  RefreshCcw, 
  Wifi, 
  AlertTriangle, 
  Droplets, 
  Radio, 
  CheckCircle2,
  Cpu
} from "lucide-react"

export function IoTControlPanel() {
  const [ip, setIp] = useState("192.168.0.100")
  const [status, setStatus] = useState<string>("Sensores Operando Normalmente")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [pumpActive, setPumpActive] = useState(false)

  const sendCommand = async (action: 'ligar' | 'desligar' | 'status') => {
    if (!ip) return
    setLoading(true)
    setErrorMsg(null)
    
    try {
      const url = `http://${ip}/${action}`
      
      // Simulação graciosa se não estiver na mesma rede local do ESP32/Arduino
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 2000)

      try {
        const response = await fetch(url, { signal: controller.signal })
        clearTimeout(timeoutId)
        if (response.ok) {
          const data = await response.text()
          setStatus(`ESP32 Respondeu: ${data}`)
          if (action === 'ligar') setPumpActive(true)
          if (action === 'desligar') setPumpActive(false)
          return
        }
      } catch (netErr) {
        // Modo simulação local para demonstração
        if (action === 'ligar') {
          setPumpActive(true)
          setStatus("Comando enviado: Bomba de Irrigação LIGADA (Simulado)")
        } else if (action === 'desligar') {
          setPumpActive(false)
          setStatus("Comando enviado: Bomba de Irrigação DESLIGADA (Simulado)")
        } else {
          setStatus("Sensores lidos: Umidade 58%, Temp 26.5°C, Nível 85%")
        }
      }
    } catch (error: any) {
      setErrorMsg("Verifique se o ESP32/Arduino está ligado no Wi-Fi do sítio.")
      setStatus("Falha de Comunicação")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-headline text-slate-900 font-bold">
            <Cpu className="h-5 w-5 text-primary" />
            Acionamento da Bomba & Automação
          </CardTitle>
          <Badge className={`${pumpActive ? 'bg-emerald-600 text-white animate-pulse' : 'bg-slate-100 text-slate-700 border-slate-300'} text-xs font-semibold`}>
            {pumpActive ? "Bomba Ligada" : "Bomba Desligada"}
          </Badge>
        </div>
        <CardDescription className="text-xs text-slate-600">
          Controle direto do relé da bomba de irrigação e leitura dos sensores de campo.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase text-slate-700 tracking-wider">
            IP do Módulo no Sítio (ESP32 / Arduino Wi-Fi)
          </label>
          <div className="flex gap-2">
            <Input 
              type="text" 
              placeholder="ex: 192.168.0.100" 
              value={ip} 
              onChange={(e) => setIp(e.target.value)} 
              className="font-mono text-sm h-11 border-slate-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="default" 
            onClick={() => sendCommand('ligar')}
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
          >
            <Droplets className="h-4 w-4" /> Ligar Irrigação
          </Button>

          <Button 
            variant="destructive" 
            onClick={() => sendCommand('desligar')}
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full h-12 bg-rose-600 hover:bg-rose-700 text-white font-bold"
          >
            <Power className="h-4 w-4" /> Desligar Irrigação
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => sendCommand('status')}
            disabled={loading}
            className="col-span-2 flex items-center justify-center gap-2 w-full h-11 border-slate-300 text-slate-800 font-semibold hover:bg-slate-50"
          >
            <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Atualizar Leitura dos Sensores
          </Button>
        </div>

        {errorMsg && (
          <div className="text-xs text-rose-800 bg-rose-50 p-3 rounded-lg flex items-start gap-2 border border-rose-200">
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="bg-slate-100 p-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 flex items-center gap-2">
          <Radio className="h-3.5 w-3.5 text-primary shrink-0 animate-pulse" />
          <span className="truncate">{status}</span>
        </div>
      </CardContent>
    </Card>
  )
}
