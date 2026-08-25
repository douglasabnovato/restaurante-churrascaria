import { ref, onMounted, onUnmounted } from 'vue'
import { db } from '../services/firebase'
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc 
} from 'firebase/firestore'
import { itemsData } from './useCart'
import type { FirestoreOrder, OrderItemDetail, OrderStatus } from '../types'

export function useOrders() {
  const orders = ref<FirestoreOrder[]>([])
  const loading = ref(true)
  const selectedOrder = ref<FirestoreOrder | null>(null)
  const isDetailModalOpen = ref(false)

  let unsubscribe: (() => void) | null = null

  // Converte a estrutura { id_item: qty } para uma lista de objetos detalhados
  const parseOrderItems = (rawItems: Record<string, number>): OrderItemDetail[] => {
    if (!rawItems) return []
    return Object.entries(rawItems).map(([id, qty]) => {
      const product = itemsData.find(p => p.id === id)
      const unitPrice = product ? product.price : 0
      return {
        id,
        name: product ? product.name : `Item (${id})`,
        qty,
        unitPrice,
        totalPrice: unitPrice * qty
      }
    })
  }

  // Formata o Timestamp do Firebase para DD/MM/YYYY HH:mm
  const formatFirestoreTimestamp = (timestamp: any): string => {
    if (!timestamp) return 'Data N/A'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${day}/${month}/${year} ${hours}:${minutes}`
  }

  // Inicia a escuta em tempo real do Firestore
  const subscribeToOrders = () => {
    if (!db) {
      loading.value = false
      return
    }

    const ordersQuery = query(collection(db, 'orders'), orderBy('created_at', 'desc'))

    unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      orders.value = snapshot.docs.map(docSnap => {
        const data = docSnap.data()
        return {
          id: docSnap.id,
          order_code: data.order_code || 'SC0000002026',
          type: data.type,
          table_number: data.table_number,
          address: data.address,
          subtotal: data.subtotal || 0,
          status: data.status || 'pending',
          created_at: data.created_at,
          formattedDate: formatFirestoreTimestamp(data.created_at),
          items: data.items || {},
          parsedItems: parseOrderItems(data.items || {})
        } as FirestoreOrder
      })
      loading.value = false
    }, (error) => {
      console.error("Erro ao escutar pedidos no Firestore:", error)
      loading.value = false
    })
  }

  // Atualiza o status do pedido no Firestore
  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      if (db) {
        const orderRef = doc(db, 'orders', orderId)
        await updateDoc(orderRef, { status: newStatus })
        if (selectedOrder.value && selectedOrder.value.id === orderId) {
          selectedOrder.value.status = newStatus
        }
      }
    } catch (err) {
      console.error("Erro ao atualizar status do pedido:", err)
    }
  }

  // Abre o modal de detalhes
  const openOrderDetails = (order: FirestoreOrder) => {
    selectedOrder.value = order
    isDetailModalOpen.value = true
  }

  // Fecha o modal de detalhes
  const closeOrderDetails = () => {
    isDetailModalOpen.value = false
    selectedOrder.value = null
  }

  onMounted(() => {
    subscribeToOrders()
  })

  onUnmounted(() => {
    if (unsubscribe) unsubscribe()
  })

  return {
    orders,
    loading,
    selectedOrder,
    isDetailModalOpen,
    openOrderDetails,
    closeOrderDetails,
    updateOrderStatus
  }
}