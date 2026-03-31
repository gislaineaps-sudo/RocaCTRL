"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as ChartTooltip, 
  ResponsiveContainer, 
  Legend,
  AreaChart,
  Area
} from "recharts"
import { 
  TrendingUp,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  PieChart as PieChartIcon,
  Download,
  Sprout,
  PawPrint
} from "lucide-react"

// Mock Data para MVP
const profitData = [
  { month: "Jan", despesas: 1200, receitas: 3500 },
  { month: "Fev", despesas: 1800, receitas: 4200 },
  { month: "Mar", despesas: 1400, receitas: 3800 },
  { month: "Abr", despesas: 2100, receitas: 5500 },
  { month: "Mai", despesas: 1600, receitas: 4800 },
  { month: "Jun", despesas: 2400, receitas: 6200 },
]

const unitCosts = [
  { group: "Lote Frangos 01", type: "animal", totalCost: 480, projectedYield: 1200, status: "Alta Margem" },
  { group: "Limoeiros Siciliano", type: "crop", totalCost: 150, projectedYield: 800, status: "Média Margem" },
  { group: "Tanque Tilápia 04", type: "animal", totalCost: 950, projectedYield: 3000, status: "Alta Margem" },
  { group: "Canteiro Tomate", type: "crop", totalCost: 320, projectedYield: 400, status: "Risco/Baixa Margem" },
]

export default function FinancialPage() {
  const [loading] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-3">
            <Wallet className="h-8 w-8 text-green-600" /> Planejamento Financeiro
          </h1>
          <p className="text-muted-foreground">Controle de lucros, custos de manejo e projeção de receita.</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" /> Exportar Relatório
        </Button>
      </div>

      {/* KPIs Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Bruta (Ano)</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 28.000,00</div>
            <p className="text-xs text-green-600 flex items-center mt-1 font-medium">
              <ArrowUpRight className="h-3 w-3 mr-1" /> +15% desde o último ano
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custos Insumos Agrícolas</CardTitle>
            <Sprout className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 3.450,00</div>
            <p className="text-xs text-muted-foreground mt-1">
              Fertilizantes e Pesticidas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custo Saúde & Ração</CardTitle>
            <PawPrint className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 7.050,00</div>
            <p className="text-xs text-red-500 flex items-center mt-1 font-medium">
              <ArrowUpRight className="h-3 w-3 mr-1" /> +2% devido a aumento de ração
            </p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-green-800">Margem de Lucro</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-green-700">62.5%</div>
            <Progress value={62.5} className="h-2 mt-2 bg-green-200" />
          </CardContent>
        </Card>
      </div>

      {/* Gráficos e Projeções */}
      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle>Fluxo de Caixa e Projeção</CardTitle>
            <CardDescription>Comparativo mensal entre Receitas Geradas vs Despesas de Manejo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={profitData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `R$${value}`}
                  />
                  <ChartTooltip formatter={(value) => `R$ ${value}`} />
                  <Legend />
                  <Area type="monotone" dataKey="receitas" name="Receitas Brutas" stroke="#22c55e" fillOpacity={1} fill="url(#colorReceitas)" />
                  <Area type="monotone" dataKey="despesas" name="Despesas (Ração/Insumos)" stroke="#ef4444" fillOpacity={1} fill="url(#colorDespesas)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Resumo de Custos Unitários */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Rentabilidade por Unidade</CardTitle>
            <CardDescription>Custo vs Retorno Esperado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {unitCosts.map((item, index) => {
              const profitROI = Math.round(((item.projectedYield - item.totalCost) / item.totalCost) * 100)
              
              return (
                <div key={index} className="space-y-2 border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {item.type === 'animal' ? <PawPrint className="h-4 w-4 text-blue-500" /> : <Sprout className="h-4 w-4 text-green-500" />}
                      <span className="font-bold text-sm">{item.group}</span>
                    </div>
                    <Badge variant={profitROI > 100 ? "default" : "destructive"}>
                      ROI {profitROI}%
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>Gasto: R$ {item.totalCost}</span>
                    <span>Retorno Estimado: R$ {item.projectedYield}</span>
                  </div>
                  <Progress 
                    value={(item.totalCost / item.projectedYield) * 100} 
                    className={`h-1 !bg-muted ${profitROI > 100 ? '[&>div]:bg-green-500' : '[&>div]:bg-red-500'}`} 
                  />
                  {profitROI < 100 && (
                    <p className="text-[10px] text-red-500 italic mt-1 font-medium">⚠️ Custo com insumos/ração alto para o retorno.</p>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
