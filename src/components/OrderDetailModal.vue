<script setup lang="ts">
import type { FirestoreOrder, OrderStatus } from '../types'

const props = defineProps<{
  isOpen: boolean
  order: FirestoreOrder | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'update-status', orderId: string, status: OrderStatus): void
}>()

const getStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case 'pending': return { label: 'Pendente', bg: 'bg-amber-100 text-amber-800 border-amber-300' }
    case 'preparing': return { label: 'Em Preparo', bg: 'bg-blue-100 text-blue-800 border-blue-300' }
    case 'completed': return { label: 'Concluído', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300' }
    case 'cancelled': return { label: 'Cancelado', bg: 'bg-rose-100 text-rose-800 border-rose-300' }
    default: return { label: status, bg: 'bg-slate-100 text-slate-800' }
  }
}
</script>

<template>
  <div v-if="isOpen && order" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div class="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-fade-in">
      
      <!-- Cabeçalho do Modal -->
      <div class="p-5 bg-slate-900 text-white flex justify-between items-center">
        <div>
          <span class="text-xs uppercase tracking-wider text-slate-400 font-semibold">Comanda do Pedido</span>
          <h2 class="text-xl font-bold font-mono text-amber-400">#{{ order.order_code }}</h2>
        </div>
        <button @click="emit('close')" class="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition">
          ✕
        </button>
      </div>

      <!-- Corpo do Modal -->
      <div class="p-6 overflow-y-auto space-y-5 text-slate-800">
        
        <!-- Info Principal -->
        <div class="grid grid-cols-2 gap-3 text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div>
            <span class="block text-xs text-slate-500 font-medium">Data e Hora</span>
            <span class="font-semibold">{{ order.formattedDate }}</span>
          </div>
          <div>
            <span class="block text-xs text-slate-500 font-medium">Tipo / Local</span>
            <span class="font-semibold capitalize">
              {{ order.type === 'mesa' ? `Mesa ${order.table_number || 'N/A'}` : 'Delivery' }}
            </span>
          </div>
          <div v-if="order.address" class="col-span-2 pt-2 border-t border-slate-200">
            <span class="block text-xs text-slate-500 font-medium">Endereço de Entrega</span>
            <span class="font-medium text-slate-700">{{ order.address }}</span>
          </div>
        </div>

        <!-- Status do Pedido & Ações Rápidas -->
        <div>
          <span class="block text-xs text-slate-500 font-medium mb-2">Alterar Status do Pedido</span>
          <div class="grid grid-cols-3 gap-2">
            <button 
              @click="emit('update-status', order.id, 'pending')"
              :class="['py-2 px-3 text-xs font-semibold rounded-lg border transition', order.status === 'pending' ? 'bg-amber-500 text-white border-amber-500' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-amber-50']">
              Pendente
            </button>
            <button 
              @click="emit('update-status', order.id, 'preparing')"
              :class="['py-2 px-3 text-xs font-semibold rounded-lg border transition', order.status === 'preparing' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-blue-50']">
              Em Preparo
            </button>
            <button 
              @click="emit('update-status', order.id, 'completed')"
              :class="['py-2 px-3 text-xs font-semibold rounded-lg border transition', order.status === 'completed' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-emerald-50']">
              Concluído
            </button>
          </div>
        </div>

        <!-- Itens do Pedido -->
        <div>
          <h3 class="text-sm font-bold text-slate-900 border-b pb-2 mb-3">Itens Solicitados</h3>
          <ul class="divide-y divide-slate-100">
            <li v-for="item in order.parsedItems" :key="item.id" class="py-2 flex justify-between items-center text-sm">
              <div class="flex items-center space-x-3">
                <span class="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-xs">{{ item.qty }}x</span>
                <span class="font-medium text-slate-800">{{ item.name }}</span>
              </div>
              <span class="font-semibold text-slate-700">R$ {{ item.totalPrice.toFixed(2) }}</span>
            </li>
          </ul>
        </div>

        <!-- Total -->
        <div class="pt-3 border-t border-slate-200 flex justify-between items-center text-base">
          <span class="font-bold text-slate-900">Total do Pedido</span>
          <span class="font-bold text-emerald-600 text-xl">R$ {{ order.subtotal.toFixed(2) }}</span>
        </div>

      </div>

      <!-- Rodapé do Modal -->
      <div class="p-4 bg-slate-50 border-t border-slate-100 text-right">
        <button @click="emit('close')" class="px-5 py-2.5 bg-slate-800 text-white font-medium text-sm rounded-xl hover:bg-slate-900 transition">
          Fechar
        </button>
      </div>

    </div>
  </div>
</template>