/* Registro do pedido no Firestore; carregado sob demanda só na hora de enviar (o cardápio abre sem baixar o Firebase) */
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "./firebase"
import type { OrderType } from "../types"
import { cleanNote } from "../domain/order"

export { generateOrderCode } from "./orderCode"

/* Salva o pedido para o painel da equipe; lança erro se o Firestore não estiver disponível */
/* A observação só entra no documento quando existe: pedido sem observação continua válido para as regras antigas (#13) */
export async function saveOrder(order: { code: string; type: OrderType; table: string; address: string; subtotal: number; items: Record<string, number>; note?: string }) {
  if (!db) throw new Error("Firestore não configurado")
  const note = cleanNote(order.note)
  await addDoc(collection(db, "orders"), {
    ...(note ? { note } : {}),
    order_code: order.code,
    type: order.type,
    table_number: order.type === "mesa" ? order.table : null,
    address: order.type === "delivery" ? order.address.trim() : null,
    subtotal: order.subtotal,
    items: { ...order.items },
    status: "pending",
    created_at: serverTimestamp(),
  })
}
/* Fim de orders.ts */
