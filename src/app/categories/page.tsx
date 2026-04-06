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
  Info, 
  Bird, 
  Beef, 
  FlaskConical, 
  Leaf, 
  Cherry, 
  Sprout,
  Trees,
  Star
} from "lucide-react"

const initialCategories = [
  { id: 1, name: "Hortaliças (Verduras/Legumes)", species: "Alface, Tomate Cereja, Cenoura, Pimentão, Couve", products: "Consumo Próprio, Venda Local, Feiras", icon: Sprout },
  { id: 2, name: "Pomar (Frutíferas)", species: "Limão, Jabuticaba, Amora, Banana, Mamão", products: "Frutas Frescas, Geleias, Sucos", icon: Cherry },
  { id: 3, name: "Ervas Medicinais / Temperos", species: "Manjericão, Alecrim, Hortelã, Salsinha, Cebolinha", products: "Temperos Frescos, Chás, Óleos Essenciais", icon: Leaf },
  { id: 4, name: "Avicultura Familiar", species: "Galinha Caipira (Postura e Corte), Codorna", products: "Ovos Caipiras, Carne, Esterco para Horta", icon: Bird },
  { id: 5, name: "Apicultura / Meliponicultura", species: "Abelha Jataí, Mandaçaia, Europa", products: "Mel, Polinização da Horta, Própolis", icon: FlaskConical },
  { id: 6, name: "Pequenos Ruminantes", species: "Cabra Saanen (Leite), Ovelha Santa Inês", products: "Leite Artesanal, Queijos, Lã", icon: Beef },
  { id: 7, name: "Fungicultura (Cogumelos)", species: "Shitake, Shimeji, Champignon", products: "Consumo Próprio, Venda Especializada", icon: Leaf },
  { id: 8, name: "Cereais / Grãos (Milho/Soja)", species: "Milho, Soja, Arroz, Feijão", products: "Grãos de Consumo, Ração Animal", icon: Sprout },
  { id: 9, name: "Raízes / Tubérculos (Mandioca)", species: "Mandioca, Batata Doce, Inhame", products: "Farinhas, Consumo Fresco", icon: Sprout },
  { id: 10, name: "Floricultura (Flores)", species: "Orquídeas, Rosas, Girassóis", products: "Ornamentação, Eventos", icon: Star },
  { id: 11, name: "Silvicultura (Madeira/Eucalipto)", species: "Eucalipto, Pinus, Cedro", products: "Madeira, Lenha, Manejo Florestal", icon: Trees },
]

export default function CategoriesPage() {
  const [categories, setCategories] = useState(initialCategories)
  const [searchTerm, setSearchTerm] = useState("")
  
  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newName, setNewName] = useState("")
  const [newSpecies, setNewSpecies] = useState("")
  const [newProducts, setNewProducts] = useState("")

  const filtered = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.products.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSave = () => {
    if (!newName) return
    
    // Create new array to preserve existing functionality with new item
    const newCategory = {
      id: Date.now(),
      name: newName,
      species: newSpecies || "Não informado",
      products: newProducts || "Não informado",
      icon: Star
    }

    setCategories([newCategory, ...categories])
    setIsDialogOpen(false)
    setNewName("")
    setNewSpecies("")
    setNewProducts("")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Guia de Diversificação</h1>
          <p className="text-muted-foreground">Foco em Agricultura Familiar e Produção de Pequena Escala.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 min-w-40">
              <Plus className="h-4 w-4 mr-2" /> Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Incluir Manualmente</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nome</Label>
                <Input 
                  id="name" 
                  className="col-span-3" 
                  placeholder="Ex: Minhocultura" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="species" className="text-right">Cultivos</Label>
                <Input 
                  id="species" 
                  className="col-span-3" 
                  placeholder="Ex: Minhoca Californiana" 
                  value={newSpecies}
                  onChange={(e) => setNewSpecies(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="products" className="text-right">Produtos</Label>
                <Input 
                  id="products" 
                  className="col-span-3" 
                  placeholder="Ex: Húmus, Isca Viva" 
                  value={newProducts}
                  onChange={(e) => setNewProducts(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" onClick={handleSave}>Salvar Registro</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Filtrar cultivos, espécies ou produtos..." 
                className="pl-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[250px] font-bold">Categoria</TableHead>
                  <TableHead className="font-bold">Cultivos / Espécies</TableHead>
                  <TableHead className="font-bold">Finalidade / Produtos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length > 0 ? (
                  filtered.map((cat) => (
                    <TableRow key={cat.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                            <cat.icon className="h-4 w-4" />
                          </div>
                          <span>{cat.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {cat.species}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {cat.products.split(",").map((prod, i) => (
                            <Badge key={i} variant="secondary" className="bg-accent/10 text-primary border-none text-[10px]">
                              {prod.trim()}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                      Nenhuma categoria encontrada para "{searchTerm}".
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Sustentabilidade no Sítio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Em chácaras, a integração é a chave. Use o esterco das galinhas para adubar a horta e os restos de vegetais para alimentar os animais ou compostagem.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-accent/5 border-accent/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Leaf className="h-5 w-5 text-primary" />
              Agregação de Valor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Transformar o excedente do pomar em geleias ou vender ervas frescas em maços aumenta a rentabilidade da pequena propriedade.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
