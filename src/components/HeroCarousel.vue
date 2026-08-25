<template>
  <div class="relative w-full h-[200px] overflow-hidden bg-black">
    <div 
      v-for="(slide, index) in slides" 
      :key="index"
      class="absolute inset-0 transition-opacity duration-700 ease-in-out"
      :class="currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'"
    >
      <img :src="slide.image" :alt="slide.caption" class="w-full h-full object-cover opacity-85" />
      <div class="absolute bottom-3 left-4 right-4 text-white font-bold text-sm bg-black/40 px-3 py-1.5 rounded-md backdrop-blur-xs">
        {{ slide.caption }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const slides = [
  { image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=700&q=80", caption: "🔥 Carnes nobres preparadas diariamente na brasa" },
  { image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=80", caption: "🥗 Buffet de saladas e pratos quentes variados" },
  { image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80", caption: "🥩 Self-service com churrasco e sem balança" }
]

const currentSlide = ref(0)
let timer: number

onMounted(() => {
  timer = window.setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % slides.length
  }, 3500)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>