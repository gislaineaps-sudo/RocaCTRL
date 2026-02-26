"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Info, Bird, Fish, HelpCircle, Beef, FlaskConical, Leaf, Cherry, Sprout } from "lucide-react"

const categories = [
  { id: 1, name: "Horta de Vegetais", species: "Alface, Tomate Cereja, Cenoura, Pimentão, Couve", products: "Consumo Próprio, Venda Local, Feiras", icon: Sprout },
  { id: 2, name: "Pomar (Frutíferas)", species: "Limão, Jabuticaba, Amora, Banana, Mamão", products: "Frutas Frescas, Geleias, Sucos", icon: Cherry },
  { id: 3, name: "Ervas e Temperos", species: "Manjericão, Alecrim, Hortelã, Salsinha, Cebolinha", products: "Temperos Frescos, Chás, Óleos Essenciais", icon: Leaf },
  { id: 4, name: "Avicultura Familiar", species: "Galinha Caipira (Postura e Corte), Codorna", products: "Ovos Caipiras, Carne, Esterco para Horta", icon: Bird },
  { id: 5, name: "Apicultura / Meliponicultura", species: "Abelha Jataí, Mandaçaia, Europa", products: "Mel, Polinização da Horta, Própolis", icon: FlaskConical },
  { id: 6, name: "Pequenos Ruminantes", species: "Cabra Saanen (Leite), Ovelha Santa Inês", products: "Leite Artesanal, Queijos, Lã", icon: Beef },
]

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filtered = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.products.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Guia de Diversificação</h1>
          <p className="text-muted-foreground">Foco em Agricultura Familiar e Produção de Pequena Escala.</p>
        </div>
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
                  <TableHead className="w-[200px] font-bold">Categoria</TableHead>
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
                          <div className="p-2 rounded-lg bg-primary/10 text-primary">
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
                          {cat.products.split(", ").map((prod, i) => (
                            <Badge key={i} variant="secondary" className="bg-accent/10 text-primary border-none text-[10px]">
                              {prod}
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
