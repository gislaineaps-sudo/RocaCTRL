"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signOut as firebaseSignOut,
} from "firebase/auth"
import {
  doc,
  getDoc,
  setDoc,
  writeBatch,
  collection,
  getDocs,
} from "firebase/firestore"
import { auth, db, googleProvider, isFirebaseConfigured } from "@/lib/firebase"
import {
  RocaDB,
  UserProfile,
  PlanType,
  SEED_CATEGORIES,
  SEED_CROPS,
  SEED_ANIMALS,
  SEED_TRANSACTIONS,
  SEED_ALERTS,
} from "@/lib/db"

interface AuthContextType {
  user: UserProfile | null
  loading: boolean
  isAdmin: boolean
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (name: string, email: string, password: string, farmName?: string) => Promise<void>
  resetPassword: (email: string) => Promise<void>
  signOut: () => Promise<void>
  updateCurrentUserPlan: (plan: PlanType) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const LOCAL_AUTH_USER_KEY = "rocactrl_auth_current_user_v5"

export function checkIsAdminEmail(email?: string | null): boolean {
  if (!email) return false
  const normalized = email.trim().toLowerCase()
  const envAdmin = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "").trim().toLowerCase()
  if (envAdmin && normalized === envAdmin) return true
  if (
    normalized === "suporte.rocactrl@gmail.com" ||
    normalized === "gislaine@rocactrl.com.br" ||
    normalized === "gislaineaps@gmail.com"
  ) {
    return true
  }
  return false
}

/**
 * Popula automaticamente as subcoleções do Firestore no primeiro login de um novo usuário
 */
async function seedFirestoreNewUser(uid: string, profile: UserProfile) {
  if (!db || !isFirebaseConfigured) return
  try {
    const userRef = doc(db, "users", uid)
    await setDoc(userRef, profile, { merge: true })

    // Verifica se já existem categorias na subcoleção users/{uid}/categories
    const catSnap = await getDocs(collection(db, "users", uid, "categories"))
    if (catSnap.empty) {
      const batch = writeBatch(db)

      // 1. Popula todas as categorias padrão divididas por contexto (PLANT, ANIMAL, FINANCIAL, INFRASTRUCTURE)
      for (const cat of SEED_CATEGORIES) {
        batch.set(doc(db, "users", uid, "categories", cat.id), cat)
      }

      // 2. Cria 1 registro de exemplo em cada módulo para a conta não abrir vazia
      const sampleCrop = SEED_CROPS[0]
      if (sampleCrop) {
        batch.set(doc(db, "users", uid, "crops", sampleCrop.id), sampleCrop)
      }

      const sampleAnimal = SEED_ANIMALS[0]
      if (sampleAnimal) {
        batch.set(doc(db, "users", uid, "animals", sampleAnimal.id), sampleAnimal)
      }

      const sampleTx = SEED_TRANSACTIONS[0]
      if (sampleTx) {
        batch.set(doc(db, "users", uid, "financial", sampleTx.id), sampleTx)
      }

      const sampleAlert = SEED_ALERTS[0]
      if (sampleAlert) {
        batch.set(doc(db, "users", uid, "alerts", sampleAlert.id), sampleAlert)
      }

      await batch.commit()
    }
  } catch (error) {
    console.warn("Aviso ao sincronizar seed inicial com Firestore:", error)
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Carrega sessão local imediata para evitar flash e suportar offline
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(LOCAL_AUTH_USER_KEY)
        if (saved) {
          const parsed = JSON.parse(saved) as UserProfile
          setUser(parsed)
          RocaDB.setCurrentUid(parsed.uid)
        } else {
          // Usuário padrão de demonstração caso ainda não tenha feito login
          const defaultProfile: UserProfile = {
            uid: "demo",
            name: "Produtor(a) Visitante",
            email: "visitante@rocactrl.com.br",
            farmName: "Meu Sítio",
            plan: "free",
            role: "user",
            createdAt: new Date().toISOString().split("T")[0],
          }
          setUser(defaultProfile)
          RocaDB.setCurrentUid("demo")
        }
      } catch (e) {
        console.warn("Erro ao restaurar sessão local:", e)
      }
    }

    // 2. Se o Firebase Auth estiver configurado, escuta mudanças reais de autenticação
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          const isAdmin = checkIsAdminEmail(fbUser.email)
          let profile: UserProfile = {
            uid: fbUser.uid,
            name: fbUser.displayName || fbUser.email?.split("@")[0] || "Produtor(a)",
            email: fbUser.email || "",
            farmName: "Meu Sítio",
            plan: isAdmin ? "iot" : "free",
            role: isAdmin ? "admin" : "user",
            createdAt: new Date().toISOString().split("T")[0],
          }

          if (db) {
            try {
              const userDoc = await getDoc(doc(db, "users", fbUser.uid))
              if (userDoc.exists()) {
                const data = userDoc.data() as Partial<UserProfile>
                profile = {
                  ...profile,
                  ...data,
                  uid: fbUser.uid,
                  role: isAdmin ? "admin" : data.role || "user",
                }
              } else {
                // Primeiro acesso: cria documento e popula seed inicial
                await seedFirestoreNewUser(fbUser.uid, profile)
              }
            } catch (e) {
              console.warn("Modo offline ao buscar perfil Firestore:", e)
            }
          }

          RocaDB.ensureTenantSeeded(profile.uid)
          RocaDB.setCurrentUid(profile.uid)
          RocaDB.saveUser(profile)
          localStorage.setItem(LOCAL_AUTH_USER_KEY, JSON.stringify(profile))
          setUser(profile)
        }
        setLoading(false)
      })
      return () => unsubscribe()
    } else {
      setLoading(false)
    }
  }, [])

  const signInWithGoogle = async () => {
    if (isFirebaseConfigured && auth && googleProvider) {
      const cred = await signInWithPopup(auth, googleProvider)
      const fbUser = cred.user
      const isAdmin = checkIsAdminEmail(fbUser.email)
      const profile: UserProfile = {
        uid: fbUser.uid,
        name: fbUser.displayName || "Produtor(a) Rural",
        email: fbUser.email || "",
        farmName: "Meu Sítio",
        plan: isAdmin ? "iot" : "free",
        role: isAdmin ? "admin" : "user",
        createdAt: new Date().toISOString().split("T")[0],
      }
      await seedFirestoreNewUser(fbUser.uid, profile)
      RocaDB.ensureTenantSeeded(profile.uid)
      RocaDB.setCurrentUid(profile.uid)
      RocaDB.saveUser(profile)
      localStorage.setItem(LOCAL_AUTH_USER_KEY, JSON.stringify(profile))
      setUser(profile)
      return
    }

    // Fallback instantâneo caso variáveis de ambiente do Firebase ainda não estejam no .env
    const mockUid = `google-${Date.now()}`
    const defaultEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "suporte.rocactrl@gmail.com"
    const isAdmin = checkIsAdminEmail(defaultEmail)
    const profile: UserProfile = {
      uid: mockUid,
      name: "Gislaine (Conta Google)",
      email: defaultEmail,
      farmName: "Meu Sítio",
      plan: isAdmin ? "iot" : "free",
      role: isAdmin ? "admin" : "user",
      createdAt: new Date().toISOString().split("T")[0],
    }
    RocaDB.ensureTenantSeeded(profile.uid)
    RocaDB.setCurrentUid(profile.uid)
    RocaDB.saveUser(profile)
    localStorage.setItem(LOCAL_AUTH_USER_KEY, JSON.stringify(profile))
    setUser(profile)
  }

  const signInWithEmail = async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase()
    if (isFirebaseConfigured && auth) {
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, password)
      const fbUser = cred.user
      const isAdmin = checkIsAdminEmail(fbUser.email)
      const profile: UserProfile = {
        uid: fbUser.uid,
        name: fbUser.displayName || cleanEmail.split("@")[0],
        email: cleanEmail,
        farmName: "Meu Sítio",
        plan: isAdmin ? "iot" : "free",
        role: isAdmin ? "admin" : "user",
        createdAt: new Date().toISOString().split("T")[0],
      }
      RocaDB.ensureTenantSeeded(profile.uid)
      RocaDB.setCurrentUid(profile.uid)
      RocaDB.saveUser(profile)
      localStorage.setItem(LOCAL_AUTH_USER_KEY, JSON.stringify(profile))
      setUser(profile)
      return
    }

    // Fallback local multi-tenant
    const existingUsers = RocaDB.getUsers()
    const found = existingUsers.find((u) => u.email.toLowerCase() === cleanEmail)
    const isAdmin = checkIsAdminEmail(cleanEmail)
    const profile: UserProfile = found
      ? { ...found, role: isAdmin ? "admin" : found.role }
      : {
          uid: `usr-${btoa(cleanEmail).replace(/[^a-zA-Z0-9]/g, "").slice(0, 10)}`,
          name: cleanEmail.split("@")[0],
          email: cleanEmail,
          farmName: "Meu Sítio",
          plan: isAdmin ? "iot" : "free",
          role: isAdmin ? "admin" : "user",
          createdAt: new Date().toISOString().split("T")[0],
        }

    RocaDB.ensureTenantSeeded(profile.uid)
    RocaDB.setCurrentUid(profile.uid)
    RocaDB.saveUser(profile)
    localStorage.setItem(LOCAL_AUTH_USER_KEY, JSON.stringify(profile))
    setUser(profile)
  }

  const signUpWithEmail = async (
    name: string,
    email: string,
    password: string,
    farmName = "Meu Sítio"
  ) => {
    const cleanEmail = email.trim().toLowerCase()
    const isAdmin = checkIsAdminEmail(cleanEmail)

    if (isFirebaseConfigured && auth) {
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password)
      if (name.trim()) {
        await updateProfile(cred.user, { displayName: name.trim() })
      }
      const profile: UserProfile = {
        uid: cred.user.uid,
        name: name.trim() || cleanEmail.split("@")[0],
        email: cleanEmail,
        farmName: farmName.trim() || "Meu Sítio",
        plan: isAdmin ? "iot" : "free",
        role: isAdmin ? "admin" : "user",
        createdAt: new Date().toISOString().split("T")[0],
      }
      await seedFirestoreNewUser(cred.user.uid, profile)
      RocaDB.ensureTenantSeeded(profile.uid)
      RocaDB.setCurrentUid(profile.uid)
      RocaDB.saveUser(profile)
      localStorage.setItem(LOCAL_AUTH_USER_KEY, JSON.stringify(profile))
      setUser(profile)
      return
    }

    // Fallback local multi-tenant com seed automático
    const newUid = `usr-${Date.now()}`
    const profile: UserProfile = {
      uid: newUid,
      name: name.trim() || cleanEmail.split("@")[0],
      email: cleanEmail,
      farmName: farmName.trim() || "Meu Sítio",
      plan: isAdmin ? "iot" : "free",
      role: isAdmin ? "admin" : "user",
      createdAt: new Date().toISOString().split("T")[0],
    }
    RocaDB.ensureTenantSeeded(profile.uid)
    RocaDB.setCurrentUid(profile.uid)
    RocaDB.saveUser(profile)
    localStorage.setItem(LOCAL_AUTH_USER_KEY, JSON.stringify(profile))
    setUser(profile)
  }

  const resetPassword = async (email: string) => {
    const cleanEmail = email.trim().toLowerCase()
    if (!cleanEmail) {
      throw new Error("Digite seu e-mail para receber o link de redefinição.")
    }
    if (isFirebaseConfigured && auth) {
      await sendPasswordResetEmail(auth, cleanEmail)
    }
  }

  const signOut = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        await firebaseSignOut(auth)
      } catch (e) {
        console.warn("Aviso ao sair do Firebase:", e)
      }
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem(LOCAL_AUTH_USER_KEY)
    }
    RocaDB.setCurrentUid("demo")
    setUser(null)
  }

  const updateCurrentUserPlan = async (plan: PlanType) => {
    if (!user) return
    const updated: UserProfile = { ...user, plan }
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, "users", user.uid), { plan }, { merge: true })
      } catch (e) {
        console.warn("Modo offline ao atualizar plano:", e)
      }
    }
    RocaDB.updateUserPlan(user.uid, plan)
    localStorage.setItem(LOCAL_AUTH_USER_KEY, JSON.stringify(updated))
    setUser(updated)
  }

  const isAdmin = Boolean(
    user && (user.role === "admin" || checkIsAdminEmail(user.email))
  )

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        resetPassword,
        signOut,
        updateCurrentUserPlan,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth deve ser utilizado dentro de um AuthProvider")
  }
  return context
}
