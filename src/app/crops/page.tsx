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
  History
} from "lucide-react"

const initialCrops = [
  { id: 1, name: "Milho Safra 2024", type: "Milho", stage: "Vegetativo", progress: 35, area: "15 ha", plantedDate: "2024-01-15", health: "Ótimo" },
  { id: 2, name: "Soja Primária", type: "Soja", stage: "Floração", progress: 60, area: "25 ha", plantedDate: "2023-12-10", health: "Bom" },
  { id: 3, name: "Trigo Inverno", type: "Trigo", stage: "Semeadura", progress: 5, area: "10 ha", plantedDate: "2024-02-05", health: "Excelente" },
]

export default function CropsPage() {
  const [crops] = useState(initialCrops)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Culturas e Plantio</h1>
          <p className="text-muted-foreground">Ciclos de vida e acompanhamento de lavoura.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <History className="h-4 w-4 mr-2" /> Histórico
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" /> Novo Plantio
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {crops.map((crop) => (
          <Card key={crop.id} className="overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/3 bg-primary/5 p-6 border-b lg:border-b-0 lg:border-r">
                <div className="flex items-center gap-2 text-primary font-bold mb-2">
                  <Leaf className="h-5 w-5" />
                  <span>{crop.type}</span>
                </div>
                <h3 className="text-xl font-headline font-bold mb-1">{crop.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{crop.area} • Plantado em {crop.plantedDate}</p>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progresso do Ciclo</span>
                      <span className="font-bold">{crop.progress}%</span>
                    </div>
                    <Progress value={crop.progress} className="h-2" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-md bg-white border">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Saúde do Solo</span>
                    <Badge variant="secondary" className="bg-accent text-accent-foreground">{crop.health}</Badge>
                  </div>
                </div>
              </div>
              <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase text-muted-foreground">Estágio Atual</h4>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <ArrowUpRight className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold">{crop.stage}</p>
                      <p className="text-xs text-muted-foreground">Iniciado há 14 dias</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase text-muted-foreground">Próxima Irrigação</h4>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <Droplets className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold">Amanhã, 06:00</p>
                      <p className="text-xs text-muted-foreground">Setor Norte / Central</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase text-muted-foreground">Previsão Colheita</h4>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold">15 Mai 2024</p>
                      <p className="text-xs text-muted-foreground">~85 dias restantes</p>
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