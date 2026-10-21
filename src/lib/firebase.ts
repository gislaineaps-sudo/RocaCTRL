/**
 * @fileOverview Inicialização do Firebase Authentication e Cloud Firestore (SDK v10+ modular)
 * com Persistência Offline multi-abas habilitada e fallback seguro para build na Vercel.
 */

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth"
import {
  initializeFirestore,
  getFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  type Firestore,
} from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
}

/**
 * Indica se as variáveis de ambiente do Firebase estão configuradas.
 * Evita quebras durante o build estático na Vercel caso ainda não estejam preenchidas.
 */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    !firebaseConfig.apiKey.includes("sua_chave")
)

let app: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null
let googleProvider: GoogleAuthProvider | null = null

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
    auth = getAuth(app)
    googleProvider = new GoogleAuthProvider()
    googleProvider.setCustomParameters({ prompt: "select_account" })

    if (typeof window !== "undefined") {
      try {
        // Habilita persistência offline no navegador e sincronização entre múltiplas abas
        db = initializeFirestore(app, {
          localCache: persistentLocalCache({
            tabManager: persistentMultipleTabManager(),
          }),
        })
      } catch {
        // Caso o Firestore já tenha sido inicializado anteriormente (ex: Fast Refresh)
        db = getFirestore(app)
      }
    } else {
      db = getFirestore(app)
    }
  } catch (error) {
    console.warn("Aviso ao inicializar Firebase (usando fallback seguro):", error)
  }
}

export { app, auth, db, googleProvider }
