/* Testes das regras do Firestore no emulador (npm run test:rules): clientes não leem pedidos nem endereços */
import { readFileSync } from 'node:fs'
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest'
import { assertFails, assertSucceeds, initializeTestEnvironment, type RulesTestEnvironment } from '@firebase/rules-unit-testing'
import { doc, getDoc, getDocs, collection, setDoc, updateDoc, serverTimestamp, deleteDoc } from 'firebase/firestore'

let env: RulesTestEnvironment
const order = (extra: Record<string, unknown> = {}) => ({ order_code: 'SC0001092026', type: 'delivery', table_number: null, address: 'Rua A, 10 - Centro', subtotal: 38, items: { picanha: 1 }, status: 'pending', created_at: serverTimestamp(), ...extra })

beforeAll(async () => {
  env = await initializeTestEnvironment({ projectId: 'sabor-rules', firestore: { rules: readFileSync('firestore.rules', 'utf8'), host: '127.0.0.1', port: 8080 } })
})
beforeEach(async () => {
  await env.clearFirestore()
  await env.withSecurityRulesDisabled(async (ctx) => {
    await setDoc(doc(ctx.firestore(), 'staff/equipe1'), { name: 'Caixa' })
    await setDoc(doc(ctx.firestore(), 'orders/o1'), { ...order(), created_at: new Date() })
    await setDoc(doc(ctx.firestore(), 'counters/orders_counter'), { current_seq: 7 })
  })
})
afterAll(() => env.cleanup())

describe('pedidos', () => {
  it('cliente anônimo cria pedido válido, mas não lê nenhum pedido', async () => {
    const db = env.unauthenticatedContext().firestore()
    await assertSucceeds(setDoc(doc(db, 'orders/novo'), order()))
    await assertFails(getDoc(doc(db, 'orders/o1')))
    await assertFails(getDocs(collection(db, 'orders')))
  })
  it('pedido com status diferente de pending ou campos extras é recusado', async () => {
    const db = env.unauthenticatedContext().firestore()
    await assertFails(setDoc(doc(db, 'orders/x1'), order({ status: 'completed' })))
    await assertFails(setDoc(doc(db, 'orders/x2'), order({ admin: true })))
    await assertFails(setDoc(doc(db, 'orders/x3'), order({ address: 'curto' })))
  })
  it('usuário logado que não é da equipe não lê nem altera', async () => {
    const db = env.authenticatedContext('cliente').firestore()
    await assertFails(getDoc(doc(db, 'orders/o1')))
    await assertFails(updateDoc(doc(db, 'orders/o1'), { status: 'cancelled' }))
  })
  it('equipe lê e muda só o status', async () => {
    const db = env.authenticatedContext('equipe1').firestore()
    await assertSucceeds(getDocs(collection(db, 'orders')))
    await assertSucceeds(updateDoc(doc(db, 'orders/o1'), { status: 'preparing' }))
    await assertFails(updateDoc(doc(db, 'orders/o1'), { subtotal: 1 }))
    await assertSucceeds(deleteDoc(doc(db, 'orders/o1')))
  })
})

describe('contador', () => {
  it('só permite somar 1', async () => {
    const db = env.unauthenticatedContext().firestore()
    await assertSucceeds(setDoc(doc(db, 'counters/orders_counter'), { current_seq: 8 }))
    await assertFails(setDoc(doc(db, 'counters/orders_counter'), { current_seq: 0 }))
  })
})
/* Fim de firestore.rules.test.ts */
