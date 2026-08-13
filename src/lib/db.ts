/**
 * @fileOverview Banco de dados local reativo para o RoçaCtrl.
 * Fornece persistência em localStorage, dados iniciais ricos (seed) e eventos de sincronização.
 */

export interface CategoryItem {
  id: string
  name: string
  sector: "Animais" | "Culturas" | "Insumos" | "Financeiro" | "Geral"
  species: string
  products: string
  unit?: string
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
// DADOS INICIAIS (SEED)
// -------------------------------------------------------------

export const SEED_CATEGORIES: CategoryItem[] = [
  { id: "cat-1", name: "Hortaliças e Folhosas", sector: "Culturas", species: "Alface, Rúcula, Couve, Espinafre, Agrião", products: "Maços frescos para feira e venda direta", unit: "m² / canteiros", color: "#22c55e" },
  { id: "cat-2", name: "Pomar e Frutíferas", sector: "Culturas", species: "Limoeiro, Laranjeira, Jabuticabeira, Bananeira, Mamoeiro", products: "Frutas in natura, polpas, geleias artesanais", unit: "árvores / covas", color: "#eab308" },
  { id: "cat-3", name: "Ervas e Temperos Medicinais", sector: "Culturas", species: "Manjericão, Alecrim, Hortelã, Cebolinha, Salsinha, Tomilho", products: "Temperos desidratados, chás e mudas", unit: "m² / vasos", color: "#10b981" },
  { id: "cat-4", name: "Grãos e Cereais", sector: "Culturas", species: "Milho Verde, Feijão Carioca, Soja, Arroz", products: "Grãos secos, espigas para consumo e ração", unit: "hectares / sacas", color: "#f59e0b" },
  { id: "cat-5", name: "Raízes e Tubérculos", sector: "Culturas", species: "Mandioca Mansa (Aipim), Batata-Doce, Cenoura, Inhame", products: "Raízes frescas e farinhas", unit: "canteiros / sacos", color: "#d97706" },
  { id: "cat-6", name: "Avicultura Caipira", sector: "Animais", species: "Galinha Caipira (Postura), Frango de Corte, Codorna, Pato", products: "Ovos caipiras, carne, esterco para adubação orgânica", unit: "cabeças", color: "#3b82f6" },
  { id: "cat-7", name: "Pequenos Ruminantes", sector: "Animais", species: "Cabra Saanen (Leiteira), Ovelha Santa Inês", products: "Leite artesanal, queijo fresco, cordeiro", unit: "cabeças", color: "#8b5cf6" },
  { id: "cat-8", name: "Apicultura e Abelhas Nativas", sector: "Animais", species: "Abelha Jataí, Mandaçaia, Apis Mellifera", products: "Mel puro, própolis verde, polinização da propriedade", unit: "caixas / colmeias", color: "#facc15" },
  { id: "cat-9", name: "Piscicultura Familiar", sector: "Animais", species: "Tilápia do Nilo, Tambaqui, Pacu, Carpa", products: "Peixes vivos e filés frescos", unit: "tanques / alevinos", color: "#06b6d4" },
  { id: "cat-10", name: "Bovinocultura de Leite", sector: "Animais", species: "Girolando, Jersey, Holandesa", products: "Leite cru, queijos, manteiga", unit: "cabeças", color: "#64748b" },
  { id: "cat-11", name: "Insumos e Adubação", sector: "Insumos", species: "Esterco curtido, Calcário, Composto orgânico, NPK", products: "Nutrição vegetal e correção do solo", unit: "kg / sacos", color: "#84cc16" },
  { id: "cat-12", name: "Venda de Produtos Agro", sector: "Financeiro", species: "Feiras livres, cestas orgânicas, vendas a granel", products: "Receitas de comercialização", unit: "R$", color: "#16a34a" },
  { id: "cat-13", name: "Custos Operacionais e Ração", sector: "Financeiro", species: "Ração balanceada, vacinas, ferramentas, diesel", products: "Despesas de manutenção do sítio", unit: "R$", color: "#ef4444" },
]

export const SEED_ANIMALS: AnimalItem[] = [
  { id: "AVI-001", name: "Lote Galinhas Poedeiras 01", category: "Avicultura Caipira", species: "Galinha Caipira", age: 6, unitAge: "meses", status: "Saudável", quantity: 30, lastCheck: "2026-04-10", location: "Galinheiro Principal", notes: "Produzindo média de 24 ovos/dia com ração orgânica." },
  { id: "RUM-002", name: "Bete e Cabritas", category: "Pequenos Ruminantes", species: "Cabra Saanen", age: 24, unitAge: "meses", status: "Observação", quantity: 4, lastCheck: "2026-04-12", location: "Pasto 02", notes: "Vacinação de clostridiose em dia. Acompanhar lactação." },
  { id: "PIS-003", name: "Tanque Alevinos 04", category: "Piscicultura Familiar", species: "Tilápia do Nilo", age: 3, unitAge: "meses", status: "Saudável", quantity: 200, lastCheck: "2026-04-14", location: "Tanque Escavado 04", notes: "Biometria com média de 280g por exemplar." },
  { id: "API-004", name: "Meliponário Jataí 01", category: "Apicultura e Abelhas Nativas", species: "Abelha Jataí", age: 14, unitAge: "meses", status: "Saudável", quantity: 6, lastCheck: "2026-04-05", location: "Pomar dos Citros", notes: "Ótima atividade de forrageamento e postura da rainha." },
  { id: "BOV-005", name: "Mimosa (Leite)", category: "Bovinocultura de Leite", species: "Girolando", age: 4, unitAge: "anos", status: "Saudável", quantity: 1, lastCheck: "2026-04-11", location: "Piquete 01", notes: "Média de 14 litros de leite por ordenha diária." }
]

export const SEED_CROPS: CropItem[] = [
  { id: "CRP-001", name: "Canteiro de Alface Crespa e Roxa", type: "Horta", category: "Hortaliças e Folhosas", stage: "Desenvolvimento", progress: 65, area: "20 m²", plantedDate: "2026-03-20", expectedHarvest: "2026-04-28", health: "Excelente", notes: "Irrigação por gotejamento conectada ao sensor IoT." },
  { id: "CRP-002", name: "Limoeiros Siciliano e Taiti", type: "Pomar", category: "Pomar e Frutíferas", stage: "Frutificação", progress: 85, area: "12 árvores", plantedDate: "2024-05-10", expectedHarvest: "2026-05-15", health: "Saudável", notes: "Boa carga de frutos, adubação com cinza e esterco realizada." },
  { id: "CRP-003", name: "Canteiro Tomate Cereja Orgânico", type: "Horta", category: "Hortaliças e Folhosas", stage: "Floração", progress: 55, area: "15 m²", plantedDate: "2026-03-10", expectedHarvest: "2026-05-20", health: "Ótimo", notes: "Tutoramento feito. Aplicação preventiva de calda bordalesa." },
  { id: "CRP-004", name: "Ervas Finas e Medicinais", type: "Ervas", category: "Ervas e Temperos Medicinais", stage: "Colheita Contínua", progress: 100, area: "8 m²", plantedDate: "2025-11-01", expectedHarvest: "Colheita Semanal", health: "Excelente", notes: "Manjericão e alecrim com excelente aroma." },
  { id: "CRP-005", name: "Milho Verde Caipira", type: "Lavoura", category: "Grãos e Cereais", stage: "Desenvolvimento", progress: 40, area: "400 m²", plantedDate: "2026-03-01", expectedHarvest: "2026-06-10", health: "Saudável", notes: "Primeira capina realizada com sucesso." }
]

export const SEED_TRANSACTIONS: TransactionItem[] = [
  { id: "TX-001", description: "Venda de Ovos Caipiras (15 dúzias)", type: "receita", category: "Venda de Produtos Agro", amount: 225.00, date: "2026-04-12", relatedType: "animal", relatedName: "Lote Galinhas Poedeiras 01", paymentMethod: "Pix", status: "Concluído" },
  { id: "TX-002", description: "Compra de Ração de Postura 50kg", type: "despesa", category: "Custos Operacionais e Ração", amount: 135.00, date: "2026-04-10", relatedType: "animal", relatedName: "Lote Galinhas Poedeiras 01", paymentMethod: "Pix", status: "Concluído" },
  { id: "TX-003", description: "Venda de Cestas de Hortaliças para Feira", type: "receita", category: "Venda de Produtos Agro", amount: 480.00, date: "2026-04-11", relatedType: "crop", relatedName: "Canteiro de Alface", paymentMethod: "Dinheiro", status: "Concluído" },
  { id: "TX-004", description: "Aquisição de Mangueiras de Irrigação Gotejamento", type: "despesa", category: "Custos Operacionais e Ração", amount: 190.00, date: "2026-04-08", relatedType: "geral", relatedName: "Infraestrutura Sítio", paymentMethod: "Cartão", status: "Concluído" },
  { id: "TX-005", description: "Venda de Mel de Abelha Jataí (4 frascos 250ml)", type: "receita", category: "Venda de Produtos Agro", amount: 160.00, date: "2026-04-06", relatedType: "animal", relatedName: "Meliponário Jataí 01", paymentMethod: "Pix", status: "Concluído" },
  { id: "TX-006", description: "Compra de Esterco Bovino Curtido (20 sacos)", type: "despesa", category: "Insumos e Adubação", amount: 180.00, date: "2026-04-04", relatedType: "crop", relatedName: "Horta Geral", paymentMethod: "Pix", status: "Concluído" }
]

export const SEED_ALERTS: AlertTaskItem[] = [
  { id: "ALT-001", title: "Vacinação Febre Aftosa / Clostridiose", priority: "Alta", category: "Saúde Animal", date: "2026-04-20", status: "Pendente", recurrence: "Semestral", notes: "Separar animais no piquete 02 às 7h." },
  { id: "ALT-002", title: "Adubação Foliar nos Limoeiros", priority: "Média", category: "Pomar e Frutíferas", date: "2026-04-18", status: "Pendente", recurrence: "Mensal", notes: "Aplicar biofertilizante nas folhas ao entardecer." },
  { id: "ALT-003", title: "Colheita de Alface para Feira de Sábado", priority: "Alta", category: "Hortaliças e Folhosas", date: "2026-04-17", status: "Pendente", recurrence: "Semanal", notes: "Colher no amanhecer para preservar frescor." },
  { id: "ALT-004", title: "Limpeza dos Filtros do Tanque de Peixes", priority: "Média", category: "Piscicultura Familiar", date: "2026-04-19", status: "Aguardando", recurrence: "Quinzenal", notes: "Verificar aeração e oxigenação da água." },
  { id: "ALT-005", title: "Revisão da Cerca do Piquete dos Pequenos Ruminantes", priority: "Baixa", category: "Infraestrutura", date: "2026-04-14", status: "Concluído", recurrence: "Atividade Única", notes: "Troca dos mourões avariados concluída." }
]

// -------------------------------------------------------------
// STORAGE KEYS & EVENT BUS
// -------------------------------------------------------------

const STORAGE_KEYS = {
  CATEGORIES: "rocactrl_db_categories_v2",
  ANIMALS: "rocactrl_db_animals_v2",
  CROPS: "rocactrl_db_crops_v2",
  TRANSACTIONS: "rocactrl_db_transactions_v2",
  ALERTS: "rocactrl_db_alerts_v2",
}

// Disparador de eventos local para sincronizar estados React
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
    const prefix = animal.category.includes("Avicultura") ? "AVI" : animal.category.includes("Ruminante") ? "RUM" : animal.category.includes("Peixe") || animal.category.includes("Pisic") ? "PIS" : "ANI"
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
