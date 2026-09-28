/* Registro do pedido no Firestore; carregado sob demanda só na hora de enviar (o cardápio abre sem baixar o Firebase) */
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "./firebase"
import type { OrderType } from "../types"

export { generateOrderCode } from "./orderCode"

/* Salva o pedido para o painel da equipe; lança erro se o Firestore não estiver disponível */
export async function saveOrder(order: { code: string; type: OrderType; table: string; address: string; subtotal: number; items: Record<string, number> }) {
  if (!db) throw new Error("Firestore não configurado")
  await addDoc(collection(db, "orders"), {
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
