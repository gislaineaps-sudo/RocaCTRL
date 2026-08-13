"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2,
  Edit,
  HeartPulse, 
  Calendar,
  Download,
  PawPrint,
  Layers,
  MapPin,
  FileText
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useAnimals, useCategories } from "@/hooks/use-roca-db"
import { AnimalItem } from "@/lib/db"
import { exportToCSV } from "@/lib/export-utils"
import { useToast } from "@/hooks/use-toast"

export default function AnimalsPage() {
  const { animals, saveAnimal, deleteAnimal } = useAnimals()
  const { categories } = useCategories()
  const { toast } = useToast()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  
  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<{
    name: string
    category: string
    species: string
    quantity: number
    age: number
    unitAge: "meses" | "anos" | "dias"
    status: "Saudável" | "Observação" | "Tratamento" | "Vendido" | "Abatido"
    location: string
    notes: string
  }>({
    name: "",
    category: "",
    species: "",
    quantity: 1,
    age: 1,
    unitAge: "meses",
    status: "Saudável",
    location: "",
    notes: ""
  })

  // Categorias disponíveis no banco (setor Animais ou todas)
  const animalCategories = categories.filter(c => c.sector === "Animais" || c.sector === "Geral")

  const filteredAnimals = animals.filter(animal => {
    const matchesCategory = selectedCategory === "all" || animal.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || animal.status === selectedStatus
    const matchesSearch = 
      animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (animal.location && animal.location.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesStatus && matchesSearch
  })

  const handleOpenDialog = (animal?: AnimalItem) => {
    const defaultCat = animalCategories[0]?.name || "Avicultura Caipira"
    if (animal) {
      setEditingId(animal.id)
      setFormData({
        name: animal.name,
        category: animal.category || defaultCat,
        species: animal.species || "",
        quantity: animal.quantity || 1,
        age: animal.age || 1,
        unitAge: animal.unitAge || "meses",
        status: animal.status || "Saudável",
        location: animal.location || "",
        notes: animal.notes || ""
      })
    } else {
      setEditingId(null)
      setFormData({
        name: "",
        category: defaultCat,
        species: "",
        quantity: 1,
        age: 1,
        unitAge: "meses",
        status: "Saudável",
        location: "",
        notes: ""
      })
    }
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe a identificação do animal ou lote.",
        variant: "destructive"
      })
      return
    }

    saveAnimal({
      id: editingId || undefined,
      name: formData.name.trim(),
      category: formData.category || animalCategories[0]?.name || "Animais",
      species: formData.species.trim() || "Espécie Geral",
      quantity: Number(formData.quantity) || 1,
      age: Number(formData.age) || 1,
      unitAge: formData.unitAge,
      status: formData.status,
      lastCheck: new Date().toISOString().split("T")[0],
      location: formData.location.trim() || "Propriedade",
      notes: formData.notes.trim()
    })

    toast({
      title: editingId ? "Registro atualizado!" : "Animal / Lote cadastrado!",
      description: `"${formData.name}" foi salvo no banco de dados local com sucesso.`
    })

    setIsDialogOpen(false)
  }

  const handleDelete = (animal: AnimalItem) => {
    if (confirm(`Deseja realmente remover o registro "${animal.name}"?`)) {
      deleteAnimal(animal.id)
      toast({
        title: "Registro excluído",
        description: `"${animal.name}" foi removido do sistema.`
      })
    }
  }

  const handleExport = () => {
    const data = filteredAnimals.map(a => ({
      ID: a.id,
      Nome: a.name,
      Categoria: a.category,
      "Espécie / Raça": a.species,
      Quantidade: a.quantity || 1,
      Idade: `${a.age} ${a.unitAge || "meses"}`,
      Status: a.status,
      "Localização no Sítio": a.location || "N/A",
      "Último Manejo": a.lastCheck,
      Observações: a.notes || ""
    }))
    exportToCSV("relatorio_animais_rocactrl", data)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Saudável":
        return <Badge className="bg-emerald-600/15 text-emerald-700 hover:bg-emerald-600/25 border-emerald-300">Saudável</Badge>
      case "Observação":
        return <Badge className="bg-amber-600/15 text-amber-700 hover:bg-amber-600/25 border-amber-300">Observação</Badge>
      case "Tratamento":
        return <Badge className="bg-rose-600/15 text-rose-700 hover:bg-rose-600/25 border-rose-300">Tratamento</Badge>
      case "Vendido":
        return <Badge className="bg-blue-600/15 text-blue-700 hover:bg-blue-600/25 border-blue-300">Vendido</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Estatísticas rápidas
  const totalHeads = animals.reduce((acc, a) => acc + (a.quantity || 1), 0)
  const healthyCount = animals.filter(a => a.status === "Saudável").length
  const observationCount = animals.filter(a => a.status === "Observação" || a.status === "Tratamento").length

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-3">
            <PawPrint className="h-8 w-8 text-primary" /> Manejo de Animais e Rebanho
          </h1>
          <p className="text-muted-foreground">
            Cadastro, rastreamento de saúde, lotes e controle zootécnico da propriedade.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" /> Exportar CSV
          </Button>
          <Button onClick={() => handleOpenDialog()} className="bg-primary hover:bg-primary/90 gap-2">
            <Plus className="h-4 w-4" /> Novo Registro Animal
          </Button>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Total de Indivíduos / Aves</p>
            <p className="text-2xl font-bold text-foreground mt-1">{totalHeads}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Em {animals.length} lotes/grupos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Status Saudável</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{healthyCount}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Lotes sem intercorrências</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Em Observação / Tratamento</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{observationCount}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Exigem atenção zootécnica</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Categorias Ativas</p>
            <p className="text-2xl font-bold text-primary mt-1">{new Set(animals.map(a => a.category)).size}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Tipos de criação no sítio</p>
          </CardContent>
        </Card>
      </div>

      {/* Barra de Busca e Filtros */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por lote, espécie, brinco ou local..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground shrink-0">Categoria:</span>
              <select
                className="h-9 rounded-md border border-input bg-background px-2.5 py-1 text-xs"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">Todas as Categorias</option>
                {Array.from(new Set(categories.map(c => c.name))).map(catName => (
                  <option key={catName} value={catName}>{catName}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground shrink-0">Status:</span>
              <select
                className="h-9 rounded-md border border-input bg-background px-2.5 py-1 text-xs"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">Todos os Status</option>
                <option value="Saudável">Saudável</option>
                <option value="Observação">Observação</option>
                <option value="Tratamento">Tratamento</option>
                <option value="Vendido">Vendido</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid de Animais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAnimals.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-card rounded-xl border border-dashed text-muted-foreground">
            <PawPrint className="h-10 w-10 mx-auto opacity-30 mb-2" />
            <p className="text-base font-medium">Nenhum animal ou lote encontrado.</p>
            <p className="text-xs text-muted-foreground mt-1">Cadastre um novo animal clicando no botão acima.</p>
          </div>
        ) : (
          filteredAnimals.map((animal) => (
            <Card key={animal.id} className="hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold bg-muted px-2 py-0.5 rounded text-muted-foreground">
                      {animal.id}
                    </span>
                    <h3 className="text-lg font-bold text-foreground mt-1">{animal.name}</h3>
                    <p className="text-xs text-muted-foreground">{animal.species}</p>
                  </div>
                  {getStatusBadge(animal.status)}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-border/50 bg-muted/20 -mx-5 px-5">
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Categoria</span>
                    <span className="font-medium text-foreground truncate block">{animal.category}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Quantidade</span>
                    <span className="font-semibold text-primary">{animal.quantity || 1} cabeças/un</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Idade</span>
                    <span className="font-medium text-foreground">{animal.age} {animal.unitAge || "meses"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Local no Sítio</span>
                    <span className="font-medium text-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-primary shrink-0" />
                      {animal.location || "Principal"}
                    </span>
                  </div>
                </div>

                {animal.notes && (
                  <p className="text-xs text-muted-foreground bg-muted/40 p-2.5 rounded-md italic">
                    "{animal.notes}"
                  </p>
                )}

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Manejo: {animal.lastCheck}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                      onClick={() => handleOpenDialog(animal)}
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(animal)}
                      title="Excluir"
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
              <PawPrint className="h-5 w-5 text-primary" />
              {editingId ? "Editar Registro Animal" : "Novo Registro de Animal / Lote"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="anim-name">Identificação / Nome do Lote *</Label>
              <Input
                id="anim-name"
                placeholder="Ex: Lote Frangos 02, Mimosa, Colmeia 05..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="anim-category">Categoria (Banco Dinâmico)</Label>
                <select
                  id="anim-category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name} ({cat.sector})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="anim-species">Espécie / Raça Específica</Label>
                <Input
                  id="anim-species"
                  placeholder="Ex: Galinha Caipira, Saanen, Tilápia..."
                  value={formData.species}
                  onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="anim-qty">Quantidade</Label>
                <Input
                  id="anim-qty"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="anim-age">Idade</Label>
                <Input
                  id="anim-age"
                  type="number"
                  min="0"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="anim-unit-age">Unidade Idade</Label>
                <select
                  id="anim-unit-age"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-2 py-2 text-sm"
                  value={formData.unitAge}
                  onChange={(e) => setFormData({ ...formData, unitAge: e.target.value as any })}
                >
                  <option value="meses">Meses</option>
                  <option value="anos">Anos</option>
                  <option value="dias">Dias</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="anim-status">Status de Saúde</Label>
                <select
                  id="anim-status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                >
                  <option value="Saudável">Saudável</option>
                  <option value="Observação">Observação</option>
                  <option value="Tratamento">Tratamento</option>
                  <option value="Vendido">Vendido</option>
                  <option value="Abatido">Abatido</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="anim-location">Localização no Sítio</Label>
                <Input
                  id="anim-location"
                  placeholder="Ex: Piquete 01, Galinheiro, Pasto Sul..."
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="anim-notes">Observações / Histórico de Manejo</Label>
              <Input
                id="anim-notes"
                placeholder="Ex: Vacinação em dia, peso médio, alimentação..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
              Salvar Registro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
