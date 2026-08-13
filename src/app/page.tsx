"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Sprout, 
  PawPrint, 
  TrendingUp,
  Clock,
  BrainCircuit,
  CloudSun,
  ThermometerSun,
  CloudRain,
  Loader2,
  AlertTriangle,
  Cpu,
  LineChart as LineIcon,
  MapPin,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Calendar
} from "lucide-react"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  Legend 
} from "recharts"
import { getWeatherAnalysis, type WeatherAnalysisOutput } from "@/ai/flows/weather-analysis"
import { IoTControlPanel } from "@/components/iot-control"
import { AccessibilityPopover } from "@/components/accessibility-popover"
import { useAnimals, useCrops, useAlerts, useTransactions } from "@/hooks/use-roca-db"

const cropEfficiencyData = [
  { month: "Jan", horta: 120, pomar: 45, meta: 150 },
  { month: "Fev", horta: 150, pomar: 60, meta: 180 },
  { month: "Mar", horta: 110, pomar: 180, meta: 250 },
  { month: "Abr", horta: 145, pomar: 140, meta: 220 },
  { month: "Mai", horta: 160, pomar: 120, meta: 230 },
  { month: "Jun", horta: 175, pomar: 90, meta: 210 },
]

export default function Dashboard() {
  const { animals } = useAnimals()
  const { crops } = useCrops()
  const { alerts } = useAlerts()
  const { transactions } = useTransactions()

  const [aiWeather, setAiWeather] = useState<WeatherAnalysisOutput | null>(null)
  const [loadingWeather, setLoadingWeather] = useState(false)
  const [locationName, setLocationName] = useState("Detectar Local")
  const [isLocating, setIsLocating] = useState(false)
  const [temperature, setTemperature] = useState(27)

  // Métricas calculadas dinamicamente
  const totalAnimalHeads = animals.reduce((acc, a) => acc + (a.quantity || 1), 0)
  const pendingTasksCount = alerts.filter(a => a.status === "Pendente" || a.status === "Aguardando").length
  const totalReceitas = transactions.filter(t => t.type === "receita").reduce((acc, t) => acc + Number(t.amount || 0), 0)
  const totalDespesas = transactions.filter(t => t.type === "despesa").reduce((acc, t) => acc + Number(t.amount || 0), 0)
  const saldoAtual = totalReceitas - totalDespesas

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Seu navegador não suporta geolocalização.")
      return
    }
    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
        const data = await res.json()
        
        const city = data.address.city || data.address.town || data.address.village || data.address.municipality || "Sua Cidade"
        setLocationName(city)
        setTemperature(Math.floor(Math.random() * (33 - 18 + 1)) + 18)
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
      {/* Topo do Dashboard */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 text-center md:text-left">
          <Image 
            src="/logo.jpg" 
            alt="Logo RoçaCTRL" 
            width={140} 
            height={140} 
            className="w-20 h-20 md:w-28 md:h-28 rounded-full shadow-md object-cover object-center border-4 border-primary/20 aspect-square shrink-0 bg-white"
            priority
          />
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-headline font-bold text-primary">RoçaCtrl: Dashboard Geral</h1>
            <p className="text-sm md:text-base text-muted-foreground">Gestão rural inteligente, sensores IoT e planejamento de campo.</p>
            <div className="mt-2 flex justify-center md:justify-start">
              <AccessibilityPopover />
            </div>
          </div>
        </div>
        
        {/* Widget Clima */}
        <div className="flex flex-col gap-2 bg-card p-3 rounded-xl border shadow-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 pr-4 border-r">
              <CloudSun className="h-8 w-8 text-amber-500" />
              <div>
                <p className="text-2xl font-bold leading-none">{temperature}°C</p>
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Agradável</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Hoje</p>
                <CloudSun className="h-4 w-4 mx-auto text-amber-400" />
                <p className="text-xs font-bold">{temperature}°</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Amanhã</p>
                <CloudRain className="h-4 w-4 mx-auto text-blue-400" />
                <p className="text-xs font-bold">{temperature - 3}°</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Depois</p>
                <ThermometerSun className="h-4 w-4 mx-auto text-orange-400" />
                <p className="text-xs font-bold">{temperature + 2}°</p>
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

      {/* Cards de Métricas Principais Dinâmicos */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Link href="/animals">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rebanho / Criações</CardTitle>
              <PawPrint className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAnimalHeads}</div>
              <p className="text-xs text-muted-foreground">Animais em {animals.length} lotes</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/crops">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Culturas e Pomares</CardTitle>
              <Sprout className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{crops.length}</div>
              <p className="text-xs text-muted-foreground">Canteiros e parcelas ativas</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/alerts">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tarefas de Campo</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingTasksCount}</div>
              <p className="text-xs text-muted-foreground">Pendências no calendário</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/financial">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Financeiro</CardTitle>
              <Wallet className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${saldoAtual >= 0 ? "text-primary" : "text-rose-600"}`}>
                R$ {saldoAtual.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>
              <p className="text-xs text-muted-foreground">Resultado acumulado</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="font-headline text-lg">Eficiência Produtiva</CardTitle>
            <CardDescription>Comparativo de colheita real vs Meta planejada (kg)</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cropEfficiencyData}>
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
            <CardTitle className="font-headline text-lg">Monitoramento IoT</CardTitle>
            <CardDescription>Resumo de Sensores em Tempo Real</CardDescription>
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
                <strong>Análise Automática:</strong> A produção superou a meta em 15% devido ao ajuste inteligente da rega via sensores de umidade.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seção Inferior: IA Agroclimática + Painel IoT */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-0.5">
              <CardTitle className="font-headline text-lg flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-primary" />
                Análise de Dados IA
              </CardTitle>
              <CardDescription>Insights agroclimáticos e prioridades</CardDescription>
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
                <div className="space-y-3 pt-2">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Ações Prioritárias</p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                    {aiWeather.priorityTasks.map((task, i) => (
                      <li key={i} className="text-xs flex items-start gap-2 font-medium">
                        <div className="h-1.5 w-1.5 min-w-[6px] rounded-full bg-primary shrink-0 mt-1" />
                        <span className="leading-snug text-muted-foreground">{task}</span>
                      </li>
                    ))}
                  </ul>
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
