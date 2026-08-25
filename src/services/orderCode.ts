import { db } from './firebase'
import { doc, runTransaction } from 'firebase/firestore'

/**
 * Gera um código de pedido no padrão SCXXXXMMAAAA usando transação atômica do Firestore.
 * Exemplo de retorno: "SC0001082026"
 */
export async function generateOrderCode(): Promise<string> {
  const counterRef = doc(db, 'counters', 'orders_counter')

  const nextSeq = await runTransaction(db, async (transaction) => {
    const counterDoc = await transaction.get(counterRef)

    let currentSeq = 0
    if (counterDoc.exists()) {
      currentSeq = counterDoc.data().current_seq || 0
    }

    const newSeq = currentSeq + 1

    // Atualiza o contador no Firestore
    transaction.set(counterRef, { current_seq: newSeq }, { merge: true })

    return newSeq
  })

  // Data atual para extrair Mês (MM) e Ano (AAAA)
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0') // 01 a 12
  const year = String(now.getFullYear())                   // 2026

  // Formata a sequência em 4 dígitos (ex: 1 -> "0001")
  const seqFormatted = String(nextSeq).padStart(4, '0')

  return `SC${seqFormatted}${month}${year}`
}