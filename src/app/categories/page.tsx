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
import { Search, Info, Bird, Fish, HelpCircle, Beef, FlaskConical } from "lucide-react"

const categories = [
  { id: 1, name: "Avicultura", species: "Galinha Caipira, Codorna, Pato, Ganso, Peru", products: "Ovos, Carne, Penas, Esterco (Adubo)", icon: Bird },
  { id: 2, name: "Cunicultura", species: "Coelho (Nova Zelândia, Gigante de Flandres)", products: "Carne, Pele, Matrizes", icon: HelpCircle },
  { id: 3, name: "Apicultura", species: "Abelha Europa (Apis), Jataí, Mandaçaia", products: "Mel, Própolis, Pólen, Cera, Geleia Real", icon: FlaskConical },
  { id: 4, name: "Pequenos Ruminantes", species: "Cabra (Saanen, Alpina), Ovelha (Santa Inês)", products: "Leite, Queijo, Iogurte, Lã, Carne", icon: Beef },
  { id: 5, name: "Piscicultura", species: "Tilápia, Tambaqui, Carpa", products: "Filé, Peixe Inteiro, Alevinos", icon: Fish },
  { id: 6, name: "Ranicultura", species: "Rã-touro", products: "Carne, Couro", icon: Info },
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
          <h1 className="text-3xl font-headline font-bold text-primary">Categorias de Produção</h1>
          <p className="text-muted-foreground">Guia de referência para diversificação da propriedade rural.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Filtrar categorias, espécies ou produtos..." 
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
                  <TableHead className="font-bold">Espécies Comuns</TableHead>
                  <TableHead className="font-bold">Principais Produtos</TableHead>
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
              Dica de Gestão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">
              A diversificação de categorias pode aumentar a resiliência financeira da sua propriedade. 
              Considere integrar produções complementares, como Apicultura próxima a Culturas que necessitam de polinização.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-accent/5 border-accent/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bird className="h-5 w-5 text-primary" />
              Sustentabilidade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">
              O uso de subprodutos (como o esterco da avicultura) como adubo para suas culturas reduz custos 
              e promove uma economia circular dentro da sua fazenda.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
