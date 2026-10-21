"use client"

import { useState, useEffect, useCallback } from "react"
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore"
import { db, isFirebaseConfigured } from "@/lib/firebase"
import {
  RocaDB,
  CategoryItem,
  AnimalItem,
  CropItem,
  TransactionItem,
  AlertTaskItem,
  UserProfile,
  FeedbackItem,
  PlanType,
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

    let unsubFirestore: (() => void) | undefined
    const uid = RocaDB.getCurrentUid()
    if (isFirebaseConfigured && db && uid) {
      try {
        unsubFirestore = onSnapshot(
          collection(db, "users", uid, "categories"),
          (snap) => {
            if (!snap.empty) {
              const list = snap.docs.map((d) => ({ ...d.data(), id: d.id } as CategoryItem))
              RocaDB.setCategoriesCache(list, uid)
              setCategories(list)
              setLoaded(true)
            }
          },
          () => {}
        )
      } catch {}
    }

    return () => {
      window.removeEventListener("rocactrl_db_update", handleUpdate)
      window.removeEventListener("storage", handleUpdate)
      if (unsubFirestore) unsubFirestore()
    }
  }, [reload])

  const saveCategory = (category: Omit<CategoryItem, "id"> & { id?: string }) => {
    const uid = RocaDB.getCurrentUid()
    const saved = RocaDB.saveCategory(category, uid)
    if (isFirebaseConfigured && db && uid) {
      setDoc(doc(db, "users", uid, "categories", saved.id), saved, { merge: true }).catch(() => {})
    }
    return saved
  }

  const deleteCategory = (id: string) => {
    const uid = RocaDB.getCurrentUid()
    RocaDB.deleteCategory(id, uid)
    if (isFirebaseConfigured && db && uid) {
      deleteDoc(doc(db, "users", uid, "categories", id)).catch(() => {})
    }
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

    let unsubFirestore: (() => void) | undefined
    const uid = RocaDB.getCurrentUid()
    if (isFirebaseConfigured && db && uid) {
      try {
        unsubFirestore = onSnapshot(
          collection(db, "users", uid, "animals"),
          (snap) => {
            if (!snap.empty) {
              const list = snap.docs.map((d) => ({ ...d.data(), id: d.id } as AnimalItem))
              RocaDB.setAnimalsCache(list, uid)
              setAnimals(list)
              setLoaded(true)
            }
          },
          () => {}
        )
      } catch {}
    }

    return () => {
      window.removeEventListener("rocactrl_db_update", handleUpdate)
      window.removeEventListener("storage", handleUpdate)
      if (unsubFirestore) unsubFirestore()
    }
  }, [reload])

  const saveAnimal = (animal: Omit<AnimalItem, "id"> & { id?: string }) => {
    const uid = RocaDB.getCurrentUid()
    const saved = RocaDB.saveAnimal(animal, uid)
    if (isFirebaseConfigured && db && uid) {
      setDoc(doc(db, "users", uid, "animals", saved.id), saved, { merge: true }).catch(() => {})
    }
    return saved
  }

  const deleteAnimal = (id: string) => {
    const uid = RocaDB.getCurrentUid()
    RocaDB.deleteAnimal(id, uid)
    if (isFirebaseConfigured && db && uid) {
      deleteDoc(doc(db, "users", uid, "animals", id)).catch(() => {})
    }
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

    let unsubFirestore: (() => void) | undefined
    const uid = RocaDB.getCurrentUid()
    if (isFirebaseConfigured && db && uid) {
      try {
        unsubFirestore = onSnapshot(
          collection(db, "users", uid, "crops"),
          (snap) => {
            if (!snap.empty) {
              const list = snap.docs.map((d) => ({ ...d.data(), id: d.id } as CropItem))
              RocaDB.setCropsCache(list, uid)
              setCrops(list)
              setLoaded(true)
            }
          },
          () => {}
        )
      } catch {}
    }

    return () => {
      window.removeEventListener("rocactrl_db_update", handleUpdate)
      window.removeEventListener("storage", handleUpdate)
      if (unsubFirestore) unsubFirestore()
    }
  }, [reload])

  const saveCrop = (crop: Omit<CropItem, "id"> & { id?: string }) => {
    const uid = RocaDB.getCurrentUid()
    const saved = RocaDB.saveCrop(crop, uid)
    if (isFirebaseConfigured && db && uid) {
      setDoc(doc(db, "users", uid, "crops", saved.id), saved, { merge: true }).catch(() => {})
    }
    return saved
  }

  const deleteCrop = (id: string) => {
    const uid = RocaDB.getCurrentUid()
    RocaDB.deleteCrop(id, uid)
    if (isFirebaseConfigured && db && uid) {
      deleteDoc(doc(db, "users", uid, "crops", id)).catch(() => {})
    }
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

    let unsubFirestore: (() => void) | undefined
    const uid = RocaDB.getCurrentUid()
    if (isFirebaseConfigured && db && uid) {
      try {
        unsubFirestore = onSnapshot(
          collection(db, "users", uid, "financial"),
          (snap) => {
            if (!snap.empty) {
              const list = snap.docs.map((d) => ({ ...d.data(), id: d.id } as TransactionItem))
              RocaDB.setTransactionsCache(list, uid)
              setTransactions(list)
              setLoaded(true)
            }
          },
          () => {}
        )
      } catch {}
    }

    return () => {
      window.removeEventListener("rocactrl_db_update", handleUpdate)
      window.removeEventListener("storage", handleUpdate)
      if (unsubFirestore) unsubFirestore()
    }
  }, [reload])

  const saveTransaction = (tx: Omit<TransactionItem, "id"> & { id?: string }) => {
    const uid = RocaDB.getCurrentUid()
    const saved = RocaDB.saveTransaction(tx, uid)
    if (isFirebaseConfigured && db && uid) {
      setDoc(doc(db, "users", uid, "financial", saved.id), saved, { merge: true }).catch(() => {})
    }
    return saved
  }

  const deleteTransaction = (id: string) => {
    const uid = RocaDB.getCurrentUid()
    RocaDB.deleteTransaction(id, uid)
    if (isFirebaseConfigured && db && uid) {
      deleteDoc(doc(db, "users", uid, "financial", id)).catch(() => {})
    }
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

    let unsubFirestore: (() => void) | undefined
    const uid = RocaDB.getCurrentUid()
    if (isFirebaseConfigured && db && uid) {
      try {
        unsubFirestore = onSnapshot(
          collection(db, "users", uid, "alerts"),
          (snap) => {
            if (!snap.empty) {
              const list = snap.docs.map((d) => ({ ...d.data(), id: d.id } as AlertTaskItem))
              RocaDB.setAlertsCache(list, uid)
              setAlerts(list)
              setLoaded(true)
            }
          },
          () => {}
        )
      } catch {}
    }

    return () => {
      window.removeEventListener("rocactrl_db_update", handleUpdate)
      window.removeEventListener("storage", handleUpdate)
      if (unsubFirestore) unsubFirestore()
    }
  }, [reload])

  const saveAlert = (alert: Omit<AlertTaskItem, "id"> & { id?: string }) => {
    const uid = RocaDB.getCurrentUid()
    const saved = RocaDB.saveAlert(alert, uid)
    if (isFirebaseConfigured && db && uid) {
      setDoc(doc(db, "users", uid, "alerts", saved.id), saved, { merge: true }).catch(() => {})
    }
    return saved
  }

  const toggleAlertStatus = (id: string) => {
    const uid = RocaDB.getCurrentUid()
    const updated = RocaDB.toggleAlertStatus(id, uid)
    if (updated && isFirebaseConfigured && db && uid) {
      setDoc(doc(db, "users", uid, "alerts", id), updated, { merge: true }).catch(() => {})
    }
  }

  const deleteAlert = (id: string) => {
    const uid = RocaDB.getCurrentUid()
    RocaDB.deleteAlert(id, uid)
    if (isFirebaseConfigured && db && uid) {
      deleteDoc(doc(db, "users", uid, "alerts", id)).catch(() => {})
    }
  }

  return { alerts, loaded, saveAlert, toggleAlertStatus, deleteAlert, reload }
}

/**
 * Hook para gestão de usuários e feedbacks no Painel Admin (/admin)
 */
export function useAdminData() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([])
  const [loaded, setLoaded] = useState(false)

  const reload = useCallback(() => {
    setUsers(RocaDB.getUsers())
    setFeedbacks(RocaDB.getFeedbacks())
    setLoaded(true)
  }, [])

  useEffect(() => {
    reload()
    const handleUpdate = () => reload()
    window.addEventListener("rocactrl_db_update", handleUpdate)
    window.addEventListener("storage", handleUpdate)

    let unsubUsers: (() => void) | undefined
    let unsubFeedbacks: (() => void) | undefined

    if (isFirebaseConfigured && db) {
      try {
        unsubUsers = onSnapshot(
          collection(db, "users"),
          (snap) => {
            if (!snap.empty) {
              const list = snap.docs.map((d) => ({ ...d.data(), uid: d.id } as UserProfile))
              RocaDB.setUsersCache(list)
              setUsers(list)
            }
          },
          () => {}
        )
        unsubFeedbacks = onSnapshot(
          collection(db, "feedbacks"),
          (snap) => {
            if (!snap.empty) {
              const list = snap.docs.map((d) => ({ ...d.data(), id: d.id } as FeedbackItem))
              RocaDB.setFeedbacksCache(list)
              setFeedbacks(list)
            }
          },
          () => {}
        )
      } catch {}
    }

    return () => {
      window.removeEventListener("rocactrl_db_update", handleUpdate)
      window.removeEventListener("storage", handleUpdate)
      if (unsubUsers) unsubUsers()
      if (unsubFeedbacks) unsubFeedbacks()
    }
  }, [reload])

  const changeUserPlan = (uid: string, plan: PlanType) => {
    const updated = RocaDB.updateUserPlan(uid, plan)
    if (isFirebaseConfigured && db) {
      setDoc(doc(db, "users", uid), { plan }, { merge: true }).catch(() => {})
    }
    return updated
  }

  const createOrInviteUser = (profile: UserProfile) => {
    const saved = RocaDB.saveUser(profile)
    if (isFirebaseConfigured && db) {
      setDoc(doc(db, "users", saved.uid), saved, { merge: true }).catch(() => {})
    }
    return saved
  }

  const toggleFeedbackStatus = (id: string) => {
    const updated = RocaDB.toggleFeedbackStatus(id)
    if (updated && isFirebaseConfigured && db) {
      setDoc(doc(db, "feedbacks", id), updated, { merge: true }).catch(() => {})
    }
    return updated
  }

  return {
    users,
    feedbacks,
    loaded,
    changeUserPlan,
    createOrInviteUser,
    toggleFeedbackStatus,
    reload,
  }
}
