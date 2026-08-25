<script setup lang="ts">
import { ref, computed } from 'vue'
import HeaderBar from './components/HeaderBar.vue'
import HeroCarousel from './components/HeroCarousel.vue'
import PromoBanner from './components/PromoBanner.vue'
import ProductCard from './components/ProductCard.vue'
import CartBar from './components/CartBar.vue'
import CheckoutModal from './components/CheckoutModal.vue'
import FooterBar from './components/FooterBar.vue'
import OrdersDashboard from './components/OrdersDashboard.vue'

import { useCart, itemsData } from './composables/useCart'

const currentTab = ref<'menu' | 'dashboard'>('menu')

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

<template>
  <div class="min-h-screen bg-body pb-24 flex flex-col justify-between">
    
    <div>
      <!-- Cabeçalho de Navegação entre Visões (Cardápio x Dashboard) -->
      <div class="bg-slate-900 text-white sticky top-0 z-50 shadow-md">
        <div class="max-w-[480px] mx-auto px-4 py-2.5 flex justify-between items-center">
          <span class="text-xs font-bold text-amber-400 tracking-wide uppercase">Gestão Sabor & Churrasco</span>
          <nav class="flex gap-1.5">
            <button 
              @click="currentTab = 'menu'"
              :class="['px-3 py-1.5 text-xs font-bold rounded-lg transition', currentTab === 'menu' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700']">
              📋 Cardápio
            </button>
            <button 
              @click="currentTab = 'dashboard'"
              :class="['px-3 py-1.5 text-xs font-bold rounded-lg transition', currentTab === 'dashboard' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700']">
              📊 Dashboard
            </button>
          </nav>
        </div>
      </div>

      <!-- VISUALIZAÇÃO 1: CARDÁPIO ORIGINAL -->
      <div v-if="currentTab === 'menu'">
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

      <!-- VISUALIZAÇÃO 2: DASHBOARD DE PEDIDOS -->
      <div v-else-if="currentTab === 'dashboard'">
        <OrdersDashboard />
      </div>

    </div>

    <FooterBar />

  </div>
</template>