# 🥩 Sabor & Churrasco - Comanda & Cardápio Digital (PWA)

> Aplicação web progressiva (PWA) desenvolvida para transformar a comanda analógica em um produto digital interativo, acelerando o atendimento presencial, os pedidos via WhatsApp e o gerenciamento operacional em tempo real.

---

## Estado e próximos passos (ciclo de 07/11/2026)

Nível: Vitrine (N2). **4 de 12** critérios do MVP atendidos; não finalizado. O site no ar (https://douglasabnovato.github.io/restaurante-churrascaria/, HTTP 200 em 09/11/2026) ainda é o build antigo da pasta `docs/`: a publicação pelo Actions espera a troca da fonte do Pages (#2).

**O que foi feito no ciclo de 07/11/2026**
- Horários num só lugar ([`src/domain/hours.ts`](src/domain/hours.ts)), no fuso de Juiz de Fora; fora do horário (11h às 15h), o delivery fica indisponível no checkout, com aviso lido por leitor de tela (#14).
- Ícones PNG de 192 e 512 px da marca (um maskable) no manifesto do PWA (#15).
- `documentacao/MVP.md` com uma tabela só e histórico; plano do ciclo em `documentacao/PLANO-DE-ACAO.md`.

**Ciclo de 03/11/2026:** CI nos PRs, `.env` fora do Git, carrossel mais leve, trava do deploy e observação no pedido (#10, #1).

**O que queremos fazer**
- [#2](https://github.com/douglasabnovato/restaurante-churrascaria/issues/2) Publicar a versão atual do site (responsável).
- [#11](https://github.com/douglasabnovato/restaurante-churrascaria/issues/11) Proteger a `main` com PR e CI obrigatórios (responsável).
- [#12](https://github.com/douglasabnovato/restaurante-churrascaria/issues/12) Medir o uso do cardápio com aviso de coleta (responsável).
- [#16](https://github.com/douglasabnovato/restaurante-churrascaria/issues/16) Confirmar a meta da hipótese (responsável).
- [#9](https://github.com/douglasabnovato/restaurante-churrascaria/issues/9) Medir e reduzir o LCP móvel no site publicado (depois da #2).
- [#13](https://github.com/douglasabnovato/restaurante-churrascaria/issues/13) Mostrar a observação do pedido no painel.
- [#18](https://github.com/douglasabnovato/restaurante-churrascaria/issues/18) Fechar o delivery em feriados e dias de exceção.
- [#19](https://github.com/douglasabnovato/restaurante-churrascaria/issues/19) Testar o envio do pedido só com teclado.

**Onde está a documentação**
- Estado e critérios: [documentacao/MVP.md](documentacao/MVP.md).
- Plano do ciclo: [documentacao/PLANO-DE-ACAO.md](documentacao/PLANO-DE-ACAO.md), seção "Ciclo de 07/11/2026".
- Publicação: [documentacao/DEPLOY.md](documentacao/DEPLOY.md).

---

## ✅ Próximos passos do responsável

As regras do Firestore já estão publicadas (01/11/2026). Falta publicar a versão atual do site, com o painel protegido por login.

1. Abrir [Settings → Secrets and variables → Actions → Variables](https://github.com/douglasabnovato/restaurante-churrascaria/settings/variables/actions).
2. Abrir o `.env` local, com `notepad .env`, para copiar os valores.
3. Em **New repository variable**, criar cada variável abaixo com o valor que vem depois do `=`, sem aspas:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_MEASUREMENT_ID`
4. Criar `VITE_WHATSAPP_NUMBER` com o número real, só dígitos, com DDI e DDD. Sem ela, o site usa o WhatsApp de desenvolvimento e mostra um aviso no rodapé.
5. Em [Settings → Pages](https://github.com/douglasabnovato/restaurante-churrascaria/settings/pages), trocar **Source** para **GitHub Actions**.
6. Criar a variável `PAGES_VIA_ACTIONS` com o valor `true`.

Depois disso, rodar o workflow CI na `main` (Actions → CI → Run workflow) e conferir que o painel pede login. O PR #1 já foi integrado: antes do `git pull` no clone local, guardar uma cópia do `.env`, porque o merge o apaga da pasta. Detalhes em [documentacao/DEPLOY.md](documentacao/DEPLOY.md).

---

## 📌 Visão Geral do Produto

- **Cliente/BU:** Sabor & Churrasco Restaurante (Juiz de Fora - MG)
- **Objetivo:** Eliminar erros de cálculo manual, otimizar o fluxo de atendimento em mesas e delivery e oferecer um painel de controle (Dashboard) em tempo real para a cozinha/atendimento.
- **Ambiente de Dev (WhatsApp):** `+55 (32) 98836-7667` (padrão quando `VITE_WHATSAPP_NUMBER` não está definido)
- **URL de Produção:** [GitHub Pages - Sabor & Churrasco](https://douglasabnovato.github.io/restaurante-churrascaria/)

### 🌐 Em produção

- URL: https://douglasabnovato.github.io/restaurante-churrascaria/ (responde com HTTP 200 em 06/11/2026). **Atenção:** o que está no ar ainda é o build antigo da pasta `docs/`, sem o painel com login. A versão atual entra no ar quando o Pages passar a publicar pelo Actions ([#2](https://github.com/douglasabnovato/restaurante-churrascaria/issues/2)).
- Hospedagem prevista: GitHub Pages publicado pelo GitHub Actions a cada push na `main` (variáveis `VITE_*` e `PAGES_VIA_ACTIONS=true` nas Variables do repositório) + Firebase (Auth e Firestore, plano Spark). As regras do Firestore já estão publicadas.
- Passo a passo, incluindo a publicação das regras do Firestore: [documentacao/DEPLOY.md](documentacao/DEPLOY.md)

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
- **Hospedagem / CI/CD:** GitHub Pages publicado pelo GitHub Actions (build em `dist/`, fora do Git)

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
- [x] **1.4. Pipeline CI/CD:** Build automatizado no GitHub Actions; a publicação pelo Actions liga com `PAGES_VIA_ACTIONS=true` (até lá, o Pages serve a pasta `/docs`, com o build antigo).

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

### 🔒 Fase 5: Segurança, acessibilidade e testes (v1.1)
- [x] Painel movido para `#/painel` e protegido por login da equipe (Firebase Auth, e-mail e senha)
- [x] `firestore.rules` versionado: clientes só **criam** pedidos válidos; ler pedidos/endereços e mudar status é só da equipe (coleção `staff`)
- [x] Número do WhatsApp por `VITE_WHATSAPP_NUMBER`; `.env` fora do Git (use `.env.example`)
- [x] Validação de mesa/endereço, totais em centavos, código provisório único quando o contador falha
- [x] WCAG AA (axe-core sem violações, Lighthouse Acessibilidade 100); carrossel com pausa
- [x] Firebase carregado só ao enviar o pedido ou abrir o painel: JS inicial de 576 kB para 87 kB
- [x] Testes: `npm test` (regras do pedido) e `npm run test:rules` (regras do Firestore no emulador)

#### Como configurar o painel

1. No console do Firebase: **Authentication → Método de login → E-mail/senha** (ativar) e crie o usuário da equipe.
2. **Firestore → Dados**: crie a coleção `staff` com um documento cujo ID é o **UID** desse usuário (conteúdo livre, ex.: `{ "nome": "Caixa" }`).
3. Publique as regras: `npm run deploy:rules` (ou cole `firestore.rules` no console).
4. Acesse `.../restaurante-churrascaria/#/painel` e entre com o e-mail e a senha.

Detalhes em [documentacao/ANALISE.md](documentacao/ANALISE.md), [documentacao/ARQUITETURA.md](documentacao/ARQUITETURA.md) e [documentacao/PLANO-DE-ACAO.md](documentacao/PLANO-DE-ACAO.md).

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
├── documentacao/                [Análise, arquitetura, plano de ação e DEPLOY.md]
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
├── .env.example                 [Modelo das variáveis; o .env fica fora do Git]
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

Os horários ficam num só lugar do código, [`src/domain/hours.ts`](src/domain/hours.ts): o rodapé mostra e o checkout consulta (fora do horário, o delivery fica indisponível).

---
Feito com 💻 e 🔥 por **Douglas A B Novato**.