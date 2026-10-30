# Avaliação — Sabor & Churrasco (restaurante-churrascaria)

> Data: 30/10/2026 · Base: `main` em `6bd2cf4` · Complementa `ANALISE.md`.

## Evidências

| Item | Resultado |
|---|---|
| Testes unitários, `vue-tsc` e build | Passam (4 testes) |
| Testes das regras do Firestore | Rodam só com Java e emulador; ver o resultado no CI do PR |
| CI | Não rodava: o arquivo estava em `ci/` |
| Site publicado | Build de 25/08/2026, enquanto o código é de 28/09/2026; a aba Dashboard aparece sem login |
| GitHub Pages | Publica `main:/docs`; o workflow foi feito para publicar por Actions |
| Dependências de produção | 9 alertas altos, 5 corrigidos no PR; restam 4 ligados ao `@grpc/grpc-js`, dentro do Firebase |

**Não testado:** Dashboard, dados no Firestore e regras publicadas, para não acessar dados pessoais; envio de pedidos.

## Achados

| # | Severidade | Achado | Encaminhamento |
|---|---|---|---|
| A1 | Crítica | O site publicado é anterior à proteção do painel | Issue com a ordem de publicação |
| A2 | Alta | CI inativo: o site ficou preso a um build antigo sem aviso | PR do CI |
| A3 | Média | `.env` versionado, com a configuração web do Firebase | Sai do Git no PR do CI; continua no histórico, e a proteção vem das regras |
| A4 | Média | Alertas restantes do Firebase | Avaliar o Firebase 13, que é uma versão maior |

## Nota

Nota anterior do portfólio: 6,2. **Nota atual: 6,0 até A1 ser resolvido**, porque a falha está em produção. É um julgamento técnico.
