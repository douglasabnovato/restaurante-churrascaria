# ADR-06: Aceitar os alertas de desenvolvimento do Dependabot

- **Status:** Aceita
- **Data:** 16/11/2026
- **Origem:** ordem do responsável repassada pelo DG líder em 16/11/2026:

> "Regra geral por ADR. alertas que nao atrapalham a producao, pode passar. os que atrapalham, entender, escolher a melhor estrategia para manter a funcionalidade"

## Contexto

Em 16/11/2026, 15h06, `gh api "repos/douglasabnovato/restaurante-churrascaria/dependabot/alerts?state=open&per_page=100"` deu 15 alertas abertos. Onze já estão corrigidos no `package-lock.json` da `developer/sprint-2026-11-19` (PR #36) e fecham com o merge na `main`: `fast-uri` 3.1.9 (#1, #2, #14 a #17), `serialize-javascript` 7.1.4 (#18), `@vitest/mocker` 5.1.0 (#12, #13) e `brace-expansion` 2.1.8 e 5.0.13 (#7, #8). Esta ADR trata dos 4 que restam.

O site é estático: o GitHub Pages serve o resultado do `vite build` (`dist/` pelo Actions; hoje ainda o build antigo em `docs/`). Só o que está nesses arquivos roda na produção. O Firestore é usado pelo SDK web do Firebase, no navegador.

Provas, de 16/11/2026, na `developer/sprint-2026-11-19`, depois de `npm ci` e `npm run build`:
- `npm ls @grpc/grpc-js`: `firebase` 12.19.0 → `@firebase/firestore` 4.17.2 → `@grpc/grpc-js` 1.9.16. O `@firebase/firestore` declara uma entrada própria para navegador (`"browser": "dist/index.esm.js"`), que fala com o servidor por WebChannel (HTTP), não por gRPC. O `@grpc/grpc-js` só é carregado na entrada de Node, usada pelos testes de regras no emulador (`npm run test:rules`).
- Busca no site gerado: `grep -rlF` por `@grpc/grpc-js`, `grpc-js`, `http2`, `GRPC_TRACE`, `GRPC_VERBOSITY` e `grpc.max_receive_message_length` acha **0 arquivos** em `dist/` e em `docs/`. As três últimas cadeias existem no próprio pacote (`node_modules/@grpc/grpc-js/build`), então a busca acharia o código se ele fosse empacotado. Já `webchannel` aparece no `dist/assets/firebase-*.js`: é o transporte que o navegador usa.
- `npm ls deepmerge` e `npm ls minimatch`: `vite-plugin-pwa` 1.3.0 → `workbox-build` 7.4.1 → `@rollup/plugin-node-resolve` (`deepmerge` 4.3.1) e `glob` 11 (`minimatch` 10.2.6). O `workbox-build` só roda no `vite build`, para gerar o `sw.js`; `npm ls deepmerge --omit=dev` e `npm ls minimatch --omit=dev` devolvem `(empty)`.
- `npm audit --omit=dev` acusa 4 altas no `@grpc/grpc-js`, porque o npm olha a árvore de pacotes e não o que o Vite empacota. A busca no `dist/` acima mostra que esse código não chega ao navegador.

## Decisão

Aceitar os alertas abaixo, porque não chegam à produção.

| Alerta | Pacote | Severidade | Quem o puxa | Por que não chega à produção |
|---|---|---|---|---|
| #11 | @grpc/grpc-js 1.9.16 (GHSA-m9gg-hp2v-232j) | alta | `firebase` → `@firebase/firestore` 4.17.2 (pino `~1.9.0`) | Só a entrada de Node do Firestore usa gRPC (testes no emulador); o navegador usa WebChannel. 0 ocorrências no `dist/` e no `docs/` |
| #10 | @grpc/grpc-js 1.9.16 (GHSA-f596-whhp-79r4) | baixa | idem | idem |
| #21 | minimatch 10.2.6 (GHSA-g3hv-75wg-m249) | média | `vite-plugin-pwa` → `workbox-build` → `glob` 11 | Ferramenta de build do service worker; só roda no `vite build` |
| #19 | deepmerge 4.3.1 (GHSA-gcqx-w48m-w2h4) | baixa | `vite-plugin-pwa` → `workbox-build` → `@rollup/plugin-node-resolve` | Ferramenta de build; sem versão corrigida publicada |

O `@grpc/grpc-js` aparece com escopo "runtime" no Dependabot porque o `firebase` está em `dependencies`. Mesmo assim, o código dele não entra no bundle do navegador, que é a produção deste site. Forçar a 1.13.6 por `overrides` mudaria o pino do Firestore sem ganho para o site.

Os alertas não são dispensados nem fechados pela API. Esta ADR só registra a decisão.

## Consequências

- O risco fica no ambiente de quem desenvolve e no CI (o emulador do Firestore e o build do PWA), não no site.
- O `npm audit --omit=dev` segue acusando o `@grpc/grpc-js` até o Firebase subir o pino; a leitura certa dele é esta ADR.
- O acompanhamento do pino do Firebase segue na #27, e o `vite-plugin-pwa` 2 na #32.

## Quando revisar

- Se o site passar a ter código de servidor em Node com o Firebase (por exemplo, Cloud Functions ou SSR), onde o `@grpc/grpc-js` rodaria em produção.
- Se uma busca no `dist/` passar a achar `grpc-js`, `minimatch` ou `deepmerge`.
- Se o `@firebase/firestore` subir o pino do `@grpc/grpc-js` para 1.13.6 ou mais nova, ou se sair o `deepmerge` corrigido.
- Numa migração do `vite-plugin-pwa` para a versão 2 (#32).
