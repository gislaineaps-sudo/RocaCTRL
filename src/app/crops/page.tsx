"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Plus, 
  Search, 
  Calendar, 
  Droplets, 
  Leaf, 
  ArrowUpRight,
  History,
  Cherry,
  Sprout
} from "lucide-react"

const initialCrops = [
  { id: 1, name: "Canteiro de Alface", type: "Horta", stage: "Desenvolvimento", progress: 45, area: "15 m²", plantedDate: "2024-02-10", health: "Saudável" },
  { id: 2, name: "Limoeiros Siciliano", type: "Pomar", stage: "Frutificação", progress: 80, area: "8 árvores", plantedDate: "2023-05-10", health: "Excelente" },
  { id: 3, name: "Horta de Temperos", type: "Ervas", stage: "Colheita Contínua", progress: 100, area: "5 m²", plantedDate: "2024-01-05", health: "Ótimo" },
  { id: 4, name: "Canteiro Tomate Cereja", type: "Horta", stage: "Floração", progress: 60, area: "10 m²", plantedDate: "2024-02-01", health: "Observação" },
]

export default function CropsPage() {
  const [crops] = useState(initialCrops)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Hortas e Pomares</h1>
          <p className="text-muted-foreground">Gestão de cultivos para consumo e pequena comercialização.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <History className="h-4 w-4 mr-2" /> Histórico
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" /> Novo Cultivo
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {crops.map((crop) => (
          <Card key={crop.id} className="overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/3 bg-primary/5 p-6 border-b lg:border-b-0 lg:border-r">
                <div className="flex items-center gap-2 text-primary font-bold mb-2">
                  {crop.type === "Pomar" ? <Cherry className="h-5 w-5" /> : <Sprout className="h-5 w-5" />}
                  <span>{crop.type}</span>
                </div>
                <h3 className="text-xl font-headline font-bold mb-1">{crop.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">Área: {crop.area} • Início: {crop.plantedDate}</p>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progresso do Ciclo</span>
                      <span className="font-bold">{crop.progress}%</span>
                    </div>
                    <Progress value={crop.progress} className="h-2" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-md bg-white border">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Estado</span>
                    <Badge variant="secondary" className={
                      crop.health === 'Observação' ? 'bg-yellow-100 text-yellow-700' : 'bg-accent text-accent-foreground'
                    }>{crop.health}</Badge>
                  </div>
                </div>
              </div>
              <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase text-muted-foreground">Fase Atual</h4>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <ArrowUpRight className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold">{crop.stage}</p>
                      <p className="text-xs text-muted-foreground">Último manejo: 3 dias</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase text-muted-foreground">Próxima Rega</h4>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <Droplets className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold">Hoje, 17:30</p>
                      <p className="text-xs text-muted-foreground">Horta Principal</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase text-muted-foreground">Estimativa Colheita</h4>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold">~12 Março</p>
                      <p className="text-xs text-muted-foreground">Ideal para colheita jovem</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
