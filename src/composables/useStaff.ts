/* Sessão da equipe (Firebase Auth, e-mail e senha) para o painel de pedidos */
import { ref, onMounted, onUnmounted } from "vue"
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth"
import { auth } from "../services/firebase"

export function useStaff() {
  const user = ref<User | null>(null)
  const ready = ref(!auth)
  const error = ref("")
  let stop: (() => void) | null = null

  onMounted(() => {
    if (!auth) return
    stop = onAuthStateChanged(auth, (u) => { user.value = u; ready.value = true })
  })
  onUnmounted(() => stop?.())

  /* Entra com e-mail e senha; mensagem genérica em caso de erro */
  const login = async (email: string, password: string) => {
    error.value = ""
    if (!auth) { error.value = "Firebase não configurado."; return }
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password)
    } catch {
      error.value = "E-mail ou senha inválidos."
    }
  }

  /* Sai do painel */
  const logout = () => (auth ? signOut(auth) : Promise.resolve())

  return { user, ready, error, login, logout }
}
/* Fim de useStaff.ts */
