/* Código do pedido no padrão SCXXXXMMAAAA com contador atômico no Firestore (a regra só permite somar 1) */
import { db } from "./firebase"
import { doc, runTransaction } from "firebase/firestore"

/* Próximo código; lança erro se o Firestore não estiver disponível */
export async function generateOrderCode(now = new Date()): Promise<string> {
  if (!db) throw new Error("Firestore não configurado")
  const firestore = db
  const counterRef = doc(firestore, "counters", "orders_counter")
  const nextSeq = await runTransaction(firestore, async (transaction) => {
    const snap = await transaction.get(counterRef)
    const current = snap.exists() ? Number(snap.data().current_seq) || 0 : 0
    transaction.set(counterRef, { current_seq: current + 1 }, { merge: true })
    return current + 1
  })
  const month = String(now.getMonth() + 1).padStart(2, "0")
  return `SC${String(nextSeq % 10000).padStart(4, "0")}${month}${now.getFullYear()}`
}
/* Fim de orderCode.ts */
