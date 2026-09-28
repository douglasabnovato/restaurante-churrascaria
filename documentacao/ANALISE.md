# Análise — Sabor & Churrasco (restaurante-churrascaria)

## 1. Especificação

Comanda e cardápio digital (PWA): o cliente monta o pedido (mesa ou delivery) e envia pelo WhatsApp; o pedido também vai para o Firestore, onde a equipe acompanha em um painel em tempo real.

Avaliado no grupo **fullstack** (e não landing), porque guarda dados pessoais (endereços) no Firestore e tem painel operacional.

| ID | Requisito | Antes | Depois |
|---|---|---|---|
| RF01 | Montar pedido e ver subtotal | ✅ (float) | ✅ centavos |
| RF02 | Enviar por WhatsApp com código | ✅ (código fixo em falhas) | ✅ código único |
| RF03 | Validar mesa/endereço | ❌ | ✅ |
| RF04 | Painel da equipe | ⚠️ aberto a qualquer cliente | ✅ login + regras |
| RF05 | Mudar status do pedido | ⚠️ qualquer pessoa | ✅ só equipe, só o campo status |

## 2. Defeitos encontrados

| # | Severidade | Defeito | Referência |
|---|---|---|---|
| D1 | Crítica | Aba "Dashboard" no próprio cardápio: qualquer cliente via todos os pedidos, **endereços de entrega** e faturamento, e mudava status | OWASP A01:2025; LGPD art. 46 |
| D2 | Crítica | Sem `firestore.rules` no repositório: para o painel funcionar sem login, as regras precisavam estar abertas (qualquer um lê/escreve pela API) | OWASP A01:2025 |
| D3 | Alta | `.env` versionado no Git | OWASP A02:2025 |
| D4 | Média | Código de pedido `SC0000002026` repetido sempre que o contador falhava; subtotal em ponto flutuante; faturamento somava cancelados | — |
| D5 | Média | Botões − / + sem nome acessível, rótulos sem `for`, carrossel automático sem pausa, verde #25D366 com texto branco (2:1), `lang="en"` | WCAG 2.2 4.1.2, 1.3.1, 2.2.2, 1.4.3 |
| D6 | Baixa | Ícones PWA (pwa-192/512.png) inexistentes; Supabase instalado sem uso; Firebase inteiro no carregamento | — |

## 3. Baseline automatizado

| Verificação | Antes | Depois |
|---|---|---|
| Testes | 0 | 4 unitários + 6 de regras (emulador) |
| `npm audit` | 0 | 0 |
| JS inicial | 576 kB | 87 kB |
| axe-core | não medido | 0 violações |
| Lighthouse (mobile, sem imagens externas) | — | 100 / 100 / 96 / 100 |

## Rubrica v2 (grupo fullstack)

Aprovação: média ponderada ≥ 7,0 **e** C1 e C4 (eliminatórios) ≥ 5. Regras: nota sem evidência vale no máximo 6; C1 limitado a 7 para parte não executada de ponta a ponta; C9 ≥ 8 só com URL publicada e CI verde.

| # | Critério | Referência | Peso | Antes | Depois | Evidência | Justificativa |
|---|---|---|---|---|---|---|---|
| C1 | Núcleo de valor | MVP (Ries); SWEBOK Requirements | 16% | 6 | 7 | Chromium: montar pedido → validação → envio (build sem .env); painel pede login | Painel não testado com Firebase real (limite 7) |
| C2 | Estados e condições excepcionais | Nielsen; OWASP A10:2025 | 8% | 3 | 8 | testes de validação; mensagens de erro no painel e no checkout | Falhas de Firestore/cópia ficavam só no console; checkout sem validação |
| C3 | Acessibilidade | WCAG 2.2 AA (axe-core) | 7% | 4 | 9 | axe-core 0 (cardápio, checkout, painel); Lighthouse Acessibilidade 100 | Botões − e + sem nome, rótulos sem for, carrossel automático sem pausa, verde WhatsApp 2:1 |
| C4 | Segurança e privacidade | OWASP Top 10:2025 / ASVS 5.0 N1 | 14% | 1 | 6 | firestore.rules + 5 testes de regras escritos (emulador não executado aqui); .env ainda versionado até o `git rm --cached .env` (ação sua) | Painel com endereços de clientes aberto a qualquer um na mesma página do cardápio e sem regras versionadas; .env no Git. Agora login + regras, mas sem teste no emulador → máx. 6 |
| C5 | Dados | 3FN / ACID / fonte única | 10% | 4 | 7 | total em centavos; código provisório único; regras validam formato do pedido | Código SC0000002026 repetido em qualquer falha; somas em ponto flutuante |
| C6 | Testes | Pirâmide de testes; SWEBOK Testing | 9% | 0 | 6 | vitest 4 (domínio) + suíte de regras pronta | Não havia testes |
| C7 | Qualidade de código | SOLID / camadas; SWEBOK Construction | 7% | 6 | 8 | domínio puro em src/domain; Firebase carregado sob demanda | itemsData misturado ao composable |
| C8 | Desempenho | Complexidade; Core Web Vitals | 5% | 6 | 8 | JS inicial 87 kB (antes 576 kB); Lighthouse 100 (imagens externas bloqueadas no teste) | Firebase inteiro no carregamento inicial |
| C9 | Operação | 12-Factor; DORA | 7% | 5 | 7 | build para docs/ (GitHub Pages); CI em ci/ | URL publicada existe, mas sem CI |
| C10 | Documentação | README como contrato | 5% | 7 | 8 | README + documentacao/ | README já era bom; faltava segurança e configuração |
| C11 | Produto e evidência | Cagan (4 riscos); Torres | 7% | 6 | 7 | pedido por WhatsApp com código; painel da equipe separado | Faturamento somava pedidos cancelados |
| C12 | Sustentabilidade técnica | OWASP A03:2025; SWEBOK Maintenance | 5% | 7 | 8 | npm audit 0; Supabase sem uso removido | Stack já moderna (Vue 3.5, Vite 8, Tailwind 4) |

**Média ponderada:** antes **4,21** (REPROVADO) → depois **7,21** (APROVADO).

## Limitações da avaliação

- O `.env` não foi lido; o build de verificação foi feito numa cópia sem ele, então Firestore e login não foram exercitados aqui.
- O emulador do Firestore não pode ser baixado neste ambiente: rode `npm run test:rules` (Java 11+) antes de publicar as regras.
- As fotos do cardápio vêm do Unsplash (bloqueado aqui); o Lighthouse real terá LCP maior.
