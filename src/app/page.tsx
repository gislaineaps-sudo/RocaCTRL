
"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  Sprout, 
  PawPrint, 
  AlertCircle, 
  CheckCircle2, 
  TrendingUp,
  Clock,
  BrainCircuit,
  Hammer,
  Scissors,
  Droplets
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
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

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
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold text-primary">Dashboard Rural</h1>
        <p className="text-muted-foreground">Visão geral da sua propriedade hoje.</p>
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
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Próximos Alertas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: "Reparo de Cerca Divisa", date: "Hoje", type: "Infraestrutura", icon: Hammer, color: "text-red-500" },
                { title: "Adubação Cobertura Milho", date: "Em 5 dias", type: "Adubação", icon: Droplets, color: "text-primary" },
                { title: "Poda de Limpeza Pomar", date: "Em 1 semana", type: "Podas", icon: Scissors, color: "text-green-500" },
              ].map((alert, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg border bg-card/50">
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

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Sugestão da IA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 space-y-2">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <BrainCircuit className="h-4 w-4" />
                <span>Otimização de Infraestrutura</span>
              </div>
              <p className="text-sm leading-relaxed">
                Baseado no desgaste reportado, recomendamos priorizar o reparo da cerca na divisa sul antes do início do período de rotação do gado para o Lote C.
              </p>
              <button className="text-xs font-bold text-primary hover:underline">Ver detalhes da análise</button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
