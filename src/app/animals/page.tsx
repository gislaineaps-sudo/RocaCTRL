
"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  HeartPulse, 
  Calendar,
  Tag,
  Layers
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const CATEGORIES_DATA = {
  "Avicultura": ["Galinha Caipira", "Galinha de Angola", "Codorna", "Pato", "Ganso", "Peru"],
  "Cunicultura": ["Coelho Nova Zelândia", "Coelho Gigante de Flandres"],
  "Apicultura": ["Abelha Europa (Apis)", "Abelha Jataí", "Abelha Mandaçaia"],
  "Pequenos Ruminantes": ["Cabra Saanen", "Cabra Alpina", "Ovelha Santa Inês"],
  "Piscicultura": ["Tilápia", "Tambaqui", "Carpa"],
  "Ranicultura": ["Rã-touro"]
}

const initialAnimals = [
  { id: "AVI-001", name: "Lote Frangos 01", category: "Avicultura", species: "Galinha Caipira", age: 4, status: "Saudável", lastCheck: "2024-02-15" },
  { id: "RUM-002", name: "Bete", category: "Pequenos Ruminantes", species: "Cabra Saanen", age: 24, status: "Observação", lastCheck: "2024-02-10" },
  { id: "PIS-003", name: "Tanque 04", category: "Piscicultura", species: "Tilápia", age: 3, status: "Saudável", lastCheck: "2024-02-12" },
  { id: "API-004", name: "Colmeia Jataí", category: "Apicultura", species: "Abelha Jataí", age: 12, status: "Saudável", lastCheck: "2024-02-01" },
]

export default function AnimalsPage() {
  const [animals] = useState(initialAnimals)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  
  // Form state for dependencies
  const [newAnimalCategory, setNewAnimalCategory] = useState<string>("")
  const [newAnimalSpecies, setNewAnimalSpecies] = useState<string>("")

  const filteredAnimals = useMemo(() => {
    return animals.filter(a => {
      const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            a.species.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = selectedCategory === "all" || a.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })
  }, [animals, searchTerm, selectedCategory])

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Gestão de Animais</h1>
          <p className="text-muted-foreground">Cadastre e acompanhe a saúde das suas criações por categoria.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" /> Novo Registro
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Animal/Lote</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">ID/Nome</Label>
                <Input id="name" className="col-span-3" placeholder="Ex: Mimosa ou Lote 01" />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">Categoria</Label>
                <div className="col-span-3">
                  <Select onValueChange={(val) => {
                    setNewAnimalCategory(val)
                    setNewAnimalSpecies("") 
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(CATEGORIES_DATA).map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="species" className="text-right">Espécie</Label>
                <div className="col-span-3">
                  <Select 
                    disabled={!newAnimalCategory} 
                    onValueChange={setNewAnimalSpecies} 
                    value={newAnimalSpecies}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={newAnimalCategory ? "Selecione a Espécie" : "Aguardando categoria..."} />
                    </SelectTrigger>
                    <SelectContent>
                      {newAnimalCategory && CATEGORIES_DATA[newAnimalCategory as keyof typeof CATEGORIES_DATA].map(spec => (
                        <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="age" className="text-right">Idade (Meses)</Label>
                <Input id="age" type="number" className="col-span-3" placeholder="Ex: 12" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Salvar Registro</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por nome, ID ou espécie..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <Layers className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Todas Categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas Categorias</SelectItem>
              {Object.keys(CATEGORIES_DATA).map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredAnimals.length > 0 ? filteredAnimals.map((animal) => (
          <Card key={animal.id} className="group relative overflow-hidden hover:border-primary/50 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Badge variant="outline" className="mb-2 font-mono text-[10px] uppercase bg-muted/50 border-primary/20">
                  {animal.id}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Editar</DropdownMenuItem>
                    <DropdownMenuItem>Histórico</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Remover</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardTitle className="font-headline text-lg group-hover:text-primary transition-colors">
                {animal.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[10px] font-bold text-primary/70 uppercase tracking-widest">
                  <Layers className="h-3 w-3" />
                  <span>{animal.category}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                  <Tag className="h-3 w-3" />
                  <span>{animal.species}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{animal.age} meses</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center gap-1.5">
                  <HeartPulse className={`h-4 w-4 ${
                    animal.status === 'Saudável' ? 'text-green-500' : 
                    animal.status === 'Observação' ? 'text-yellow-500' : 'text-red-500'
                  }`} />
                  <span className="text-xs font-bold">{animal.status}</span>
                </div>
                <span className="text-[10px] text-muted-foreground italic">Visto: {animal.lastCheck}</span>
              </div>
            </CardContent>
          </Card>
        )) : (
          <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-xl bg-muted/5">
            <Layers className="h-10 w-10 mx-auto mb-3 opacity-20" />
            <p>Nenhum registro encontrado para os filtros atuais.</p>
          </div>
        )}
      </div>
    </div>
  )
}
