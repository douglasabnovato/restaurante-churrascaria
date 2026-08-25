import { ref, computed } from 'vue'
import { db } from '../services/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import type { Product, OrderType } from '../types'
import { generateOrderCode } from '../services/orderCode'

export const DEFAULT_CHEF_IMAGE = "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=300&q=80"

export const itemsData: Product[] = [
  // --- OPÇÕES DE PROTEÍNA + BUFFET LIVRE ---
  {
    id: "churr_01",
    name: "Churrasco 01 (Trio Tradicional)",
    desc: "Sobrecoxa de frango, pernil suíno e linguiça toscana assados na brasa + Acesso livre à ilha de acompanhamentos e saladas.",
    price: 28.00,
    cat: "combo",
    badge: "Buffet Livre",
    includesBuffet: true,
    img: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "churr_02",
    name: "Churrasco 02 (Combo Completo)",
    desc: "Alcatra bovina, frango, pernil e linguiça artesanal na brasa + Acesso livre à ilha de acompanhamentos e saladas.",
    price: 32.00,
    cat: "combo",
    badge: "Mais Pedido",
    includesBuffet: true,
    img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "churr_03",
    name: "Churrasco 03 (Boi & Porco)",
    desc: "Cortes de contrafilé bovino e lombo suíno na brasa + Acesso livre à ilha de acompanhamentos e saladas.",
    price: 30.00,
    cat: "combo",
    includesBuffet: true,
    img: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "churr_04",
    name: "Churrasco 04 (Frango & Boi)",
    desc: "Peito de frango temperado e alcatra bovina macia na brasa + Acesso livre à ilha de acompanhamentos e saladas.",
    price: 30.00,
    cat: "combo",
    includesBuffet: true,
    img: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "churr_05",
    name: "Churrasco 05 (Boi & Linguiça)",
    desc: "Contrafilé grelhado e linguiça toscana defumada + Acesso livre à ilha de acompanhamentos e saladas.",
    price: 30.00,
    cat: "combo",
    includesBuffet: true,
    img: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=300&q=80"
  },

  // --- CORTES ESPECIAIS + BUFFET LIVRE ---
  {
    id: "picanha",
    name: "Picanha Nobre na Brasa",
    desc: "Fatias de picanha com capa de gordura perfeita + Acesso livre à ilha de acompanhamentos e saladas.",
    price: 38.00,
    cat: "special",
    badge: "Especialidade",
    includesBuffet: true,
    img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "med_frango",
    name: "Medalhão de Frango com Bacon",
    desc: "Espeto artesanal de frango envolto em tiras de bacon + Acesso livre à ilha de acompanhamentos e saladas.",
    price: 26.00,
    cat: "special",
    includesBuffet: true,
    img: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "somente_boi",
    name: "Proteína Exclusiva Somente Boi",
    desc: "Porção generosa exclusiva de carne bovina nobre na brasa + Acesso livre à ilha de acompanhamentos e saladas.",
    price: 34.00,
    cat: "special",
    includesBuffet: true,
    img: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "prato_dia",
    name: "Prato do Dia do Chef",
    desc: "Sugestão de proteína do dia preparada na brasa + Acesso livre à ilha de acompanhamentos e saladas.",
    price: 25.00,
    cat: "special",
    badge: "Oferta do Dia",
    includesBuffet: true,
    img: DEFAULT_CHEF_IMAGE
  },

  // --- BEBIDAS GELADAS ---
  { id: "refri_200", name: "Refrigerante 200ml", desc: "Lata caçulinha bem gelada", price: 4.00, cat: "drink", img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=300&q=80" },
  { id: "refri_310", name: "Refrigerante Lata 310ml", desc: "Lata tradicional bem gelada", price: 6.00, cat: "drink", badge: "Gelado", img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=300&q=80" },
  { id: "refri_600", name: "Refrigerante 600ml", desc: "Garrafa individual", price: 8.00, cat: "drink", img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=300&q=80" },
  { id: "refri_1l", name: "Refrigerante 1 Litro", desc: "Garrafa de 1 Litro", price: 12.00, cat: "drink", img: "https://images.unsplash.com/photo-1581006852262-e4307cf6283a?auto=format&fit=crop&w=300&q=80" },
  { id: "agua_com_gas", name: "Água Mineral com Gás 500ml", desc: "Garrafa gelada", price: 4.50, cat: "drink", img: "https://images.unsplash.com/photo-1559839914-17aae19cec71?auto=format&fit=crop&w=300&q=80" },
  { id: "agua_sem_gas", name: "Água Mineral sem Gás 500ml", desc: "Garrafa gelada", price: 4.00, cat: "drink", img: "https://images.unsplash.com/photo-1559839914-17aae19cec71?auto=format&fit=crop&w=300&q=80" },
  { id: "suco", name: "Suco Natural da Fruta 400ml", desc: "Preparo na hora (Laranja/Limonada)", price: 7.00, cat: "drink", badge: "Natural", img: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=300&q=80" }
]

export function useCart() {
  const cart = ref<Record<string, number>>({})
  const isModalOpen = ref(false)
  const isOrderSubmitted = ref(false)

  const updateQty = (id: string, change: number) => {
    const current = cart.value[id] || 0
    const updated = Math.max(0, current + change)
    if (updated === 0) {
      delete cart.value[id]
    } else {
      cart.value[id] = updated
    }
  }

  const subtotal = computed(() => {
    let total = 0
    for (const [id, qty] of Object.entries(cart.value)) {
      const item = itemsData.find(i => i.id === id)
      if (item) total += item.price * qty
    }
    return total
  })

  const totalItems = computed(() => {
    return Object.values(cart.value).reduce((acc, qty) => acc + qty, 0)
  })

  const sendToWhatsApp = async (type: OrderType, tableNum?: string, address?: string) => {
    const devPhone = "5532988367667"

    // 1. Gera o código sequencial formatado (ex: SC0001082026)
    let orderCode = "SC0000002026"
    try {
      orderCode = await generateOrderCode()
    } catch (err) {
      console.warn("Aviso ao gerar código do pedido:", err)
    }

    // 2. Grava o pedido no Firestore com o order_code
    try {
      if (db) {
        await addDoc(collection(db, 'orders'), {
          order_code: orderCode,
          type,
          table_number: type === 'mesa' ? tableNum : null,
          address: type === 'delivery' ? address : null,
          subtotal: subtotal.value,
          items: cart.value,
          status: 'pending',
          created_at: serverTimestamp()
        })
      }
    } catch (err) {
      console.warn("Aviso ao salvar pedido no Firestore:", err)
    }

    // 3. Monta a mensagem para o WhatsApp com o Código do Pedido em destaque
    let message = `*PEDIDO #${orderCode} - SABOR & CHURRASCO*\n`
    message += `-----------------------------------\n`
    for (const [id, qty] of Object.entries(cart.value)) {
      const item = itemsData.find(i => i.id === id)
      if (item) {
        message += `${qty}x ${item.name} - R$ ${(item.price * qty).toFixed(2)}\n`
      }
    }
    message += `-----------------------------------\n`
    message += `*Total:* R$ ${subtotal.value.toFixed(2).replace('.', ',')}\n`

    if (type === 'mesa') {
      message += `*Mesa/Local:* Mesa ${tableNum || 'Não especificada'}`
    } else {
      message += `*Delivery:* ${address || 'Não informado'}`
    }

    isOrderSubmitted.value = true
    window.open(`https://wa.me/${devPhone}?text=${encodeURIComponent(message)}`, '_blank')
  }

  const resetAppAndReturn = () => {
    cart.value = {}
    isModalOpen.value = false
    isOrderSubmitted.value = false
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return {
    cart,
    subtotal,
    totalItems,
    isModalOpen,
    isOrderSubmitted,
    updateQty,
    sendToWhatsApp,
    resetAppAndReturn
  }
}
