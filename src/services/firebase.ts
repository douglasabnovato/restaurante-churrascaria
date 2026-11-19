/* Firebase: Firestore (pedidos) e Auth (painel da equipe); sem configuração o app funciona só com WhatsApp */
import { initializeApp, type FirebaseApp } from "firebase/app"
import { connectFirestoreEmulator, getFirestore, type Firestore } from "firebase/firestore"
import { connectAuthEmulator, getAuth, type Auth } from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)

const app: FirebaseApp | null = isFirebaseConfigured ? initializeApp(firebaseConfig) : null
export const db: Firestore | null = app ? getFirestore(app) : null
export const auth: Auth | null = app ? getAuth(app) : null
/* Só no teste do painel (npm run test:e2e:painel, #31): o build aponta para os emuladores locais de Auth e Firestore. O build de produção não define a variável */
if (import.meta.env.VITE_FIREBASE_EMULATORS === "true" && db && auth) {
  connectFirestoreEmulator(db, "127.0.0.1", 8080)
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true })
}
/* O Analytics do Firebase não é ligado: usa cookies e não tinha aviso ao visitante. A medição é a do GoatCounter, sem cookie (decisão D5, src/services/medicao.ts) */
/* Fim de firebase.ts */
