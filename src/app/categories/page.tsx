"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { 
  Plus,
  Search, 
  Filter,
  Download,
  Trash2,
  Edit,
  RotateCcw,
  Sprout,
  PawPrint,
  Wallet,
  Tag,
  Wrench,
  Layers,
  Sparkles,
  TreeDeciduous
} from "lucide-react"
import { useCategories } from "@/hooks/use-roca-db"
import { CategoryItem, CategoryType, RocaDB } from "@/lib/db"
import { exportToCSV } from "@/lib/export-utils"
import { useToast } from "@/hooks/use-toast"

const TYPE_TABS = [
  { id: "ALL", label: "Todas as Categorias", icon: Layers },
  { id: "PLANT", label: "🌳 Culturas & Vegetação", icon: Sprout },
  { id: "ANIMAL", label: "🐔 Animais & Criações", icon: PawPrint },
  { id: "FINANCIAL", label: "💰 Financeiro", icon: Wallet },
  { id: "INFRASTRUCTURE", label: "🚜 Infraestrutura", icon: Wrench },
] as const

export default function CategoriesPage() {
  const { categories, loaded, saveCategory, deleteCategory } = useCategories()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<string>("ALL")
  
  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<{
    name: string
    type: CategoryType
    species: string
    products: string
    unit: string
    icon: string
    color: string
  }>({
    name: "",
    type: "PLANT",
    species: "",
    products: "",
    unit: "",
    icon: "🌱",
    color: "#22c55e"
  })

  const filteredCategories = categories.filter(cat => {
    const matchesType = activeTab === "ALL" || cat.type === activeTab
    const matchesSearch = 
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.products.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesType && matchesSearch
  })

  const handleOpenDialog = (category?: CategoryItem) => {
    if (category) {
      setEditingId(category.id)
      setFormData({
        name: category.name,
        type: category.type || "PLANT",
        species: category.species || "",
        products: category.products || "",
        unit: category.unit || "",
        icon: category.icon || "🌱",
        color: category.color || "#22c55e"
      })
    } else {
      setEditingId(null)
      // Define tipo inicial baseado na aba ativa se não for ALL
      const initialType: CategoryType = (activeTab !== "ALL" ? activeTab : "PLANT") as CategoryType
      setFormData({
        name: "",
        type: initialType,
        species: "",
        products: "",
        unit: "",
        icon: initialType === "PLANT" ? "🌱" : initialType === "ANIMAL" ? "🐔" : initialType === "FINANCIAL" ? "💰" : "🚜",
        color: initialType === "PLANT" ? "#22c55e" : initialType === "ANIMAL" ? "#3b82f6" : initialType === "FINANCIAL" ? "#8b5cf6" : "#475569"
      })
    }
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira o nome da categoria.",
        variant: "destructive"
      })
      return
    }

    const sectorName = 
      formData.type === "PLANT" ? "Culturas" :
      formData.type === "ANIMAL" ? "Animais" :
      formData.type === "FINANCIAL" ? "Financeiro" : "Infraestrutura"

    saveCategory({
      id: editingId || undefined,
      name: formData.name.trim(),
      type: formData.type,
      sector: sectorName,
      species: formData.species.trim() || "Variedades diversas",
      products: formData.products.trim() || "Produção do sítio",
      unit: formData.unit.trim() || "unidades",
      icon: formData.icon.trim() || "🌱",
      color: formData.color
    })

    toast({
      title: editingId ? "Categoria atualizada!" : "Categoria cadastrada!",
      description: `A categoria "${formData.name}" foi salva e já alimenta os formulários de ${sectorName}.`
    })

    setIsDialogOpen(false)
  }

  const handleDelete = (cat: CategoryItem) => {
    if (confirm(`Deseja realmente remover a categoria "${cat.name}"?`)) {
      deleteCategory(cat.id)
      toast({
        title: "Categoria removida",
        description: `A categoria "${cat.name}" foi excluída com sucesso.`
      })
    }
  }

  const handleExport = () => {
    const data = filteredCategories.map(c => ({
      ID: c.id,
      Nome: c.name,
      Tipo: c.type,
      "Espécies / Variedades": c.species,
      "Produtos / Destinação": c.products,
      Unidade: c.unit || "N/A"
    }))
    exportToCSV("banco_categorias_rocactrl", data)
  }

  const handleResetSeed = () => {
    if (confirm("Deseja restaurar todas as categorias padrão do RoçaCtrl? As categorias originais de Plantios, Animais e Finanças serão restauradas.")) {
      RocaDB.resetToSeed()
      toast({
        title: "Banco restaurado",
        description: "As categorias completas foram recarregadas com sucesso."
      })
    }
  }

  const getTypeBadge = (type: CategoryType) => {
    switch (type) {
      case "PLANT":
        return <Badge className="bg-emerald-600/15 text-emerald-800 border-emerald-300 gap-1.5 py-0.5"><Sprout className="h-3 w-3 text-emerald-600" /> Plantio / Vegetação</Badge>
      case "ANIMAL":
        return <Badge className="bg-blue-600/15 text-blue-800 border-blue-300 gap-1.5 py-0.5"><PawPrint className="h-3 w-3 text-blue-600" /> Animal / Criação</Badge>
      case "FINANCIAL":
        return <Badge className="bg-purple-600/15 text-purple-800 border-purple-300 gap-1.5 py-0.5"><Wallet className="h-3 w-3 text-purple-600" /> Financeiro</Badge>
      case "INFRASTRUCTURE":
        return <Badge className="bg-slate-200 text-slate-800 border-slate-300 gap-1.5 py-0.5"><Wrench className="h-3 w-3 text-slate-700" /> Infraestrutura</Badge>
      default:
        return <Badge variant="outline">Geral</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-slate-900 flex items-center gap-3">
            <Layers className="h-8 w-8 text-primary" /> Banco de Categorias do Sítio
          </h1>
          <p className="text-slate-600 font-medium">
            Organização estrita e categorização para Culturas, Animais, Finanças e Infraestrutura.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport} className="h-10 text-xs gap-2 border-slate-300 text-slate-800 hover:bg-slate-50 font-semibold">
            <Download className="h-4 w-4" /> Exportar CSV
          </Button>
          <Button variant="ghost" size="sm" onClick={handleResetSeed} className="h-10 text-xs gap-1.5 text-slate-600 hover:text-slate-900">
            <RotateCcw className="h-4 w-4" /> Restaurar Padrões
          </Button>
          <Button onClick={() => handleOpenDialog()} className="h-10 px-4 bg-primary hover:bg-primary/90 text-white font-bold gap-2 shadow-xs">
            <Plus className="h-4 w-4" /> Nova Categoria
          </Button>
        </div>
      </div>

      {/* ABAS DE SELEÇÃO POR TIPO / CONTEXTO */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {TYPE_TABS.map((tab) => {
          const isSelected = activeTab === tab.id
          const count = tab.id === "ALL" 
            ? categories.length 
            : categories.filter(c => c.type === tab.id).length

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shrink-0 min-h-[44px] ${
                isSelected
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <tab.icon className={`h-4 w-4 ${isSelected ? "text-amber-400" : "text-slate-500"}`} />
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Barra de Busca */}
      <Card className="border-slate-200">
        <CardContent className="p-3 flex items-center justify-between gap-4">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar categoria por nome, variedade (ex: milho, limão, galinha) ou produto final..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 border-slate-300 text-sm text-slate-900"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Categorias */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold text-slate-900">
            Categorias Ativas ({filteredCategories.length})
          </CardTitle>
          <CardDescription className="text-xs text-slate-600">
            As categorias abaixo alimentam automaticamente os seletores dos módulos correspondentes.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 border-b border-slate-200">
                  <TableHead className="w-14 text-center">Ícone</TableHead>
                  <TableHead className="font-bold text-slate-800">Nome da Categoria</TableHead>
                  <TableHead className="font-bold text-slate-800">Pertence a (Tipo)</TableHead>
                  <TableHead className="font-bold text-slate-800">Espécies / Variedades Típicas</TableHead>
                  <TableHead className="font-bold text-slate-800">Produtos / Destinação</TableHead>
                  <TableHead className="font-bold text-slate-800">Unidade</TableHead>
                  <TableHead className="text-right font-bold text-slate-800">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-slate-500 font-medium">
                      Nenhuma categoria encontrada nesta seção.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((cat) => (
                    <TableRow key={cat.id} className="hover:bg-slate-50/80 border-b border-slate-100">
                      <TableCell className="text-center text-lg">
                        <span 
                          className="inline-flex items-center justify-center w-8 h-8 rounded-xl text-base shadow-2xs"
                          style={{ backgroundColor: `${cat.color || '#22c55e'}20`, border: `1px solid ${cat.color || '#22c55e'}50` }}
                        >
                          {cat.icon || "🌱"}
                        </span>
                      </TableCell>
                      <TableCell className="font-bold text-slate-900 text-sm">
                        {cat.name}
                      </TableCell>
                      <TableCell>
                        {getTypeBadge(cat.type)}
                      </TableCell>
                      <TableCell className="text-xs text-slate-600 max-w-xs truncate" title={cat.species}>
                        {cat.species || "Não informado"}
                      </TableCell>
                      <TableCell className="text-xs text-slate-600 max-w-xs truncate" title={cat.products}>
                        {cat.products || "Não informado"}
                      </TableCell>
                      <TableCell className="text-xs font-mono text-slate-600 font-medium">
                        {cat.unit || "unidades"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-slate-600 hover:text-primary hover:bg-primary/10"
                            onClick={() => handleOpenDialog(cat)}
                            title="Editar Categoria"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-slate-600 hover:text-rose-600 hover:bg-rose-50"
                            onClick={() => handleDelete(cat)}
                            title="Excluir Categoria"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal Dialog para Cadastro/Edição com Seletor Obrigatório de Contexto */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-headline font-bold text-slate-900">
              {editingId ? <Edit className="h-5 w-5 text-primary" /> : <Plus className="h-5 w-5 text-primary" />}
              {editingId ? "Editar Categoria" : "Nova Categoria de Campo"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* SELETOR OBRIGATÓRIO DE TIPO / CONTEXTO */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                Essa categoria pertence a: *
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "PLANT", icon: "🌱", color: "#22c55e" })}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 text-left transition-all ${
                    formData.type === "PLANT"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-500/20"
                      : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <span className="text-xl">🌳</span>
                  <div>
                    <p className="text-xs font-bold">Plantio / Vegetação</p>
                    <p className="text-[10px] text-slate-500">Hortas, pomares, grãos</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "ANIMAL", icon: "🐔", color: "#3b82f6" })}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 text-left transition-all ${
                    formData.type === "ANIMAL"
                      ? "border-blue-600 bg-blue-50 text-blue-900 font-bold ring-2 ring-blue-500/20"
                      : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <span className="text-xl">🐔</span>
                  <div>
                    <p className="text-xs font-bold">Animais & Criações</p>
                    <p className="text-[10px] text-slate-500">Aves, rebanho, abelhas</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "FINANCIAL", icon: "💰", color: "#8b5cf6" })}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 text-left transition-all ${
                    formData.type === "FINANCIAL"
                      ? "border-purple-600 bg-purple-50 text-purple-900 font-bold ring-2 ring-purple-500/20"
                      : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <span className="text-xl">💰</span>
                  <div>
                    <p className="text-xs font-bold">Financeiro</p>
                    <p className="text-[10px] text-slate-500">Receitas e despesas</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "INFRASTRUCTURE", icon: "🚜", color: "#475569" })}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 text-left transition-all ${
                    formData.type === "INFRASTRUCTURE"
                      ? "border-slate-700 bg-slate-100 text-slate-900 font-bold ring-2 ring-slate-400/20"
                      : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <span className="text-xl">🚜</span>
                  <div>
                    <p className="text-xs font-bold">Infraestrutura</p>
                    <p className="text-[10px] text-slate-500">Máquinas e cercas</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cat-name" className="text-xs font-bold text-slate-800">Nome da Categoria *</Label>
              <Input
                id="cat-name"
                placeholder="Ex: 🌳 Fruticultura Orgânica, 🐔 Avicultura Caipira..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-11 bg-white border border-gray-300 text-gray-800 font-medium placeholder:text-gray-400 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="cat-unit" className="text-xs font-bold text-slate-800">Unidade de Medida</Label>
                <Input
                  id="cat-unit"
                  placeholder="Ex: m², árvores, cabeças, kg"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="h-11 bg-white border border-gray-300 text-gray-800 font-medium placeholder:text-gray-400 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cat-icon" className="text-xs font-bold text-slate-800">Emoji / Ícone</Label>
                <Input
                  id="cat-icon"
                  placeholder="Ex: 🌳, 🥬, 🐔, 🐄, 🐝, 💰"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="h-11 bg-white border border-gray-300 text-gray-800 font-medium placeholder:text-gray-400 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cat-species" className="text-xs font-bold text-slate-800">Espécies / Variedades Típicas</Label>
              <Input
                id="cat-species"
                placeholder="Ex: Alface crespa, Tomate cereja, Galinha Caipira..."
                value={formData.species}
                onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                className="h-11 bg-white border border-gray-300 text-gray-800 font-medium placeholder:text-gray-400 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cat-products" className="text-xs font-bold text-slate-800">Produtos Finais / Destinação</Label>
              <Input
                id="cat-products"
                placeholder="Ex: Maços frescos, Ovos coloniais, Frutas in natura..."
                value={formData.products}
                onChange={(e) => setFormData({ ...formData, products: e.target.value })}
                className="h-11 bg-white border border-gray-300 text-gray-800 font-medium placeholder:text-gray-400 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-sm"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="h-11">
              Cancelar
            </Button>
            <Button onClick={handleSave} className="h-11 bg-primary hover:bg-primary/90 text-white font-bold px-5">
              Salvar Categoria
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
