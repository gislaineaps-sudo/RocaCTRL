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
  DialogTrigger,
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
  Package,
  Layers,
  Check
} from "lucide-react"
import { useCategories } from "@/hooks/use-roca-db"
import { CategoryItem, RocaDB } from "@/lib/db"
import { exportToCSV } from "@/lib/export-utils"
import { useToast } from "@/hooks/use-toast"

const SECTOR_OPTIONS = ["Todas", "Culturas", "Animais", "Insumos", "Financeiro", "Geral"] as const

export default function CategoriesPage() {
  const { categories, loaded, saveCategory, deleteCategory } = useCategories()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSector, setSelectedSector] = useState<string>("Todas")
  
  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<{
    name: string
    sector: "Culturas" | "Animais" | "Insumos" | "Financeiro" | "Geral"
    species: string
    products: string
    unit: string
    color: string
  }>({
    name: "",
    sector: "Culturas",
    species: "",
    products: "",
    unit: "",
    color: "#22c55e"
  })

  const filteredCategories = categories.filter(cat => {
    const matchesSector = selectedSector === "Todas" || cat.sector === selectedSector
    const matchesSearch = 
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.products.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSector && matchesSearch
  })

  const handleOpenDialog = (category?: CategoryItem) => {
    if (category) {
      setEditingId(category.id)
      setFormData({
        name: category.name,
        sector: category.sector,
        species: category.species || "",
        products: category.products || "",
        unit: category.unit || "",
        color: category.color || "#22c55e"
      })
    } else {
      setEditingId(null)
      setFormData({
        name: "",
        sector: "Culturas",
        species: "",
        products: "",
        unit: "",
        color: "#22c55e"
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

    saveCategory({
      id: editingId || undefined,
      name: formData.name.trim(),
      sector: formData.sector,
      species: formData.species.trim() || "Variedades diversas",
      products: formData.products.trim() || "Produção do sítio",
      unit: formData.unit.trim() || "unidades",
      color: formData.color
    })

    toast({
      title: editingId ? "Categoria atualizada!" : "Categoria cadastrada!",
      description: `A categoria "${formData.name}" já está disponível nos formulários.`
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
      Setor: c.sector,
      "Espécies / Variedades": c.species,
      "Produtos / Destinação": c.products,
      Unidade: c.unit || "N/A"
    }))
    exportToCSV("banco_categorias_rocactrl", data)
  }

  const handleResetSeed = () => {
    if (confirm("Deseja restaurar as categorias padrão do RoçaCtrl? Seus dados serão redefinidos para a base inicial.")) {
      RocaDB.resetToSeed()
      toast({
        title: "Banco restaurado",
        description: "Categorias e registros padrão foram recarregados."
      })
    }
  }

  const getSectorBadge = (sector: string) => {
    switch (sector) {
      case "Culturas":
        return <Badge className="bg-emerald-600/15 text-emerald-700 hover:bg-emerald-600/25 border-emerald-300 gap-1"><Sprout className="h-3 w-3" /> Culturas</Badge>
      case "Animais":
        return <Badge className="bg-blue-600/15 text-blue-700 hover:bg-blue-600/25 border-blue-300 gap-1"><PawPrint className="h-3 w-3" /> Animais</Badge>
      case "Insumos":
        return <Badge className="bg-amber-600/15 text-amber-700 hover:bg-amber-600/25 border-amber-300 gap-1"><Package className="h-3 w-3" /> Insumos</Badge>
      case "Financeiro":
        return <Badge className="bg-violet-600/15 text-violet-700 hover:bg-violet-600/25 border-violet-300 gap-1"><Wallet className="h-3 w-3" /> Financeiro</Badge>
      default:
        return <Badge variant="outline" className="gap-1"><Tag className="h-3 w-3" /> Geral</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-3">
            <Layers className="h-8 w-8 text-primary" /> Banco de Categorias
          </h1>
          <p className="text-muted-foreground">
            Gerencie e crie novas categorias dinâmicas para culturas, criações, insumos e finanças do seu sítio.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" /> Exportar CSV
          </Button>
          <Button variant="ghost" size="sm" onClick={handleResetSeed} className="gap-1 text-muted-foreground hover:text-foreground">
            <RotateCcw className="h-4 w-4" /> Restaurar Padrões
          </Button>
          <Button onClick={() => handleOpenDialog()} className="bg-primary hover:bg-primary/90 gap-2">
            <Plus className="h-4 w-4" /> Nova Categoria
          </Button>
        </div>
      </div>

      {/* Contadores por setor */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {SECTOR_OPTIONS.filter(s => s !== "Todas").map((sec) => {
          const count = categories.filter(c => c.sector === sec).length
          const isSelected = selectedSector === sec
          return (
            <Card 
              key={sec} 
              className={`cursor-pointer transition-all hover:border-primary/50 ${isSelected ? "border-primary bg-primary/5 shadow-sm" : ""}`}
              onClick={() => setSelectedSector(isSelected ? "Todas" : sec)}
            >
              <CardContent className="p-3 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">{sec}</p>
                  <p className="text-xl font-bold text-foreground">{count}</p>
                </div>
                <div className={`p-2 rounded-lg ${isSelected ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                  {sec === "Culturas" ? <Sprout className="h-4 w-4" /> :
                   sec === "Animais" ? <PawPrint className="h-4 w-4" /> :
                   sec === "Insumos" ? <Package className="h-4 w-4" /> :
                   sec === "Financeiro" ? <Wallet className="h-4 w-4" /> : <Tag className="h-4 w-4" />}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Barra de Filtros e Busca */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por categoria, espécies ou produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-semibold text-muted-foreground shrink-0 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Setor:
            </span>
            {SECTOR_OPTIONS.map((sec) => (
              <Button
                key={sec}
                variant={selectedSector === sec ? "default" : "outline"}
                size="sm"
                className="text-xs h-8 shrink-0"
                onClick={() => setSelectedSector(sec)}
              >
                {sec}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Categorias */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Categorias Registradas ({filteredCategories.length})</CardTitle>
              <CardDescription>Todas as opções abaixo alimentam os seletores dos módulos do RoçaCtrl.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="w-12 text-center">Cor</TableHead>
                  <TableHead>Nome da Categoria</TableHead>
                  <TableHead>Setor</TableHead>
                  <TableHead>Espécies / Variedades Típicas</TableHead>
                  <TableHead>Produtos e Destinação</TableHead>
                  <TableHead>Unidade de Medida</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                      Nenhuma categoria encontrada com os filtros selecionados.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((cat) => (
                    <TableRow key={cat.id} className="hover:bg-muted/20">
                      <TableCell className="text-center">
                        <span 
                          className="inline-block w-4 h-4 rounded-full border border-border shadow-xs" 
                          style={{ backgroundColor: cat.color || "#22c55e" }}
                        />
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">
                        {cat.name}
                      </TableCell>
                      <TableCell>
                        {getSectorBadge(cat.sector)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-xs truncate" title={cat.species}>
                        {cat.species || "Não informado"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-xs truncate" title={cat.products}>
                        {cat.products || "Não informado"}
                      </TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">
                        {cat.unit || "unidades"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                            onClick={() => handleOpenDialog(cat)}
                            title="Editar Categoria"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
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

      {/* Modal Dialog para Cadastro/Edição */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {editingId ? <Edit className="h-5 w-5 text-primary" /> : <Plus className="h-5 w-5 text-primary" />}
              {editingId ? "Editar Categoria" : "Nova Categoria"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="cat-name">Nome da Categoria *</Label>
              <Input
                id="cat-name"
                placeholder="Ex: Fruticultura Orgânica, Avicultura de Corte, etc."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="cat-sector">Setor Principal</Label>
                <select
                  id="cat-sector"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.sector}
                  onChange={(e) => setFormData({ ...formData, sector: e.target.value as any })}
                >
                  <option value="Culturas">Culturas (Plantios)</option>
                  <option value="Animais">Animais (Criações)</option>
                  <option value="Insumos">Insumos e Adubação</option>
                  <option value="Financeiro">Financeiro (Receita/Despesa)</option>
                  <option value="Geral">Geral / Diversos</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cat-unit">Unidade de Medida</Label>
                <Input
                  id="cat-unit"
                  placeholder="Ex: m², árvores, cabeças, kg, caixas"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cat-species">Espécies / Variedades Típicas</Label>
              <Input
                id="cat-species"
                placeholder="Ex: Alface crespa, Tomate cereja, Rúcula..."
                value={formData.species}
                onChange={(e) => setFormData({ ...formData, species: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cat-products">Produtos Finais e Comercialização</Label>
              <Input
                id="cat-products"
                placeholder="Ex: Maços frescos, Ovos caipiras, Polpa congelada..."
                value={formData.products}
                onChange={(e) => setFormData({ ...formData, products: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Cor de Identificação</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-10 h-10 rounded border cursor-pointer"
                />
                <span className="text-xs text-muted-foreground font-mono">{formData.color}</span>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
              Salvar Categoria
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
