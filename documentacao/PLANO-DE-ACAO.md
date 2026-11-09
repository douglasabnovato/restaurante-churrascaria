# Plano de ação — Sabor & Churrasco

Timebox: 50 min.

| MoSCoW | Item | Ganho | Esforço | Status |
|---|---|---|---|---|
| Must | Painel fora do cardápio e com login (D1) | Alto | Médio | ✅ |
| Must | firestore.rules versionado (D2) | Alto | Médio | ✅ escrito; ⏳ testar e publicar |
| Must | .env fora do Git (D3) | Alto | Baixo | ⏳ `git rm --cached .env` (ação sua) |
| Should | Totais, código e validação (D4) | Médio | Baixo | ✅ |
| Should | Acessibilidade (D5) | Médio | Baixo | ✅ axe 0 |
| Should | Desempenho (D6) | Médio | Baixo | ✅ 576 → 87 kB |
| Could | Ícones PNG do PWA (192 e 512) | Baixo | Baixo | Próximo ciclo |
| Could | Fotos próprias em vez do Unsplash | Médio | Baixo | Próximo ciclo |

## Ciclo de 03/11/2026

> Executado em 06/11/2026. Branch `feature/2026-11-06` → `developer/sprint-2026-11-12` → `main`. Nível: Vitrine (N2), 12 critérios.

### Produto

**Problema e público.** Clientes do Sabor & Churrasco pedem pelo celular e mandam o pedido pelo WhatsApp; a equipe acompanha os pedidos num painel com login.

**Hipótese e meta.** Metade dos pedidos do delivery passa pelo cardápio digital em um mês. A meta segue proposta; confirmar é do responsável (#16). Medir depende de uma decisão de coleta (#12).

**O que a pesquisa trouxe.**

| Ideia | O que levamos para o projeto | Fonte |
|---|---|---|
| No pedido pelo WhatsApp, o cliente monta o carrinho e combina o resto na conversa | Observação opcional no checkout (ex.: ponto da carne), que vai junto na mensagem e evita uma troca de mensagens | [Saipos: cardápio digital para WhatsApp](https://saipos.com/cardapio-digital/como-fazer-cardapio-digital-para-whatsapp), [Olhar Digital: cardápio digital no WhatsApp](https://olhardigital.com.br/2023/06/15/dicas-e-tutoriais/como-funciona-o-cardapio-digital-para-whatsapp/) |
| A chave web do Firebase identifica o projeto; quem protege os dados são as regras | O `.env` sai do Git por organização, não por ser segredo. A proteção real são as regras publicadas e testadas no CI | [Firebase: lista de segurança](https://firebase.google.com/support/guides/security-checklist) |
| A imagem do LCP não deve ser carregada tarde e pode ser pré-carregada com prioridade alta | Já no PR #1: `preload` e `fetchpriority` na primeira imagem do carrossel, que caiu para 480 px | [web.dev: otimizar o LCP](https://web.dev/articles/optimize-lcp) |

**Backlog priorizado (impacto × esforço).**

| Prioridade | Item | Impacto | Esforço | Destino |
|---|---|---|---|---|
| 1 | Integrar o PR #1 (CI, `.env`, carrossel) | Alto | Baixo | Este ciclo (#10) |
| 2 | Travar o deploy até a troca do Pages | Alto | Baixo | Este ciclo (#10) |
| 3 | Observação no pedido | Médio | Baixo | Este ciclo (#10) |
| 4 | Publicar a versão atual | Alto | Baixo | Responsável (#2) |
| 5 | Proteger a `main` | Alto | Baixo | Responsável (#11) |
| 6 | Medição de uso com aviso de coleta | Médio | Médio | Responsável (#12) |
| 7 | LCP no site publicado | Médio | Baixo | Depois da #2 (#9) |
| 8 | Observação no painel | Médio | Médio | Issue (#13) |
| 9 | Aviso de horário do delivery | Médio | Baixo | Issue (#14) |
| 10 | Ícones PNG do PWA | Baixo | Baixo | Issue (#15) |

**Fora do escopo.** Pagamento online, integração com caixa, fotos próprias.

### Engenharia

**Arquitetura.** SPA Vue 3 + TypeScript + Vite, com PWA. Regras puras do pedido em `src/domain/order.ts`. Firebase Auth e Firestore para o painel e o registro dos pedidos, carregados sob demanda. Publicação prevista: GitHub Actions → Pages, com as variáveis `VITE_*` do repositório.

**Riscos.**
- O site no ar é o build antigo de `docs/` até a troca da fonte do Pages (#2).
- O Analytics do Firebase liga sozinho quando há `VITE_FIREBASE_MEASUREMENT_ID`, sem aviso de coleta (#12).
- A observação não vai para o Firestore: mudar as regras exige publicá-las de novo, o que é do responsável (#13).
- Sem proteção na `main`, um push direto publicaria sem CI (#11).

**Qualidade.**
- Testes: 7 unitários (total, validação, mensagem, observação, código) e testes das regras no emulador, no CI.
- CI: agora também nos PRs para `developer/**`, com execução manual.
- Acessibilidade: campo de observação com rótulo e texto de ajuda ligados.
- Segurança: nada novo vai para o Firestore; observação limitada a 140 caracteres.

**Definição de pronto.** `npm ci`, `npm test`, `npm run test:rules` e `npm run build` passam; CI verde nos dois PRs; `documentacao/MVP.md` e README atualizados.

### Plano de ação

**Este ciclo executa.**
1. Integrar o PR #1 com a trava `PAGES_VIA_ACTIONS`.
2. Observação no pedido, com testes.
3. `documentacao/MVP.md` com o resumo batendo com a tabela; README com o estado do ciclo.

**Vira issue.** #2, #11, #12, #16 (responsável); #9, #13, #14, #15 (agente).

## Ciclo de 07/11/2026

> Branch `feature/2026-11-07` → `developer/sprint-2026-11-12` → `main` (o PR para a `main` fica aberto para revisão do responsável). Nível: Vitrine (N2), 12 critérios. Escopo: só o que o código resolve; a publicação segue travada pela Variable `PAGES_VIA_ACTIONS` até o responsável trocar a fonte do Pages (#2), e isso não foi mexido.

### Produto

**Problema e público.** Sem mudança: clientes pedem pelo celular e mandam o pedido pelo WhatsApp; a equipe acompanha no painel.

**Hipótese e meta.** Sem mudança; confirmar é do responsável (#16).

**O que a pesquisa trouxe.**

| Ideia | O que levamos para o projeto | Fonte |
|---|---|---|
| Plataformas de cardápio digital configuram o horário do delivery por dia e mostram ao cliente se a loja está aberta; fora do horário, o item aparece desabilitado e o pedido não fecha | O checkout desabilita a opção "Delivery" fora das 11h às 15h e avisa com `role="status"`; o consumo na mesa segue disponível | [Goomer: horários de delivery e retirada](https://ajuda.goomer.com.br/cardapio-digital/painel/loja/horarios/delivery-e-retirada), [99Food: horário de funcionamento](https://99app.com/99food/restaurantes/guias/configuracao-horario-funcionamento-99food/), [Saipos: cardápio delivery](https://saipos.com/cardapio/cardapio-delivery) |
| Para instalar o PWA, o Chrome pede ícones de 192 e 512 px; o maskable deve ser um arquivo separado, com a arte na zona segura central | Três PNG da marca (192, 512 e 512 maskable) e um SVG da marca no manifesto | [web.dev: web app manifest](https://web.dev/learn/pwa/web-app-manifest), [Front-End Checklist: PWA installability](https://frontendchecklist.io/rules/html/pwa-installability) |

**Backlog priorizado (impacto × esforço).**

| Prioridade | Item | Impacto | Esforço | Destino |
|---|---|---|---|---|
| 1 | Delivery indisponível fora do horário, com horários num só lugar | Médio | Baixo | Este ciclo (#14) |
| 2 | Ícones PNG do PWA | Baixo | Baixo | Este ciclo (#15) |
| 3 | Publicar a versão atual (troca da fonte do Pages) | Alto | Baixo | Responsável (#2) |
| 4 | Observação no painel (precisa publicar regras novas) | Médio | Médio | Issue (#13) |
| 5 | LCP no site publicado | Médio | Baixo | Depois da #2 (#9) |
| 6 | Feriados e fechamento manual do delivery | Médio | Médio | Issue #18 |
| 7 | Envio do pedido só com teclado (critério 8) | Médio | Médio | Issue #19 |

**Fora do escopo.** Pagamento online, integração com caixa, feriados (vira issue).

### Engenharia

**Arquitetura.** `src/domain/hours.ts` guarda os horários (salão na semana e no domingo, delivery) e calcula aberto e fechado com `Intl.DateTimeFormat` no fuso `America/Sao_Paulo`, para o resultado não depender do relógio do aparelho. O `CheckoutModal` consulta ao abrir e ao enviar; o `FooterBar` mostra os mesmos textos. O manifesto do PWA (em `vite.config.ts`) lista os ícones novos de `public/`.

**Riscos.**
- O horário do aparelho não importa, mas o relógio sim: um celular com a hora errada calcula o fuso a partir de um instante errado.
- Feriados e fechamentos manuais não estão no código (issue nova).
- O site no ar continua sendo o build antigo até a #2.

**Qualidade.**
- Testes: 4 novos no Vitest para os horários (fuso, limites do delivery, salão na semana e no domingo, texto). Regras do Firestore seguem testadas no emulador pelo CI.
- Acessibilidade: o aviso de fechado usa `role="status"` com texto âmbar-escuro (`text-amber-900`) sobre âmbar-claro (`bg-amber-100`), contraste acima de 4,5:1.

**Definição de pronto.** `npm test`, `npm run test:rules` e `npm run build` passam no CI; `documentacao/MVP.md` com uma tabela só; README com o ciclo.

### Plano de ação

**Este ciclo executa.**
1. Horários num só lugar e delivery indisponível fora do horário, com testes (#14).
2. Ícones PNG de 192 e 512 px no PWA (#15).
3. `documentacao/MVP.md` com uma tabela só e histórico; README com o ciclo.

**Vira issue ou segue em issue.** #2, #11, #12 e #16 (responsável); #9 (depois da #2), #13 (precisa das regras publicadas pelo responsável), #18 (feriados) e #19 (envio por teclado) (agente).

**Verificação no navegador (09/11/2026).** Build de produção em `vite preview`, Playwright com relógio fixo: às 20h a opção "Delivery" fica desabilitada e o aviso "Delivery fechado agora. Horário: todos os dias das 11:00 às 15:00." aparece; às 12h a opção fica disponível e não há aviso. axe-core 4.14 (WCAG 2 A e AA) sem violações no diálogo nos dois casos.

**Revisão independente (09/11/2026).** Um subagente que não viu o código leu só o diff e esta seção. Corrigido: o teste do salão não conferia o fechamento das 17h30. Conferido sem mudança: os ícones existem em `public/` (o diff passado ao revisor não incluía os binários). Aceito: com o checkout aberto antes das 11h, a opção "Delivery" só libera ao reabrir o diálogo (o envio confere o horário de novo).

## Ciclo de 09/11/2026

> Branch `feature/2026-11-09` criada a partir de `developer/sprint-2026-11-12`; PR para a sprint. O PR da sprint para a `main` (#22) fica aberto para revisão do responsável. Nível: Vitrine (N2), 12 critérios. Escopo: só o que o código resolve. Pages e a Variable `PAGES_VIA_ACTIONS` não foram tocados (#2).

### Produto

**Problema e público.** Sem mudança. O que faltava do lado do código era provar que o pedido fecha sem mouse (critério 8, #19).

**O que a pesquisa trouxe.**

| Ideia | O que levamos para o projeto | Fonte |
|---|---|---|
| No diálogo modal, Tab e Shift+Tab circulam só dentro dele; ao fechar, o foco volta para quem o abriu ou, se ele não existir mais, para um ponto lógico do fluxo | Armadilha de foco no checkout; o foco volta ao "Avançar" ou, com o carrinho vazio (botão desativado), ao conteúdo; na confirmação, vai para o título | [W3C APG: dialog (modal) pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialogmodal/), [UXPin: restore focus after modal dialogs](https://www.uxpin.com/studio/blog/restore-focus-after-modal-dialogs/) |
| A espera para começar a baixar o recurso do LCP costuma ser a maior fase; imagem de outra origem paga uma conexão nova | Medido: o LCP é a 1ª imagem do carrossel (Unsplash), com mediana local de 2,49 s; trazer a imagem para o site vira a #23 | [web.dev: optimize LCP](https://web.dev/optimize-lcp/) |

**Backlog priorizado (impacto × esforço).**

| Prioridade | Item | Impacto | Esforço | Destino |
|---|---|---|---|---|
| 1 | Pedido só com teclado: armadilha e retorno de foco, com teste no CI | Médio | Médio | Este ciclo (#19) |
| 2 | Medição local do LCP no build atual | Médio | Baixo | Este ciclo (#9) |
| 3 | Primeira imagem do carrossel no próprio site, com preload | Médio | Baixo | Issue (#23) |
| 4 | Publicar a versão atual | Alto | Baixo | Responsável (#2) |

**Fora do escopo.** Feriados (#18), observação no painel (#13, precisa publicar regras).

### Engenharia

**Arquitetura.** `CheckoutModal.vue` trata `keydown.tab` no overlay: com o foco no último elemento focável (ou fora do diálogo), Tab volta ao primeiro; Shift+Tab no primeiro (ou no próprio diálogo) vai ao último. Ao abrir, guarda `document.activeElement`; ao fechar, devolve o foco a ele, se ainda existir e não estiver desativado, ou ao `#conteudo` (`tabindex="-1"`). Com `isSubmitted`, o foco vai para o título "Pedido enviado!" (`tabindex="-1"`). O teste `e2e/pedido-teclado.spec.ts` roda sobre `vite build` + `vite preview` em porta própria, com as variáveis `VITE_FIREBASE_*` vazias (nada é gravado), rede externa cortada e `window.open` trocado por um objeto que guarda a URL do WhatsApp.

**Riscos.**
- O build do teste não tem Firebase: o registro no Firestore não é exercitado no navegador (segue coberto pelos testes de regras no emulador).
- A mediana local de 2,49 s está no limite; a rede do Unsplash pode passar de 2,5 s (#23).

**Qualidade.**
- Testes: Vitest 11, regras do Firestore no emulador, Playwright 4 (2 testes × claro e escuro). Sem a correção do diálogo, o teste de teclado falha na armadilha de foco (conferido em 09/11/2026).
- Desempenho e acessibilidade: ver `MVP.md`.

**Definição de pronto.** `vue-tsc`, Vitest, Playwright e build passam; CI verde no PR para a sprint; `MVP.md`, plano e README atualizados; comentário no PR #22.

### Plano de ação

**Este ciclo executa.**
1. Armadilha e retorno de foco no checkout e foco na confirmação (#19).
2. Teste de ponta a ponta do pedido por teclado, com axe, no CI (#19).
3. Medição local do LCP no build atual (#9).

**Vira issue ou segue em issue.** #23 (imagem do carrossel no site); #2, #11, #12, #16 e #21 (responsável); #9, #13 e #18 seguem. #19 recebe a evidência por comentário e fecha depois do merge na `main`.
