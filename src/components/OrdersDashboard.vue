<script setup lang="ts">
import { computed } from 'vue'
import { useOrders } from '../composables/useOrders'
import OrderDetailModal from './OrderDetailModal.vue'
import type { OrderStatus } from '../types'

const { 
  orders, 
  loading, 
  selectedOrder, 
  isDetailModalOpen, 
  openOrderDetails, 
  closeOrderDetails, 
  updateOrderStatus 
} = useOrders()

// Métrica simples: Faturamento total acumulado
const totalRevenue = computed(() => {
  return orders.value.reduce((acc, order) => acc + (order.subtotal || 0), 0)
})

const getStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case 'pending': return { label: 'Pendente', bg: 'bg-amber-100 text-amber-800 border-amber-200' }
    case 'preparing': return { label: 'Em Preparo', bg: 'bg-blue-100 text-blue-800 border-blue-200' }
    case 'completed': return { label: 'Concluído', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' }
    case 'cancelled': return { label: 'Cancelado', bg: 'bg-rose-100 text-rose-800 border-rose-200' }
    default: return { label: status, bg: 'bg-slate-100 text-slate-800 border-slate-200' }
  }
}
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    
    <!-- Cabeçalho do Dashboard -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-black text-slate-900 tracking-tight">Dashboard de Pedidos</h1>
        <p class="text-sm text-slate-500">Acompanhamento de comandas em tempo real</p>
      </div>

      <!-- Cards Rápidos de Resumo -->
      <div class="flex gap-4">
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex-1 md:w-44">
          <span class="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Pedidos</span>
          <span class="text-2xl font-black text-slate-800">{{ orders.length }}</span>
        </div>
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex-1 md:w-52">
          <span class="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Faturamento</span>
          <span class="text-2xl font-black text-emerald-600">R$ {{ totalRevenue.toFixed(2) }}</span>
        </div>
      </div>
    </div>

    <!-- Indicador de Carregamento -->
    <div v-if="loading" class="text-center py-16 bg-white rounded-2xl border border-slate-200">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-600 mx-auto mb-3"></div>
      <p class="text-slate-500 text-sm font-medium">Carregando pedidos do Firestore...</p>
    </div>

    <!-- Lista Vazia -->
    <div v-else-if="orders.length === 0" class="text-center py-16 bg-white rounded-2xl border border-slate-200">
      <p class="text-slate-400 text-base font-medium">Nenhum pedido registrado até o momento.</p>
    </div>

    <!-- Tabela / Lista de Pedidos -->
    <div v-else class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider">
            <tr>
              <th class="py-3.5 px-4">Código</th>
              <th class="py-3.5 px-4">Data / Hora</th>
              <th class="py-3.5 px-4">Tipo / Local</th>
              <th class="py-3.5 px-4">Valor Total</th>
              <th class="py-3.5 px-4">Status</th>
              <th class="py-3.5 px-4 text-right">Ação</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="order in orders" :key="order.id" class="hover:bg-slate-50 transition">
              <td class="py-4 px-4 font-mono font-bold text-amber-700">
                #{{ order.order_code }}
              </td>
              <td class="py-4 px-4 text-slate-600 font-medium">
                {{ order.formattedDate }}
              </td>
              <td class="py-4 px-4">
                <span :class="[
                  'px-2.5 py-1 text-xs font-semibold rounded-full border',
                  order.type === 'mesa' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-purple-50 text-purple-700 border-purple-200'
                ]">
                  {{ order.type === 'mesa' ? `Mesa ${order.table_number || 'N/A'}` : 'Delivery' }}
                </span>
              </td>
              <td class="py-4 px-4 font-bold text-slate-900">
                R$ {{ order.subtotal.toFixed(2) }}
              </td>
              <td class="py-4 px-4">
                <span :class="['px-2.5 py-1 text-xs font-bold rounded-full border', getStatusBadge(order.status).bg]">
                  {{ getStatusBadge(order.status).label }}
                </span>
              </td>
              <td class="py-4 px-4 text-right">
                <button 
                  @click="openOrderDetails(order)"
                  class="px-3 py-1.5 bg-slate-900 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg transition shadow-sm">
                  Ver Detalhes
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de Detalhes -->
    <OrderDetailModal 
      :is-open="isDetailModalOpen" 
      :order="selectedOrder" 
      @close="closeOrderDetails"
      @update-status="updateOrderStatus"
    />

  </div>
</template>