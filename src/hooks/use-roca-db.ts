"use client"

import { useState, useEffect, useCallback } from "react"
import {
  RocaDB,
  CategoryItem,
  AnimalItem,
  CropItem,
  TransactionItem,
  AlertTaskItem
} from "@/lib/db"

export function useCategories() {
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [loaded, setLoaded] = useState(false)

  const reload = useCallback(() => {
    setCategories(RocaDB.getCategories())
    setLoaded(true)
  }, [])

  useEffect(() => {
    reload()
    const handleUpdate = () => reload()
    window.addEventListener("rocactrl_db_update", handleUpdate)
    window.addEventListener("storage", handleUpdate)
    return () => {
      window.removeEventListener("rocactrl_db_update", handleUpdate)
      window.removeEventListener("storage", handleUpdate)
    }
  }, [reload])

  const saveCategory = (category: Omit<CategoryItem, "id"> & { id?: string }) => {
    return RocaDB.saveCategory(category)
  }

  const deleteCategory = (id: string) => {
    RocaDB.deleteCategory(id)
  }

  return { categories, loaded, saveCategory, deleteCategory, reload }
}

export function useAnimals() {
  const [animals, setAnimals] = useState<AnimalItem[]>([])
  const [loaded, setLoaded] = useState(false)

  const reload = useCallback(() => {
    setAnimals(RocaDB.getAnimals())
    setLoaded(true)
  }, [])

  useEffect(() => {
    reload()
    const handleUpdate = () => reload()
    window.addEventListener("rocactrl_db_update", handleUpdate)
    window.addEventListener("storage", handleUpdate)
    return () => {
      window.removeEventListener("rocactrl_db_update", handleUpdate)
      window.removeEventListener("storage", handleUpdate)
    }
  }, [reload])

  const saveAnimal = (animal: Omit<AnimalItem, "id"> & { id?: string }) => {
    return RocaDB.saveAnimal(animal)
  }

  const deleteAnimal = (id: string) => {
    RocaDB.deleteAnimal(id)
  }

  return { animals, loaded, saveAnimal, deleteAnimal, reload }
}

export function useCrops() {
  const [crops, setCrops] = useState<CropItem[]>([])
  const [loaded, setLoaded] = useState(false)

  const reload = useCallback(() => {
    setCrops(RocaDB.getCrops())
    setLoaded(true)
  }, [])

  useEffect(() => {
    reload()
    const handleUpdate = () => reload()
    window.addEventListener("rocactrl_db_update", handleUpdate)
    window.addEventListener("storage", handleUpdate)
    return () => {
      window.removeEventListener("rocactrl_db_update", handleUpdate)
      window.removeEventListener("storage", handleUpdate)
    }
  }, [reload])

  const saveCrop = (crop: Omit<CropItem, "id"> & { id?: string }) => {
    return RocaDB.saveCrop(crop)
  }

  const deleteCrop = (id: string) => {
    RocaDB.deleteCrop(id)
  }

  return { crops, loaded, saveCrop, deleteCrop, reload }
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<TransactionItem[]>([])
  const [loaded, setLoaded] = useState(false)

  const reload = useCallback(() => {
    setTransactions(RocaDB.getTransactions())
    setLoaded(true)
  }, [])

  useEffect(() => {
    reload()
    const handleUpdate = () => reload()
    window.addEventListener("rocactrl_db_update", handleUpdate)
    window.addEventListener("storage", handleUpdate)
    return () => {
      window.removeEventListener("rocactrl_db_update", handleUpdate)
      window.removeEventListener("storage", handleUpdate)
    }
  }, [reload])

  const saveTransaction = (tx: Omit<TransactionItem, "id"> & { id?: string }) => {
    return RocaDB.saveTransaction(tx)
  }

  const deleteTransaction = (id: string) => {
    RocaDB.deleteTransaction(id)
  }

  return { transactions, loaded, saveTransaction, deleteTransaction, reload }
}

export function useAlerts() {
  const [alerts, setAlerts] = useState<AlertTaskItem[]>([])
  const [loaded, setLoaded] = useState(false)

  const reload = useCallback(() => {
    setAlerts(RocaDB.getAlerts())
    setLoaded(true)
  }, [])

  useEffect(() => {
    reload()
    const handleUpdate = () => reload()
    window.addEventListener("rocactrl_db_update", handleUpdate)
    window.addEventListener("storage", handleUpdate)
    return () => {
      window.removeEventListener("rocactrl_db_update", handleUpdate)
      window.removeEventListener("storage", handleUpdate)
    }
  }, [reload])

  const saveAlert = (alert: Omit<AlertTaskItem, "id"> & { id?: string }) => {
    return RocaDB.saveAlert(alert)
  }

  const toggleAlertStatus = (id: string) => {
    RocaDB.toggleAlertStatus(id)
  }

  const deleteAlert = (id: string) => {
    RocaDB.deleteAlert(id)
  }

  return { alerts, loaded, saveAlert, toggleAlertStatus, deleteAlert, reload }
}
