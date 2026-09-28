<!-- Barra fixa com subtotal e botão para finalizar -->
<template>
  <div class="fixed bottom-0 left-0 right-0 bg-surface border-t border-slate-200 p-3 px-4 flex justify-between items-center z-30 shadow-[0_-4px_16px_rgba(0,0,0,0.12)]">
    <div aria-live="polite">
      <div class="text-[0.7rem] text-slate-600 uppercase font-bold">Subtotal ({{ totalItems }} {{ totalItems === 1 ? 'item' : 'itens' }})</div>
      <div class="text-xl font-extrabold text-primary-dark">{{ brl(subtotal) }}</div>
    </div>
    <button type="button" @click="$emit('open-modal')" :disabled="totalItems === 0"
      class="bg-primary text-white font-extrabold text-sm py-3 px-5 rounded-lg cursor-pointer transition-all disabled:bg-slate-500 disabled:cursor-not-allowed">
      Avançar
    </button>
  </div>
</template>

<script setup lang="ts">
import { brl } from '../domain/order'

defineProps<{ subtotal: number; totalItems: number }>()
defineEmits(['open-modal'])
</script>
<!-- Fim de CartBar.vue -->
