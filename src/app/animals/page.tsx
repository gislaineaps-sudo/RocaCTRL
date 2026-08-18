"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { 
  PawPrint, 
  Plus, 
  Search, 
  Filter, 
  HeartPulse, 
  Calendar, 
  Download, 
  Trash2, 
  Edit,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldCheck
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

const STATUS_OPTIONS = ["Saudável", "Observação", "Tratamento", "Vendido", "Abatido"] as const

export default function AnimalsPage() {
  const { animals, saveAnimal, deleteAnimal } = useAnimals()
  const { categories } = useCategories()
  const { toast } = useToast()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  // FILTRAGEM ESTRITA: APENAS CATEGORIAS DE ANIMAIS (type === 'ANIMAL')
  const animalCategories = categories.filter(c => c.type === 'ANIMAL' || (!c.type && c.sector === 'Animais'))

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
    status: AnimalItem["status"]
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
    const defaultCat = animalCategories[0]?.name || "🐔 Aves e Postura"
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
        description: "Por favor, informe a identificação ou nome do animal/lote.",
        variant: "destructive"
      })
      return
    }

    saveAnimal({
      id: editingId || undefined,
      name: formData.name.trim(),
      category: formData.category || animalCategories[0]?.name || "🐔 Aves e Postura",
      species: formData.species.trim() || "Mestiço / Caipira",
      quantity: Number(formData.quantity) || 1,
      age: Number(formData.age) || 1,
      unitAge: formData.unitAge,
      status: formData.status,
      location: formData.location.trim() || "Piquete / Galinheiro",
      notes: formData.notes.trim(),
      lastCheck: new Date().toISOString().split("T")[0]
    })

    toast({
      title: editingId ? "Animal atualizado!" : "Novo registro adicionado!",
      description: `"${formData.name}" foi salvo com sucesso no banco do rebanho.`
    })

    setIsDialogOpen(false)
  }

  const handleDelete = (animal: AnimalItem) => {
    if (confirm(`Deseja remover o registro de "${animal.name}"?`)) {
      deleteAnimal(animal.id)
      toast({
        title: "Registro removido",
        description: `"${animal.name}" foi excluído.`
      })
    }
  }

  const handleExport = () => {
    const data = filteredAnimals.map(a => ({
      ID: a.id,
      Nome: a.name,
      Categoria: a.category,
      Espécie: a.species,
      Quantidade: a.quantity || 1,
      Idade: `${a.age} ${a.unitAge || 'meses'}`,
      Status: a.status,
      Localização: a.location || "N/A",
      "Último Manejo": a.lastCheck,
      Observações: a.notes || ""
    }))
    exportToCSV("relatorio_animais_rocactrl", data)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Saudável":
        return <Badge className="bg-emerald-600/15 text-emerald-800 border-emerald-300">Saudável</Badge>
      case "Observação":
        return <Badge className="bg-amber-600/15 text-amber-800 border-amber-300">Em Observação</Badge>
      case "Tratamento":
        return <Badge className="bg-rose-600/15 text-rose-800 border-rose-300">Em Tratamento</Badge>
      case "Vendido":
        return <Badge className="bg-blue-600/15 text-blue-800 border-blue-300">Vendido</Badge>
      case "Abatido":
        return <Badge className="bg-slate-200 text-slate-700 border-slate-300">Abatido</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const totalAnimals = animals.reduce((acc, a) => acc + (a.quantity || 1), 0)

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-slate-900 flex items-center gap-3">
            <PawPrint className="h-8 w-8 text-primary" /> Criações, Rebanhos e Colmeias
          </h1>
          <p className="text-slate-600 font-medium">
            Manejo zootécnico de aves, pecuária, pequenos ruminantes, apicultura e piscicultura.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport} className="h-10 text-xs gap-2 border-slate-300 text-slate-800 hover:bg-slate-50 font-semibold">
            <Download className="h-4 w-4" /> Exportar CSV
          </Button>
          <Button onClick={() => handleOpenDialog()} className="h-10 px-4 bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-xs">
            <Plus className="h-4 w-4" /> Novo Animal / Lote
          </Button>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-slate-200">
          <CardContent className="p-4">
            <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">Total de Animais / Aves</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalAnimals}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Em {animals.length} lotes/registros</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-4">
            <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">Plantel Saudável</p>
            <p className="text-2xl font-bold text-emerald-700 mt-1">
              {animals.filter(a => a.status === "Saudável").length}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Sem pendências veterinárias</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-4">
            <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">Em Atenção / Tratamento</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">
              {animals.filter(a => a.status === "Observação" || a.status === "Tratamento").length}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Requer acompanhamento</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-4">
            <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">Categorias de Criação</p>
            <p className="text-2xl font-bold text-primary mt-1">
              {new Set(animals.map(a => a.category)).size}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Espécies registradas</p>
          </CardContent>
        </Card>
      </div>

      {/* Busca e Filtros */}
      <Card className="border-slate-200">
        <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar por nome, espécie, lote ou local..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-11 border-slate-300 text-sm text-slate-900"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 shrink-0">Categoria Animal:</span>
              <select
                className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-xs font-medium text-slate-800"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">Todas as Categorias de Criação</option>
                {animalCategories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 shrink-0">Status:</span>
              <select
                className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-xs font-medium text-slate-800"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">Todos os Status</option>
                {STATUS_OPTIONS.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid de Animais */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredAnimals.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300 text-slate-500">
            <PawPrint className="h-10 w-10 mx-auto opacity-30 mb-2" />
            <p className="text-base font-bold text-slate-700">Nenhum animal ou lote encontrado.</p>
            <p className="text-xs text-slate-500 mt-1">Cadastre um novo lote no botão acima.</p>
          </div>
        ) : (
          filteredAnimals.map((animal) => (
            <Card key={animal.id} className="hover:shadow-md transition-shadow relative overflow-hidden border-slate-200">
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-500">{animal.id}</span>
                      <span className="text-slate-400 text-xs">•</span>
                      <span className="text-xs font-bold text-primary">{animal.category}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">{animal.name}</h3>
                    <p className="text-xs text-slate-600 font-medium">{animal.species}</p>
                  </div>
                  {getStatusBadge(animal.status)}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs py-2.5 border-y border-slate-100 bg-slate-50 -mx-5 px-5">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Quantidade</span>
                    <span className="font-bold text-slate-900 text-sm">{animal.quantity || 1} cabeças/un</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Idade / Tempo</span>
                    <span className="font-bold text-slate-800">{animal.age} {animal.unitAge || "meses"}</span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-200/60 flex items-center gap-1.5 text-slate-600">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{animal.location || "Sítio / Pasto Geral"}</span>
                  </div>
                </div>

                {animal.notes && (
                  <p className="text-xs text-slate-700 bg-slate-100 p-2.5 rounded-lg italic">
                    "{animal.notes}"
                  </p>
                )}

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" /> Último manejo: {animal.lastCheck}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-slate-600 hover:text-primary hover:bg-primary/10"
                      onClick={() => handleOpenDialog(animal)}
                      title="Editar Registro"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-slate-600 hover:text-rose-600 hover:bg-rose-50"
                      onClick={() => handleDelete(animal)}
                      title="Excluir Registro"
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

      {/* Modal Dialog para Cadastro/Edição de Animais */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-headline font-bold text-slate-900">
              <PawPrint className="h-5 w-5 text-primary" />
              {editingId ? "Editar Registro Animal" : "Novo Registro de Animal / Lote"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="anim-name" className="text-xs font-bold text-slate-800">Identificação / Nome do Lote *</Label>
              <Input
                id="anim-name"
                placeholder="Ex: Lote Frangos 02, Mimosa, Colmeia 05..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-11 border-slate-300 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* SELETOR ESTRITO: EXIBE APENAS CATEGORIAS DO TIPO ANIMAL */}
              <div className="space-y-1.5">
                <Label htmlFor="anim-category" className="text-xs font-bold text-slate-800">
                  Categoria de Criação *
                </Label>
                <select
                  id="anim-category"
                  className="flex h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 font-medium"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {animalCategories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="anim-species" className="text-xs font-bold text-slate-800">Espécie / Raça Específica</Label>
                <Input
                  id="anim-species"
                  placeholder="Ex: Galinha Caipira, Saanen, Tilápia..."
                  value={formData.species}
                  onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                  className="h-11 border-slate-300 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="anim-quantity" className="text-xs font-bold text-slate-800">Qtd. Cabeças</Label>
                <Input
                  id="anim-quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  className="h-11 border-slate-300 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="anim-age" className="text-xs font-bold text-slate-800">Idade / Tempo</Label>
                <Input
                  id="anim-age"
                  type="number"
                  min="1"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  className="h-11 border-slate-300 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="anim-unit" className="text-xs font-bold text-slate-800">Unidade</Label>
                <select
                  id="anim-unit"
                  className="flex h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 font-medium"
                  value={formData.unitAge}
                  onChange={(e) => setFormData({ ...formData, unitAge: e.target.value as any })}
                >
                  <option value="dias">Dias</option>
                  <option value="meses">Meses</option>
                  <option value="anos">Anos</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="anim-status" className="text-xs font-bold text-slate-800">Status Sanitário</Label>
                <select
                  id="anim-status"
                  className="flex h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 font-medium"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                >
                  {STATUS_OPTIONS.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="anim-loc" className="text-xs font-bold text-slate-800">Localização / Piquete</Label>
                <Input
                  id="anim-loc"
                  placeholder="Ex: Piquete 01, Galinheiro B..."
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="h-11 border-slate-300 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="anim-notes" className="text-xs font-bold text-slate-800">Observações Zootécnicas</Label>
              <Input
                id="anim-notes"
                placeholder="Ex: Vacinação em dia, postura de 24 ovos/dia, suplementação mineral..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="h-11 border-slate-300 text-sm"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="h-11">
              Cancelar
            </Button>
            <Button onClick={handleSave} className="h-11 bg-primary hover:bg-primary/90 text-white font-bold px-5">
              Salvar Registro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
