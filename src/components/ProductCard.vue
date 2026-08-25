<template>
  <div class="bg-surface border border-slate-200 rounded-xl p-3 mb-3 flex gap-3 items-center shadow-xs active:scale-[0.99] transition-transform">
    <img 
      :src="product.img" 
      @error="handleImageError"
      class="w-[76px] h-[76px] rounded-lg object-cover shrink-0 bg-slate-100" 
      :alt="product.name"
    />
    <div class="flex-1">
      <!-- Badge de Buffet Livre ou Customizado -->
      <span v-if="product.badge" class="bg-accent/20 text-primary-dark text-[0.6rem] font-extrabold px-1.5 py-0.5 rounded uppercase inline-block mb-1">
        {{ product.badge }}
      </span>
      <div class="font-bold text-sm text-dark leading-snug">{{ product.name }}</div>
      <div class="text-xs text-slate-500 my-0.5 leading-tight">{{ product.desc }}</div>
      <div class="font-extrabold text-primary-dark text-sm">R$ {{ product.price.toFixed(2).replace('.', ',') }}</div>
    </div>
    <div class="flex items-center gap-1.5 bg-body p-1 rounded-lg border border-slate-200">
      <button 
        @click="$emit('update', -1)" 
        class="w-7 h-7 bg-surface text-primary font-extrabold rounded-md shadow-xs flex items-center justify-center cursor-pointer active:bg-slate-100"
      >
        -
      </button>
      <span class="font-bold text-sm min-w-[18px] text-center">{{ quantity }}</span>
      <button 
        @click="$emit('update', 1)" 
        class="w-7 h-7 bg-surface text-primary font-extrabold rounded-md shadow-xs flex items-center justify-center cursor-pointer active:bg-slate-100"
      >
        +
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '../types'
import { DEFAULT_CHEF_IMAGE } from '../composables/useCart'

defineProps<{
  product: Product;
  quantity: number;
}>()

defineEmits(['update'])

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement
  if (target) target.src = DEFAULT_CHEF_IMAGE
}
</script>