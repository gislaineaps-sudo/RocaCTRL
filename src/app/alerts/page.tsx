"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Bell, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Circle,
  Clock, 
  AlertTriangle,
  Filter,
  Plus,
  Trash2,
  Download,
  CalendarCheck,
  Share2
} from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { useAlerts, useCategories } from "@/hooks/use-roca-db"
import { AlertTaskItem } from "@/lib/db"
import { exportToCSV } from "@/lib/export-utils"
import { useToast } from "@/hooks/use-toast"

export default function AlertsPage() {
  const { alerts, saveAlert, toggleAlertStatus, deleteAlert } = useAlerts()
  const { categories } = useCategories()
  const { toast } = useToast()

  const [date, setDate] = useState<Date | undefined>(undefined)
  const [filterStatus, setFilterStatus] = useState<"all" | "Pendente" | "Concluído">("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Form State
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskDate, setNewTaskDate] = useState("")
  const [newTaskPriority, setNewTaskPriority] = useState<"Alta" | "Média" | "Baixa">("Média")
  const [newTaskCategory, setNewTaskCategory] = useState("")
  const [newTaskRecurrence, setNewTaskRecurrence] = useState("Atividade Única")
  const [newTaskNotes, setNewTaskNotes] = useState("")

  useEffect(() => {
    setDate(new Date())
    setNewTaskDate(new Date().toISOString().split("T")[0])
  }, [])

  const filteredAlerts = alerts.filter(task => {
    const matchesStatus = filterStatus === "all" || task.status === filterStatus
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.category.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const handleAddTask = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!newTaskTitle.trim()) {
      toast({
        title: "Título obrigatório",
        description: "Por favor, digite o nome da tarefa ou alerta.",
        variant: "destructive"
      })
      return
    }

    const defaultCat = categories[0]?.name || "Geral"
    saveAlert({
      title: newTaskTitle.trim(),
      priority: newTaskPriority,
      category: newTaskCategory || defaultCat,
      date: newTaskDate || (date ? date.toISOString().split("T")[0] : new Date().toISOString().split("T")[0]),
      status: "Pendente",
      recurrence: newTaskRecurrence,
      notes: newTaskNotes.trim() || undefined
    })

    toast({
      title: "Tarefa agendada!",
      description: `"${newTaskTitle}" foi inserida no calendário de campo.`
    })

    setNewTaskTitle("")
    setNewTaskNotes("")
  }

  const handleToggle = (task: AlertTaskItem) => {
    toggleAlertStatus(task.id)
    toast({
      title: task.status === "Concluído" ? "Tarefa reaberta" : "Tarefa concluída!",
      description: `"${task.title}" atualizada.`
    })
  }

  const handleDelete = (task: AlertTaskItem) => {
    if (confirm(`Excluir a tarefa "${task.title}"?`)) {
      deleteAlert(task.id)
      toast({
        title: "Tarefa removida",
        description: `"${task.title}" foi excluída.`
      })
    }
  }

  const handleExport = () => {
    const data = filteredAlerts.map(a => ({
      ID: a.id,
      Título: a.title,
      Prioridade: a.priority,
      Categoria: a.category,
      "Data Prevista": a.date,
      Status: a.status,
      Recorrência: a.recurrence || "Única",
      Notas: a.notes || ""
    }))
    exportToCSV("tarefas_alertas_rocactrl", data)
  }

  const handleShareWhatsApp = () => {
    const pendingTasks = alerts.filter(a => a.status !== "Concluído")
    const taskLines = pendingTasks.map(t => 
      `• [${t.priority.toUpperCase()}] *${t.title}* (${t.date}) - ${t.category}`
    ).join("\n")

    const text = [
      `🔔 *Cronograma & Alertas de Campo - RoçaCtrl*`,
      `📅 Data: ${new Date().toLocaleDateString("pt-BR")}`,
      `⏳ Pendentes: ${pendingCount} | ✅ Concluídas: ${completedCount}`,
      ``,
      `📋 *Próximas Atividades de Manejo:*`,
      taskLines || "Todas as tarefas estão em dia! 🎉",
      ``,
      `_Gerado pelo app RoçaCtrl_`
    ].join("\n")

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(whatsappUrl, "_blank", "noopener,noreferrer")
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "Alta":
        return <Badge className="bg-rose-600/15 text-rose-700 hover:bg-rose-600/25 border-rose-300">Alta</Badge>
      case "Média":
        return <Badge className="bg-amber-600/15 text-amber-700 hover:bg-amber-600/25 border-amber-300">Média</Badge>
      case "Baixa":
        return <Badge className="bg-emerald-600/15 text-emerald-700 hover:bg-emerald-600/25 border-emerald-300">Baixa</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  const pendingCount = alerts.filter(a => a.status === "Pendente" || a.status === "Aguardando").length
  const completedCount = alerts.filter(a => a.status === "Concluído").length

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-3">
            <Bell className="h-8 w-8 text-primary" /> Tarefas, Alertas e Calendário
          </h1>
          <p className="text-muted-foreground">
            Cronograma de campo, lembretes de vacinação, adubação e manejo de rotina.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShareWhatsApp}
            className="gap-2 border-emerald-300 text-emerald-800 hover:bg-emerald-50 font-semibold"
          >
            <Share2 className="h-4 w-4 text-emerald-600" /> Compartilhar no WhatsApp
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" /> Exportar CSV
          </Button>
        </div>
      </div>

      {/* Grid Principal: Calendário + Formulário na esquerda, Lista na direita */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Coluna Lateral: Calendário e Nova Tarefa */}
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-primary" /> Calendário de Campo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => {
                    setDate(d)
                    if (d) setNewTaskDate(d.toISOString().split("T")[0])
                  }}
                  className="rounded-md border p-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Plus className="h-4 w-4 text-primary" /> Nova Rotina / Tarefa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddTask} className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="task-title" className="text-xs">Título da Tarefa *</Label>
                  <Input
                    id="task-title"
                    placeholder="Ex: Vacinação, Poda limoeiro, Adubação..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="task-date" className="text-xs">Data</Label>
                    <Input
                      id="task-date"
                      type="date"
                      value={newTaskDate}
                      onChange={(e) => setNewTaskDate(e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="task-priority" className="text-xs">Prioridade</Label>
                    <select
                      id="task-priority"
                      className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs"
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    >
                      <option value="Alta">Alta</option>
                      <option value="Média">Média</option>
                      <option value="Baixa">Baixa</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="task-category" className="text-xs">Categoria</Label>
                    <select
                      id="task-category"
                      className="flex h-9 w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-800 font-medium"
                      value={newTaskCategory}
                      onChange={(e) => setNewTaskCategory(e.target.value)}
                    >
                      <optgroup label="🌳 Culturas & Vegetação">
                        {categories.filter(c => c.type === 'PLANT').map(c => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </optgroup>
                      <optgroup label="🐔 Animais & Criações">
                        {categories.filter(c => c.type === 'ANIMAL').map(c => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </optgroup>
                      <optgroup label="🚜 Infraestrutura & Geral">
                        {categories.filter(c => c.type === 'INFRASTRUCTURE' || c.type === 'FINANCIAL').map(c => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="task-rec" className="text-xs">Recorrência</Label>
                    <select
                      id="task-rec"
                      className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs"
                      value={newTaskRecurrence}
                      onChange={(e) => setNewTaskRecurrence(e.target.value)}
                    >
                      <option value="Atividade Única">Atividade Única</option>
                      <option value="Diária">Diária</option>
                      <option value="Semanal">Semanal</option>
                      <option value="Quinzenal">Quinzenal</option>
                      <option value="Mensal">Mensal</option>
                      <option value="Semestral">Semestral</option>
                      <option value="Anual">Anual</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="task-notes" className="text-xs">Observações (Opcional)</Label>
                  <Input
                    id="task-notes"
                    placeholder="Instruções de aplicação ou horário..."
                    value={newTaskNotes}
                    onChange={(e) => setNewTaskNotes(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>

                <Button type="submit" className="w-full h-8 text-xs bg-primary hover:bg-primary/90 mt-2">
                  <Plus className="h-3.5 w-3.5 mr-1" /> Agendar Tarefa
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Coluna Principal: Lista de Tarefas */}
        <div className="lg:col-span-2 space-y-4">
          {/* Barra de Filtros */}
          <Card>
            <CardContent className="p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-64">
                <Input
                  placeholder="Buscar tarefa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setFilterStatus("all")}
                >
                  Todas ({alerts.length})
                </Button>
                <Button
                  variant={filterStatus === "Pendente" ? "default" : "outline"}
                  size="sm"
                  className="h-8 text-xs text-amber-700"
                  onClick={() => setFilterStatus("Pendente")}
                >
                  Pendentes ({pendingCount})
                </Button>
                <Button
                  variant={filterStatus === "Concluído" ? "default" : "outline"}
                  size="sm"
                  className="h-8 text-xs text-emerald-700"
                  onClick={() => setFilterStatus("Concluído")}
                >
                  Concluídas ({completedCount})
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Cards de Tarefas */}
          <div className="space-y-3">
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-xl border border-dashed text-muted-foreground">
                <CalendarCheck className="h-10 w-10 mx-auto opacity-30 mb-2" />
                <p className="text-base font-medium">Nenhuma tarefa encontrada.</p>
                <p className="text-xs text-muted-foreground mt-1">Utilize o formulário ao lado para agendar novas tarefas.</p>
              </div>
            ) : (
              filteredAlerts.map((task) => {
                const isCompleted = task.status === "Concluído"
                return (
                  <Card 
                    key={task.id} 
                    className={`transition-all hover:shadow-xs ${isCompleted ? "opacity-70 bg-muted/20 border-muted" : "border-l-4 border-l-primary"}`}
                  >
                    <CardContent className="p-4 flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => handleToggle(task)}
                          className="mt-0.5 text-muted-foreground hover:text-primary transition-colors shrink-0"
                          title={isCompleted ? "Marcar como pendente" : "Marcar como concluído"}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                          ) : (
                            <Circle className="h-5 w-5 hover:text-primary" />
                          )}
                        </button>

                        <div className="space-y-1">
                          <h4 className={`text-sm font-semibold ${isCompleted ? "line-through text-muted-foreground" : "text-foreground"}`}>
                            {task.title}
                          </h4>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1 font-mono">
                              <CalendarIcon className="h-3 w-3" /> {task.date}
                            </span>
                            <span>•</span>
                            <span>{task.category}</span>
                            {task.recurrence && (
                              <>
                                <span>•</span>
                                <span className="text-[11px] bg-muted px-1.5 py-0.5 rounded">{task.recurrence}</span>
                              </>
                            )}
                          </div>
                          {task.notes && (
                            <p className="text-xs text-muted-foreground italic mt-1 bg-muted/40 p-1.5 rounded">
                              {task.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {getPriorityBadge(task.priority)}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDelete(task)}
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
