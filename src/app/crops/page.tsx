"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Plus, 
  Search, 
  Calendar, 
  Droplets, 
  Leaf, 
  ArrowUpRight,
  History,
  Cherry,
  Sprout
} from "lucide-react"

const initialCrops = [
  { id: 1, name: "Canteiro de Alface", type: "Horta", stage: "Desenvolvimento", progress: 45, area: "15 m²", plantedDate: "2024-02-10", health: "Saudável" },
  { id: 2, name: "Limoeiros Siciliano", type: "Pomar", stage: "Frutificação", progress: 80, area: "8 árvores", plantedDate: "2023-05-10", health: "Excelente" },
  { id: 3, name: "Horta de Temperos", type: "Ervas", stage: "Colheita Contínua", progress: 100, area: "5 m²", plantedDate: "2024-01-05", health: "Ótimo" },
  { id: 4, name: "Canteiro Tomate Cereja", type: "Horta", stage: "Floração", progress: 60, area: "10 m²", plantedDate: "2024-02-01", health: "Observação" },
]

export default function CropsPage() {
  const [crops, setCrops] = useState(initialCrops)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  // Form State
  const [newName, setNewName] = useState("")
  const [newType, setNewType] = useState("")
  const [newArea, setNewArea] = useState("")
  const [customType, setCustomType] = useState("")

  const handleSave = () => {
    if (!newName || !newType || !newArea) return
    
    const finalType = newType === "Outro (Personalizado)" && customType ? customType : newType

    const newCrop = {
      id: Date.now(),
      name: newName,
      type: finalType,
      stage: "Plantio Inicial",
      progress: 0,
      area: newArea,
      plantedDate: new Date().toISOString().split('T')[0],
      health: "Observação"
    }
    setCrops([newCrop, ...crops])
    setIsDialogOpen(false)
    setNewName("")
    setNewType("")
    setNewArea("")
    setCustomType("")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Hortas e Pomares</h1>
          <p className="text-muted-foreground">Gestão de cultivos para consumo e pequena comercialização.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <History className="h-4 w-4 mr-2" /> Histórico
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" /> Novo Cultivo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Cultivo</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Nome</Label>
                  <Input 
                    id="name" 
                    className="col-span-3" 
                    placeholder="Ex: Canteiro de Rúcula" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">Categoria</Label>
                  <div className="col-span-3 space-y-2">
                    <Select value={newType} onValueChange={setNewType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione Categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hortaliças (Verduras/Legumes)">Hortaliças (Verduras/Legumes)</SelectItem>
                        <SelectItem value="Pomar (Frutíferas)">Pomar (Frutíferas)</SelectItem>
                        <SelectItem value="Ervas Medicinais / Temperos">Ervas Medicinais / Temperos</SelectItem>
                        <SelectItem value="Fungicultura (Cogumelos)">Fungicultura (Cogumelos)</SelectItem>
                        <SelectItem value="Cereais / Grãos (Milho/Soja)">Cereais / Grãos (Milho/Soja)</SelectItem>
                        <SelectItem value="Raízes / Tubérculos (Mandioca)">Raízes / Tubérculos (Mandioca)</SelectItem>
                        <SelectItem value="Floricultura (Flores)">Floricultura (Flores)</SelectItem>
                        <SelectItem value="Silvicultura (Madeira/Eucalipto)">Silvicultura (Madeira/Eucalipto)</SelectItem>
                        <SelectItem value="Outro (Personalizado)">Outro (Adicionar Manualmente...)</SelectItem>
                      </SelectContent>
                    </Select>
                    {newType === "Outro (Personalizado)" && (
                      <Input 
                        placeholder="Nome da categoria (ex: Hidroponia)" 
                        value={customType}
                        onChange={(e) => setCustomType(e.target.value)}
                      />
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="area" className="text-right">Tamanho</Label>
                  <Input 
                    id="area" 
                    className="col-span-3" 
                    placeholder="Ex: 5 m² ou 10 árvores" 
                    value={newArea}
                    onChange={(e) => setNewArea(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" onClick={handleSave}>Salvar Registro</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6">
        {crops.map((crop) => (
          <Card key={crop.id} className="overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/3 bg-primary/5 p-6 border-b lg:border-b-0 lg:border-r">
                <div className="flex items-center gap-2 text-primary font-bold mb-2">
                  {crop.type === "Pomar" ? <Cherry className="h-5 w-5" /> : <Sprout className="h-5 w-5" />}
                  <span>{crop.type}</span>
                </div>
                <h3 className="text-xl font-headline font-bold mb-1">{crop.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">Área: {crop.area} • Início: {crop.plantedDate}</p>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progresso do Ciclo</span>
                      <span className="font-bold">{crop.progress}%</span>
                    </div>
                    <Progress value={crop.progress} className="h-2" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-md bg-white border">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Estado</span>
                    <Badge variant="secondary" className={
                      crop.health === 'Observação' ? 'bg-yellow-100 text-yellow-700' : 'bg-accent text-accent-foreground'
                    }>{crop.health}</Badge>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase text-muted-foreground">Fase Atual</h4>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <ArrowUpRight className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold">{crop.stage}</p>
                      <p className="text-xs text-muted-foreground">Último manejo: 3 dias</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase text-muted-foreground">Próxima Rega</h4>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <Droplets className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold">Hoje, 17:30</p>
                      <p className="text-xs text-muted-foreground">Horta Principal</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase text-muted-foreground">Estimativa Colheita</h4>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold">~12 Março</p>
                      <p className="text-xs text-muted-foreground">Ideal para colheita jovem</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted/30 p-4 border-t w-full flex justify-end">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="text-xs h-8 bg-green-50 hover:bg-green-100 text-green-700 border-green-200">
                      🌿 Insumos e Custos
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Manejo de Insumos: {crop.name}</DialogTitle>
                    </DialogHeader>
                    <Tabs defaultValue="fertilizantes" className="w-full mt-2">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="fertilizantes">Fertilizantes</TabsTrigger>
                        <TabsTrigger value="pesticidas">Pesticidas</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="fertilizantes" className="space-y-4 py-4">
                        <div className="bg-green-50 border border-green-200 p-3 rounded-md flex justify-between items-center">
                          <div>
                            <p className="text-sm font-bold text-green-800">Custo com Fertilizantes</p>
                            <p className="text-xs text-green-700">Acumulado na safra atual</p>
                          </div>
                          <p className="text-lg font-bold text-green-800">R$ 150,00</p>
                        </div>
                        <div className="space-y-3">
                          <h4 className="text-sm font-bold">Aplicações Recentes</h4>
                          <div className="flex justify-between items-center text-sm border-b pb-2">
                            <span>NPK 10-10-10 (2kg)</span>
                            <span className="font-bold text-muted-foreground">15/02/2024</span>
                          </div>
                          <div className="flex justify-between items-center text-sm border-b pb-2">
                            <span>Composto Orgânico (10kg)</span>
                            <span className="font-bold text-muted-foreground">01/02/2024</span>
                          </div>
                        </div>
                        <div className="border-t pt-3">
                           <h4 className="text-sm font-bold mb-3">Lançar Nova Aplicação</h4>
                           <div className="grid gap-2">
                              <Input placeholder="Tipo (ex: NPK, Ureia)" className="text-sm" />
                              <div className="grid grid-cols-3 gap-2">
                                <Input placeholder="Qtd" type="number" className="text-sm" />
                                <Input type="date" className="text-sm" />
                                <Input placeholder="R$ Custo" type="number" className="text-sm" />
                              </div>
                              <Button size="sm" className="w-full mt-2" variant="outline">Salvar e Enviar ao Financeiro</Button>
                           </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="pesticidas" className="space-y-4 py-4">
                        <div className="bg-red-50 border border-red-200 p-3 rounded-md flex justify-between items-center">
                          <div>
                            <p className="text-sm font-bold text-red-800">Custo com Defensivos</p>
                            <p className="text-xs text-red-700">Acumulado na safra atual</p>
                          </div>
                          <p className="text-lg font-bold text-red-800">R$ 80,00</p>
                        </div>
                        <div className="space-y-3">
                          <h4 className="text-sm font-bold">Aplicações Recentes</h4>
                          <div className="flex justify-between items-center text-sm border-b pb-2">
                            <span>Óleo de Neem (500ml)</span>
                            <span className="font-bold text-muted-foreground">22/02/2024</span>
                          </div>
                        </div>
                        <div className="border-t pt-3">
                           <h4 className="text-sm font-bold mb-3">Lançar Nova Aplicação</h4>
                           <div className="grid gap-2">
                              <Input placeholder="Tipo (ex: Óleo de Neem)" className="text-sm" />
                              <div className="grid grid-cols-3 gap-2">
                                <Input placeholder="Qtd" type="number" className="text-sm" />
                                <Input type="date" className="text-sm" />
                                <Input placeholder="R$ Custo" type="number" className="text-sm" />
                              </div>
                              <Button size="sm" className="w-full mt-2" variant="outline">Salvar e Enviar ao Financeiro</Button>
                           </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>
              </div>

                </div>
              </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
