/* Cardápio do Sabor & Churrasco (preços em reais) */
import type { Product } from "../types"

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
/* Fim de menu.ts */
