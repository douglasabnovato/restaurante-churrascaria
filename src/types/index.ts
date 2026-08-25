export interface Product {
  id: string
  name: string
  desc: string
  price: number
  cat: 'combo' | 'special' | 'drink'
  img: string
  badge?: string
  includesBuffet?: boolean
}

export type OrderType = 'mesa' | 'delivery'

export type OrderStatus = 'pending' | 'preparing' | 'completed' | 'cancelled'

export interface OrderPayload {
  type: OrderType
  tableNumber?: string
  address?: string
  items: Record<string, number>
  total: number
}

// Estrutura detalhada de um item para o modal de detalhes do Dashboard
export interface OrderItemDetail {
  id: string
  name: string
  qty: number
  unitPrice: number
  totalPrice: number
}

// Estrutura do Pedido como é armazenado e lido do Firestore
export interface FirestoreOrder {
  id: string                      // ID gerado pelo documento no Firestore
  order_code: string              // Código formatado (ex: SC0001082026)
  type: OrderType
  table_number?: string | null
  address?: string | null
  subtotal: number
  status: OrderStatus
  created_at: any                 // Timestamp do Firebase
  formattedDate?: string          // Data formatada para a UI (ex: 25/08/2026 13:34)
  items: Record<string, number>   // Mapeamento { id_item: quantidade }
  parsedItems?: OrderItemDetail[] // Lista detalhada pronta para renderizar no modal
}