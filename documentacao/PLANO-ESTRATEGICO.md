# Plano estratégico — Sabor & Churrasco (restaurante-churrascaria)

> Criado em 30/10/2026. Diagnóstico em `AVALIACAO.md`.

## Objetivo

Primeiro, proteger os dados em produção. Depois, chegar ao nível N2 (vitrine).

## Execução

| Etapa | Entrega | Situação |
|---|---|---|
| 1 | Publicar as regras do Firestore | Com o responsável |
| 2 | CI ativo, `.env` fora do Git e dependências atualizadas | PR aberto |
| 3 | Publicar a versão atual por Actions | Depois das Variables e da troca da fonte do Pages |
| 4 | Remover `docs/` do Git | Depois da etapa 3 |
| 5 | Avaliar o Firebase 13 | Próximo ciclo |

## O que você pode melhorar

- **Arquitetura:** gravar o contador de pedidos por uma função no servidor, porque hoje qualquer cliente pode incrementá-lo.
- **Engenharia:** proteger a `main` e publicar só por CI, para o site não voltar a ficar atrás do código.
- **Produto:** avisar sobre a coleta de dados e o Google Analytics, já que o sistema trata endereços de clientes.
