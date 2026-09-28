<!-- Cartão do produto com botões de quantidade acessíveis (antes "-" e "+" sem nome para leitores de tela) -->
<template>
  <article class="bg-surface border border-slate-200 rounded-xl p-3 mb-3 flex gap-3 items-center shadow-xs">
    <img :src="product.img" @error="handleImageError" width="76" height="76" loading="lazy"
      class="w-[76px] h-[76px] rounded-lg object-cover shrink-0 bg-slate-100" alt="" />
    <div class="flex-1">
      <span v-if="product.badge" class="bg-accent/20 text-primary-dark text-[0.65rem] font-extrabold px-1.5 py-0.5 rounded uppercase inline-block mb-1">
        {{ product.badge }}
      </span>
      <h3 class="font-bold text-sm text-dark leading-snug">{{ product.name }}</h3>
      <p class="text-xs text-slate-600 my-0.5 leading-tight">{{ product.desc }}</p>
      <p class="font-extrabold text-primary-dark text-sm">{{ brl(product.price) }}</p>
    </div>
    <div class="flex items-center gap-1.5 bg-body p-1 rounded-lg border border-slate-200" role="group" :aria-label="`Quantidade de ${product.name}`">
      <button type="button" :aria-label="`Remover 1 ${product.name}`" :disabled="quantity === 0" @click="$emit('update', -1)"
        class="w-8 h-8 bg-surface text-primary font-extrabold rounded-md shadow-xs flex items-center justify-center cursor-pointer disabled:opacity-40">−</button>
      <span class="font-bold text-sm min-w-[18px] text-center" aria-live="polite">{{ quantity }}</span>
      <button type="button" :aria-label="`Adicionar 1 ${product.name}`" @click="$emit('update', 1)"
        class="w-8 h-8 bg-surface text-primary font-extrabold rounded-md shadow-xs flex items-center justify-center cursor-pointer">+</button>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Product } from '../types'
import { DEFAULT_CHEF_IMAGE } from '../data/menu'
import { brl } from '../domain/order'

defineProps<{ product: Product; quantity: number }>()
defineEmits(['update'])

/* Troca por uma imagem padrão quando a foto falha */
const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement
  if (target && target.src !== DEFAULT_CHEF_IMAGE) target.src = DEFAULT_CHEF_IMAGE
}
</script>
<!-- Fim de ProductCard.vue -->
