# 🥩 Sabor & Churrasco - Comanda & Cardápio Digital (PWA)

> Aplicação web progressiva (PWA) desenvolvida para transformar a comanda analógica em um produto digital interativo, acelerando o atendimento presencial e os pedidos via WhatsApp.

---

## 📌 Visão Geral do Produto

- **Cliente/BU:** Sabor & Churrasco Restaurante (Juiz de Fora - MG)
- **Objetivo:** Eliminar erros de cálculo manual, otimizar o fluxo de atendimento em mesas e delivery e oferecer um cardápio visual e intuitivo de alta conversão.
- **Ambiente de Dev (WhatsApp):** `+55 (32) 98836-7667`

---

## 🛠️ Tech Stack

- **Frontend:** Vue 3 (Composition API) + TypeScript + Vite
- **Estilização:** Tailwind CSS v4 (Design System customizado com a paleta oficial da marca)
- **PWA Plugin:** `@vite-pwa/plugin` (Suporte offline e suporte a *Add to Home Screen*)
- **Backend & Banco de Dados:** Supabase (PostgreSQL + Realtime Subscriptions)
- **Integração:** WhatsApp Direct-to-Chat (`wa.me`)
- **Hospedagem / CI/CD:** Vercel

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

## 📋 Plano de Ação & Roadmap de Projeto

### 🚀 Fase 1: Configuração do Ambiente e Arquitetura Base
- [x] **1.1. Setup do Frontend:** Inicializar o projeto Vue 3 com Vite, TypeScript e Tailwind CSS.
- [x] **1.2. Configuração PWA:** Adicionar manifesto, ícones e service workers para suporte à instalação em smartphones.
- [ ] **1.3. Banco de Dados (Supabase):** Criar projeto no Supabase e executar o script DDL para tabelas `products`, `categories` e `orders`.
- [ ] **1.4. Pipeline CI/CD:** Conectar repositório GitHub à Vercel para deploys automáticos a cada commit.

---

### 🧩 Fase 2: Componentização e Gerenciamento de Estado
- [x] **2.1. Componentes do Layout:**
  - `HeaderBar.vue`: Cabeçalho fixo com identidade da marca.
  - `HeroCarousel.vue`: Carrossel rotativo no topo para fotos do ambiente e produtos.
  - `PromoBanner.vue`: Destaque do "Prato do Dia / Especial do Chef" com tratamento de imagem *fallback*.
  - `ProductCard.vue`: Card reativo de produto com seleção de quantidades e tratamento `onerror` de imagens.
  - `CartBar.vue`: Barra flutuante inferior com exibição de subtotal em tempo real.
  - `CheckoutModal.vue`: Modal com alternância entre consumo no local (Mesa) ou Delivery.
  - `FooterBar.vue`: Rodapé institucional com informações operacionais e localização (Bairro Democrata).
- [x] **2.2. State Management (`useCart.ts`):**
  - Implementar composable reativo para gestão de itens do carrinho.
  - Criar função `resetAppAndReturn()` para zerar a aplicação e retornar ao estado inicial pós-pedido.

---

### 📲 Fase 3: Integração com WhatsApp & Persistência
- [x] **3.1. Disparo para WhatsApp:** Estruturar gerador de links pré-formatados com os itens do pedido, subtotal e identificação (Mesa/Delivery).
- [ ] **3.2. Persistência de Pedidos:** Gravação assíncrona do histórico de comandas na tabela `orders` do Supabase.
- [x] **3.3. UX de Confirmação:** Exibição da tela *"Pedido realizado com sucesso!"* e ação do botão *"Voltar ao cardápio"*.

---

### 🎛️ Fase 4: Painel de Operação (KDS & Gerenciamento)
- [ ] **4.1. Dashboard do Lojista:** Interface protegida por senha para alteração rápida do **Prato do Dia** e controle de estoque de produtos esgotados.
- [ ] **4.2. Monitor de Cozinha (KDS Leve):** Painel web que consome dados em tempo real do Supabase Realtime para notificação de novos pedidos.

---

### 📍 Fase 5: Testes de Campo, QR Codes & Lançamento
- [ ] **5.1. Testes de Carga & Conexão:** Validar carregamento e performance da PWA em conexões 3G/4G no estabelecimento.
- [ ] **5.2. QR Codes para Mesas:** Imprimir adesivos de QR Code parametrizados com a mesa (ex: `app.saborchurrasco.com.br?mesa=04`).
- [ ] **5.3. Treinamento da Equipe:** Instruir garçons e gerentes para utilização e acompanhamento dos pedidos.

---

## 🗄️ Estrutura do Banco de Dados (PostgreSQL / Supabase)

```sql
-- Tabela de Categorias
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  display_order INT NOT NULL
);

-- Tabela de Produtos
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  category_id UUID REFERENCES categories(id),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE
);

-- Tabela de Pedidos/Comandas
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL, -- 'mesa' ou 'delivery'
  table_number TEXT,
  address TEXT,
  subtotal DECIMAL(10,2) NOT NULL,
  items JSONB NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 📂 Estrutura de Pastas

```text
sabor-e-churrasco/
├── public/
│   ├── favicon.ico
│   ├── icon-192.png
│   └── icon-512.png
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── CartBar.vue
│   │   ├── CheckoutModal.vue
│   │   ├── FooterBar.vue
│   │   ├── HeaderBar.vue
│   │   ├── HeroCarousel.vue
│   │   ├── ProductCard.vue
│   │   └── PromoBanner.vue
│   ├── composables/
│   │   └── useCart.ts
│   ├── services/
│   │   └── supabase.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.vue
│   ├── main.ts
│   └── style.css
├── .env
├── index.html
├── package.json
├── README.md
└── vite.config.ts
```

---

## 🏢 Informações do Estabelecimento

- **Endereço:** Rua Benjamin Guimarães, 315 / 308 - Bairro Democrata, Juiz de Fora - MG (Em frente ao Bahamas Mix)
- **Horário de Funcionamento:**
  - Segunda a Sábado: 10:30h às 17:30h
  - Domingo: 10:30h às 15:30h
  - Delivery: Todos os dias das 11:00h às 15:00h