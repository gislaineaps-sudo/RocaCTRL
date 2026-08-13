"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Droplets, 
  Leaf, 
  Download,
  Trash2,
  Edit,
  Sprout,
  CheckCircle2,
  Clock,
  Cherry
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useCrops, useCategories } from "@/hooks/use-roca-db"
import { CropItem } from "@/lib/db"
import { exportToCSV } from "@/lib/export-utils"
import { useToast } from "@/hooks/use-toast"

const STAGE_OPTIONS = [
  "Preparo de Solo",
  "Plantio Inicial",
  "Desenvolvimento",
  "Floração",
  "Frutificação",
  "Colheita Contínua",
  "Finalizado"
] as const

export default function CropsPage() {
  const { crops, saveCrop, deleteCrop } = useCrops()
  const { categories } = useCategories()
  const { toast } = useToast()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<{
    name: string
    type: string
    category: string
    stage: CropItem["stage"]
    progress: number
    area: string
    plantedDate: string
    expectedHarvest: string
    health: CropItem["health"]
    notes: string
  }>({
    name: "",
    type: "Horta",
    category: "",
    stage: "Plantio Inicial",
    progress: 10,
    area: "",
    plantedDate: new Date().toISOString().split("T")[0],
    expectedHarvest: "",
    health: "Saudável",
    notes: ""
  })

  // Categorias de cultivo disponíveis no banco
  const cropCategories = categories.filter(c => c.sector === "Culturas" || c.sector === "Geral")

  const filteredCrops = crops.filter(crop => {
    const matchesType = selectedType === "all" || crop.type === selectedType
    const matchesCategory = selectedCategory === "all" || crop.category === selectedCategory
    const matchesSearch = 
      crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crop.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (crop.category && crop.category.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesType && matchesCategory && matchesSearch
  })

  const handleOpenDialog = (crop?: CropItem) => {
    const defaultCat = cropCategories[0]?.name || "Hortaliças e Folhosas"
    if (crop) {
      setEditingId(crop.id)
      setFormData({
        name: crop.name,
        type: crop.type,
        category: crop.category || defaultCat,
        stage: crop.stage,
        progress: crop.progress,
        area: crop.area,
        plantedDate: crop.plantedDate,
        expectedHarvest: crop.expectedHarvest || "",
        health: crop.health,
        notes: crop.notes || ""
      })
    } else {
      setEditingId(null)
      setFormData({
        name: "",
        type: "Horta",
        category: defaultCat,
        stage: "Plantio Inicial",
        progress: 10,
        area: "",
        plantedDate: new Date().toISOString().split("T")[0],
        expectedHarvest: "",
        health: "Saudável",
        notes: ""
      })
    }
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (!formData.name.trim() || !formData.area.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha o nome do plantio e a área ocupada.",
        variant: "destructive"
      })
      return
    }

    saveCrop({
      id: editingId || undefined,
      name: formData.name.trim(),
      type: formData.type,
      category: formData.category || cropCategories[0]?.name || "Culturas",
      stage: formData.stage,
      progress: Number(formData.progress),
      area: formData.area.trim(),
      plantedDate: formData.plantedDate,
      expectedHarvest: formData.expectedHarvest.trim() || "Em definição",
      health: formData.health,
      notes: formData.notes.trim()
    })

    toast({
      title: editingId ? "Cultivo atualizado!" : "Novo cultivo cadastrado!",
      description: `"${formData.name}" foi salvo com sucesso no banco de dados.`
    })

    setIsDialogOpen(false)
  }

  const handleDelete = (crop: CropItem) => {
    if (confirm(`Deseja remover o cultivo "${crop.name}"?`)) {
      deleteCrop(crop.id)
      toast({
        title: "Cultivo removido",
        description: `"${crop.name}" foi excluído.`
      })
    }
  }

  const handleExport = () => {
    const data = filteredCrops.map(c => ({
      ID: c.id,
      Nome: c.name,
      Tipo: c.type,
      Categoria: c.category || "N/A",
      Estágio: c.stage,
      "Progresso (%)": c.progress,
      Área: c.area,
      "Data de Plantio": c.plantedDate,
      "Previsão de Colheita": c.expectedHarvest || "N/A",
      Vigor: c.health,
      Observações: c.notes || ""
    }))
    exportToCSV("relatorio_culturas_rocactrl", data)
  }

  const getHealthBadge = (health: string) => {
    switch (health) {
      case "Excelente":
      case "Ótimo":
        return <Badge className="bg-emerald-600/15 text-emerald-700 hover:bg-emerald-600/25 border-emerald-300">{health}</Badge>
      case "Saudável":
        return <Badge className="bg-lime-600/15 text-lime-700 hover:bg-lime-600/25 border-lime-300">Saudável</Badge>
      case "Observação":
      case "Atenção":
        return <Badge className="bg-amber-600/15 text-amber-700 hover:bg-amber-600/25 border-amber-300">{health}</Badge>
      default:
        return <Badge variant="outline">{health}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-3">
            <Sprout className="h-8 w-8 text-primary" /> Culturas, Hortas e Pomares
          </h1>
          <p className="text-muted-foreground">
            Acompanhamento de canteiros, estágios fenológicos, áreas de plantio e previsão de colheita.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" /> Exportar CSV
          </Button>
          <Button onClick={() => handleOpenDialog()} className="bg-primary hover:bg-primary/90 gap-2">
            <Plus className="h-4 w-4" /> Novo Canteiro / Pomar
          </Button>
        </div>
      </div>

      {/* Métricas Rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Cultivos Ativos</p>
            <p className="text-2xl font-bold text-foreground mt-1">{crops.length}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Canteiros e parcelas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Prontos / Em Colheita</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">
              {crops.filter(c => c.stage === "Colheita Contínua" || c.progress >= 85).length}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Disponíveis para colheita</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Em Desenvolvimento</p>
            <p className="text-2xl font-bold text-primary mt-1">
              {crops.filter(c => c.stage === "Desenvolvimento" || c.stage === "Floração").length}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Em fase de crescimento</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Categorias Vinculadas</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">
              {new Set(crops.map(c => c.category || c.type)).size}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Variedades no sítio</p>
          </CardContent>
        </Card>
      </div>

      {/* Busca e Filtros */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar canteiro, fruta ou legume..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground shrink-0">Tipo:</span>
              <select
                className="h-9 rounded-md border border-input bg-background px-2.5 py-1 text-xs"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="all">Todos os Tipos</option>
                <option value="Horta">Horta</option>
                <option value="Pomar">Pomar</option>
                <option value="Ervas">Ervas / Medicinais</option>
                <option value="Lavoura">Lavoura / Grãos</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground shrink-0">Categoria:</span>
              <select
                className="h-9 rounded-md border border-input bg-background px-2.5 py-1 text-xs"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">Todas as Categorias</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid de Cultivos */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCrops.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-card rounded-xl border border-dashed text-muted-foreground">
            <Leaf className="h-10 w-10 mx-auto opacity-30 mb-2" />
            <p className="text-base font-medium">Nenhum cultivo encontrado.</p>
            <p className="text-xs text-muted-foreground mt-1">Adicione um novo canteiro no botão acima.</p>
          </div>
        ) : (
          filteredCrops.map((crop) => (
            <Card key={crop.id} className="hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-primary uppercase tracking-wider">{crop.type}</span>
                      <span className="text-muted-foreground text-xs">•</span>
                      <span className="text-xs text-muted-foreground">{crop.category || "Geral"}</span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground mt-1">{crop.name}</h3>
                  </div>
                  {getHealthBadge(crop.health)}
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">Estágio: {crop.stage}</span>
                    <span className="font-bold text-primary">{crop.progress}%</span>
                  </div>
                  <Progress value={crop.progress} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-border/50 bg-muted/20 -mx-5 px-5">
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Área / Tamanho</span>
                    <span className="font-semibold text-foreground">{crop.area}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Previsão Colheita</span>
                    <span className="font-medium text-emerald-700">{crop.expectedHarvest || "Em breve"}</span>
                  </div>
                </div>

                {crop.notes && (
                  <p className="text-xs text-muted-foreground bg-muted/40 p-2.5 rounded-md italic">
                    "{crop.notes}"
                  </p>
                )}

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Plantado em: {crop.plantedDate}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                      onClick={() => handleOpenDialog(crop)}
                      title="Editar Cultivo"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(crop)}
                      title="Excluir Cultivo"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Modal Dialog para Cadastro/Edição */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sprout className="h-5 w-5 text-primary" />
              {editingId ? "Editar Cultivo / Canteiro" : "Novo Cultivo / Canteiro"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="crop-name">Nome do Canteiro / Plantação *</Label>
              <Input
                id="crop-name"
                placeholder="Ex: Canteiro Alface Roxa, Pomar Laranjeiras..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="crop-type">Tipo de Cultivo</Label>
                <select
                  id="crop-type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="Horta">Horta (Verduras/Legumes)</option>
                  <option value="Pomar">Pomar (Frutíferas)</option>
                  <option value="Ervas">Ervas e Medicinais</option>
                  <option value="Lavoura">Lavoura (Grãos/Tubérculos)</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="crop-category">Categoria (Banco Dinâmico)</Label>
                <select
                  id="crop-category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name} ({cat.sector})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="crop-area">Área / Tamanho Ocupado *</Label>
                <Input
                  id="crop-area"
                  placeholder="Ex: 25 m², 10 árvores, 2 canteiros"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="crop-stage">Estágio Fenológico</Label>
                <select
                  id="crop-stage"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.stage}
                  onChange={(e) => setFormData({ ...formData, stage: e.target.value as any })}
                >
                  {STAGE_OPTIONS.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <Label htmlFor="crop-progress">Progresso do Ciclo</Label>
                <span className="font-bold text-primary">{formData.progress}%</span>
              </div>
              <input
                id="crop-progress"
                type="range"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
                className="w-full cursor-pointer accent-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="crop-planted">Data de Plantio</Label>
                <Input
                  id="crop-planted"
                  type="date"
                  value={formData.plantedDate}
                  onChange={(e) => setFormData({ ...formData, plantedDate: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="crop-harvest">Previsão de Colheita</Label>
                <Input
                  id="crop-harvest"
                  placeholder="Ex: 2026-05-15 ou Contínua"
                  value={formData.expectedHarvest}
                  onChange={(e) => setFormData({ ...formData, expectedHarvest: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="crop-health">Vigor / Saúde</Label>
                <select
                  id="crop-health"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.health}
                  onChange={(e) => setFormData({ ...formData, health: e.target.value as any })}
                >
                  <option value="Excelente">Excelente</option>
                  <option value="Ótimo">Ótimo</option>
                  <option value="Saudável">Saudável</option>
                  <option value="Observação">Observação</option>
                  <option value="Atenção">Atenção / Risco</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="crop-notes">Observações e Manejo</Label>
                <Input
                  id="crop-notes"
                  placeholder="Ex: Irrigação gotejamento, adubação..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
              Salvar Cultivo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
