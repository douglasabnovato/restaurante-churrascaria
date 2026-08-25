<template>
  <div class="bg-gradient-to-br from-primary to-primary-dark text-white rounded-xl p-4 my-7 flex gap-3 items-center border-2 border-accent shadow-lg relative overflow-hidden">
    <img 
      :src="imgSrc" 
      @error="handleImageError"
      class="w-[85px] h-[85px] rounded-lg object-cover border-2 border-accent shrink-0" 
      alt="Prato do Dia do Chef"
    />
    <div class="flex-1">
      <span class="bg-accent text-dark text-[0.65rem] font-extrabold px-2 py-0.5 rounded uppercase inline-block mb-1">
        Especial de Hoje
      </span>
      <div class="text-base font-extrabold leading-tight">Prato do Dia do Chef</div>
      <div class="text-xs opacity-90 my-1">Prato completo preparado diariamente com carnes selecionadas na brasa.</div>
      <div class="text-lg font-extrabold text-accent">R$ 25,00</div>
    </div>
    <button 
      @click="$emit('add')" 
      class="w-[38px] h-[38px] bg-accent text-dark rounded-lg font-extrabold text-lg flex items-center justify-center shrink-0 active:scale-95 transition-transform cursor-pointer shadow"
    >
      +
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DEFAULT_CHEF_IMAGE } from '../composables/useCart'

defineEmits(['add'])

const imgSrc = ref("https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=300&q=80")

const handleImageError = () => {
  imgSrc.value = DEFAULT_CHEF_IMAGE
}
</script>