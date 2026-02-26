"use client"

import React, { useState } from "react"
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
  Tag
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

const initialAnimals = [
  { id: "BOV-001", name: "Mimosa", species: "Bovino", breed: "Nelore", age: 36, status: "Saudável", lastCheck: "2023-10-15" },
  { id: "BOV-002", name: "Estrela", species: "Bovino", breed: "Angus", age: 24, status: "Observação", lastCheck: "2023-11-02" },
  { id: "OVI-054", name: "Bento", species: "Ovino", breed: "Santa Inês", age: 12, status: "Saudável", lastCheck: "2023-11-10" },
  { id: "SUI-022", name: "Piggy", species: "Suíno", breed: "Landrace", age: 8, status: "Tratamento", lastCheck: "2023-11-18" },
]

export default function AnimalsPage() {
  const [animals, setAnimals] = useState(initialAnimals)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredAnimals = animals.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Gestão de Animais</h1>
          <p className="text-muted-foreground">Cadastre e acompanhe a saúde do seu rebanho.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" /> Novo Animal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Animal</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nome</Label>
                <Input id="name" className="col-span-3" placeholder="Ex: Mimosa" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="species" className="text-right">Espécie</Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bovino">Bovino</SelectItem>
                    <SelectItem value="ovino">Ovino</SelectItem>
                    <SelectItem value="suino">Suíno</SelectItem>
                  </SelectContent>
                </Select>
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
            placeholder="Buscar por nome ou ID..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" /> Filtros
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredAnimals.map((animal) => (
          <Card key={animal.id} className="group relative overflow-hidden hover:border-primary/50 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Badge variant="outline" className="mb-2 font-mono text-[10px] uppercase">
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
                    <DropdownMenuItem>Histórico Médico</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Remover</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardTitle className="font-headline text-lg group-hover:text-primary transition-colors">
                {animal.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Tag className="h-3 w-3" />
                <span>{animal.species} • {animal.breed}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{animal.age} meses</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-1">
                  <HeartPulse className={`h-4 w-4 ${
                    animal.status === 'Saudável' ? 'text-green-500' : 
                    animal.status === 'Observação' ? 'text-yellow-500' : 'text-red-500'
                  }`} />
                  <span className="text-xs font-semibold">{animal.status}</span>
                </div>
                <span className="text-[10px] text-muted-foreground italic">Check: {animal.lastCheck}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}