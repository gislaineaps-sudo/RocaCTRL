"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  ShieldCheck,
  Users,
  TrendingUp,
  MessageSquare,
  Plus,
  Search,
  Sparkles,
  CheckCircle2,
  Clock,
  Crown,
  Cpu,
  Gift,
} from "lucide-react"
import { useAdminData } from "@/hooks/use-roca-db"
import { useAuth } from "@/context/AuthContext"
import { PlanType, UserProfile } from "@/lib/db"
import { useToast } from "@/hooks/use-toast"

export default function AdminDashboardPage() {
  const { users, feedbacks, changeUserPlan, createOrInviteUser, toggleFeedbackStatus } = useAdminData()
  const { user, updateCurrentUserPlan } = useAuth()
  const { toast } = useToast()

  const [searchTerm, setSearchTerm] = useState("")
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [friendName, setFriendName] = useState("")
  const [friendEmail, setFriendEmail] = useState("")
  const [friendFarm, setFriendFarm] = useState("")
  const [friendPlan, setFriendPlan] = useState<PlanType>("pro")

  // KPIs da Plataforma
  const totalUsers = users.length
  const freeCount = users.filter((u) => !u.plan || u.plan === "free").length
  const proCount = users.filter((u) => u.plan === "pro").length
  const iotCount = users.filter((u) => u.plan === "iot").length

  // MRR Estimado (Pro = R$ 9,90 | IoT = R$ 24,90)
  const estimatedMRR = proCount * 9.9 + iotCount * 24.9

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.farmName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handlePlanChange = (targetUser: UserProfile, newPlan: PlanType) => {
    changeUserPlan(targetUser.uid, newPlan)
    if (user && user.uid === targetUser.uid) {
      updateCurrentUserPlan(newPlan)
    }
    const planLabel =
      newPlan === "iot"
        ? "Sítio Conectado - IoT (R$ 24,90)"
        : newPlan === "pro"
        ? "Chácara Produtiva - Pro (R$ 9,90)"
        : "Gratuito (R$ 0)"

    toast({
      title: "Plano atualizado com sucesso! ✨",
      description: `O plano de "${targetUser.name}" (${targetUser.farmName}) foi alterado para ${planLabel}.`,
    })
  }

  const handleInviteFriend = () => {
    if (!friendName.trim() || !friendEmail.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Informe o nome e o e-mail do amigo produtor.",
        variant: "destructive",
      })
      return
    }

    const newProfile: UserProfile = {
      uid: `usr-${Date.now()}`,
      name: friendName.trim(),
      email: friendEmail.trim().toLowerCase(),
      farmName: friendFarm.trim() || "Chácara Convidada",
      plan: friendPlan,
      role: "user",
      createdAt: new Date().toISOString().split("T")[0],
    }

    createOrInviteUser(newProfile)
    toast({
      title: "Acesso liberado! 🎁",
      description: `${newProfile.name} já está com o plano ${friendPlan.toUpperCase()} liberado quando entrar com ${newProfile.email}.`,
    })

    setFriendName("")
    setFriendEmail("")
    setFriendFarm("")
    setIsInviteOpen(false)
  }

  const getPlanBadge = (plan: PlanType) => {
    switch (plan) {
      case "iot":
        return (
          <Badge className="bg-blue-600/15 text-blue-800 border-blue-300 gap-1">
            <Cpu className="h-3 w-3" /> Sítio Conectado (R$ 24,90)
          </Badge>
        )
      case "pro":
        return (
          <Badge className="bg-emerald-600/15 text-emerald-800 border-emerald-300 gap-1">
            <Crown className="h-3 w-3" /> Chácara Pro (R$ 9,90)
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-slate-700 border-slate-300">
            Gratuito (R$ 0)
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Cabeçalho da Administradora */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-emerald-700 text-white rounded-2xl shadow-xs">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-headline font-bold text-slate-900">
                Painel da Administradora
              </h1>
              <Badge className="bg-amber-500/20 text-amber-900 border-amber-400 text-xs font-bold">
                Admin Master
              </Badge>
            </div>
            <p className="text-sm text-slate-600 font-medium">
              Gestão de produtores cadastrados, liberação manual de planos Pro/IoT e caixa de feedbacks.
            </p>
          </div>
        </div>

        <Button
          onClick={() => setIsInviteOpen(true)}
          className="h-11 px-5 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl gap-2 shadow-xs"
        >
          <Gift className="h-4 w-4" /> Liberar Plano Pro para Amigo(a)
        </Button>
      </div>

      {/* 1. KPIs DA PLATAFORMA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-600">Total de Produtores</span>
              <div className="p-2 bg-primary/10 text-primary rounded-xl">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 mt-2">{totalUsers}</p>
            <p className="text-xs text-slate-500 mt-0.5">Propriedades rurais ativas</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-600">Distribuição de Planos</span>
              <div className="p-2 bg-amber-500/15 text-amber-700 rounded-xl">
                <Crown className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-2 text-xs font-bold">
              <span className="text-slate-700">Grátis: {freeCount}</span>
              <span className="text-emerald-700">Pro: {proCount}</span>
              <span className="text-blue-700">IoT: {iotCount}</span>
            </div>
            <p className="text-xs text-slate-500 mt-1.5">
              {proCount + iotCount} assinantes em planos pagos/cortesia
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-emerald-50/40">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-emerald-900">MRR Estimado</span>
              <div className="p-2 bg-emerald-600 text-white rounded-xl">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <p className="text-3xl font-bold text-emerald-800 mt-2">
              R$ {estimatedMRR.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-emerald-700 mt-0.5">Receita recorrente mensal</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-600">Feedbacks Recebidos</span>
              <div className="p-2 bg-purple-600/10 text-purple-700 rounded-xl">
                <MessageSquare className="h-4 w-4" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 mt-2">{feedbacks.length}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {feedbacks.filter((f) => f.status === "Pendente").length} aguardando leitura
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 2. GESTÃO DE USUÁRIOS E TROCA RÁPIDA DE PLANO */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-headline font-bold text-slate-900">
                Gestão de Produtores Cadastrados ({filteredUsers.length})
              </CardTitle>
              <CardDescription className="text-xs text-slate-600">
                Altere manualmente o plano de qualquer produtor no seletor ao lado para liberar recursos Pro ou IoT gratuitamente.
              </CardDescription>
            </div>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar por nome, chácara ou e-mail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-10 text-xs border-slate-300"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="font-bold text-slate-800">Produtor(a)</TableHead>
                  <TableHead className="font-bold text-slate-800">Propriedade / Chácara</TableHead>
                  <TableHead className="font-bold text-slate-800">E-mail</TableHead>
                  <TableHead className="font-bold text-slate-800">Desde</TableHead>
                  <TableHead className="font-bold text-slate-800">Plano Atual</TableHead>
                  <TableHead className="text-right font-bold text-slate-800">
                    Alterar Plano (1 Clique)
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((u) => (
                  <TableRow key={u.uid} className="hover:bg-slate-50/70">
                    <TableCell className="font-bold text-slate-900 text-sm">
                      <div className="flex items-center gap-2">
                        <span>{u.name}</span>
                        {u.role === "admin" && (
                          <Badge className="bg-slate-900 text-white text-[10px]">Admin</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-emerald-800">
                      {u.farmName || "Minha Chácara"}
                    </TableCell>
                    <TableCell className="text-xs text-slate-600 font-mono">{u.email}</TableCell>
                    <TableCell className="text-xs text-slate-500">{u.createdAt}</TableCell>
                    <TableCell>{getPlanBadge(u.plan)}</TableCell>
                    <TableCell className="text-right">
                      <select
                        aria-label={`Alterar plano de ${u.name}`}
                        value={u.plan || "free"}
                        onChange={(e) => handlePlanChange(u, e.target.value as PlanType)}
                        className="h-9 rounded-xl border border-slate-300 bg-white px-3 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-primary cursor-pointer"
                      >
                        <option value="free">🌱 Gratuito (R$ 0)</option>
                        <option value="pro">⭐ Chácara Produtiva Pro (R$ 9,90)</option>
                        <option value="iot">📡 Sítio Conectado IoT (R$ 24,90)</option>
                      </select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 3. CAIXA DE ENTRADA DE FEEDBACKS */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-headline font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Caixa de Entrada de Feedbacks & Suporte Beta ({feedbacks.length})
          </CardTitle>
          <CardDescription className="text-xs text-slate-600">
            Sugestões, dúvidas e problemas enviados pelos produtores através do botão de suporte lateral.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {feedbacks.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-500">
                Nenhum feedback registrado até o momento.
              </p>
            ) : (
              feedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    fb.status === "Pendente"
                      ? "border-amber-300 bg-amber-50/40"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        className={
                          fb.type === "problema"
                            ? "bg-rose-600/15 text-rose-800 border-rose-300 text-[10px]"
                            : fb.type === "sugestao"
                            ? "bg-emerald-600/15 text-emerald-800 border-emerald-300 text-[10px]"
                            : "bg-blue-600/15 text-blue-800 border-blue-300 text-[10px]"
                        }
                      >
                        {fb.type === "problema"
                          ? "🐞 Problema"
                          : fb.type === "sugestao"
                          ? "💡 Sugestão"
                          : "❓ Dúvida"}
                      </Badge>
                      <span className="text-sm font-bold text-slate-900">{fb.userName}</span>
                      <span className="text-xs text-slate-500">• {fb.farmName || "Propriedade"}</span>
                      <span className="text-[11px] font-mono text-slate-400">({fb.createdAt})</span>
                    </div>
                    <p className="text-xs text-slate-800 leading-relaxed pt-1 font-medium">
                      "{fb.message}"
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleFeedbackStatus(fb.id)}
                      className="h-9 text-xs gap-1.5 border-slate-300"
                    >
                      {fb.status === "Lido" ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Lido
                        </>
                      ) : (
                        <>
                          <Clock className="h-3.5 w-3.5 text-amber-600" /> Marcar como Lido
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal para Liberar Plano Pro Gratuitamente para um Amigo */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-headline font-bold text-slate-900">
              <Gift className="h-5 w-5 text-primary" />
              Liberar Acesso Cortesia para Amigo(a)
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="friend-name" className="text-xs font-bold text-slate-800">
                Nome do Produtor(a) / Amigo(a) *
              </Label>
              <Input
                id="friend-name"
                placeholder="Ex: Zé Roberto"
                value={friendName}
                onChange={(e) => setFriendName(e.target.value)}
                className="h-11 border-slate-300"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="friend-farm" className="text-xs font-bold text-slate-800">
                Nome da Chácara / Sítio
              </Label>
              <Input
                id="friend-farm"
                placeholder="Ex: Chácara Recanto Verde"
                value={friendFarm}
                onChange={(e) => setFriendFarm(e.target.value)}
                className="h-11 border-slate-300"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="friend-email" className="text-xs font-bold text-slate-800">
                E-mail que ele(a) usará no login *
              </Label>
              <Input
                id="friend-email"
                type="email"
                placeholder="amigo@gmail.com"
                value={friendEmail}
                onChange={(e) => setFriendEmail(e.target.value)}
                className="h-11 border-slate-300"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="friend-plan" className="text-xs font-bold text-slate-800">
                Plano a Liberar
              </Label>
              <select
                id="friend-plan"
                value={friendPlan}
                onChange={(e) => setFriendPlan(e.target.value as PlanType)}
                className="flex h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-bold text-slate-900"
              >
                <option value="pro">⭐ Chácara Produtiva - Pro (R$ 9,90/mês - Cortesia)</option>
                <option value="iot">📡 Sítio Conectado - IoT (R$ 24,90/mês - Cortesia)</option>
                <option value="free">🌱 Gratuito</option>
              </select>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsInviteOpen(false)} className="h-11">
              Cancelar
            </Button>
            <Button
              onClick={handleInviteFriend}
              className="h-11 bg-primary hover:bg-primary/90 text-white font-bold"
            >
              Liberar Plano Agora
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
