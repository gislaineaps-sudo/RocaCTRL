/**
 * @fileOverview Banco de dados multi-tenant reativo + sementes padrão para o RoçaCtrl.
 * Trabalha em conjunto com o Cloud Firestore (com persistência offline) e fallback em localStorage por usuário.
 */

export type CategoryType = 'PLANT' | 'ANIMAL' | 'FINANCIAL' | 'INFRASTRUCTURE'

export const AGRO_UNITS = ["kg", "Maço", "Caixa", "Saca", "Dúzia", "Litro", "Unidade"] as const
export type AgroUnit = typeof AGRO_UNITS[number]

export type PlanType = 'free' | 'pro' | 'iot'

export interface UserProfile {
  uid: string
  name: string
  email: string
  farmName: string
  plan: PlanType
  role: 'user' | 'admin'
  createdAt: string
}

export interface FeedbackItem {
  id: string
  uid?: string
  userName: string
  userEmail?: string
  farmName?: string
  type: "sugestao" | "problema" | "duvida"
  message: string
  status: "Pendente" | "Lido"
  createdAt: string
}

export interface CategoryItem {
  id: string
  name: string
  type: CategoryType
  sector?: "Culturas" | "Animais" | "Insumos" | "Financeiro" | "Infraestrutura" | "Geral"
  species: string
  products: string
  unit?: string
  icon?: string
  iconName?: string
  color?: string
}

export interface AnimalItem {
  id: string
  name: string
  category: string
  species: string
  age: number
  unitAge?: "meses" | "anos" | "dias"
  status: "Saudável" | "Observação" | "Tratamento" | "Vendido" | "Abatido"
  quantity?: number
  lastCheck: string
  notes?: string
  location?: string
}

export interface CropItem {
  id: string
  name: string
  type: string
  category?: string
  stage: "Preparo de Solo" | "Plantio Inicial" | "Desenvolvimento" | "Floração" | "Frutificação" | "Colheita Contínua" | "Finalizado"
  progress: number
  area: string
  unit?: string
  estimatedYield?: string
  plantedDate: string
  expectedHarvest?: string
  health: "Excelente" | "Saudável" | "Ótimo" | "Observação" | "Atenção"
  notes?: string
}

export interface TransactionItem {
  id: string
  description: string
  type: "receita" | "despesa"
  category: string
  amount: number
  quantity?: number
  unit?: string
  date: string
  relatedType?: "animal" | "crop" | "geral"
  relatedName?: string
  paymentMethod?: "Pix" | "Dinheiro" | "Cartão" | "Boleto" | "Outro"
  status: "Concluído" | "Pendente"
  notes?: string
}

export interface AlertTaskItem {
  id: string
  title: string
  priority: "Alta" | "Média" | "Baixa"
  category: string
  date: string
  status: "Pendente" | "Aguardando" | "Concluído"
  recurrence?: string
  notes?: string
  iconName?: string
}

// -------------------------------------------------------------
// DADOS INICIAIS (SEED) ESTRUTURADOS COM type: 'PLANT' | 'ANIMAL' | ...
// -------------------------------------------------------------

export const SEED_CATEGORIES: CategoryItem[] = [
  // 1. PLANTIOS / VEGETAÇÃO (type: 'PLANT')
  {
    id: "cat-plant-1",
    name: "🌳 Árvores Frutíferas",
    type: "PLANT",
    sector: "Culturas",
    species: "Limoeiro, Laranjeira, Jabuticabeira, Bananeira, Mamoeiro, Goiabeira, Mangueira",
    products: "Frutas frescas in natura, polpas congeladas, doces e geleias artesanais",
    unit: "Caixa",
    icon: "🌳",
    color: "#eab308"
  },
  {
    id: "cat-plant-2",
    name: "🌲 Árvores Nativas e Reflorestamento",
    type: "PLANT",
    sector: "Culturas",
    species: "Ipê Amarelo, Jatobá, Pau-Brasil, Cedro Rosa, Aroeira, Canafístula",
    products: "Mudas florestais, recuperação de nascentes e APPs, sombra para pasto",
    unit: "Unidade",
    icon: "🌲",
    color: "#059669"
  },
  {
    id: "cat-plant-3",
    name: "🥬 Hortaliças e Folhosas",
    type: "PLANT",
    sector: "Culturas",
    species: "Alface (Crespa/Americana), Rúcula, Couve Manteiga, Espinafre, Agrião, Acelga",
    products: "Maços frescos para feiras livres, restaurantes locais e consumo da família",
    unit: "Maço",
    icon: "🥬",
    color: "#22c55e"
  },
  {
    id: "cat-plant-4",
    name: "🌽 Grãos e Legumes",
    type: "PLANT",
    sector: "Culturas",
    species: "Milho Verde, Feijão Carioca, Tomate Cereja/Débora, Pimentão, Berinjela, Quiabo",
    products: "Espigas verdes, grãos secos, legumes in natura e ração para os animais",
    unit: "Saca",
    icon: "🌽",
    color: "#f59e0b"
  },
  {
    id: "cat-plant-5",
    name: "🌿 Ervas e Medicinais",
    type: "PLANT",
    sector: "Culturas",
    species: "Manjericão, Alecrim, Hortelã, Cebolinha, Salsinha, Tomilho, Boldo, Capim-Santo",
    products: "Temperos desidratados, chás medicinais, óleos essenciais e mudas em vasos",
    unit: "Maço",
    icon: "🌿",
    color: "#10b981"
  },
  {
    id: "cat-plant-6",
    name: "🥔 Raízes e Tubérculos",
    type: "PLANT",
    sector: "Culturas",
    species: "Mandioca Mansa (Aipim/Macaxeira), Batata-Doce, Cenoura, Beterraba, Inhame",
    products: "Raízes frescas embaladas, farinhas artesanais e polvilho",
    unit: "kg",
    icon: "🥔",
    color: "#d97706"
  },

  // 2. ANIMAIS E CRIAÇÕES (type: 'ANIMAL')
  {
    id: "cat-anim-1",
    name: "🐕 Animais Domésticos e Guarda",
    type: "ANIMAL",
    sector: "Animais",
    species: "Cão Pastor/Boiadeiro, Cão de Guarda do Galinheiro, Gato de Celeiro, Pets",
    products: "Vigilância patrimonial, guarda de rebanho, controle de roedores e companhia",
    unit: "Unidade",
    icon: "🐕",
    color: "#64748b"
  },
  {
    id: "cat-anim-2",
    name: "🐔 Aves e Postura",
    type: "ANIMAL",
    sector: "Animais",
    species: "Galinha Caipira (Poedeira), Frango Caipira de Corte, Codorna, Pato, Peru",
    products: "Ovos caipiras coloniais, carne nobre, pintainhos e esterco rico em N para horta",
    unit: "Dúzia",
    icon: "🐔",
    color: "#3b82f6"
  },
  {
    id: "cat-anim-3",
    name: "🐄 Pecuária e Criação",
    type: "ANIMAL",
    sector: "Animais",
    species: "Bovinos de Leite/Corte (Girolando, Jersey), Caprinos (Saanen), Ovinos, Suínos",
    products: "Leite cru artesanal, queijos frescos, carne, cordeiro, esterco para compostagem",
    unit: "Litro",
    icon: "🐄",
    color: "#8b5cf6"
  },
  {
    id: "cat-anim-4",
    name: "🐝 Apicultura / Colmeias",
    type: "ANIMAL",
    sector: "Animais",
    species: "Abelha Jataí (Sem Ferrão), Mandaçaia, Tiúba, Apis Mellifera (Europa)",
    products: "Mel puro de floradas silvestres, própolis verde, cera e polinização das culturas",
    unit: "Litro",
    icon: "🐝",
    color: "#facc15"
  },
  {
    id: "cat-anim-5",
    name: "🐟 Piscicultura e Aquicultura",
    type: "ANIMAL",
    sector: "Animais",
    species: "Tilápia do Nilo, Tambaqui, Pacu, Carpa Colorida, Lambari",
    products: "Peixes vivos, filés frescos limpos e água enriquecida para bioirrigação",
    unit: "kg",
    icon: "🐟",
    color: "#06b6d4"
  },

  // 3. FINANCEIRO (type: 'FINANCIAL')
  {
    id: "cat-fin-1",
    name: "💰 Venda de Produtos Agro",
    type: "FINANCIAL",
    sector: "Financeiro",
    species: "Feiras livres, cestas orgânicas por assinatura, venda direta na porteira",
    products: "Receitas operacionais brutas da produção",
    unit: "Unidade",
    icon: "💰",
    color: "#16a34a"
  },
  {
    id: "cat-fin-2",
    name: "🧾 Insumos, Rações e Custos",
    type: "FINANCIAL",
    sector: "Financeiro",
    species: "Rações balanceadas, vacinas, sementes, calcário, combustível e manutenção",
    products: "Despesas de custeio e manejo do sítio",
    unit: "Saca",
    icon: "🧾",
    color: "#ef4444"
  },

  // 4. INFRAESTRUTURA (type: 'INFRASTRUCTURE')
  {
    id: "cat-infra-1",
    name: "🚜 Maquinários e Implementos",
    type: "INFRASTRUCTURE",
    sector: "Infraestrutura",
    species: "Microtrator / Motocultivador, Roçadeira costal, Triturador de forragem",
    products: "Equipamentos mecânicos para preparo e manejo",
    unit: "Unidade",
    icon: "🚜",
    color: "#475569"
  },
  {
    id: "cat-infra-2",
    name: "💧 Irrigação e Reservatórios",
    type: "INFRASTRUCTURE",
    sector: "Infraestrutura",
    species: "Caixa d'água 5000L, Fitas de gotejamento, Bomba solar, Sensores IoT",
    products: "Segurança hídrica e automação de rega",
    unit: "Unidade",
    icon: "💧",
    color: "#0284c7"
  }
]

export const SEED_ANIMALS: AnimalItem[] = [
  { id: "AVI-001", name: "Lote Galinhas Poedeiras 01", category: "🐔 Aves e Postura", species: "Galinha Caipira", age: 6, unitAge: "meses", status: "Saudável", quantity: 30, lastCheck: "2026-04-10", location: "Galinheiro Principal", notes: "Produzindo média de 24 ovos/dia com ração orgânica e pastagem." },
  { id: "API-004", name: "Meliponário Jataí 01", category: "🐝 Apicultura / Colmeias", species: "Abelha Jataí (Sem Ferrão)", age: 14, unitAge: "meses", status: "Saudável", quantity: 6, lastCheck: "2026-04-05", location: "Pomar dos Citros", notes: "Ótima atividade de forrageamento e postura da rainha." },
  { id: "RUM-002", name: "Bete e Cabritas", category: "🐄 Pecuária e Criação", species: "Cabra Saanen", age: 24, unitAge: "meses", status: "Observação", quantity: 4, lastCheck: "2026-04-12", location: "Pasto 02", notes: "Vacinação de clostridiose em dia. Acompanhar lactação." }
]

export const SEED_CROPS: CropItem[] = [
  { id: "CRP-001", name: "Canteiro de Alface Crespa e Roxa", type: "Horta", category: "🥬 Hortaliças e Folhosas", stage: "Desenvolvimento", progress: 65, area: "20 m²", unit: "Maço", plantedDate: "2026-03-20", expectedHarvest: "2026-04-28", health: "Excelente", notes: "Irrigação por gotejamento conectada ao sensor IoT." },
  { id: "CRP-002", name: "Limoeiros Siciliano e Taiti", type: "Pomar", category: "🌳 Árvores Frutíferas", stage: "Frutificação", progress: 85, area: "12 árvores", unit: "Caixa", plantedDate: "2024-05-10", expectedHarvest: "2026-05-15", health: "Saudável", notes: "Boa carga de frutos, adubação com cinza e esterco realizada." },
  { id: "CRP-005", name: "Milho Verde Caipira", type: "Lavoura", category: "🌽 Grãos e Legumes", stage: "Desenvolvimento", progress: 40, area: "400 m²", unit: "Saca", plantedDate: "2026-03-01", expectedHarvest: "2026-06-10", health: "Saudável", notes: "Primeira capina realizada com sucesso." }
]

export const SEED_TRANSACTIONS: TransactionItem[] = [
  { id: "TX-001", description: "Venda de Ovos Caipiras (15 dúzias)", type: "receita", category: "💰 Venda de Produtos Agro", amount: 225.00, quantity: 15, unit: "Dúzia", date: "2026-04-12", relatedType: "animal", relatedName: "Lote Galinhas Poedeiras 01", paymentMethod: "Pix", status: "Concluído" },
  { id: "TX-002", description: "Compra de Ração de Postura 50kg", type: "despesa", category: "🧾 Insumos, Rações e Custos", amount: 135.00, quantity: 50, unit: "kg", date: "2026-04-10", relatedType: "animal", relatedName: "Lote Galinhas Poedeiras 01", paymentMethod: "Pix", status: "Concluído" },
  { id: "TX-003", description: "Venda de Cestas de Hortaliças para Feira", type: "receita", category: "💰 Venda de Produtos Agro", amount: 480.00, quantity: 40, unit: "Maço", date: "2026-04-11", relatedType: "crop", relatedName: "Canteiro de Alface", paymentMethod: "Dinheiro", status: "Concluído" }
]

export const SEED_ALERTS: AlertTaskItem[] = [
  { id: "ALT-001", title: "Vacinação Febre Aftosa / Clostridiose", priority: "Alta", category: "🐄 Pecuária e Criação", date: "2026-04-20", status: "Pendente", recurrence: "Semestral", notes: "Separar animais no piquete 02 às 7h." },
  { id: "ALT-002", title: "Adubação Foliar nos Limoeiros", priority: "Média", category: "🌳 Árvores Frutíferas", date: "2026-04-18", status: "Pendente", recurrence: "Mensal", notes: "Aplicar biofertilizante nas folhas ao entardecer." },
  { id: "ALT-003", title: "Colheita de Alface para Feira de Sábado", priority: "Alta", category: "🥬 Hortaliças e Folhosas", date: "2026-04-17", status: "Pendente", recurrence: "Semanal", notes: "Colher no amanhecer para preservar frescor." }
]

export const SEED_USERS: UserProfile[] = [
  {
    uid: "usr-admin-1",
    name: "Administradora RoçaCtrl",
    email: process.env.NEXT_PUBLIC_ADMIN_EMAIL || "suporte.rocactrl@gmail.com",
    farmName: "Sítio Matriz RoçaCtrl",
    plan: "iot",
    role: "admin",
    createdAt: "2026-03-01"
  },
  {
    uid: "usr-prod-2",
    name: "Seu Antônio Oliveira",
    email: "antonio.chacara@gmail.com",
    farmName: "Chácara São José",
    plan: "pro",
    role: "user",
    createdAt: "2026-04-02"
  },
  {
    uid: "usr-prod-3",
    name: "Maria Aparecida Santos",
    email: "maria.horta@gmail.com",
    farmName: "Recanto das Hortaliças",
    plan: "free",
    role: "user",
    createdAt: "2026-04-10"
  },
  {
    uid: "usr-prod-4",
    name: "Carlos Eduardo (Consultor)",
    email: "carlos.agro@outlook.com",
    farmName: "Fazendinha Boa Vista",
    plan: "free",
    role: "user",
    createdAt: "2026-04-14"
  }
]

export const SEED_FEEDBACKS: FeedbackItem[] = [
  {
    id: "FB-101",
    uid: "usr-prod-2",
    userName: "Seu Antônio Oliveira",
    userEmail: "antonio.chacara@gmail.com",
    farmName: "Chácara São José",
    type: "sugestao",
    message: "Adorei o seletor de Maço e Caixa nas colheitas! Facilitou muito na hora de fechar as vendas da feira de sábado.",
    status: "Lido",
    createdAt: "2026-04-15"
  },
  {
    id: "FB-102",
    uid: "usr-prod-3",
    userName: "Maria Aparecida Santos",
    userEmail: "maria.horta@gmail.com",
    farmName: "Recanto das Hortaliças",
    type: "duvida",
    message: "Como faço para conectar o sensor de umidade do solo no plano Sítio Conectado?",
    status: "Pendente",
    createdAt: "2026-04-16"
  }
]

// -------------------------------------------------------------
// STORAGE KEYS MULTI-TENANT & EVENT BUS
// -------------------------------------------------------------

const GLOBAL_KEYS = {
  ACTIVE_UID: "rocactrl_active_uid_v5",
  USERS: "rocactrl_global_users_v5",
  FEEDBACKS: "rocactrl_global_feedbacks_v5",
}

function getTenantKey(collectionName: string, uid?: string): string {
  const activeUid = uid || RocaDB.getCurrentUid()
  return `rocactrl_tenant_${activeUid}_${collectionName}_v5`
}

export function dispatchUpdateEvent(key: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("rocactrl_db_update", { detail: { key } }))
  }
}

function getStoredData<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const item = localStorage.getItem(key)
    if (!item) {
      localStorage.setItem(key, JSON.stringify(fallback))
      return fallback
    }
    return JSON.parse(item) as T
  } catch (error) {
    console.error(`Erro ao ler localStorage [${key}]:`, error)
    return fallback
  }
}

function setStoredData<T>(key: string, data: T): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(data))
    dispatchUpdateEvent(key)
  } catch (error) {
    console.error(`Erro ao gravar localStorage [${key}]:`, error)
  }
}

// -------------------------------------------------------------
// REPOSITÓRIO MULTI-TENANT ROÇACTRL DB
// -------------------------------------------------------------

export const RocaDB = {
  getCurrentUid(): string {
    if (typeof window === "undefined") return "demo"
    return localStorage.getItem(GLOBAL_KEYS.ACTIVE_UID) || "demo"
  },

  setCurrentUid(uid: string): void {
    if (typeof window === "undefined") return
    localStorage.setItem(GLOBAL_KEYS.ACTIVE_UID, uid)
    dispatchUpdateEvent("uid")
  },

  // Inicializa o seed de um novo usuário (Multi-Tenant Onboarding)
  ensureTenantSeeded(uid: string): void {
    if (typeof window === "undefined") return
    const catKey = getTenantKey("categories", uid)
    if (!localStorage.getItem(catKey)) {
      localStorage.setItem(catKey, JSON.stringify(SEED_CATEGORIES))
      localStorage.setItem(getTenantKey("animals", uid), JSON.stringify([SEED_ANIMALS[0]]))
      localStorage.setItem(getTenantKey("crops", uid), JSON.stringify([SEED_CROPS[0]]))
      localStorage.setItem(getTenantKey("transactions", uid), JSON.stringify([SEED_TRANSACTIONS[0]]))
      localStorage.setItem(getTenantKey("alerts", uid), JSON.stringify([SEED_ALERTS[0]]))
      dispatchUpdateEvent("seed")
    }
  },

  // Categorias
  getCategories(uid?: string): CategoryItem[] {
    return getStoredData<CategoryItem[]>(getTenantKey("categories", uid), SEED_CATEGORIES)
  },
  setCategoriesCache(categories: CategoryItem[], uid?: string): void {
    setStoredData(getTenantKey("categories", uid), categories)
  },
  saveCategory(category: Omit<CategoryItem, "id"> & { id?: string }, uid?: string): CategoryItem {
    const categories = this.getCategories(uid)
    if (category.id) {
      const index = categories.findIndex(c => c.id === category.id)
      if (index >= 0) {
        categories[index] = { ...categories[index], ...category } as CategoryItem
        setStoredData(getTenantKey("categories", uid), categories)
        return categories[index]
      }
    }
    const newCategory: CategoryItem = {
      ...category,
      id: category.id || `cat-${Date.now()}`
    }
    setStoredData(getTenantKey("categories", uid), [newCategory, ...categories])
    return newCategory
  },
  deleteCategory(id: string, uid?: string): void {
    const categories = this.getCategories(uid).filter(c => c.id !== id)
    setStoredData(getTenantKey("categories", uid), categories)
  },

  // Animais
  getAnimals(uid?: string): AnimalItem[] {
    return getStoredData<AnimalItem[]>(getTenantKey("animals", uid), SEED_ANIMALS)
  },
  setAnimalsCache(animals: AnimalItem[], uid?: string): void {
    setStoredData(getTenantKey("animals", uid), animals)
  },
  saveAnimal(animal: Omit<AnimalItem, "id"> & { id?: string }, uid?: string): AnimalItem {
    const animals = this.getAnimals(uid)
    if (animal.id) {
      const index = animals.findIndex(a => a.id === animal.id)
      if (index >= 0) {
        animals[index] = { ...animals[index], ...animal } as AnimalItem
        setStoredData(getTenantKey("animals", uid), animals)
        return animals[index]
      }
    }
    const prefix = animal.category.includes("Aves") ? "AVI" : animal.category.includes("Pecuária") ? "PEC" : animal.category.includes("Peixe") ? "PIS" : "ANI"
    const newAnimal: AnimalItem = {
      ...animal,
      id: animal.id || `${prefix}-${Math.floor(100 + Math.random() * 900)}`
    }
    setStoredData(getTenantKey("animals", uid), [newAnimal, ...animals])
    return newAnimal
  },
  deleteAnimal(id: string, uid?: string): void {
    const animals = this.getAnimals(uid).filter(a => a.id !== id)
    setStoredData(getTenantKey("animals", uid), animals)
  },

  // Culturas
  getCrops(uid?: string): CropItem[] {
    return getStoredData<CropItem[]>(getTenantKey("crops", uid), SEED_CROPS)
  },
  setCropsCache(crops: CropItem[], uid?: string): void {
    setStoredData(getTenantKey("crops", uid), crops)
  },
  saveCrop(crop: Omit<CropItem, "id"> & { id?: string }, uid?: string): CropItem {
    const crops = this.getCrops(uid)
    if (crop.id) {
      const index = crops.findIndex(c => c.id === crop.id)
      if (index >= 0) {
        crops[index] = { ...crops[index], ...crop } as CropItem
        setStoredData(getTenantKey("crops", uid), crops)
        return crops[index]
      }
    }
    const newCrop: CropItem = {
      ...crop,
      id: crop.id || `CRP-${Math.floor(100 + Math.random() * 900)}`
    }
    setStoredData(getTenantKey("crops", uid), [newCrop, ...crops])
    return newCrop
  },
  deleteCrop(id: string, uid?: string): void {
    const crops = this.getCrops(uid).filter(c => c.id !== id)
    setStoredData(getTenantKey("crops", uid), crops)
  },

  // Transações Financeiras
  getTransactions(uid?: string): TransactionItem[] {
    return getStoredData<TransactionItem[]>(getTenantKey("transactions", uid), SEED_TRANSACTIONS)
  },
  setTransactionsCache(txs: TransactionItem[], uid?: string): void {
    setStoredData(getTenantKey("transactions", uid), txs)
  },
  saveTransaction(tx: Omit<TransactionItem, "id"> & { id?: string }, uid?: string): TransactionItem {
    const transactions = this.getTransactions(uid)
    if (tx.id) {
      const index = transactions.findIndex(t => t.id === tx.id)
      if (index >= 0) {
        transactions[index] = { ...transactions[index], ...tx } as TransactionItem
        setStoredData(getTenantKey("transactions", uid), transactions)
        return transactions[index]
      }
    }
    const newTx: TransactionItem = {
      ...tx,
      id: tx.id || `TX-${Math.floor(100 + Math.random() * 900)}`
    }
    setStoredData(getTenantKey("transactions", uid), [newTx, ...transactions])
    return newTx
  },
  deleteTransaction(id: string, uid?: string): void {
    const transactions = this.getTransactions(uid).filter(t => t.id !== id)
    setStoredData(getTenantKey("transactions", uid), transactions)
  },

  // Alertas e Rotinas
  getAlerts(uid?: string): AlertTaskItem[] {
    return getStoredData<AlertTaskItem[]>(getTenantKey("alerts", uid), SEED_ALERTS)
  },
  setAlertsCache(alerts: AlertTaskItem[], uid?: string): void {
    setStoredData(getTenantKey("alerts", uid), alerts)
  },
  saveAlert(alert: Omit<AlertTaskItem, "id"> & { id?: string }, uid?: string): AlertTaskItem {
    const alerts = this.getAlerts(uid)
    if (alert.id) {
      const index = alerts.findIndex(a => a.id === alert.id)
      if (index >= 0) {
        alerts[index] = { ...alerts[index], ...alert } as AlertTaskItem
        setStoredData(getTenantKey("alerts", uid), alerts)
        return alerts[index]
      }
    }
    const newAlert: AlertTaskItem = {
      ...alert,
      id: alert.id || `ALT-${Math.floor(100 + Math.random() * 900)}`
    }
    setStoredData(getTenantKey("alerts", uid), [newAlert, ...alerts])
    return newAlert
  },
  toggleAlertStatus(id: string, uid?: string): AlertTaskItem | null {
    const alerts = this.getAlerts(uid)
    const index = alerts.findIndex(a => a.id === id)
    if (index >= 0) {
      alerts[index].status = alerts[index].status === "Concluído" ? "Pendente" : "Concluído"
      setStoredData(getTenantKey("alerts", uid), alerts)
      return alerts[index]
    }
    return null
  },
  deleteAlert(id: string, uid?: string): void {
    const alerts = this.getAlerts(uid).filter(a => a.id !== id)
    setStoredData(getTenantKey("alerts", uid), alerts)
  },

  // Gestão Global de Usuários (Para Painel Admin e Auth)
  getUsers(): UserProfile[] {
    return getStoredData<UserProfile[]>(GLOBAL_KEYS.USERS, SEED_USERS)
  },
  setUsersCache(users: UserProfile[]): void {
    setStoredData(GLOBAL_KEYS.USERS, users)
  },
  saveUser(profile: UserProfile): UserProfile {
    const users = this.getUsers()
    const idx = users.findIndex(u => u.uid === profile.uid || u.email.toLowerCase() === profile.email.toLowerCase())
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...profile }
      setStoredData(GLOBAL_KEYS.USERS, users)
      return users[idx]
    }
    setStoredData(GLOBAL_KEYS.USERS, [profile, ...users])
    return profile
  },
  updateUserPlan(uid: string, plan: PlanType): UserProfile | null {
    const users = this.getUsers()
    const idx = users.findIndex(u => u.uid === uid)
    if (idx >= 0) {
      users[idx].plan = plan
      setStoredData(GLOBAL_KEYS.USERS, users)
      return users[idx]
    }
    return null
  },

  // Caixa de Entrada de Feedbacks (Salvos na coleção feedbacks)
  getFeedbacks(): FeedbackItem[] {
    return getStoredData<FeedbackItem[]>(GLOBAL_KEYS.FEEDBACKS, SEED_FEEDBACKS)
  },
  setFeedbacksCache(feedbacks: FeedbackItem[]): void {
    setStoredData(GLOBAL_KEYS.FEEDBACKS, feedbacks)
  },
  saveFeedback(fb: Omit<FeedbackItem, "id" | "createdAt" | "status"> & { id?: string; status?: "Pendente" | "Lido" }): FeedbackItem {
    const feedbacks = this.getFeedbacks()
    const newFb: FeedbackItem = {
      id: fb.id || `FB-${Math.floor(100 + Math.random() * 900)}`,
      uid: fb.uid,
      userName: fb.userName || "Produtor(a)",
      userEmail: fb.userEmail,
      farmName: fb.farmName || "Minha Chácara",
      type: fb.type,
      message: fb.message,
      status: fb.status || "Pendente",
      createdAt: new Date().toISOString().split("T")[0],
    }
    setStoredData(GLOBAL_KEYS.FEEDBACKS, [newFb, ...feedbacks])
    return newFb
  },
  toggleFeedbackStatus(id: string): FeedbackItem | null {
    const feedbacks = this.getFeedbacks()
    const idx = feedbacks.findIndex(f => f.id === id)
    if (idx >= 0) {
      feedbacks[idx].status = feedbacks[idx].status === "Lido" ? "Pendente" : "Lido"
      setStoredData(GLOBAL_KEYS.FEEDBACKS, feedbacks)
      return feedbacks[idx]
    }
    return null
  },

  // Reset total para dados de demonstração no tenant atual
  resetToSeed(uid?: string): void {
    if (typeof window === "undefined") return
    localStorage.setItem(getTenantKey("categories", uid), JSON.stringify(SEED_CATEGORIES))
    localStorage.setItem(getTenantKey("animals", uid), JSON.stringify(SEED_ANIMALS))
    localStorage.setItem(getTenantKey("crops", uid), JSON.stringify(SEED_CROPS))
    localStorage.setItem(getTenantKey("transactions", uid), JSON.stringify(SEED_TRANSACTIONS))
    localStorage.setItem(getTenantKey("alerts", uid), JSON.stringify(SEED_ALERTS))
    dispatchUpdateEvent("all")
  }
}
