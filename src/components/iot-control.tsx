"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Power, RefreshCcw, Wifi, AlertTriangle } from "lucide-react"

export function IoTControlPanel() {
  const [ip, setIp] = useState("192.168.0.100")
  const [status, setStatus] = useState<string>("Buscando...")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const sendCommand = async (path: string) => {
    if (!ip) return
    setLoading(true)
    setErrorMsg(null)
    
    try {
      // Constrói a URL usando o IP informado
      const url = `http://${ip}${path}`
      
      const response = await fetch(url, {
        method: "GET",
        // Importante: No dispositivo IoT (ESP32/Arduino), você precisará configurar
        // o cabeçalho 'Access-Control-Allow-Origin: *' para que o navegador permita a leitura (CORS).
      })
      
      if (!response.ok) {
        throw new Error(`Status ${response.status}`)
      }
      
      const data = await response.text()
      setStatus(`Resposta: ${data}`)
      
    } catch (error: any) {
      console.error(error)
      setErrorMsg("Falha na conexão. O dispositivo está ligado nesta rede?")
      setStatus("Erro")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-headline">
          <Wifi className="h-5 w-5 text-blue-500" />
          Controle IoT Local
        </CardTitle>
        <CardDescription>Envie comandos diretos via requisições HTTP</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-muted-foreground">Endereço IP Local (ESP32/Arduino)</label>
          <div className="flex gap-2">
            <Input 
              type="text" 
              placeholder="ex: 192.168.0.100" 
              value={ip} 
              onChange={(e) => setIp(e.target.value)} 
              className="font-mono text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="default" 
            onClick={() => sendCommand('/ligar')}
            disabled={loading}
            className="flex items-center gap-2 w-full"
          >
            <Power className="h-4 w-4" /> Ligar
          </Button>

          <Button 
            variant="destructive" 
            onClick={() => sendCommand('/desligar')}
            disabled={loading}
            className="flex items-center gap-2 w-full"
          >
            <Power className="h-4 w-4" /> Desligar
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => sendCommand('/status')}
            disabled={loading}
            className="col-span-2 flex items-center gap-2 w-full"
          >
            <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Atualizar / Ler Sensores
          </Button>
        </div>

        {errorMsg && (
          <div className="text-xs text-red-600 bg-red-50 p-3 rounded-md flex items-start gap-2 border border-red-100">
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="bg-muted px-3 py-2 rounded-md text-xs font-mono break-all text-muted-foreground">
          {status}
        </div>
        
      </CardContent>
    </Card>
  )
}
