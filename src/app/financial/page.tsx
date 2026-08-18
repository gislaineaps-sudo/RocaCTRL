"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as ChartTooltip, 
  ResponsiveContainer, 
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { 
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Download,
  Plus,
  Trash2,
  Filter,
  Search,
  Sprout,
  PawPrint,
  CheckCircle2
} from "lucide-react"
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
import { useTransactions, useCategories, useAnimals, useCrops } from "@/hooks/use-roca-db"
import { TransactionItem } from "@/lib/db"
import { exportToCSV } from "@/lib/export-utils"
import { useToast } from "@/hooks/use-toast"

const COLORS = ["#16a34a", "#22c55e", "#eab308", "#3b82f6", "#8b5cf6", "#ec4899", "#f97316"]

export default function FinancialPage() {
  const { transactions, saveTransaction, deleteTransaction } = useTransactions()
  const { categories } = useCategories()
  const { animals } = useAnimals()
  const { crops } = useCrops()
  const { toast } = useToast()

  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | "receita" | "despesa">("all")
  
  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState<{
    description: string
    type: "receita" | "despesa"
    category: string
    amount: string
    date: string
    relatedType: "animal" | "crop" | "geral"
    relatedName: string
    paymentMethod: "Pix" | "Dinheiro" | "Cartão" | "Boleto" | "Outro"
    notes: string
  }>({
    description: "",
    type: "receita",
    category: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    relatedType: "geral",
    relatedName: "",
    paymentMethod: "Pix",
    notes: ""
  })

  // Categorias para finanças
  const finCategories = categories.filter(c => c.sector === "Financeiro" || c.sector === "Geral" || c.sector === "Insumos")

  const filteredTransactions = transactions.filter(tx => {
    const matchesType = filterType === "all" || tx.type === filterType
    const matchesSearch = 
      tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.relatedName && tx.relatedName.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesType && matchesSearch
  })

  // Cálculos financeiros totais
  const totalReceitas = transactions
    .filter(t => t.type === "receita")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0)

  const totalDespesas = transactions
    .filter(t => t.type === "despesa")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0)

  const saldoLiquido = totalReceitas - totalDespesas
  const margemLucro = totalReceitas > 0 ? ((saldoLiquido / totalReceitas) * 100).toFixed(1) : "0"

  // Agrupamento por mês para o gráfico
  const monthlyMap: Record<string, { month: string, receitas: number, despesas: number }> = {}
  transactions.forEach(tx => {
    const month = tx.date ? tx.date.substring(0, 7) : "2026-04"
    if (!monthlyMap[month]) {
      monthlyMap[month] = { month, receitas: 0, despesas: 0 }
    }
    if (tx.type === "receita") {
      monthlyMap[month].receitas += Number(tx.amount || 0)
    } else {
      monthlyMap[month].despesas += Number(tx.amount || 0)
    }
  })
  const chartData = Object.values(monthlyMap).sort((a, b) => a.month.localeCompare(b.month))

  // Gráfico de distribuição por categoria
  const categoryMap: Record<string, number> = {}
  transactions.forEach(tx => {
    const cat = tx.category || "Outros"
    categoryMap[cat] = (categoryMap[cat] || 0) + Number(tx.amount || 0)
  })
  const pieData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }))

  const handleOpenDialog = (type: "receita" | "despesa" = "receita") => {
    const defaultCat = finCategories[0]?.name || (type === "receita" ? "Venda de Produtos Agro" : "Custos Operacionais e Ração")
    setFormData({
      description: "",
      type,
      category: defaultCat,
      amount: "",
      date: new Date().toISOString().split("T")[0],
      relatedType: "geral",
      relatedName: "",
      paymentMethod: "Pix",
      notes: ""
    })
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    const val = parseFloat(formData.amount.replace(",", "."))
    if (!formData.description.trim() || isNaN(val) || val <= 0) {
      toast({
        title: "Dados inválidos",
        description: "Informe a descrição e um valor monetário positivo.",
        variant: "destructive"
      })
      return
    }

    saveTransaction({
      description: formData.description.trim(),
      type: formData.type,
      category: formData.category || "Geral",
      amount: val,
      date: formData.date,
      relatedType: formData.relatedType,
      relatedName: formData.relatedName.trim() || undefined,
      paymentMethod: formData.paymentMethod,
      status: "Concluído",
      notes: formData.notes.trim() || undefined
    })

    toast({
      title: formData.type === "receita" ? "Receita registrada!" : "Despesa registrada!",
      description: `R$ ${val.toFixed(2)} lançado com sucesso.`
    })

    setIsDialogOpen(false)
  }

  const handleDelete = (tx: TransactionItem) => {
    if (confirm(`Remover o lançamento "${tx.description}"?`)) {
      deleteTransaction(tx.id)
      toast({
        title: "Lançamento excluído",
        description: "O registro financeiro foi removido."
      })
    }
  }

  const handleExport = () => {
    const data = filteredTransactions.map(t => ({
      ID: t.id,
      Descrição: t.description,
      Tipo: t.type.toUpperCase(),
      Categoria: t.category,
      "Valor (R$)": t.amount.toFixed(2),
      Data: t.date,
      Vínculo: t.relatedName || "Geral",
      "Forma de Pagamento": t.paymentMethod || "Pix",
      Status: t.status
    }))
    exportToCSV("relatorio_financeiro_rocactrl", data)
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-3">
            <Wallet className="h-8 w-8 text-primary" /> Planejamento & Controle Financeiro
          </h1>
          <p className="text-muted-foreground">
            Gestão de receitas, custos de manejo, insumos e fluxo de caixa da propriedade.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" /> Exportar CSV
          </Button>
          <Button onClick={() => handleOpenDialog("despesa")} variant="outline" className="border-rose-300 text-rose-700 hover:bg-rose-50 gap-2">
            <ArrowDownRight className="h-4 w-4" /> Nova Despesa
          </Button>
          <Button onClick={() => handleOpenDialog("receita")} className="bg-primary hover:bg-primary/90 gap-2">
            <ArrowUpRight className="h-4 w-4" /> Nova Receita
          </Button>
        </div>
      </div>

      {/* Cards de Saldo e Indicadores */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground font-medium">Total de Receitas</p>
              <span className="p-1.5 rounded-full bg-emerald-100 text-emerald-700">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
            <p className="text-2xl font-bold text-emerald-600 mt-1">
              R$ {totalReceitas.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Vendas e comercialização</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-rose-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground font-medium">Total de Despesas</p>
              <span className="p-1.5 rounded-full bg-rose-100 text-rose-700">
                <ArrowDownRight className="h-4 w-4" />
              </span>
            </div>
            <p className="text-2xl font-bold text-rose-600 mt-1">
              R$ {totalDespesas.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Insumos, ração e manejo</p>
          </CardContent>
        </Card>

        <Card className={`border-l-4 ${saldoLiquido >= 0 ? "border-l-primary" : "border-l-rose-600"}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground font-medium">Saldo Líquido</p>
              <span className="p-1.5 rounded-full bg-primary/10 text-primary">
                <Wallet className="h-4 w-4" />
              </span>
            </div>
            <p className={`text-2xl font-bold mt-1 ${saldoLiquido >= 0 ? "text-primary" : "text-rose-600"}`}>
              R$ {saldoLiquido.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Resultado acumulado</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground font-medium">Margem Operacional</p>
              <span className="p-1.5 rounded-full bg-blue-100 text-blue-700">
                <TrendingUp className="h-4 w-4" />
              </span>
            </div>
            <p className="text-2xl font-bold text-blue-600 mt-1">{margemLucro}%</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Eficiência de retorno</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos de Fluxo Financeiro */}
      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="font-headline text-lg">Fluxo de Caixa (Receitas vs Despesas)</CardTitle>
            <CardDescription>Evolução mensal dos lançamentos financeiros</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.length ? chartData : [{ month: "Atual", receitas: totalReceitas, despesas: totalDespesas }]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `R$ ${val}`} />
                  <ChartTooltip formatter={(value: any) => [`R$ ${Number(value).toFixed(2)}`, ""]} />
                  <Legend />
                  <Bar dataKey="receitas" fill="#22c55e" name="Receitas (R$)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="despesas" fill="#ef4444" name="Despesas (R$)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline text-lg">Distribuição por Categoria</CardTitle>
            <CardDescription>Volume movimentado por tipo de operação</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name }) => name.split(" ")[0]}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip formatter={(value: any) => [`R$ ${Number(value).toFixed(2)}`, "Total"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Histórico e Tabela de Lançamentos */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Extrato e Lançamentos ({filteredTransactions.length})</CardTitle>
              <CardDescription>Histórico detalhado de entradas e saídas.</CardDescription>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar lançamento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-8 text-xs"
                />
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant={filterType === "all" ? "default" : "outline"}
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setFilterType("all")}
                >
                  Todos
                </Button>
                <Button
                  variant={filterType === "receita" ? "default" : "outline"}
                  size="sm"
                  className="h-8 text-xs text-emerald-700"
                  onClick={() => setFilterType("receita")}
                >
                  Receitas
                </Button>
                <Button
                  variant={filterType === "despesa" ? "default" : "outline"}
                  size="sm"
                  className="h-8 text-xs text-rose-700"
                  onClick={() => setFilterType("despesa")}
                >
                  Despesas
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Vínculo</TableHead>
                  <TableHead>Pagamento</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Nenhum lançamento encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((tx) => (
                    <TableRow key={tx.id} className="hover:bg-muted/20">
                      <TableCell className="text-xs font-mono text-muted-foreground">
                        {tx.date}
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">
                        {tx.description}
                      </TableCell>
                      <TableCell>
                        {tx.type === "receita" ? (
                          <Badge className="bg-emerald-600/15 text-emerald-700 hover:bg-emerald-600/25 border-emerald-300">
                            Receita
                          </Badge>
                        ) : (
                          <Badge className="bg-rose-600/15 text-rose-700 hover:bg-rose-600/25 border-rose-300">
                            Despesa
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {tx.category}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {tx.relatedName || "Geral"}
                      </TableCell>
                      <TableCell className="text-xs font-medium">
                        {tx.paymentMethod || "Pix"}
                      </TableCell>
                      <TableCell className={`text-right font-bold ${tx.type === "receita" ? "text-emerald-600" : "text-rose-600"}`}>
                        {tx.type === "receita" ? "+ " : "- "}
                        R$ {Number(tx.amount).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDelete(tx)}
                          title="Excluir Lançamento"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Nova Transação */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              {formData.type === "receita" ? "Registrar Receita" : "Registrar Despesa"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="flex gap-2">
              <Button
                type="button"
                variant={formData.type === "receita" ? "default" : "outline"}
                className={`flex-1 ${formData.type === "receita" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}`}
                onClick={() => setFormData({ ...formData, type: "receita" })}
              >
                <ArrowUpRight className="h-4 w-4 mr-1" /> Receita (Entrada)
              </Button>
              <Button
                type="button"
                variant={formData.type === "despesa" ? "default" : "outline"}
                className={`flex-1 ${formData.type === "despesa" ? "bg-rose-600 hover:bg-rose-700 text-white" : ""}`}
                onClick={() => setFormData({ ...formData, type: "despesa" })}
              >
                <ArrowDownRight className="h-4 w-4 mr-1" /> Despesa (Saída)
              </Button>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tx-desc">Descrição do Lançamento *</Label>
              <Input
                id="tx-desc"
                placeholder={formData.type === "receita" ? "Ex: Venda de 10 dúzias de ovos, colheita alface..." : "Ex: Compra de saco de ração 50kg, adubo orgânico..."}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="tx-amount">Valor (R$) *</Label>
                <Input
                  id="tx-amount"
                  placeholder="0,00"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="tx-date">Data</Label>
                <Input
                  id="tx-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="tx-category">Categoria</Label>
                  <select
                    id="tx-category"
                    className="flex h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 font-medium"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <optgroup label="💰 Financeiro e Custos">
                      {categories.filter(c => c.type === 'FINANCIAL').map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="🌳 Culturas & Vegetação">
                      {categories.filter(c => c.type === 'PLANT').map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="🐔 Animais & Criações">
                      {categories.filter(c => c.type === 'ANIMAL').map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="🚜 Infraestrutura">
                      {categories.filter(c => c.type === 'INFRASTRUCTURE').map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </optgroup>
                  </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="tx-method">Forma de Pagamento</Label>
                <select
                  id="tx-method"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                >
                  <option value="Pix">Pix</option>
                  <option value="Dinheiro">Dinheiro</option>
                  <option value="Cartão">Cartão</option>
                  <option value="Boleto">Boleto</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tx-related">Vínculo com Atividade (Opcional)</Label>
              <select
                id="tx-related"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.relatedName}
                onChange={(e) => setFormData({ ...formData, relatedName: e.target.value })}
              >
                <option value="">Geral / Sem Vínculo Específico</option>
                <optgroup label="Animais">
                  {animals.map(a => (
                    <option key={a.id} value={`Animal: ${a.name}`}>{a.name} ({a.category})</option>
                  ))}
                </optgroup>
                <optgroup label="Culturas">
                  {crops.map(c => (
                    <option key={c.id} value={`Cultura: ${c.name}`}>{c.name} ({c.type})</option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
              Salvar Lançamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
