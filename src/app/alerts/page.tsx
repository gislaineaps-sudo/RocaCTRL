
"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Bell, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  ChevronRight,
  Filter,
  Hammer,
  Scissors,
  Droplets
} from "lucide-react"
import { Calendar } from "@/components/ui/calendar"

const alerts = [
  { id: 1, title: "Vacinação Febre Aftosa", priority: "Alta", category: "Saúde Animal", date: "2024-02-28", status: "Pendente", icon: Bell },
  { id: 2, title: "Adubação Cobertura Milho", priority: "Média", category: "Adubação", date: "2024-03-02", status: "Aguardando", icon: Droplets },
  { id: 3, title: "Revisão Trator John Deere", priority: "Baixa", category: "Manutenção", date: "2024-03-05", status: "Pendente", icon: Hammer },
  { id: 4, title: "Troca de Pasto Lote B", priority: "Média", category: "Manejo", date: "2024-03-01", status: "Concluído", icon: CheckCircle2 },
  { id: 5, title: "Reparo de Cerca Divisa Sul", priority: "Alta", category: "Infraestrutura", date: "2024-03-04", status: "Pendente", icon: Hammer },
  { id: 6, title: "Poda de Limpeza Pomar", priority: "Baixa", category: "Podas", date: "2024-03-10", status: "Aguardando", icon: Scissors },
]

export default function AlertsPage() {
  const [date, setDate] = useState<Date | undefined>(undefined)

  useEffect(() => {
    setDate(new Date())
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Alertas e Rotinas</h1>
          <p className="text-muted-foreground">Cronograma de tarefas e lembretes automáticos.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" /> Filtros
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Calendário de Campo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Próximas Tarefas</CardTitle>
            <Badge variant="outline">{alerts.length} Totais</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`flex items-center gap-4 p-4 rounded-xl border-l-4 transition-all hover:bg-muted/50 ${
                    alert.status === 'Concluído' ? 'border-l-green-500 bg-green-50/30' : 
                    alert.priority === 'Alta' ? 'border-l-red-500' : 'border-l-primary'
                  }`}
                >
                  <div className={`p-2 rounded-full ${
                    alert.status === 'Concluído' ? 'bg-green-100 text-green-600' : 
                    alert.priority === 'Alta' ? 'bg-red-100 text-red-600' : 'bg-primary/10 text-primary'
                  }`}>
                    {alert.status === 'Concluído' ? <CheckCircle2 className="h-5 w-5" /> : 
                     alert.priority === 'Alta' ? <AlertTriangle className="h-5 w-5" /> : 
                     <Clock className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`font-bold ${alert.status === 'Concluído' ? 'line-through text-muted-foreground' : ''}`}>
                        {alert.title}
                      </h4>
                      <Badge variant={alert.priority === 'Alta' ? 'destructive' : 'secondary'}>
                        {alert.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" /> {alert.date}
                      </span>
                      <span className="font-medium text-primary uppercase tracking-tight flex items-center gap-1">
                        {alert.category === "Infraestrutura" && <Hammer className="h-3 w-3" />}
                        {alert.category === "Podas" && <Scissors className="h-3 w-3" />}
                        {alert.category === "Adubação" && <Droplets className="h-3 w-3" />}
                        {alert.category}
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button className="w-full mt-6" variant="outline">
              Ver Todas as Tarefas
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
