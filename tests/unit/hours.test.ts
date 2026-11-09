/* Testes dos horários (#14): delivery e salão no fuso de Juiz de Fora (UTC-3, sem horário de verão) */
import { describe, it, expect } from 'vitest'
import { agoraNoRestaurante, deliveryAberto, salaoAberto, textoDelivery } from '../../src/domain/hours'

/* Horário local de Juiz de Fora convertido para UTC (+3 h) */
const local = (iso: string) => new Date(`${iso}-03:00`)

describe('horários', () => {
  it('lê dia e minutos no fuso do restaurante, não no do aparelho', () => {
    expect(agoraNoRestaurante(new Date('2026-11-09T02:00:00Z'))).toEqual({ dia: 6, minutos: 23 * 60 })
    expect(agoraNoRestaurante(local('2026-11-09T11:00:00'))).toEqual({ dia: 1, minutos: 11 * 60 })
  })
  it('delivery: fechado antes das 11h, aberto até 14h59 e fechado às 15h', () => {
    expect(deliveryAberto(local('2026-11-09T10:59:00'))).toBe(false)
    expect(deliveryAberto(local('2026-11-09T11:00:00'))).toBe(true)
    expect(deliveryAberto(local('2026-11-09T14:59:00'))).toBe(true)
    expect(deliveryAberto(local('2026-11-09T15:00:00'))).toBe(false)
    expect(deliveryAberto(local('2026-11-09T21:00:00'))).toBe(false)
  })
  it('salão: até 17h30 na semana e até 15h30 no domingo', () => {
    expect(salaoAberto(local('2026-11-09T10:29:00'))).toBe(false)
    expect(salaoAberto(local('2026-11-09T17:00:00'))).toBe(true)
    expect(salaoAberto(local('2026-11-08T15:29:00'))).toBe(true)
    expect(salaoAberto(local('2026-11-08T16:00:00'))).toBe(false)
  })
  it('texto do delivery vem do mesmo lugar', () => {
    expect(textoDelivery()).toBe('Todos os dias das 11:00 às 15:00')
  })
})
/* Fim de hours.test.ts */
