/* Medição de uso sem cookie (GoatCounter, decisão D5 de 10/11/2026).
   Só carrega no build de produção e fora do próprio computador: dev e testes não contam visitas.
   Nenhum dado pessoal: só o caminho da página e o nome do evento (nada de endereço, telefone ou itens). */
export const ENDERECO_MEDICAO = 'https://douglasabnovato.goatcounter.com/count'
export const SCRIPT_MEDICAO = 'https://gc.zgo.at/count.js'

/* Aviso de coleta mostrado no rodapé (#12): diz o que a medição conta e o que ela não guarda (LGPD, art. 6º, VI, e art. 9º) */
export const AVISO_MEDICAO =
  'Quando ativa no site publicado, a medição conta visitas e pedidos enviados com o GoatCounter, sem cookie. A contagem não guarda nome, endereço, telefone nem itens do pedido.'
export const POLITICA_MEDICAO = 'https://www.goatcounter.com/help/privacy'

type Contador = { count?: (dados: { path: string; title?: string; event?: boolean }) => void }
type Janela = { goatcounter?: Contador }

let carregada = false

/* Verdadeiro só no build de produção servido fora de localhost */
export function medicaoAtiva(prod: boolean = import.meta.env.PROD, host: string = globalThis.location?.hostname ?? ''): boolean {
  const local = host === '' || host === 'localhost' || host === '127.0.0.1' || host === '[::1]'
  return prod && !local
}

/* Insere o script do GoatCounter uma vez; devolve se inseriu */
export function carregarMedicao(prod?: boolean, host?: string, doc: Document | undefined = globalThis.document): boolean {
  if (!doc || !medicaoAtiva(prod, host) || doc.querySelector('script[data-goatcounter]')) return false
  const script = doc.createElement('script')
  script.async = true
  script.src = SCRIPT_MEDICAO
  script.setAttribute('data-goatcounter', ENDERECO_MEDICAO)
  doc.head.appendChild(script)
  carregada = true
  return true
}

/* Conta um evento do fluxo principal; não faz nada se a medição não foi carregada */
export function registrarEvento(nome: string, janela: Janela = globalThis as unknown as Janela): void {
  if (!carregada) return
  janela.goatcounter?.count?.({ path: nome, title: nome, event: true })
}

/* Só para os testes: volta ao estado inicial */
export function reiniciarMedicao(): void {
  carregada = false
}
/* Fim de medicao.ts */
