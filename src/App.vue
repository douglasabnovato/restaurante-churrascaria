<template>
  <div class="min-h-screen bg-body pb-24">
    <HeaderBar />
    <HeroCarousel />

    <main class="max-w-[480px] mx-auto p-4">
      <!-- Combos Principais -->
      <div class="text-sm font-extrabold my-5 text-primary-dark uppercase border-l-4 border-primary pl-2.5">
        Combos de Churrasco
      </div>
      <ProductCard 
        v-for="item in combos" 
        :key="item.id" 
        :product="item" 
        :quantity="cart[item.id] || 0"
        @update="(change) => updateQty(item.id, change)"
      />

      <!-- Banner Promocional Prato do Dia -->
      <PromoBanner @add="updateQty('prato_dia', 1)" />

      <!-- Cortes Especiais e Prato do Dia -->
      <div class="text-sm font-extrabold my-5 text-primary-dark uppercase border-l-4 border-primary pl-2.5">
        Pratos & Cortes Especiais
      </div>
      <ProductCard 
        v-for="item in specials" 
        :key="item.id" 
        :product="item" 
        :quantity="cart[item.id] || 0"
        @update="(change) => updateQty(item.id, change)"
      />

      <!-- Bebidas -->
      <div class="text-sm font-extrabold my-5 text-primary-dark uppercase border-l-4 border-primary pl-2.5">
        Bebidas Geladas
      </div>
      <ProductCard 
        v-for="item in drinks" 
        :key="item.id" 
        :product="item" 
        :quantity="cart[item.id] || 0"
        @update="(change) => updateQty(item.id, change)"
      />
    </main>

    <FooterBar />

    <!-- Barra de Subtotal e Checkout -->
    <CartBar 
      :subtotal="subtotal" 
      :total-items="totalItems"
      @open-modal="isModalOpen = true"
    />

    <!-- Modal de Checkout -->
    <CheckoutModal 
      :is-open="isModalOpen"
      :is-submitted="isOrderSubmitted"
      @close="isModalOpen = false"
      @send="sendToWhatsApp"
      @reset="resetAppAndReturn"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import HeaderBar from './components/HeaderBar.vue'
import HeroCarousel from './components/HeroCarousel.vue'
import PromoBanner from './components/PromoBanner.vue'
import ProductCard from './components/ProductCard.vue'
import CartBar from './components/CartBar.vue'
import CheckoutModal from './components/CheckoutModal.vue'
import FooterBar from './components/FooterBar.vue'

import { useCart, itemsData } from './composables/useCart'

const { 
  cart, 
  subtotal, 
  totalItems, 
  isModalOpen, 
  isOrderSubmitted, 
  updateQty, 
  sendToWhatsApp, 
  resetAppAndReturn 
} = useCart()

const combos = computed(() => itemsData.filter(i => i.cat === 'combo'))
const specials = computed(() => itemsData.filter(i => i.cat === 'special'))
const drinks = computed(() => itemsData.filter(i => i.cat === 'drink'))
</script>