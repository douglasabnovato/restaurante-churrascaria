# MVP — Sabor & Churrasco

> Criado em 31/10/2026, com os critérios usados no `movies`. Situação baseada em `AVALIACAO.md` e na conferência deste ciclo.

## Problema e hipótese

**Problema e público:** Clientes do restaurante pedem pelo celular, e a equipe acompanha os pedidos em um painel, sem erro de cálculo manual.

**Hipótese:** Metade dos pedidos do delivery passa pelo cardápio digital em um mês, com menos pedidos corrigidos pela equipe. Proposta inicial, para o responsável confirmar ou trocar. Sem medição, a meta ainda não pode ser conferida.

## 1. Critérios

| # | Critério | Como verificar | Situação em 31/10/2026 |
|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende |
| 2 | Hipótese a validar | Existe uma aposta escrita, com meta | Parcial: meta proposta |
| 3 | Fluxo principal completo | Uma pessoa conclui sem ajuda | Não confirmado: o site publicado é anterior à versão atual |
| 4 | Escopo enxuto | O que não entra está registrado | Parcial: PWA e painel entram; integração com caixa fica de fora |
| 5 | Medição de uso | A métrica principal é coletada | Não atende: nada coleta uso |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta clara | Não revisto neste ciclo |
| 7 | Desempenho aceitável | LCP de até 2,5 s no celular | Não medido neste ciclo |
| 8 | Acessibilidade básica | Lighthouse e teclado | Não medido neste ciclo |
| 9 | Segurança e conformidade | Riscos decididos; termos de terceiros cumpridos | **Não atende: o site publicado mostra o Dashboard sem login** (#2) |
| 10 | Entrega confiável | Publicação só depois de CI verde | Não atende até os PRs #1 e #3 e a configuração do Pages |
| 11 | Testes dos fluxos críticos | Testes automatizados no CI | Parcial: 4 testes unitários e testes de regras no CI do PR #1 |
| 12 | Documentação honesta | Qualquer pessoa roda o projeto, e os números estão certos | Parcial: README descreve o painel protegido, que ainda não está no ar |

**Resultado:** 1 de 12 critérios atendidos por inteiro. É um julgamento técnico.

## 2. Tarefas

| # | Tarefa | Situação |
|---|---|---|
| 1 | Publicar as regras do Firestore com `npm run deploy:rules` | **Primeiro**, com o responsável (#2) |
| 2 | Configurar as Variables e a fonte do Pages | Com o responsável (#2) |
| 3 | Mesclar o PR #1 e conferir o site | Depois das regras |
| 4 | Avaliar o Firebase 13 pelos 4 alertas restantes | Próximo ciclo |

## 3. Fora do MVP

Pagamento online, integração com caixa e novos recursos antes de resolver a exposição. A lista é uma proposta e pode mudar com a decisão do responsável.
