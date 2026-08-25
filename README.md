# 🥩 Sabor & Churrasco - Comanda & Cardápio Digital (PWA)

> Aplicação web progressiva (PWA) desenvolvida para transformar a comanda analógica em um produto digital interativo, acelerando o atendimento presencial, os pedidos via WhatsApp e o gerenciamento operacional em tempo real.

---

## 📌 Visão Geral do Produto

- **Cliente/BU:** Sabor & Churrasco Restaurante (Juiz de Fora - MG)
- **Objetivo:** Eliminar erros de cálculo manual, otimizar o fluxo de atendimento em mesas e delivery e oferecer um painel de controle (Dashboard) em tempo real para a cozinha/atendimento.
- **Ambiente de Dev (WhatsApp):** `+55 (32) 98836-7667`
- **URL de Produção:** [GitHub Pages - Sabor & Churrasco](https://douglasabnovato.github.io/restaurante-churrascaria/)

---

## 📱 Demonstração do Sistema

Abaixo estão alguns prints que ilustram o funcionamento do Sabor & Churrasco, contemplando a experiência em dispositivos móveis, desktop, o envio automatizado para o WhatsApp e o painel de controle (Dashboard).

### 🖥️ Visão Desktop
<p align="center">
  <img src="./.github/1-desktop-home.png" alt="Desktop Home" width="800px">
</p>

---

### 📱 Visão Mobile & Experiência do Cliente
<p align="center">
  <img src="./.github/2-mobile-home.png" alt="Mobile Home" width="280px">
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="./.github/3-mobile-banner.png" alt="Mobile Banner" width="280px">
</p>

---

### 💬 Integração com WhatsApp & 📊 Painel de Comandas (Dashboard)
<div align="center">
  <table border="0">
    <tr>
      <td align="center"><b>Mensagem WhatsApp</b></td>
      <td align="center"><b>Dashboard de Pedidos (Tempo Real)</b></td>
    </tr>
    <tr>
      <td><img src="./.github/4-whatsapp-pedido.png" alt="WhatsApp Pedido" width="350px"></td>
      <td><img src="./.github/5-dashboard.png" alt="Dashboard" width="450px"></td>
    </tr>
  </table>
</div>

---

## 🛠️ Tech Stack & Arquitetura

- **Frontend:** Vue 3 (Composition API) + TypeScript + Vite
- **Estilização:** Tailwind CSS (Design System customizado com a paleta oficial da marca)
- **PWA Plugin:** `@vite-pwa/plugin` (Suporte offline e *Add to Home Screen*)
- **Backend & Banco de Dados:** Google Cloud Firestore (Serverless com sincronização em tempo real via `onSnapshot`)
- **Integração:** WhatsApp Direct-to-Chat (`wa.me`) com códigos de pedido formatados (`SCXXXXMMAAAA`)
- **Hospedagem / CI/CD:** GitHub Pages (via diretório `/docs`)

---

## 🎨 Identidade Visual (Design System)

- **Cor Primária (Vermelho Churrasco):** `#C82323`
- **Cor Primária Escura:** `#9B2220`
- **Cor Secundária / Accent (Amarelo Chama):** `#F4A21A`
- **Fundo:** `#F8F9FA`
- **Card / Superfície:** `#FFFFFF`
- **Texto:** `#1A1A1A`
- **Sucesso (WhatsApp):** `#25D366`

---

## 📋 Plano de Ação & Roadmap de Engenharia

### ✅ Fase 1: Configuração do Ambiente e Arquitetura Base
- [x] **1.1. Setup do Frontend:** Inicializar o projeto Vue 3 com Vite, TypeScript e Tailwind CSS.
- [x] **1.2. Configuração PWA:** Adicionar manifesto, ícones e service workers para suporte à instalação em smartphones.
- [x] **1.3. Banco de Dados (Firebase Firestore):** Configuração do projeto e inicialização dos serviços cloud.
- [x] **1.4. Pipeline CI/CD:** Configuração de build automatizado voltado para a pasta `/docs` do GitHub Pages.

---

### ✅ Fase 2: Componentização e Gerenciamento de Estado
- [x] **2.1. Componentes do Layout & Cards:**
  - `HeaderBar.vue`, `HeroCarousel.vue`, `PromoBanner.vue`, `ProductCard.vue`, `CartBar.vue`, `CheckoutModal.vue`, `FooterBar.vue`.
  - `OrdersDashboard.vue` e `OrderDetailModal.vue` (Painel administrativo).
- [x] **2.2. State Management (`useCart.ts` & `useOrders.ts`):**
  - Gestão reativa de itens do carrinho e escuta em tempo real das comandas na nuvem.

---

### ✅ Fase 3: Identificador Sequencial & WhatsApp
- [x] **3.1. Código de Pedido Atômico (`SCXXXXMMAAAA`):**
  - Implementação de transação no Firestore para gerar sequenciais únicos (ex: `SC0001082026`).
- [x] **3.2. Disparo para WhatsApp:** Estruturação de mensagem rica destacando o código do pedido e itens selecionados.

---

### 🚀 Fase 4: Painel de Operação & Dashboard em Tempo Real
- [x] **4.1. Sincronização via `onSnapshot`:** Atualização instantânea na tela da cozinha/atendimento sem necessidade de refresh.
- [x] **4.2. Gestão de Status:** Alteração dinâmica do estado da comanda (`pending` ➔ `preparing` ➔ `completed`).

---

## 🗄️ Estrutura do Banco de Dados (Cloud Firestore)

O sistema utiliza arquitetura NoSQL baseada em documentos e coleções:

```text
Firestore Database (default)
│
├── counters/                  [Documento de controle sequencial atômico]
│   └── orders_counter         -> { current_seq: 42 }
│
└── orders/                    [Coleção de Comandas]
    └── {order_id}             -> Documento da Comanda
        ├── order_code: "SC0042082026"
        ├── type: "mesa" (ou "delivery")
        ├── table_number: "12"
        ├── address: null
        ├── subtotal: 112.00
        ├── status: "pending"
        ├── created_at: Timestamp
        └── items: {
              "churr_01": 1,
              "churr_05": 1,
              "refri_600": 1,
              "refri_1l": 1,
              "somente_boi": 1
            }
```

📂 Estrutura de Pastas

```plaintext
sabor-e-churrasco/
├── .github/                     [Prints e documentação visual para o README]
├── public/                      [Favicon e manifestos PWA]
├── docs/                        [Build estático gerado para produção no GitHub Pages]
├── src/
│   ├── components/              [Componentes visuais e modais]
│   │   ├── CartBar.vue
│   │   ├── CheckoutModal.vue
│   │   ├── FooterBar.vue
│   │   ├── HeaderBar.vue
│   │   ├── HeroCarousel.vue
│   │   ├── OrderDetailModal.vue
│   │   ├── OrdersDashboard.vue
│   │   ├── ProductCard.vue
│   │   └── PromoBanner.vue
│   ├── composables/             [Lógica reativa (Carrinho e Comandas)]
│   │   ├── useCart.ts
│   │   └── useOrders.ts
│   ├── services/                [Integrações (Firebase e OrderCode)]
│   │   ├── firebase.ts
│   │   └── orderCode.ts
│   ├── types/                   [Tipagem estricta TypeScript]
│   │   └── index.ts
│   ├── App.vue
│   ├── main.ts
│   └── style.css
├── .env                         [Variáveis de ambiente do Firebase]
├── index.html
├── package.json
├── README.md
└── vite.config.ts
```

## 🏢 Informações do Estabelecimento

* **Endereço:** Rua Benjamin Guimarães, 315 / 308 - Bairro Democrata, Juiz de Fora - MG (Em frente ao Bahamas Mix)
* **Horário de Funcionamento:**
  * Segunda a Sábado: 10:30h às 17:30h
  * Domingo: 10:30h às 15:30h
  * Delivery: Todos os dias das 11:00h às 15:00h

---
Feito com 💻 e 🔥 por **Douglas A B Novato**.