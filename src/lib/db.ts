/**
 * @fileOverview Banco de dados local reativo para o RoçaCtrl.
 * Fornece persistência em localStorage, dados iniciais ricos (seed) e eventos de sincronização.
 */

export type CategoryType = 'PLANT' | 'ANIMAL' | 'FINANCIAL' | 'INFRASTRUCTURE'

export const AGRO_UNITS = ["kg", "Maço", "Caixa", "Saca", "Dúzia", "Litro", "Unidade"] as const
export type AgroUnit = typeof AGRO_UNITS[number]

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
    unit: "árvores / covas",
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
    unit: "mudas / hectares",
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
    unit: "m² / canteiros",
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
    unit: "m² / sacas",
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
    unit: "m² / vasos",
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
    unit: "canteiros / sacos",
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
    unit: "indivíduos",
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
    unit: "aves / cabeças",
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
    unit: "cabeças / lotes",
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
    unit: "caixas / colmeias",
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
    unit: "tanques / alevinos",
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
    unit: "R$",
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
    unit: "R$",
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
    unit: "unidades",
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
    unit: "sistemas",
    icon: "💧",
    color: "#0284c7"
  }
]

export const SEED_ANIMALS: AnimalItem[] = [
  { id: "AVI-001", name: "Lote Galinhas Poedeiras 01", category: "🐔 Aves e Postura", species: "Galinha Caipira", age: 6, unitAge: "meses", status: "Saudável", quantity: 30, lastCheck: "2026-04-10", location: "Galinheiro Principal", notes: "Produzindo média de 24 ovos/dia com ração orgânica e pastagem." },
  { id: "RUM-002", name: "Bete e Cabritas", category: "🐄 Pecuária e Criação", species: "Cabra Saanen", age: 24, unitAge: "meses", status: "Observação", quantity: 4, lastCheck: "2026-04-12", location: "Pasto 02", notes: "Vacinação de clostridiose em dia. Acompanhar lactação." },
  { id: "PIS-003", name: "Tanque Alevinos 04", category: "🐟 Piscicultura e Aquicultura", species: "Tilápia do Nilo", age: 3, unitAge: "meses", status: "Saudável", quantity: 200, lastCheck: "2026-04-14", location: "Tanque Escavado 04", notes: "Biometria com média de 280g por exemplar." },
  { id: "API-004", name: "Meliponário Jataí 01", category: "🐝 Apicultura / Colmeias", species: "Abelha Jataí (Sem Ferrão)", age: 14, unitAge: "meses", status: "Saudável", quantity: 6, lastCheck: "2026-04-05", location: "Pomar dos Citros", notes: "Ótima atividade de forrageamento e postura da rainha." },
  { id: "PET-005", name: "Trovão (Cão Pastor)", category: "🐕 Animais Domésticos e Guarda", species: "Border Collie / Pastor", age: 3, unitAge: "anos", status: "Saudável", quantity: 1, lastCheck: "2026-04-08", location: "Casa e Piquetes", notes: "Guarda do rebanho e auxílio no manejo de piquetes." },
  { id: "BOV-006", name: "Mimosa (Leite)", category: "🐄 Pecuária e Criação", species: "Girolando", age: 4, unitAge: "anos", status: "Saudável", quantity: 1, lastCheck: "2026-04-11", location: "Piquete 01", notes: "Média de 14 litros de leite por ordenha diária." }
]

export const SEED_CROPS: CropItem[] = [
  { id: "CRP-001", name: "Canteiro de Alface Crespa e Roxa", type: "Horta", category: "🥬 Hortaliças e Folhosas", stage: "Desenvolvimento", progress: 65, area: "20 m²", unit: "Maço", plantedDate: "2026-03-20", expectedHarvest: "2026-04-28", health: "Excelente", notes: "Irrigação por gotejamento conectada ao sensor IoT." },
  { id: "CRP-002", name: "Limoeiros Siciliano e Taiti", type: "Pomar", category: "🌳 Árvores Frutíferas", stage: "Frutificação", progress: 85, area: "12 árvores", unit: "Caixa", plantedDate: "2024-05-10", expectedHarvest: "2026-05-15", health: "Saudável", notes: "Boa carga de frutos, adubação com cinza e esterco realizada." },
  { id: "CRP-003", name: "Canteiro Tomate Cereja Orgânico", type: "Horta", category: "🌽 Grãos e Legumes", stage: "Floração", progress: 55, area: "15 m²", unit: "kg", plantedDate: "2026-03-10", expectedHarvest: "2026-05-20", health: "Ótimo", notes: "Tutoramento feito. Aplicação preventiva de calda bordalesa." },
  { id: "CRP-004", name: "Ervas Finas e Medicinais", type: "Ervas", category: "🌿 Ervas e Medicinais", stage: "Colheita Contínua", progress: 100, area: "8 m²", unit: "Maço", plantedDate: "2025-11-01", expectedHarvest: "Colheita Semanal", health: "Excelente", notes: "Manjericão e alecrim com excelente aroma." },
  { id: "CRP-005", name: "Milho Verde Caipira", type: "Lavoura", category: "🌽 Grãos e Legumes", stage: "Desenvolvimento", progress: 40, area: "400 m²", unit: "Saca", plantedDate: "2026-03-01", expectedHarvest: "2026-06-10", health: "Saudável", notes: "Primeira capina realizada com sucesso." },
  { id: "CRP-006", name: "Bosque de Ipês e Nativas", type: "Pomar", category: "🌲 Árvores Nativas e Reflorestamento", stage: "Desenvolvimento", progress: 50, area: "500 m²", unit: "Unidade", plantedDate: "2024-01-15", expectedHarvest: "Reflorestamento Contínuo", health: "Excelente", notes: "Mudas protegidas com coroamento e cobertura morta." }
]

export const SEED_TRANSACTIONS: TransactionItem[] = [
  { id: "TX-001", description: "Venda de Ovos Caipiras (15 dúzias)", type: "receita", category: "💰 Venda de Produtos Agro", amount: 225.00, quantity: 15, unit: "Dúzia", date: "2026-04-12", relatedType: "animal", relatedName: "Lote Galinhas Poedeiras 01", paymentMethod: "Pix", status: "Concluído" },
  { id: "TX-002", description: "Compra de Ração de Postura 50kg", type: "despesa", category: "🧾 Insumos, Rações e Custos", amount: 135.00, quantity: 50, unit: "kg", date: "2026-04-10", relatedType: "animal", relatedName: "Lote Galinhas Poedeiras 01", paymentMethod: "Pix", status: "Concluído" },
  { id: "TX-003", description: "Venda de Cestas de Hortaliças para Feira", type: "receita", category: "💰 Venda de Produtos Agro", amount: 480.00, quantity: 40, unit: "Maço", date: "2026-04-11", relatedType: "crop", relatedName: "Canteiro de Alface", paymentMethod: "Dinheiro", status: "Concluído" },
  { id: "TX-004", description: "Aquisição de Mangueiras de Irrigação Gotejamento", type: "despesa", category: "🧾 Insumos, Rações e Custos", amount: 190.00, quantity: 2, unit: "Unidade", date: "2026-04-08", relatedType: "geral", relatedName: "Infraestrutura Sítio", paymentMethod: "Cartão", status: "Concluído" },
  { id: "TX-005", description: "Venda de Mel de Abelha Jataí (4 frascos 250ml)", type: "receita", category: "💰 Venda de Produtos Agro", amount: 160.00, quantity: 1, unit: "Litro", date: "2026-04-06", relatedType: "animal", relatedName: "Meliponário Jataí 01", paymentMethod: "Pix", status: "Concluído" },
  { id: "TX-006", description: "Compra de Esterco Bovino Curtido (20 sacas)", type: "despesa", category: "🧾 Insumos, Rações e Custos", amount: 180.00, quantity: 20, unit: "Saca", date: "2026-04-04", relatedType: "crop", relatedName: "Horta Geral", paymentMethod: "Pix", status: "Concluído" }
]

export const SEED_ALERTS: AlertTaskItem[] = [
  { id: "ALT-001", title: "Vacinação Febre Aftosa / Clostridiose", priority: "Alta", category: "🐄 Pecuária e Criação", date: "2026-04-20", status: "Pendente", recurrence: "Semestral", notes: "Separar animais no piquete 02 às 7h." },
  { id: "ALT-002", title: "Adubação Foliar nos Limoeiros", priority: "Média", category: "🌳 Árvores Frutíferas", date: "2026-04-18", status: "Pendente", recurrence: "Mensal", notes: "Aplicar biofertilizante nas folhas ao entardecer." },
  { id: "ALT-003", title: "Colheita de Alface para Feira de Sábado", priority: "Alta", category: "🥬 Hortaliças e Folhosas", date: "2026-04-17", status: "Pendente", recurrence: "Semanal", notes: "Colher no amanhecer para preservar frescor." },
  { id: "ALT-004", title: "Limpeza dos Filtros do Tanque de Peixes", priority: "Média", category: "🐟 Piscicultura e Aquicultura", date: "2026-04-19", status: "Aguardando", recurrence: "Quinzenal", notes: "Verificar aeração e oxigenação da água." },
  { id: "ALT-005", title: "Revisão da Cerca do Piquete dos Animais", priority: "Baixa", category: "🚜 Maquinários e Implementos", date: "2026-04-14", status: "Concluído", recurrence: "Atividade Única", notes: "Troca dos mourões avariados concluída." }
]

// -------------------------------------------------------------
// STORAGE KEYS & EVENT BUS
// -------------------------------------------------------------

const STORAGE_KEYS = {
  CATEGORIES: "rocactrl_db_categories_v4",
  ANIMALS: "rocactrl_db_animals_v4",
  CROPS: "rocactrl_db_crops_v4",
  TRANSACTIONS: "rocactrl_db_transactions_v4",
  ALERTS: "rocactrl_db_alerts_v4",
}

function dispatchUpdateEvent(key: string) {
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
    const parsed = JSON.parse(item) as T
    // Se for lista de categorias, valida se possui o campo type
    if (key === STORAGE_KEYS.CATEGORIES && Array.isArray(parsed)) {
      const hasTypes = parsed.every((c: any) => c.type && ['PLANT', 'ANIMAL', 'FINANCIAL', 'INFRASTRUCTURE'].includes(c.type))
      if (!hasTypes || parsed.length < SEED_CATEGORIES.length) {
        localStorage.setItem(key, JSON.stringify(fallback))
        return fallback
      }
    }
    return parsed
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
// REPOSITÓRIO ROÇACTRL DB
// -------------------------------------------------------------

export const RocaDB = {
  // Categorias
  getCategories(): CategoryItem[] {
    return getStoredData<CategoryItem[]>(STORAGE_KEYS.CATEGORIES, SEED_CATEGORIES)
  },
  
  saveCategory(category: Omit<CategoryItem, "id"> & { id?: string }): CategoryItem {
    const categories = this.getCategories()
    if (category.id) {
      const index = categories.findIndex(c => c.id === category.id)
      if (index >= 0) {
        categories[index] = { ...categories[index], ...category } as CategoryItem
        setStoredData(STORAGE_KEYS.CATEGORIES, categories)
        return categories[index]
      }
    }
    const newCategory: CategoryItem = {
      ...category,
      id: `cat-${Date.now()}`
    }
    setStoredData(STORAGE_KEYS.CATEGORIES, [newCategory, ...categories])
    return newCategory
  },
  
  deleteCategory(id: string): void {
    const categories = this.getCategories().filter(c => c.id !== id)
    setStoredData(STORAGE_KEYS.CATEGORIES, categories)
  },

  // Animais
  getAnimals(): AnimalItem[] {
    return getStoredData<AnimalItem[]>(STORAGE_KEYS.ANIMALS, SEED_ANIMALS)
  },
  saveAnimal(animal: Omit<AnimalItem, "id"> & { id?: string }): AnimalItem {
    const animals = this.getAnimals()
    if (animal.id) {
      const index = animals.findIndex(a => a.id === animal.id)
      if (index >= 0) {
        animals[index] = { ...animals[index], ...animal } as AnimalItem
        setStoredData(STORAGE_KEYS.ANIMALS, animals)
        return animals[index]
      }
    }
    const prefix = animal.category.includes("Aves") || animal.category.includes("Avicultura") ? "AVI" : animal.category.includes("Pecuária") || animal.category.includes("Ruminante") ? "PEC" : animal.category.includes("Peixe") || animal.category.includes("Piscic") ? "PIS" : "ANI"
    const newAnimal: AnimalItem = {
      ...animal,
      id: `${prefix}-${Math.floor(100 + Math.random() * 900)}`
    }
    setStoredData(STORAGE_KEYS.ANIMALS, [newAnimal, ...animals])
    return newAnimal
  },
  deleteAnimal(id: string): void {
    const animals = this.getAnimals().filter(a => a.id !== id)
    setStoredData(STORAGE_KEYS.ANIMALS, animals)
  },

  // Culturas
  getCrops(): CropItem[] {
    return getStoredData<CropItem[]>(STORAGE_KEYS.CROPS, SEED_CROPS)
  },
  saveCrop(crop: Omit<CropItem, "id"> & { id?: string }): CropItem {
    const crops = this.getCrops()
    if (crop.id) {
      const index = crops.findIndex(c => c.id === crop.id)
      if (index >= 0) {
        crops[index] = { ...crops[index], ...crop } as CropItem
        setStoredData(STORAGE_KEYS.CROPS, crops)
        return crops[index]
      }
    }
    const newCrop: CropItem = {
      ...crop,
      id: `CRP-${Math.floor(100 + Math.random() * 900)}`
    }
    setStoredData(STORAGE_KEYS.CROPS, [newCrop, ...crops])
    return newCrop
  },
  deleteCrop(id: string): void {
    const crops = this.getCrops().filter(c => c.id !== id)
    setStoredData(STORAGE_KEYS.CROPS, crops)
  },

  // Transações Financeiras
  getTransactions(): TransactionItem[] {
    return getStoredData<TransactionItem[]>(STORAGE_KEYS.TRANSACTIONS, SEED_TRANSACTIONS)
  },
  saveTransaction(tx: Omit<TransactionItem, "id"> & { id?: string }): TransactionItem {
    const transactions = this.getTransactions()
    if (tx.id) {
      const index = transactions.findIndex(t => t.id === tx.id)
      if (index >= 0) {
        transactions[index] = { ...transactions[index], ...tx } as TransactionItem
        setStoredData(STORAGE_KEYS.TRANSACTIONS, transactions)
        return transactions[index]
      }
    }
    const newTx: TransactionItem = {
      ...tx,
      id: `TX-${Math.floor(100 + Math.random() * 900)}`
    }
    setStoredData(STORAGE_KEYS.TRANSACTIONS, [newTx, ...transactions])
    return newTx
  },
  deleteTransaction(id: string): void {
    const transactions = this.getTransactions().filter(t => t.id !== id)
    setStoredData(STORAGE_KEYS.TRANSACTIONS, transactions)
  },

  // Alertas e Rotinas
  getAlerts(): AlertTaskItem[] {
    return getStoredData<AlertTaskItem[]>(STORAGE_KEYS.ALERTS, SEED_ALERTS)
  },
  saveAlert(alert: Omit<AlertTaskItem, "id"> & { id?: string }): AlertTaskItem {
    const alerts = this.getAlerts()
    if (alert.id) {
      const index = alerts.findIndex(a => a.id === alert.id)
      if (index >= 0) {
        alerts[index] = { ...alerts[index], ...alert } as AlertTaskItem
        setStoredData(STORAGE_KEYS.ALERTS, alerts)
        return alerts[index]
      }
    }
    const newAlert: AlertTaskItem = {
      ...alert,
      id: `ALT-${Math.floor(100 + Math.random() * 900)}`
    }
    setStoredData(STORAGE_KEYS.ALERTS, [newAlert, ...alerts])
    return newAlert
  },
  toggleAlertStatus(id: string): void {
    const alerts = this.getAlerts()
    const index = alerts.findIndex(a => a.id === id)
    if (index >= 0) {
      alerts[index].status = alerts[index].status === "Concluído" ? "Pendente" : "Concluído"
      setStoredData(STORAGE_KEYS.ALERTS, alerts)
    }
  },
  deleteAlert(id: string): void {
    const alerts = this.getAlerts().filter(a => a.id !== id)
    setStoredData(STORAGE_KEYS.ALERTS, alerts)
  },

  // Reset total para dados de demonstração
  resetToSeed(): void {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(SEED_CATEGORIES))
    localStorage.setItem(STORAGE_KEYS.ANIMALS, JSON.stringify(SEED_ANIMALS))
    localStorage.setItem(STORAGE_KEYS.CROPS, JSON.stringify(SEED_CROPS))
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(SEED_TRANSACTIONS))
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(SEED_ALERTS))
    dispatchUpdateEvent("all")
  }
}
