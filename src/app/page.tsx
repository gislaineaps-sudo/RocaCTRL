"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
  AlertTriangle
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
  Pie
} from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { getWeatherAnalysis, type WeatherAnalysisOutput } from "@/ai/flows/weather-analysis"

const animalData = [
  { name: "Bovinos", value: 45 },
  { name: "Ovinos", value: 30 },
  { name: "Suínos", value: 15 },
  { name: "Aves", value: 10 },
]

const cropData = [
  { month: "Jan", milho: 400, soja: 240 },
  { month: "Fev", milho: 300, soja: 139 },
  { month: "Mar", milho: 200, soja: 980 },
  { month: "Abr", milho: 278, soja: 390 },
  { month: "Mai", milho: 189, soja: 480 },
  { month: "Jun", milho: 239, soja: 380 },
]

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "#4ADE80", "#FACC15"]

export default function Dashboard() {
  const [aiWeather, setAiWeather] = useState<WeatherAnalysisOutput | null>(null)
  const [loadingWeather, setLoadingWeather] = useState(false)

  useEffect(() => {
    async function fetchWeatherAnalysis() {
      setLoadingWeather(true)
      try {
        const analysis = await getWeatherAnalysis({
          location: "Região Central",
          currentWeather: "Ensolarado, 29°C, Umidade 45%",
          forecast: "Próximos 3 dias com sol intenso, sem previsão de chuva significativa."
        })
        setAiWeather(analysis)
      } catch (error) {
        console.error("Erro ao carregar análise climática:", error)
      } finally {
        setLoadingWeather(false)
      }
    }
    fetchWeatherAnalysis()
  }, [])

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Dashboard Rural</h1>
          <p className="text-muted-foreground">Visão geral da sua propriedade hoje.</p>
        </div>
        
        {/* Widget de Clima Rápido */}
        <div className="flex items-center gap-4 bg-white p-3 rounded-xl border shadow-sm">
          <div className="flex items-center gap-2 pr-4 border-r">
            <CloudSun className="h-8 w-8 text-orange-500" />
            <div>
              <p className="text-2xl font-bold leading-none">29°C</p>
              <p className="text-[10px] text-muted-foreground uppercase font-bold">Ensolarado</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Ter</p>
              <CloudSun className="h-4 w-4 mx-auto text-orange-400" />
              <p className="text-xs font-bold">31°</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Qua</p>
              <CloudRain className="h-4 w-4 mx-auto text-blue-400" />
              <p className="text-xs font-bold">24°</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Qui</p>
              <ThermometerSun className="h-4 w-4 mx-auto text-red-400" />
              <p className="text-xs font-bold">33°</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Animais</CardTitle>
            <PawPrint className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">+4 desde o mês passado</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Área Plantada</CardTitle>
            <Sprout className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">54.2 ha</div>
            <p className="text-xs text-muted-foreground">+12% de expansão</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarefas Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-accent-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">3 urgentes para hoje</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtividade</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+18%</div>
            <p className="text-xs text-muted-foreground">Comparado ao ano anterior</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="font-headline">Progresso de Safras</CardTitle>
            <CardDescription>Produção estimada por mês (Milho vs Soja)</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cropData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}t`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "hsl(var(--card))", borderRadius: "var(--radius)", border: "1px solid hsl(var(--border))" }}
                    cursor={{ fill: "hsl(var(--muted)/0.2)" }}
                  />
                  <Bar dataKey="milho" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="soja" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="font-headline">Distribuição de Rebanho</CardTitle>
            <CardDescription>Composição atual por espécie</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={animalData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {animalData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {animalData.map((item, i) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-xs text-muted-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Alertas Climáticos Inteligentes */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-0.5">
              <CardTitle className="font-headline text-lg flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-primary" />
                Análise Agroclimática IA
              </CardTitle>
              <CardDescription>Insights baseados na previsão local</CardDescription>
            </div>
            {aiWeather && (
              <div className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                aiWeather.riskLevel === 'Alto' ? 'bg-red-100 text-red-600' : 
                aiWeather.riskLevel === 'Moderado' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'
              }`}>
                Risco {aiWeather.riskLevel}
              </div>
            )}
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
                  <div className="flex flex-col justify-end">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-orange-600 bg-orange-50 p-2 rounded border border-orange-100">
                      <Wind className="h-3 w-3" />
                      Ventos constantes: 12km/h
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground flex flex-col items-center gap-2">
                <AlertTriangle className="h-5 w-5 opacity-40" />
                <p className="text-xs">Não foi possível gerar a análise climática agora.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg">Próximos Alertas de Rotina</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { title: "Reparo de Cerca Divisa", date: "Hoje", type: "Infraestrutura", icon: Hammer, color: "text-red-500" },
                { title: "Adubação Cobertura Milho", date: "Em 5 dias", type: "Adubação", icon: Droplets, color: "text-primary" },
                { title: "Poda de Limpeza Pomar", date: "Em 1 semana", type: "Podas", icon: Scissors, color: "text-green-500" },
              ].map((alert, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg border bg-card/50 hover:bg-muted/50 transition-colors">
                  <alert.icon className={`h-5 w-5 ${alert.color}`} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{alert.title}</p>
                    <p className="text-xs text-muted-foreground">{alert.type} • {alert.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
