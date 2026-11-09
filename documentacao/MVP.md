# MVP — Sabor & Churrasco

> Fonte única do estado. Criado em 31/10/2026; revisto em 09/11/2026 (ciclos de 07/11 e de 09/11/2026, plano em [`PLANO-DE-ACAO.md`](PLANO-DE-ACAO.md)). As tabelas anteriores estão em [Histórico](#histórico).

**Nível:** Vitrine (N2). Valem os 12 critérios.

**Resumo:** 6 de 12 aplicáveis atendidos

**Finalizado:** sim

Tudo o que o código resolve está feito: no ciclo de 09/11/2026 o pedido passou a ser concluído só com teclado, com teste no CI (critério 8), e o LCP local ficou em 2,49 s (critério 7, que só vira "Atende" com a medição no ar). O que falta depende do responsável, cada item com issue `depende-do-responsavel`: publicar a versão atual (#2, que destrava os critérios 3, 7 e 9), proteger a `main` (#11), medir o uso (#12), confirmar a meta (#16) e mesclar a sprint na `main` (#21, PR #22).

## Problema e hipótese

**Problema e público:** Clientes do restaurante pedem pelo celular, e a equipe acompanha os pedidos em um painel, sem erro de cálculo manual.

**Hipótese:** Metade dos pedidos do delivery passa pelo cardápio digital em um mês, com menos pedidos corrigidos pela equipe. Proposta inicial, para o responsável confirmar ou trocar (#16). Sem medição, a meta ainda não pode ser conferida.

## 1. Critérios

| # | Critério | Como verificar | Situação em 09/11/2026 (ciclo de 09/11) |
|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende |
| 2 | Hipótese a validar | Existe uma aposta escrita, com meta | Parcial: meta proposta; confirmar é do responsável (#16) |
| 3 | Fluxo principal completo | Uma pessoa conclui sem ajuda | Parcial: no build atual, adicionar item e abrir o checkout foram percorridos no navegador (Playwright, 09/11/2026); o site publicado ainda é o build antigo (`curl` em 09/11/2026: HTTP 200 com o título `sabor-e-churrasco` do build anterior) (#2) |
| 4 | Escopo enxuto | O que não entra está registrado | Atende: o que fica de fora está na seção "Fora do MVP" (pagamento online, integração com caixa) e no plano; feriados viraram issue (#18). O responsável pode mudar a lista |
| 5 | Medição de uso | A métrica principal é coletada | Não atende: a métrica do pedido não é coletada (#12) |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta clara | Atende: painel com carregamento, vazio, erro e permissão; pedido com validação e falha tratada; delivery fora do horário avisa e fica indisponível (Playwright com relógio fixo às 20h e às 12h, 09/11/2026) |
| 7 | Desempenho aceitável | LCP de até 2,5 s no celular | Parcial: no build atual, Lighthouse 12.8.2 móvel local em 09/11/2026 (`vite preview`, `timeout 150`): 2,56 s (TBT 870 ms), 2,44 s (100 ms) e 2,49 s (10.028 ms, CPU disputada), mediana 2,49 s; elemento do LCP: a 1ª imagem do carrossel (Unsplash). No ar, 6,04 s na versão antiga (02/11/2026); medir no ar depende da publicação (#2, #9). Folga pequena: #23 |
| 8 | Acessibilidade básica | Lighthouse e teclado | Atende no build atual: acessibilidade 1,00 nas 3 execuções do Lighthouse de 09/11/2026. `npm run test:e2e` (Playwright 1.64.1 e axe-core 4.14, celular, modos claro e escuro, sem Firebase e com o WhatsApp simulado) adiciona um item, abre o checkout, escolhe mesa e envia só com Tab, Enter e setas; o foco fica preso no diálogo, volta ao "Avançar" com Esc e vai para "Pedido enviado!" no fim; axe sem violação séria ou crítica no checkout e na confirmação; 4 de 4 passaram em 09/11/2026 (#19). O site publicado (build antigo) tinha 91, por contraste, e muda com a publicação (#2) |
| 9 | Segurança e conformidade | Riscos decididos; termos de terceiros cumpridos | Parcial: regras publicadas em 01/11/2026 e leitura sem login recusada (403); o site publicado ainda mostra o Dashboard antigo (#2) |
| 10 | Entrega confiável | Publicação só depois de CI verde | Parcial: CI na `main` e nos PRs; a `main` não está protegida (#11) e a publicação pelo Actions espera a troca do Pages (#2) |
| 11 | Testes dos fluxos críticos | Testes automatizados no CI | Atende: `npx vitest run` com 11 testes (pedido e horários), testes das regras do Firestore no emulador e `npm run test:e2e` com 2 testes em 2 modos (pedido por teclado e mesa vazia), em 09/11/2026 |
| 12 | Documentação honesta | Qualquer pessoa roda o projeto, e os números estão certos | Atende: README diz que o site no ar é o build antigo e aponta para `src/domain/hours.ts` |

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
| 8 | Avaliar o Firebase 13 pelos alertas restantes | Próximo ciclo |

## 3. Fora do MVP

Pagamento online, integração com caixa e novos recursos antes de resolver a exposição. A lista é uma proposta e pode mudar com a decisão do responsável.

## Histórico

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
