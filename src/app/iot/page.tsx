"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Cpu, Droplets, Thermometer, Waves, RefreshCw, Signal } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function IoTPage() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [sensors, setSensors] = useState({
    moisture: 42,
    temp: 27.5,
    water: 85,
    lastUpdate: new Date().toLocaleTimeString()
  })

  const refreshData = () => {
    setIsRefreshing(true)
    // Simula chamada de API de sensores IoT
    setTimeout(() => {
      setSensors({
        moisture: Math.floor(Math.random() * (60 - 30) + 30),
        temp: Math.floor(Math.random() * (32 - 22) + 22),
        water: Math.floor(Math.random() * (100 - 70) + 70),
        lastUpdate: new Date().toLocaleTimeString()
      })
      setIsRefreshing(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Monitoramento IoT</h1>
          <p className="text-muted-foreground">Sensores em tempo real espalhados pela propriedade.</p>
        </div>
        <Button onClick={refreshData} variant="outline" disabled={isRefreshing} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Atualizar Sensores
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <Droplets className="h-8 w-8 text-blue-500" />
              <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Online</Badge>
            </div>
            <CardTitle className="text-lg pt-4">Umidade do Solo</CardTitle>
            <CardDescription>Sensor: Canteiro de Alface</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-4">{sensors.moisture}%</div>
            <Progress value={sensors.moisture} className="h-2 bg-blue-100" />
            <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
              <Signal className="h-3 w-3" /> Sinal: Forte • Atualizado: {sensors.lastUpdate}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <Thermometer className="h-8 w-8 text-orange-500" />
              <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Online</Badge>
            </div>
            <CardTitle className="text-lg pt-4">Temperatura Ambiente</CardTitle>
            <CardDescription>Sensor: Galinheiro Lote 01</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-4">{sensors.temp}°C</div>
            <div className="flex gap-1 h-2">
              <div className="flex-1 bg-orange-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500" style={{ width: `${(sensors.temp/40)*100}%` }} />
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
              <Signal className="h-3 w-3" /> Sinal: Médio • Atualizado: {sensors.lastUpdate}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-cyan-500">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <Waves className="h-8 w-8 text-cyan-500" />
              <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Online</Badge>
            </div>
            <CardTitle className="text-lg pt-4">Nível do Tanque</CardTitle>
            <CardDescription>Sensor: Reservatório Principal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-4">{sensors.water}%</div>
            <Progress value={sensors.water} className="h-2 bg-cyan-100" />
            <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
              <Signal className="h-3 w-3" /> Sinal: Forte • Atualizado: {sensors.lastUpdate}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-primary" />
            Configuração da Rede IoT
          </CardTitle>
          <CardDescription>Gateway LoRaWAN conectado via Wi-Fi do Sítio.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground leading-relaxed">
            Este painel consome dados de sensores de baixo consumo de energia (LoRa). 
            As leituras são integradas automaticamente para acionar alertas de irrigação caso a umidade do solo caia abaixo de 30%.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
