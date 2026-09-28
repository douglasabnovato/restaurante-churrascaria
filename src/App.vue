<!-- Cardápio para clientes e, em #/painel, o painel da equipe (antes o painel ficava em uma aba aberta a qualquer cliente) -->
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, defineAsyncComponent } from 'vue'
import HeaderBar from './components/HeaderBar.vue'
import HeroCarousel from './components/HeroCarousel.vue'
import PromoBanner from './components/PromoBanner.vue'
import ProductCard from './components/ProductCard.vue'
import CartBar from './components/CartBar.vue'
import CheckoutModal from './components/CheckoutModal.vue'
import FooterBar from './components/FooterBar.vue'
const StaffPanel = defineAsyncComponent(() => import('./components/StaffPanel.vue'))

import { useCart, itemsData } from './composables/useCart'

const currentTab = ref<'menu' | 'dashboard'>(location.hash === '#/painel' ? 'dashboard' : 'menu')
/* Sincroniza a visão com o endereço (#/painel) */
const syncRoute = () => { currentTab.value = location.hash === '#/painel' ? 'dashboard' : 'menu' }
onMounted(() => window.addEventListener('hashchange', syncRoute))
onUnmounted(() => window.removeEventListener('hashchange', syncRoute))

const { 
  cart, 
  subtotal, 
  totalItems, 
  isModalOpen, 
  isOrderSubmitted, 
  sending,
  lastCode,
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
      <!-- VISUALIZAÇÃO 1: CARDÁPIO ORIGINAL -->
      <div v-if="currentTab === 'menu'">
        <HeaderBar />
        <HeroCarousel />

        <main id="conteudo" class="max-w-[480px] mx-auto p-4">
          <!-- Combos Principais -->
          <h2 class="text-sm font-extrabold my-5 text-primary-dark uppercase border-l-4 border-primary pl-2.5">
            Combos de Churrasco
          </h2>
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
          <h2 class="text-sm font-extrabold my-5 text-primary-dark uppercase border-l-4 border-primary pl-2.5">
            Pratos & Cortes Especiais
          </h2>
          <ProductCard 
            v-for="item in specials" 
            :key="item.id" 
            :product="item" 
            :quantity="cart[item.id] || 0"
            @update="(change) => updateQty(item.id, change)"
          />

          <!-- Bebidas -->
          <h2 class="text-sm font-extrabold my-5 text-primary-dark uppercase border-l-4 border-primary pl-2.5">
            Bebidas Geladas
          </h2>
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
          :sending="sending"
          :order-code="lastCode"
          @close="isModalOpen = false"
          @send="sendToWhatsApp"
          @reset="resetAppAndReturn"
        />
      </div>

      <!-- VISUALIZAÇÃO 2: DASHBOARD DE PEDIDOS -->
      <div v-else-if="currentTab === 'dashboard'">
        <StaffPanel />
      </div>

    </div>

    <FooterBar />

  </div>
</template>
<!-- Fim de App.vue -->
