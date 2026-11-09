/* Horários do restaurante num só lugar (#14): o rodapé mostra e o checkout consulta.
   As contas usam o fuso de Juiz de Fora (America/Sao_Paulo), não o do aparelho de quem pede. */

export const FUSO = "America/Sao_Paulo"

type Faixa = { abre: string; fecha: string }

/* Dia da semana: 0 = domingo ... 6 = sábado */
export const HORARIOS = {
  salao: {
    semana: { abre: "10:30", fecha: "17:30" } as Faixa,
    domingo: { abre: "10:30", fecha: "15:30" } as Faixa,
  },
  delivery: { abre: "11:00", fecha: "15:00" } as Faixa,
}

const minutos = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number)
  return h * 60 + m
}

/* Dia da semana e minutos desde a meia-noite no fuso do restaurante */
export function agoraNoRestaurante(now: Date): { dia: number; minutos: number } {
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: FUSO,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now)
  const valor = (tipo: string) => partes.find((p) => p.type === tipo)?.value ?? ""
  const dia = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(valor("weekday"))
  return { dia, minutos: Number(valor("hour")) * 60 + Number(valor("minute")) }
}

/* Aberto do minuto de abertura até antes do minuto de fechamento */
const dentro = (faixa: Faixa, min: number) => min >= minutos(faixa.abre) && min < minutos(faixa.fecha)

export function deliveryAberto(now = new Date()): boolean {
  return dentro(HORARIOS.delivery, agoraNoRestaurante(now).minutos)
}

export function salaoAberto(now = new Date()): boolean {
  const { dia, minutos: min } = agoraNoRestaurante(now)
  return dentro(dia === 0 ? HORARIOS.salao.domingo : HORARIOS.salao.semana, min)
}

/* Textos para o rodapé e para o aviso do checkout */
export const textoDelivery = () => `Todos os dias das ${HORARIOS.delivery.abre} às ${HORARIOS.delivery.fecha}`
export const textoSalaoSemana = () => `${HORARIOS.salao.semana.abre} às ${HORARIOS.salao.semana.fecha}`
export const textoSalaoDomingo = () => `${HORARIOS.salao.domingo.abre} às ${HORARIOS.salao.domingo.fecha}`
/* Fim de hours.ts */
