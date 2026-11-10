# MVP — Sabor & Churrasco

> Fonte única do estado. Criado em 31/10/2026; revisto em 10/11/2026 (ciclo da faixa de 90%, decisões D1 a D7 em `engenharia/decisoes/2026-11-10-ciclo-faixa-90.md`). As tabelas anteriores estão em [Histórico](#histórico).

**Nível:** Vitrine (N2). Valem os 12 critérios.

**Resumo:** 7 de 12 aplicáveis atendidos

**Finalizado:** sim — faltam 3, 5, 7, 9 e 10, que dependem do responsável: publicar a versão atual e trocar a fonte do Pages (#2), criar a conta do GoatCounter (#12) e mesclar a sprint (#21)

Tudo o que o código resolve está feito. Neste ciclo entrou a medição sem cookie (GoatCounter) com o evento `enviar-pedido`, e o Analytics do Firebase deixou de ser ligado (usava cookies sem aviso). A publicação pelo Actions já existe no CI, travada por `PAGES_VIA_ACTIONS`; o site no ar segue o build antigo da pasta `docs/` até a troca da fonte (#2).

## Problema e hipótese

**Problema e público:** Clientes do restaurante pedem pelo celular, e a equipe acompanha os pedidos em um painel, sem erro de cálculo manual.

**Hipótese (meta do ciclo, texto da proposta mantido):** Metade dos pedidos do delivery passa pelo cardápio digital em um mês, com menos pedidos corrigidos pela equipe. Meta decidida pelo coordenador em 10/11/2026 (decisão D1), revisável pelo responsável (#16). Saberemos pelo GoatCounter (evento `enviar-pedido`) comparado com o total de pedidos do delivery que a equipe registra.

## 1. Critérios

| # | Critério | Situação em 10/11/2026 | Evidência ou o que falta | Issue |
|---|---|---|---|---|
| 1 | Problema e público claros | Atende | Frase acima | — |
| 2 | Hipótese a validar | Atende | Meta decidida pelo coordenador em 10/11/2026 (decisão D1), revisável pelo responsável: a hipótese acima | #16 |
| 3 | Fluxo principal completo | Parcial | No build atual, `npx playwright test` (claro e escuro, Pixel 7), 10/11/2026: 4 de 4, do cardápio a "Pedido enviado!" só com teclado (também no CI, job `web`). No ar, o build antigo: `curl https://douglasabnovato.github.io/restaurante-churrascaria/`, 10/11/2026: `<title>sabor-e-churrasco</title>`, e o build atual tem `Sabor & Churrasco — cardápio e pedidos` | #2 (responsável); validação com pessoa de fora: #26 |
| 4 | Escopo enxuto | Atende | Seção "Fora do MVP" (pagamento online, integração com caixa); feriados viraram issue (#18) | — |
| 5 | Medição de uso | Parcial | Código pronto; falta a conta (decisão D5). GoatCounter sem cookie (`src/services/medicao.ts`), só no build de produção fora de localhost, com o evento `enviar-pedido` (sem endereço, telefone nem itens). `npx vitest run`, 10/11/2026: 15 de 15, incluindo `tests/unit/medicao.test.ts`; o Playwright confere que o script não carrega em localhost | #12 (responsável) |
| 6 | Falhas tratadas | Atende | Painel com carregamento, vazio, erro e permissão; pedido com validação e falha tratada; delivery fora do horário avisa e fica indisponível (Playwright com relógio fixo, 09/11/2026) | — |
| 7 | Desempenho aceitável | Parcial | No build atual, Lighthouse 12.8.2 móvel local em 09/11/2026: 2,56 / 2,44 / 2,49 s, mediana 2,49 s; elemento do LCP: a 1ª imagem do carrossel. No ar, 6,04 s na versão antiga (02/11/2026). Medir no site depende da publicação (D6) | #2, #9, #23 |
| 8 | Acessibilidade básica | Atende | `npx playwright test`, 10/11/2026: 4 de 4 (claro e escuro), pedido só com Tab, Enter e setas, foco preso no diálogo, Esc devolve o foco; axe sem violação séria ou crítica no checkout e na confirmação. Lighthouse local: acessibilidade 1,00 (09/11/2026) | — |
| 9 | Segurança e conformidade | Parcial | Regras do Firestore publicadas em 01/11/2026 (leitura sem login recusada); sem cookie de medição. Falta: o site publicado ainda mostra o Dashboard antigo (#2). `npm audit --omit=dev`, 10/11/2026: 4 altas no `@grpc/grpc-js` 1.9.16 dentro do `@firebase/firestore`, sem correção no pacote; uso no navegador a conferir (#27) | #2 (responsável), #27 |
| 10 | Entrega confiável | Parcial | `gh api repos/douglasabnovato/restaurante-churrascaria/rules/branches/main`, 10/11/2026: `required_status_checks` (`web`), PR obrigatório, sem force push nem exclusão. O CI publica o `dist/` pelo Actions quando `PAGES_VIA_ACTIONS=true`. Falta: o site ainda sai da pasta `docs/`, sem passar pelo CI | #2 (responsável) |
| 11 | Testes dos fluxos críticos | Atende | `npx vitest run` (15 testes: pedido, horários e medição), regras do Firestore no emulador e `npm run test:e2e` (4 de 4), no CI, sem `skip` | — |
| 12 | Documentação honesta | Atende | README diz que o site no ar é o build antigo e como trocar a fonte do Pages | — |

**Atendidos:** 1, 2, 4, 6, 8, 11 e 12. **Parciais:** 3, 5, 7, 9 e 10.

## 2. Tarefas

| # | Tarefa | Situação |
|---|---|---|
| 1 | Publicar as regras do Firestore com `npm run deploy:rules` | Feito em 01/11/2026 |
| 2 | Configurar as Variables e a fonte do Pages | Com o responsável (#2) |
| 3 | Delivery indisponível fora do horário | Feito no ciclo de 07/11/2026 (#14) |
| 4 | Ícones PNG de 192 e 512 px no PWA | Feito no ciclo de 07/11/2026 (#15) |
| 5 | Observação do pedido no painel | Issue #13 (precisa das regras publicadas pelo responsável) |
| 6 | Feriados e fechamento manual do delivery | Issue #18 |
| 7 | Envio do pedido só com teclado | Feito no ciclo de 09/11/2026 (#19) |
| 9 | Primeira imagem do carrossel pelo próprio site | Issue #23 |
| 8 | Avaliar o Firebase 13 pelos alertas restantes | Próximo ciclo (#27) |
| 10 | Medição sem cookie (GoatCounter) e Analytics do Firebase desligado | Feito em 10/11/2026 |

## 3. Fora do MVP

Pagamento online, integração com caixa e novos recursos antes de resolver a exposição. A lista é uma proposta e pode mudar com a decisão do responsável.

## Histórico

### Estado de 10/11/2026, antes do ciclo da faixa de 90%

**Resumo:** 6 de 12 aplicáveis atendidos (1, 4, 6, 8, 11 e 12). **Finalizado:** sim. Diferenças para a tabela atual: o 2 estava "Parcial" (meta sem decisão) e o 5 "Não atende" (a métrica do pedido não era coletada).

### Tabela de 09/11/2026 (ciclo de 07/11/2026)

Resumo daquela tabela: 4 de 12 aplicáveis atendidos; Finalizado: não.

| # | Critério | Como verificar | Situação em 09/11/2026 |
|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende |
| 2 | Hipótese a validar | Existe uma aposta escrita, com meta | Parcial: meta proposta; confirmar é do responsável (#16) |
| 3 | Fluxo principal completo | Uma pessoa conclui sem ajuda | Parcial: no build atual, adicionar item e abrir o checkout foram percorridos no navegador (Playwright, 09/11/2026); o site publicado ainda é o build antigo (`curl` em 09/11/2026: HTTP 200 com o título `sabor-e-churrasco` do build anterior) (#2) |
| 4 | Escopo enxuto | O que não entra está registrado | Parcial: PWA e painel entram; integração com caixa e feriados ficam de fora; a lista é proposta para o responsável |
| 5 | Medição de uso | A métrica principal é coletada | Não atende: a métrica do pedido não é coletada (#12) |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta clara | Atende: painel com carregamento, vazio, erro e permissão; pedido com validação e falha tratada; delivery fora do horário avisa e fica indisponível (Playwright com relógio fixo às 20h e às 12h, 09/11/2026) |
| 7 | Desempenho aceitável | LCP de até 2,5 s no celular | Não atende: 6,04 s no site publicado (versão antiga, 02/11/2026) e mediana de 2,53 s no build do PR #1 em teste local. Medir no ar depende da publicação (#2, #9) |
| 8 | Acessibilidade básica | Lighthouse e teclado | Parcial: build atual com Lighthouse 100 e axe sem violações no cardápio e no modal; em 09/11/2026, axe 4.14 sem violações no checkout aberto e fechado para delivery; o site publicado tem 91, por contraste; envio do pedido por teclado não testado |
| 9 | Segurança e conformidade | Riscos decididos; termos de terceiros cumpridos | Parcial: regras publicadas em 01/11/2026 e leitura sem login recusada (403); o site publicado ainda mostra o Dashboard antigo (#2) |
| 10 | Entrega confiável | Publicação só depois de CI verde | Parcial: CI na `main` e nos PRs; a `main` não está protegida (#11) e a publicação pelo Actions espera a troca do Pages (#2) |
| 11 | Testes dos fluxos críticos | Testes automatizados no CI | Atende: `npx vitest run` com 11 testes (pedido e horários) e testes das regras do Firestore no emulador, em 09/11/2026 |
| 12 | Documentação honesta | Qualquer pessoa roda o projeto, e os números estão certos | Atende: README diz que o site no ar é o build antigo e aponta para `src/domain/hours.ts` |

### Tabela de 06/11/2026 (ciclo de 03/11/2026)

| # | Critério | Como verificar | Situação em 06/11/2026 |
|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende |
| 2 | Hipótese a validar | Existe uma aposta escrita, com meta | Parcial: meta proposta |
| 3 | Fluxo principal completo | Uma pessoa conclui sem ajuda | Não confirmado: o site publicado é anterior à versão atual |
| 4 | Escopo enxuto | O que não entra está registrado | Parcial: PWA e painel entram; integração com caixa fica de fora |
| 5 | Medição de uso | A métrica principal é coletada | Não atende: a métrica do pedido não é coletada; o Analytics do Firebase liga sem aviso quando há ID de medição (#12) |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta clara | Atende no código: painel com carregamento, vazio, erro e permissão; pedido com validação e falha tratada |
| 7 | Desempenho aceitável | LCP de até 2,5 s no celular | Não atende: 6,04 s no site publicado (versão antiga) e 4,22 s no build atual, em teste local |
| 8 | Acessibilidade básica | Lighthouse e teclado | Parcial: build atual com Lighthouse 100, axe sem violações no cardápio e no modal, item adicionado por teclado; o site publicado tem 91, por contraste; envio por teclado não testado |
| 9 | Segurança e conformidade | Riscos decididos; termos de terceiros cumpridos | Parcial: regras publicadas em 01/11/2026 e leitura sem login recusada (403); o site publicado ainda mostra o Dashboard antigo (#2) |
| 10 | Entrega confiável | Publicação só depois de CI verde | Parcial: CI na `main` e nos PRs desde o PR #10; a `main` não está protegida (#11) e a publicação pelo Actions espera a troca do Pages (#2) |
| 11 | Testes dos fluxos críticos | Testes automatizados no CI | Atende: 7 testes unitários do pedido e testes das regras do Firestore no emulador, no CI da `main` (PR #10) |
| 12 | Documentação honesta | Qualquer pessoa roda o projeto, e os números estão certos | Atende: o README diz que o site no ar é o build antigo e traz o estado do ciclo (PR #10) |

**Resultado:** 4 de 12 critérios atendidos por inteiro (1, 6, 11 e 12), 5 parciais, 1 não confirmado (3) e 2 não atendidos (5 e 7). Antes deste ciclo, a tabela tinha 2 (o resumo dizia 1). É um julgamento técnico.

**Finalizado: não.** Falta, do lado do código, o LCP no site publicado (#9). Dependem do responsável, cada um com issue `depende-do-responsavel`: mesclar o ciclo de 07/11 (#21, o merge do agente foi negado pela permissão), publicar a versão atual (#2), proteger a `main` (#11), medir o uso (#12) e confirmar a meta (#16).

### Medições de 02/11/2026

Site publicado: LCP de 6,04 s, acessibilidade 91. Build atual, local: LCP de 4,22 s (4,22, 2,72 e 4,29 s), acessibilidade 100. Lighthouse 12.8.2 local, perfil móvel simulado, sem aparelho real.
