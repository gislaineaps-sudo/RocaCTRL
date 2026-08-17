"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Sprout, 
  PawPrint, 
  Clock, 
  BrainCircuit, 
  CloudSun, 
  ThermometerSun, 
  CloudRain, 
  Loader2, 
  AlertCircle,
  Cpu, 
  LineChart as LineIcon, 
  MapPin, 
  Wallet, 
  Plus, 
  Wifi, 
  Droplets, 
  BatteryMedium, 
  Calendar,
  Sparkles,
  Info,
  ArrowRight,
  TrendingUp
} from "lucide-react"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from "recharts"
import { getWeatherAnalysis, type WeatherAnalysisOutput } from "@/ai/flows/weather-analysis"
import { IoTControlPanel } from "@/components/iot-control"
import { AccessibilityPopover } from "@/components/accessibility-popover"
import { useAnimals, useCrops, useAlerts, useTransactions } from "@/hooks/use-roca-db"
import { ProFeatureModal } from "@/components/pro-feature-modal"

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
  const [isProModalOpen, setIsProModalOpen] = useState(false)

  // Valores simulados de sensores IoT com farol de alerta
  const sensorMoisture = 52 // 25 - 60% = Amarelo
  const sensorWaterTank = 85 // > 60% = Verde
  const sensorBattery = 94 // > 60% = Verde

  // Métricas calculadas do banco de dados
  const totalAnimalHeads = animals.reduce((acc, a) => acc + (a.quantity || 1), 0)
  const pendingTasksCount = alerts.filter(a => a.status === "Pendente" || a.status === "Aguardando").length
  const totalReceitas = transactions.filter(t => t.type === "receita").reduce((acc, t) => acc + Number(t.amount || 0), 0)
  const totalDespesas = transactions.filter(t => t.type === "despesa").reduce((acc, t) => acc + Number(t.amount || 0), 0)
  const saldoAtual = totalReceitas - totalDespesas

  // Helper de Farol de Alerta (Verde >60%, Amarelo 25-60%, Vermelho <25%)
  const getTrafficLight = (value: number) => {
    if (value > 60) {
      return {
        badgeColor: "bg-emerald-600/15 text-emerald-800 border-emerald-300",
        barColor: "bg-emerald-600",
        bgColor: "bg-emerald-100",
        statusText: "Normal / Ideal",
        dotColor: "bg-emerald-600"
      }
    } else if (value >= 25) {
      return {
        badgeColor: "bg-amber-500/15 text-amber-800 border-amber-300",
        barColor: "bg-amber-500",
        bgColor: "bg-amber-100",
        statusText: "Atenção / Regular",
        dotColor: "bg-amber-500"
      }
    } else {
      return {
        badgeColor: "bg-rose-600/15 text-rose-800 border-rose-300",
        barColor: "bg-rose-600",
        bgColor: "bg-rose-100",
        statusText: "Crítico / Baixo",
        dotColor: "bg-rose-600"
      }
    }
  }

  const waterLight = getTrafficLight(sensorWaterTank)
  const moistureLight = getTrafficLight(sensorMoisture)
  const batteryLight = getTrafficLight(sensorBattery)

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
    <div className="space-y-6">
      {/* Topo do Dashboard */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 text-center md:text-left">
          <Image 
            src="/logo.jpg" 
            alt="Logo RoçaCTRL" 
            width={120} 
            height={120} 
            className="w-20 h-20 md:w-24 md:h-24 rounded-2xl shadow-md object-cover object-center border-2 border-primary/20 aspect-square shrink-0 bg-white"
            priority
          />
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <h1 className="text-2xl md:text-3xl font-headline font-bold text-slate-900">RoçaCtrl</h1>
              <Badge className="bg-primary/10 text-primary border-primary/20 text-[11px] font-semibold">
                Gestão Rural
              </Badge>
            </div>
            <p className="text-sm text-slate-600 font-medium">Painel de controle do sítio, sensores IoT e previsão agroclimática.</p>
            <div className="pt-1 flex justify-center md:justify-start">
              <AccessibilityPopover />
            </div>
          </div>
        </div>
        
        {/* Widget Clima & Cidade */}
        <div className="flex flex-col gap-2 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 pr-4 border-r border-slate-200">
              <CloudSun className="h-8 w-8 text-amber-500" />
              <div>
                <p className="text-2xl font-bold leading-none text-slate-900">{temperature}°C</p>
                <p className="text-[10px] text-slate-700 uppercase font-bold tracking-wider">Agradável</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-700 uppercase">Hoje</p>
                <CloudSun className="h-4 w-4 mx-auto text-amber-500" />
                <p className="text-xs font-bold text-slate-800">{temperature}°</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-700 uppercase">Amanhã</p>
                <CloudRain className="h-4 w-4 mx-auto text-blue-500" />
                <p className="text-xs font-bold text-slate-800">{temperature - 3}°</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-700 uppercase">Depois</p>
                <ThermometerSun className="h-4 w-4 mx-auto text-orange-500" />
                <p className="text-xs font-bold text-slate-800">{temperature + 2}°</p>
              </div>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full h-8 text-xs bg-slate-100 text-slate-800 hover:bg-primary/10 hover:text-primary transition-colors font-medium rounded-xl"
            onClick={handleGetLocation}
            disabled={isLocating}
          >
            {isLocating ? <Loader2 className="h-3 w-3 animate-spin mr-1.5" /> : <MapPin className="h-3.5 w-3.5 mr-1.5 text-primary" />}
            {locationName}
          </Button>
        </div>
      </div>

      {/* BARRA DE AÇÕES RÁPIDAS (Quick Actions) */}
      <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-xs">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 shrink-0 flex items-center gap-1 pl-1">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Ações Rápidas:
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <Button asChild size="sm" className="h-10 px-4 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl gap-1.5 shadow-xs">
              <Link href="/crops">
                <Plus className="h-3.5 w-3.5" /> Novo Canteiro / Colheita
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="h-10 px-4 text-xs font-semibold border-slate-300 text-slate-800 hover:bg-slate-50 rounded-xl gap-1.5">
              <Link href="/financial">
                <Plus className="h-3.5 w-3.5 text-primary" /> Lançamento Financeiro
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="h-10 px-4 text-xs font-semibold border-slate-300 text-slate-800 hover:bg-slate-50 rounded-xl gap-1.5">
              <Link href="/alerts">
                <Calendar className="h-3.5 w-3.5 text-amber-600" /> Agendar Manejo
              </Link>
            </Button>
            <Button asChild size="sm" variant="secondary" className="h-10 px-4 text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 rounded-xl gap-1.5">
              <Link href="/ai-assistant">
                <BrainCircuit className="h-3.5 w-3.5" /> Consultor IA
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Cards de Métricas Principais Dinâmicos */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Link href="/animals">
          <Card className="hover:shadow-md transition-all cursor-pointer h-full border-slate-200 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-bold text-slate-800">Criações & Rebanho</CardTitle>
              <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <PawPrint className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900">{totalAnimalHeads}</div>
              <p className="text-xs text-slate-600 mt-0.5">Animais em {animals.length} lotes</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/crops">
          <Card className="hover:shadow-md transition-all cursor-pointer h-full border-slate-200 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-bold text-slate-800">Culturas & Pomares</CardTitle>
              <div className="p-2 rounded-xl bg-emerald-600/10 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Sprout className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900">{crops.length}</div>
              <p className="text-xs text-slate-600 mt-0.5">Canteiros e parcelas ativas</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/alerts">
          <Card className="hover:shadow-md transition-all cursor-pointer h-full border-slate-200 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-bold text-slate-800">Tarefas de Campo</CardTitle>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-700 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                <Clock className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900">{pendingTasksCount}</div>
              <p className="text-xs text-slate-600 mt-0.5">Pendências no calendário</p>
            </CardContent>
          </Card>
        </Link>

        {/* Card Conexão do Sítio (Substitui o API Externo) */}
        <Link href="/iot">
          <Card className="hover:shadow-md transition-all cursor-pointer h-full border-slate-200 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-bold text-slate-800">Conexão do Sítio</CardTitle>
              <div className="p-2 rounded-xl bg-emerald-600/10 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Wifi className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-600 animate-pulse" />
                <span className="text-lg sm:text-xl font-bold text-emerald-800">Sincronizado</span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">Sensores e Gateway Online</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Gráficos e Farol de Alerta IoT */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Gráfico de Produção */}
        <Card className="lg:col-span-4 border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="font-headline text-lg text-slate-900 font-bold">Eficiência Produtiva</CardTitle>
            <CardDescription className="text-xs text-slate-600">Comparativo de colheita real vs meta planejada (kg)</CardDescription>
          </CardHeader>
          <CardContent className="pl-1">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cropEfficiencyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}kg`} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="horta" stroke="#16a34a" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Produção Real" />
                  <Line type="monotone" dataKey="meta" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} name="Meta Prevista" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Painel Farol de Alerta IoT (Medidores com Cores Contextuais) */}
        <Card className="lg:col-span-3 border-slate-200 flex flex-col justify-between">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-headline text-lg text-slate-900 font-bold flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-primary" /> Farol de Sensores
                </CardTitle>
                <CardDescription className="text-xs text-slate-600">Monitoramento ambiental em tempo real</CardDescription>
              </div>
              <Badge className="bg-emerald-600/15 text-emerald-800 border-emerald-300 text-[10px]">
                Tempo Real
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Medidor 1: Reservatório de Água */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-800">
                <span className="flex items-center gap-1.5">
                  <Droplets className="h-3.5 w-3.5 text-blue-600" /> Reservatório de Água
                </span>
                <div className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${waterLight.dotColor}`} />
                  <span>{sensorWaterTank}% ({waterLight.statusText})</span>
                </div>
              </div>
              <div className={`h-2.5 rounded-full ${waterLight.bgColor} overflow-hidden`}>
                <div className={`h-full ${waterLight.barColor} transition-all duration-500`} style={{ width: `${sensorWaterTank}%` }} />
              </div>
            </div>

            {/* Medidor 2: Umidade do Solo */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-800">
                <span className="flex items-center gap-1.5">
                  <Sprout className="h-3.5 w-3.5 text-emerald-600" /> Umidade do Canteiro
                </span>
                <div className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${moistureLight.dotColor}`} />
                  <span>{sensorMoisture}% ({moistureLight.statusText})</span>
                </div>
              </div>
              <div className={`h-2.5 rounded-full ${moistureLight.bgColor} overflow-hidden`}>
                <div className={`h-full ${moistureLight.barColor} transition-all duration-500`} style={{ width: `${sensorMoisture}%` }} />
              </div>
            </div>

            {/* Medidor 3: Bateria Gateway */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-800">
                <span className="flex items-center gap-1.5">
                  <BatteryMedium className="h-3.5 w-3.5 text-slate-700" /> Bateria do Gateway
                </span>
                <div className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${batteryLight.dotColor}`} />
                  <span>{sensorBattery}% ({batteryLight.statusText})</span>
                </div>
              </div>
              <div className={`h-2.5 rounded-full ${batteryLight.bgColor} overflow-hidden`}>
                <div className={`h-full ${batteryLight.barColor} transition-all duration-500`} style={{ width: `${sensorBattery}%` }} />
              </div>
            </div>

            <div className="bg-slate-100 p-3 rounded-xl border border-slate-200">
              <p className="text-xs text-slate-700 leading-relaxed">
                <LineIcon className="h-3.5 w-3.5 inline mr-1 text-primary" />
                <strong>Orientação de Manejo:</strong> Nível do reservatório excelente. A umidade do solo está em nível moderado (52%), recomenda-se irrigação leve ao entardecer.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seção Inferior: IA Agroclimática com Estado Vazio Elegante + Painel IoT */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Card Análise IA com Estado Vazio Elegante */}
        <Card className="border-primary/25 bg-emerald-50/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-0.5">
              <CardTitle className="font-headline text-lg font-bold text-slate-900 flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-primary" />
                Análise Agroclimática & Recomendações
              </CardTitle>
              <CardDescription className="text-xs text-slate-600">Orientações de campo baseadas no clima da região</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {loadingWeather ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-xs text-slate-600 font-medium">Cruzando dados meteorológicos...</p>
              </div>
            ) : aiWeather ? (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-primary/20 shadow-xs">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Parecer Técnico</p>
                  <p className="text-sm leading-relaxed text-slate-800 font-medium">
                    "{aiWeather.advice}"
                  </p>
                </div>
                <div className="space-y-2 pt-1">
                  <p className="text-[11px] font-bold uppercase text-slate-700 tracking-wider">Ações Prioritárias Recomendadas</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {aiWeather.priorityTasks.map((task, i) => (
                      <li key={i} className="text-xs flex items-start gap-2 bg-white/80 p-2.5 rounded-lg border border-slate-200 text-slate-800 font-medium">
                        <div className="h-1.5 w-1.5 min-w-[6px] rounded-full bg-primary shrink-0 mt-1.5" />
                        <span className="leading-snug">{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              /* ESTADO VAZIO ELEGANTE */
              <div className="text-center py-8 px-4 bg-white/80 rounded-xl border border-slate-200 flex flex-col items-center gap-3">
                <div className="p-3 bg-amber-500/10 text-amber-700 rounded-full">
                  <Info className="h-6 w-6" />
                </div>
                <div className="space-y-1 max-w-sm">
                  <h4 className="text-sm font-bold text-slate-900">Em preparação de leituras</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Ainda não há dados suficientes para gerar previsões avançadas. Registre mais 3 leituras de solo ou colheitas para liberar insights completos com IA.
                  </p>
                </div>
                <Button asChild size="sm" variant="outline" className="text-xs h-9 border-slate-300 gap-1 mt-1">
                  <Link href="/crops">
                    Cadastrar Colheita <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Painel IoT de Acionamento Local */}
        <IoTControlPanel />
      </div>

      <ProFeatureModal 
        isOpen={isProModalOpen} 
        onClose={() => setIsProModalOpen(false)} 
        featureName="Relatórios Ilimitados & IA Pro"
      />
    </div>
  )
}
