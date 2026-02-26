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
  AlertTriangle,
  Leaf,
  Cherry
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
  { name: "Galinhas", value: 60 },
  { name: "Abelhas", value: 20 },
  { name: "Cabras", value: 15 },
  { name: "Outros", value: 5 },
]

const cropData = [
  { month: "Jan", horta: 120, pomar: 45 },
  { month: "Fev", horta: 150, pomar: 60 },
  { month: "Mar", horta: 110, pomar: 180 },
  { month: "Abr", horta: 90, pomar: 140 },
  { month: "Mai", horta: 130, pomar: 95 },
  { month: "Jun", horta: 140, pomar: 50 },
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
          location: "Sítio Primavera",
          currentWeather: "Ensolarado, 27°C, Umidade 50%",
          forecast: "Próximos dias secos, ideal para colheita de ervas."
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
          <h1 className="text-3xl font-headline font-bold text-primary">Meu Sítio: Dashboard</h1>
          <p className="text-muted-foreground">Gestão inteligente para sua agricultura familiar.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-3 rounded-xl border shadow-sm">
          <div className="flex items-center gap-2 pr-4 border-r">
            <CloudSun className="h-8 w-8 text-orange-500" />
            <div>
              <p className="text-2xl font-bold leading-none">27°C</p>
              <p className="text-[10px] text-muted-foreground uppercase font-bold">Agradável</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Ter</p>
              <CloudSun className="h-4 w-4 mx-auto text-orange-400" />
              <p className="text-xs font-bold">29°</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Qua</p>
              <CloudRain className="h-4 w-4 mx-auto text-blue-400" />
              <p className="text-xs font-bold">22°</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Qui</p>
              <ThermometerSun className="h-4 w-4 mx-auto text-red-400" />
              <p className="text-xs font-bold">30°</p>
            </div>
          </div>
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
            <CardTitle className="text-sm font-medium">Horta e Ervas</CardTitle>
            <Sprout className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">35 m²</div>
            <p className="text-xs text-muted-foreground">Em plena produção</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manutenção</CardTitle>
            <Clock className="h-4 w-4 text-accent-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Tarefas para hoje</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Colheita Mensal</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85 kg</div>
            <p className="text-xs text-muted-foreground">+10% que jan/24</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="font-headline">Produção Diversificada</CardTitle>
            <CardDescription>Volume colhido estimado (Horta vs Pomar)</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cropData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}kg`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "hsl(var(--card))", borderRadius: "var(--radius)", border: "1px solid hsl(var(--border))" }}
                    cursor={{ fill: "hsl(var(--muted)/0.2)" }}
                  />
                  <Bar dataKey="horta" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pomar" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="font-headline">Distribuição Animal</CardTitle>
            <CardDescription>Composição do pequeno rebanho</CardDescription>
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
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-0.5">
              <CardTitle className="font-headline text-lg flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-primary" />
                Dica da IA para o Sítio
              </CardTitle>
              <CardDescription>Insights baseados no clima local</CardDescription>
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
                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Sugestões de Manejo</p>
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
                <p className="text-xs">Falha ao carregar análise inteligente.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg">Próximos Cuidados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { title: "Poda Jabuticabeiras", date: "Amanhã", type: "Pomar", icon: Scissors, color: "text-green-600" },
                { title: "Rega Reforçada Ervas", date: "Hoje", type: "Horta", icon: Droplets, color: "text-blue-500" },
                { title: "Limpeza Gallinheiro", date: "Em 3 dias", type: "Animais", icon: Hammer, color: "text-orange-500" },
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
