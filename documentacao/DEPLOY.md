# Deploy · Sabor & Churrasco (restaurante-churrascaria)

Plano de ação para corrigir a exposição do painel e publicar a comanda digital no GitHub Pages, sem custo.

## 1. Desafio

A versão no ar em `https://douglasabnovato.github.io/restaurante-churrascaria/` mostra o painel de pedidos (com **endereços de clientes**) para qualquer visitante, e o `.env` com a configuração do Firebase está versionado. A correção já existe no código (login da equipe + `firestore.rules`), mas só vale depois que as **regras forem publicadas no Firebase** e o **site for reconstruído**. O desafio é fazer isso com segurança e deixar a publicação automática, para que o site nunca mais fique preso a um build antigo.

## 2. Conteúdo

### Onde está a proteção de verdade

- Quem protege os endereços é o **Firestore**, não a tela. Enquanto as regras antigas estiverem publicadas, qualquer pessoa com a configuração do projeto consegue ler a coleção `orders`, mesmo sem abrir o painel.
- Por isso a **Etapa 0** publica o `firestore.rules` antes de tudo: a partir desse momento, o build antigo que ainda está no ar deixa de conseguir ler pedidos.

### Decisão de hospedagem

| Opção | Resultado |
|---|---|
| **GitHub Pages publicado pelo GitHub Actions, com Variables do repositório (escolhida)** | Cada push na `main` testa, valida as regras no emulador, faz o build com as variáveis `VITE_*` e publica. O `.env` fica só no seu computador e nenhum arquivo gerado vai para o Git |
| GitHub Pages servindo `docs/` versionado (como era) | Funciona, mas depende de lembrar de rodar `npm run build` com o `.env` certo e commitar o resultado. Foi exatamente assim que o painel exposto ficou no ar: o código foi corrigido, o build publicado não |
| Firebase Hosting | Também gratuito, mas o usuário prefere o GitHub Pages e a URL atual já está divulgada |

**Por que é mais seguro e mais simples:** o site publicado passa a ser sempre o código da `main` (não há como a correção existir no código e não estar no ar), o `.env` deixa de ser necessário no repositório, e o CI só publica se os testes das regras passarem. O custo é um cadastro único de 8 Variables.

As variáveis `VITE_FIREBASE_*` vão para dentro do JavaScript publicado em qualquer opção (é assim que o SDK web do Firebase funciona); por isso são **Variables**, não Secrets. O que protege os dados são as regras do Firestore e o login da equipe.

### Variables do repositório (Settings → Secrets and variables → Actions → aba Variables)

| Nome | Onde achar |
|---|---|
| `VITE_FIREBASE_API_KEY` | Console do Firebase → Configurações do projeto → Seus apps → app Web → `apiKey` |
| `VITE_FIREBASE_AUTH_DOMAIN` | mesmo lugar, `authDomain` |
| `VITE_FIREBASE_PROJECT_ID` | `projectId` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `storageBucket` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `messagingSenderId` |
| `VITE_FIREBASE_APP_ID` | `appId` |
| `VITE_FIREBASE_MEASUREMENT_ID` | `measurementId` (opcional; vazio desliga o Analytics) |
| `VITE_WHATSAPP_NUMBER` | número real que recebe os pedidos, só dígitos com DDI e DDD (ex.: `5532999999999`). Vazio usa o WhatsApp de desenvolvimento e mostra o aviso no rodapé |

### O que foi ajustado

| Mudança | Arquivo | Por quê |
|---|---|---|
| `outDir` de `docs` para `dist` | `vite.config.ts` | O build deixa de sobrescrever arquivos versionados; `dist/` já está no `.gitignore` |
| Build com as Variables, upload de `dist/` e job `deploy` (configure-pages, deploy-pages) só em push na `main` | `ci/github-actions-ci.yml` → `.github/workflows/ci.yml` | Publicação automática depois de testes, regras e build verdes |
| Seção "Em produção" e linha de hospedagem | `README.md` | A hospedagem deixou de ser pela pasta `/docs` |

As rotas são por hash (`#/painel`), então o GitHub Pages não precisa de `404.html`. O `base` continua `/restaurante-churrascaria/`.

### Arquivos que saem do Git

| Arquivo | Comando | Por quê |
|---|---|---|
| `.env` | `git rm --cached .env` | Estava versionado. O arquivo continua no seu computador para o `npm run dev` |
| `docs/` (build antigo) | `git rm -r docs` | Com o Pages em GitHub Actions, a pasta não é mais publicada. É o build com o painel exposto |
| `public/icons.svg` (opcional) | `git rm public/icons.svg` | Sem uso |

### Limitações e pontos de atenção

- **Histórico do Git:** o `.env` e o build antigo continuam no histórico. A configuração web do Firebase não é segredo, mas se o `.env` tiver qualquer outra coisa (token, senha, chave de servidor), troque esse valor no serviço de origem.
- **Chave da API:** recomendado restringir a `apiKey` por referenciador HTTP no Google Cloud Console (APIs e serviços → Credenciais) a `https://douglasabnovato.github.io/*` e `http://localhost:5173/*`.
- **LGPD:** os pedidos gravados antes da correção (com endereços) continuam no Firestore. Se forem de clientes reais e não forem mais necessários, apague-os pelo console. Guarde endereços só pelo tempo da entrega.
- **Plano Spark (gratuito) do Firebase:** 50 mil leituras e 20 mil gravações por dia no Firestore; suficiente para um restaurante. O GitHub Pages exige repositório público.
- **PWA:** quem já abriu o site tem o service worker antigo; ele se atualiza sozinho (`autoUpdate`), mas pode levar uma recarga.
- **Validação feita aqui:** `npm ci` limpo, 4 testes unitários passando, `vue-tsc` + build ok, `npm audit` com 0 vulnerabilidades. O `npm run test:rules` **não rodou** na sandbox (o download do emulador do Firestore foi bloqueado pela rede); rode no seu computador na Etapa 1 — o CI também roda.

## 3. Solução (passo a passo)

Branch principal: **`main`**.

### Etapa 0 · Segurança (fazer hoje, antes do push)

1. Console do Firebase → **Authentication → Método de login → E-mail/senha**: ativar. Em **Usuários**, criar o usuário da equipe e copiar o **UID**.
2. **Firestore → Dados**: criar a coleção `staff` com um documento cujo ID é esse UID (ex.: `{ "nome": "Caixa" }`).
3. No Git Bash:
   ```bash
   cd /c/ambiente-projeto/ser-mvp/restaurante-churrascaria
   npm install
   npm run test:rules
   npx firebase-tools login
   npx firebase-tools deploy --only firestore:rules --project <ID do projeto>
   ```
   O projeto não tem `.firebaserc`, por isso o `--project` (o mesmo valor de `VITE_FIREBASE_PROJECT_ID`). Depois de publicar, o `npm run deploy:rules` também pode ser usado com `npx firebase-tools use <ID do projeto>` feito uma vez.
4. Conferir: abrir o site antigo em aba anônima e ir ao painel: a lista de pedidos não carrega mais.

### Etapa 1 · Validar localmente (Git Bash)

1. `cd /c/ambiente-projeto/ser-mvp/restaurante-churrascaria`
2. Conferir que o `.env` tem as variáveis do `.env.example` (incluindo `VITE_WHATSAPP_NUMBER`).
3. `npm test` (esperado: 4 testes) e `npm run test:rules` (precisa de Java 11+)
4. `npm run build` (gera `dist/`) e `npm run preview`: abrir `http://localhost:4173/restaurante-churrascaria/`, montar um pedido e ir a `#/painel`, que pede login.

### Etapa 2 · Cadastrar as Variables no GitHub

1. Repositório → **Settings → Secrets and variables → Actions → aba Variables → New repository variable**.
2. Criar as 8 variáveis da tabela da seção 2 com os mesmos valores do seu `.env`.

### Etapa 3 · Subir para o GitHub

1. Tirar do Git o `.env` e o build antigo:
   ```bash
   git rm --cached .env
   git rm -r docs
   git rm public/icons.svg   # opcional, sem uso
   ```
2. Ativar o CI:
   ```bash
   mkdir -p .github/workflows && mv ci/github-actions-ci.yml .github/workflows/ci.yml && rmdir ci
   ```
3. `git status`: o `.env` deve aparecer como **deleted** (removido do índice) e **não** pode aparecer como novo; `dist/` e `node_modules/` não aparecem.
4. `git add -A`
5. `git commit -m "fix(seguranca): painel com login, regras do Firestore, .env fora do Git e deploy do Pages por Actions"`
6. `git push origin main`

### Etapa 4 · Configurar o GitHub Pages

1. **Settings → Pages → Build and deployment → Source: GitHub Actions** (antes era "Deploy from a branch", pasta `/docs`).
2. Aba **Actions**: se o workflow do push já tiver terminado, **Re-run all jobs**. Os jobs `web` e `deploy` precisam ficar verdes.

### Etapa 5 · Conferir no ar

1. Abrir `https://douglasabnovato.github.io/restaurante-churrascaria/` (se aparecer a versão antiga, recarregar com Ctrl+Shift+R: é o service worker do PWA).
2. O cardápio não tem mais aba de painel; o rodapé **não** mostra o aviso de WhatsApp de desenvolvimento.
3. Fazer um pedido de teste: o WhatsApp abre com o código `SC...` no número real.
4. `.../restaurante-churrascaria/#/painel` pede e-mail e senha; com o usuário da equipe, o pedido de teste aparece e o status muda.
5. Em aba anônima, `#/painel` sem login não mostra nenhum pedido.

### Etapa 6 · Fechar

1. Apagar pelo console do Firebase os pedidos de teste e os pedidos antigos com endereço que não forem mais necessários.
2. No GitHub, **About → Website**: `https://douglasabnovato.github.io/restaurante-churrascaria/`.
