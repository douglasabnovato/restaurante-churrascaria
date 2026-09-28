<!-- Carrossel do topo com botão de pausa e respeito a "reduzir movimento" (WCAG 2.2.2) -->
<template>
  <section class="relative w-full h-[200px] overflow-hidden bg-black" aria-roledescription="carrossel" aria-label="Destaques da casa">
    <div v-for="(slide, index) in slides" :key="index" class="absolute inset-0 transition-opacity duration-700 ease-in-out"
      :class="currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'" :aria-hidden="currentSlide !== index">
      <img :src="slide.image" alt="" class="w-full h-full object-cover opacity-85" :loading="index === 0 ? 'eager' : 'lazy'" width="700" height="200" />
      <p class="absolute bottom-3 left-4 right-14 text-white font-bold text-sm bg-black/60 px-3 py-1.5 rounded-md">{{ slide.caption }}</p>
    </div>
    <button type="button" class="absolute z-20 bottom-3 right-3 w-9 h-9 rounded-full bg-black/60 text-white" :aria-label="playing ? 'Pausar destaques' : 'Continuar destaques'" @click="toggle">
      {{ playing ? '❚❚' : '▶' }}
    </button>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const slides = [
  { image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=700&q=80", caption: "Carnes nobres preparadas diariamente na brasa" },
  { image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=80", caption: "Buffet de saladas e pratos quentes variados" },
  { image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80", caption: "Self-service com churrasco e sem balança" },
]

const currentSlide = ref(0)
const playing = ref(false)
let timer: number | undefined

/* Inicia ou para a troca automática */
const start = () => { timer = window.setInterval(() => { currentSlide.value = (currentSlide.value + 1) % slides.length }, 5000); playing.value = true }
const stop = () => { clearInterval(timer); playing.value = false }
const toggle = () => (playing.value ? stop() : start())

onMounted(() => { if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) start() })
onUnmounted(stop)
</script>
<!-- Fim de HeroCarousel.vue -->
