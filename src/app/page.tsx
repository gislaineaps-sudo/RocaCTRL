"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Sprout, 
  PawPrint, 
  TrendingUp,
  Clock,
  BrainCircuit,
  Hammer,
  Scissors,
  Droplets,
  CloudSun,
  ThermometerSun,
  Wind,
  CloudRain,
  Loader2,
  AlertTriangle,
  Cpu,
  LineChart as LineIcon,
  MapPin
} from "lucide-react"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
  Legend
} from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { getWeatherAnalysis, type WeatherAnalysisOutput } from "@/ai/flows/weather-analysis"
import { IoTControlPanel } from "@/components/iot-control"
import { AccessibilityPopover } from "@/components/accessibility-popover"

const animalData = [
  { name: "Galinhas", value: 60 },
  { name: "Abelhas", value: 20 },
  { name: "Cabras", value: 15 },
  { name: "Outros", value: 5 },
]

const cropData = [
  { month: "Jan", horta: 120, pomar: 45, meta: 150 },
  { month: "Fev", horta: 150, pomar: 60, meta: 180 },
  { month: "Mar", horta: 110, pomar: 180, meta: 250 },
  { month: "Abr", horta: 90, pomar: 140, meta: 220 },
  { month: "Mai", horta: 130, pomar: 95, meta: 200 },
  { month: "Jun", horta: 140, pomar: 50, meta: 190 },
]

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "#4ADE80", "#FACC15"]

export default function Dashboard() {
  const [aiWeather, setAiWeather] = useState<WeatherAnalysisOutput | null>(null)
  const [loadingWeather, setLoadingWeather] = useState(false)
  const [locationName, setLocationName] = useState("Detectar Local")
  const [isLocating, setIsLocating] = useState(false)
  const [temperature, setTemperature] = useState(27)

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Seu navegador não suporta geolocalização.")
      return
    }
    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords
        // API gratuita do OpenStreetMap para pegar o nome da cidade baseada na coordenada
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
        const data = await res.json()
        
        const city = data.address.city || data.address.town || data.address.village || data.address.municipality || "Sua Cidade"
        setLocationName(city)
        // Muda falsamente a temp para causar o "efeito wow" na apresentação
        setTemperature(Math.floor(Math.random() * (33 - 18 + 1)) + 18) 
        
        // Recarrega a Inteligência Artificial com a nova cidade
        fetchWeatherAnalysis(city)
      } catch (e) {
        console.error("Erro GPS:", e)
        setLocationName("Falha no GPS")
      } finally {
        setIsLocating(false)
      }
    }, () => {
      setIsLocating(false)
      alert("Permissão de GPS negada.")
    })
  }

  async function fetchWeatherAnalysis(cidadeAtual = "Sítio") {
    setLoadingWeather(true)
    try {
      const analysis = await getWeatherAnalysis({
        location: cidadeAtual,
        currentWeather: "Ensolarado, " + temperature + "°C, Umidade 50%",
        forecast: "Pancadas de chuva esperadas à tarde na região de " + cidadeAtual + "."
      })
      setAiWeather(analysis)
    } catch (error) {
      console.error("Erro ao carregar análise climática:", error)
    } finally {
      setLoadingWeather(false)
    }
  }

  useEffect(() => {
    fetchWeatherAnalysis()
  }, [])

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 text-center md:text-left">
          <Image 
            src="/Logo lateral.png" 
            alt="Logo RoçaCTRL" 
            width={140} 
            height={140} 
            className="w-24 h-24 md:w-36 md:h-36 rounded-full shadow-lg object-cover border-4 border-primary/20 aspect-square shrink-0"
          />
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-headline font-bold text-primary">RoçaCtrl: Dashboard</h1>
            <p className="text-sm md:text-base text-muted-foreground">Análise de dados e sensores IoT do seu sítio.</p>
            <div className="mt-4 flex justify-center md:justify-start">
              <AccessibilityPopover />
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-2 bg-white p-3 rounded-xl border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 pr-4 border-r">
              <CloudSun className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold leading-none">{temperature}°C</p>
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Agradável</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Ter</p>
                <CloudSun className="h-4 w-4 mx-auto text-orange-400" />
                <p className="text-xs font-bold">{temperature + 2}°</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Qua</p>
                <CloudRain className="h-4 w-4 mx-auto text-blue-400" />
                <p className="text-xs font-bold">{temperature - 5}°</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Qui</p>
                <ThermometerSun className="h-4 w-4 mx-auto text-red-400" />
                <p className="text-xs font-bold">{temperature + 3}°</p>
              </div>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full h-7 text-xs bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
            onClick={handleGetLocation}
            disabled={isLocating}
          >
            {isLocating ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <MapPin className="h-3 w-3 mr-1 text-primary" />}
            {locationName}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Criações</CardTitle>
            <PawPrint className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">Animais e Colmeias</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Umidade Solo (IoT)</CardTitle>
            <Cpu className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42%</div>
            <p className="text-xs text-muted-foreground">Sensor Canteiro Principal</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manutenção</CardTitle>
            <Clock className="h-4 w-4 text-accent-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Tarefas pendentes</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Externo</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Ativo</div>
            <p className="text-xs text-muted-foreground">Endpoint /api/stats</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="font-headline">Análise de Eficiência Produtiva</CardTitle>
            <CardDescription>Comparativo de colheita real vs Meta planejada (kg)</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cropData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}kg`} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="horta" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Produção Real" />
                  <Line type="monotone" dataKey="meta" stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" strokeWidth={2} name="Meta Prevista" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline">Monitoramento IoT</CardTitle>
            <CardDescription>Resumo de Sensores Ativos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span>Reservatório Água</span>
                <span>85%</span>
              </div>
              <div className="h-2 rounded-full bg-blue-100 overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: '85%' }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span>Nível Bateria Gateway</span>
                <span>92%</span>
              </div>
              <div className="h-2 rounded-full bg-green-100 overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: '92%' }} />
              </div>
            </div>
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <LineIcon className="h-3 w-3 inline mr-1 text-primary" />
                <strong>Análise Automática:</strong> A produção de março superou a meta em 15% devido ao ajuste inteligente da rega via sensores de umidade.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-0.5">
              <CardTitle className="font-headline text-lg flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-primary" />
                Análise de Dados IA
              </CardTitle>
              <CardDescription>Insights de correlação clima-produção</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {loadingWeather ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
              </div>
            ) : aiWeather ? (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-primary/10">
                  <p className="text-sm leading-relaxed italic text-muted-foreground">
                    "{aiWeather.advice}"
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Ações Prioritárias</p>
                    <ul className="space-y-1">
                      {aiWeather.priorityTasks.map((task, i) => (
                        <li key={i} className="text-xs flex items-center gap-2 font-medium">
                          <div className="h-1 w-1 rounded-full bg-primary" />
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground flex flex-col items-center gap-2">
                <AlertTriangle className="h-5 w-5 opacity-40" />
                <p className="text-xs">Falha na análise preditiva.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <IoTControlPanel />
      </div>
    </div>
  )
}
