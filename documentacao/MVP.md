# MVP — Sabor & Churrasco

> Fonte única do estado. Criado em 31/10/2026; revisto em 19/11/2026 (critério 9 para "Parcial" pelo alerta nº 1 do secret scanning, #40). Revisão anterior: 18/11/2026 (ciclo de 18/11, `feature/2026-11-18` → `developer/sprint-2026-11-19`, PR #39: critérios 6, 7 e 11 com evidência nova, sem mudar o resumo). Revisão anterior: 16/11/2026 (ciclo de 16/11, `feature/2026-11-16` → `developer/sprint-2026-11-19`; às 12:00, critério 9 com os alertas do Dependabot ligados, PR #36; às 15:06, critério 9 com a ADR-06). As tabelas anteriores estão em [Histórico](#histórico).

**Nível:** Vitrine (N2). Valem os 12 critérios.

**Resumo:** 7 de 12 aplicáveis atendidos

**Finalizado:** sim — faltam 3, 5, 7, 9 e 10, e todos dependem do responsável, com issue `depende-do-responsavel`: publicar a versão atual pelo Actions (#2: 3, 7 e 10), criar a conta do GoatCounter (#12: 5) e tratar o alerta nº 1 do secret scanning, "Google API Key", aberto desde 25/08/2026 (#40: 9). O responsável deixou a #40 para depois, em 19/11/2026.

**Conteúdo do restaurante:** ilustrativo até o responsável decidir se o cliente é real (#30). Endereço, horário, preços e telefone não foram criados nem mudados neste ciclo.

Neste ciclo (18/11): a 1ª imagem do carrossel, elemento do LCP, passou a vir do próprio site em WebP com preload (#23); a observação do pedido vai para o painel da equipe (#13), com regras novas que o responsável publica antes do merge na `main`; o painel ganhou teste no navegador com os emuladores de Auth e Firestore (#31).

Ciclo de 16/11: o teste "escuro" saiu (o app não tem tema escuro próprio) e deu lugar ao projeto desktop; o axe passou a cobrir o cardápio inteiro; o rodapé ganhou o aviso de coleta da medição (#12).

## Produto

- **Problema:** clientes precisam pedir pelo celular, e a equipe precisa acompanhar os pedidos sem erro de cálculo manual.
- **Público:** clientes do restaurante, que pedem pelo celular, e a equipe, que acompanha o painel. Se o cliente é real ou ilustrativo: a decidir (responsável, #30).
- **Hipótese:** acreditamos que o cardápio digital fará metade dos pedidos do delivery passar por ele em um mês, com menos pedidos corrigidos pela equipe. Saberemos quando o GoatCounter mostrar, no mês, eventos `enviar-pedido` em pelo menos metade do total de pedidos do delivery que a equipe registra.
- **Métrica:** eventos `enviar-pedido` no mês ÷ pedidos do delivery registrados pela equipe, medido por GoatCounter (falta a conta, #12) — meta: pelo menos 50% em um mês, decidida pelo coordenador em 10/11/2026 (D1), revisável pelo responsável (#16). Meta de pedidos corrigidos: a decidir (responsável).

## Problema e hipótese

**Problema e público:** Clientes do restaurante pedem pelo celular, e a equipe acompanha os pedidos em um painel, sem erro de cálculo manual.

**Hipótese:** Acreditamos que o cardápio digital fará metade dos pedidos do delivery passar por ele em um mês, com menos pedidos corrigidos pela equipe. Saberemos quando o GoatCounter (evento `enviar-pedido`) mostrar, no mês, pelo menos metade do total de pedidos do delivery que a equipe registra. Meta decidida pelo coordenador em 10/11/2026 (decisão D1), revisável pelo responsável (#16).

## 1. Critérios

| # | Critério | Situação em 16/11/2026 | Evidência ou o que falta | Issue |
|---|---|---|---|---|
| 1 | Problema e público claros | Atende | Frase acima | — |
| 2 | Hipótese a validar | Atende | Hipótese acima, com meta e "saberemos quando" (decisão D1 de 10/11/2026, revisável) | #16 |
| 3 | Fluxo principal completo | Parcial | No build atual, `E2E_PORT=4301 npx playwright test`, 16/11/2026: 10 de 10 (5 testes × celular Pixel 7 e desktop 1280 px), do cardápio a "Pedido enviado!" só com teclado; também no job `web` do CI. No ar, o build antigo: `curl -s https://douglasabnovato.github.io/restaurante-churrascaria/`, 16/11/2026: HTTP 200 com `<title>sabor-e-churrasco</title>` (o build atual tem `Sabor & Churrasco — cardápio e pedidos`) | #2 (responsável); pessoa de fora: #26 |
| 4 | Escopo enxuto | Atende | Seção "Fora do MVP" (pagamento online, integração com caixa); feriados em issue (#18) | — |
| 5 | Medição de uso | Parcial | Código pronto e aviso de coleta no rodapé (16/11/2026). GoatCounter sem cookie (`src/services/medicao.ts`), só no build de produção fora de localhost, com o evento `enviar-pedido`. `npx vitest run`, 16/11/2026: 16 de 16, incluindo o teste do aviso. Falta a conta e o painel com visitas | #12 (responsável) |
| 6 | Falhas tratadas | Atende | `E2E_PORT=4301 npx playwright test`, 16/11/2026, celular e desktop: o build roda sem Firebase, e o pedido segue pelo WhatsApp com código provisório (falha do registro tratada); "mesa vazia mostra o erro sem fechar o diálogo"; "às 20h o delivery fica fechado, com aviso lido por leitor de tela"; carrinho vazio deixa o "Avançar" desativado; espera: com o módulo de registro atrasado, o botão mostra "Enviando…" e fica desativado até a confirmação. `npx vitest run`, 16/11/2026: código provisório e horários em `tests/unit/`. O critério vale para o fluxo principal (pedido). Painel da equipe, `npm run test:e2e:painel` no CI ([run 44427780742](https://github.com/douglasabnovato/restaurante-churrascaria/actions/runs/44427780742) do PR #39, 18/11/2026): 2 de 2, com os emuladores; lista vazia ("Nenhum pedido registrado") e senha errada ("E-mail ou senha inválidos.") | — |
| 7 | Desempenho aceitável | Parcial | Só medição local. Lighthouse 12.8.2 móvel, 18/11/2026, builds servidos com gzip, séries alternadas: antes do PR #39, 2,50 / 2,49 / 2,46 s (mediana 2,49 s); depois, 2,16 / 2,14 / 1,66 s (mediana 2,14 s), TBT de 90 a 158 ms; elemento do LCP: a 1ª imagem do carrossel, agora `carrossel-1.webp` do próprio site, com atraso de carga 0 ms (#23). No ar está o build antigo (6,04 s em 02/11/2026). Medir no site depende da publicação | #2, #9 |
| 8 | Acessibilidade básica | Atende | `E2E_PORT=4301 npx playwright test`, 16/11/2026: 10 de 10, no celular (Pixel 7) e no desktop (1280 px). Pedido só com Tab, Enter e setas; foco preso no diálogo; Esc devolve o foco; axe (WCAG 2.1 A e AA) sem violação séria ou crítica no cardápio inteiro, com os dados reais de `src/data/menu.ts`, no checkout e na confirmação. No CI, [run 43823325623](https://github.com/douglasabnovato/restaurante-churrascaria/actions/runs/43823325623) do PR #33, 16/11/2026: Playwright 10 passed. O app não tem tema escuro próprio, então não há teste no escuro | — |
| 9 | Segurança e conformidade | Parcial | `gh api repos/douglasabnovato/restaurante-churrascaria/secret-scanning/alerts/1`, 19/11/2026: aberto, tipo "Google API Key", desde 25/08/2026; tratar é do responsável (#40). Dependabot: `gh api "repos/douglasabnovato/restaurante-churrascaria/dependabot/alerts?state=open&per_page=100"`, 16/11/2026, 15:06: 15 abertos, 0 sem decisão. 11 corrigidos na sprint-19 (PR #36; fecham no merge na principal): `fast-uri` 3.1.9 (#1, #2, #14 a #17), `serialize-javascript` 7.1.4 (#18), `@vitest/mocker` 5.1.0 (#12, #13), `brace-expansion` 2.1.8 e 5.0.13 (#7, #8), conferidos com `npm ls` na sprint. 4 na [ADR-06](adr/0006-aceitar-alertas-de-desenvolvimento.md): `@grpc/grpc-js` 1.9.16 (#10, #11), `minimatch` 10.2.6 (#21) e `deepmerge` 4.3.1 (#19). `npm run build`, 16/11/2026, e `grep -rlF` por `grpc-js`, `http2`, `GRPC_TRACE` e `grpc.max_receive_message_length` em `dist/` e `docs/`: 0 arquivos; o Firestore no navegador usa WebChannel. `minimatch` e `deepmerge` vêm do `workbox-build` (só no build; `npm ls --omit=dev`: `(empty)`). `npm audit --omit=dev`, 16/11/2026: 4 altas, todas no `@grpc/grpc-js` dentro do `@firebase/firestore`, cobertas pela ADR-06. Regras do Firestore publicadas em 01/11/2026; medição sem cookie, com aviso | #40, [ADR-06](adr/0006-aceitar-alertas-de-desenvolvimento.md) |
| 10 | Entrega confiável | Parcial | `gh api repos/douglasabnovato/restaurante-churrascaria/rulesets/26932556`, 16/11/2026: ruleset `principal-protegida` ativo, com PR obrigatório, sem force push nem exclusão e check `web` exigido. Falta: o site no ar sai da pasta `docs/` (`gh api .../pages`, 16/11/2026: fonte `main:/docs`), sem passar pelo CI | #2 (responsável) |
| 11 | Testes dos fluxos críticos | Atende | No job `web` do CI, [run 44427780742](https://github.com/douglasabnovato/restaurante-churrascaria/actions/runs/44427780742) do PR #39, 18/11/2026, sem `skip`: `npm test` (Vitest, 16 testes: pedido, horários e medição), `npm run test:rules` (6 testes das regras no emulador, com a observação), `npm run test:e2e` (10 execuções: 5 testes × 2 projetos) e `npm run test:e2e:painel` (2 testes do painel com os emuladores de Auth e Firestore), todos aprovados. Local, 18/11/2026: Vitest 16 de 16 e Playwright 10 de 10 | — |
| 12 | Documentação honesta | Atende | README diz que o site no ar é o build antigo e aponta o `documentacao/DEPLOY.md` com o estado de 16/11/2026 | — |

**Atendidos:** 1, 2, 4, 6, 8, 9, 11 e 12. **Parciais:** 3, 5, 7 e 10.

## 2. Tarefas

| # | Tarefa | Situação |
|---|---|---|
| 1 | Publicar as regras do Firestore com `npm run deploy:rules` | Feito em 01/11/2026 |
| 2 | Configurar as Variables e a fonte do Pages | Com o responsável (#2) |
| 3 | Delivery indisponível fora do horário | Feito no ciclo de 07/11/2026 (#14) |
| 4 | Ícones PNG de 192 e 512 px no PWA | Feito no ciclo de 07/11/2026 (#15) |
| 5 | Observação do pedido no painel | Na sprint pelo PR #39 (#13); o responsável publica as regras (`npm run deploy:rules`) antes do merge na `main` |
| 6 | Feriados e fechamento manual do delivery | Não planejada em 18/11/2026: depende da #30 (#18) |
| 7 | Envio do pedido só com teclado | Feito no ciclo de 09/11/2026 (#19) |
| 8 | Avaliar o Firebase 13 pelos alertas restantes | Acompanhado pelos alertas #10 e #11 do Dependabot e pela ADR-06 (#27 fechada em 18/11/2026) |
| 9 | Primeira imagem do carrossel pelo próprio site | Na sprint pelo PR #39 (#23) |
| 10 | Medição sem cookie (GoatCounter) e Analytics do Firebase desligado | Feito em 10/11/2026 |
| 11 | Aviso de coleta no rodapé; axe no cardápio inteiro, no celular e no desktop | Feito em 16/11/2026 |
| 12 | Ligar os alertas do Dependabot | Com o responsável (#29) |
| 13 | Decidir se o cliente é real ou ilustrativo | Com o responsável (#30) |
| 14 | Painel da equipe testado no navegador | Na sprint pelo PR #39 (#31) |

## 3. Fora do MVP

Pagamento online, integração com caixa e novos recursos antes de publicar a versão atual. A lista é uma proposta e pode mudar com a decisão do responsável.

## Histórico

- 20/11/2026: bloco Produto padronizado, sem mudar critérios.

### Revisão de 19/11/2026 (secret scanning)

O alerta nº 1 do secret scanning ("Google API Key", aberto desde 25/08/2026) não tinha decisão. O 9 volta a "Parcial", com a #40 do responsável. **Resumo:** 8 → 7 de 12. **Finalizado:** segue sim, porque tudo o que falta depende do responsável.

### Revisão de 16/11/2026, 15:06 (ADR dos alertas)

Ordem do responsável ("Regra geral por ADR"): os 4 alertas que restavam ficam aceitos na ADR-06, porque não chegam ao navegador (0 ocorrências no `dist/`). O 9 vai para "Atende". **Resumo:** 7 → 8 de 12. **Finalizado:** não → sim.

### Revisão de 16/11/2026, 12:00 (alertas do Dependabot)

Só o critério 9 mudou de motivo: antes, Parcial com os alertas desligados (403, #29 do responsável); agora, Parcial com 4 alertas sem correção nem decisão (#35) e 11 corrigidos só na sprint (PR #36). **Resumo:** segue 7 de 12. **Finalizado:** sim → não.

### Estado de 10/11/2026 (ciclo da faixa de 90%)

**Resumo:** 7 de 12 aplicáveis atendidos (1, 2, 4, 6, 8, 11 e 12). **Finalizado:** sim. Diferenças para a tabela atual: o critério 8 citava "claro e escuro", mas o app não tem tema escuro, e o projeto escuro repetia o claro; o 9 não citava o Dependabot desligado; o 10 citava o ruleset sem o check `web`.

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
