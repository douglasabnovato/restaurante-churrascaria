<!-- Painel da equipe: exige login (Firebase Auth) antes de mostrar pedidos, endereços e faturamento -->
<script setup lang="ts">
import { ref } from 'vue'
import { useStaff } from '../composables/useStaff'
import { isFirebaseConfigured } from '../services/firebase'
import OrdersDashboard from './OrdersDashboard.vue'

const { user, ready, error, login, logout } = useStaff()
const email = ref('')
const password = ref('')
const busy = ref(false)

/* Envia o login */
const submit = async () => {
  busy.value = true
  await login(email.value, password.value)
  busy.value = false
}
</script>

<template>
  <div class="bg-slate-900 text-white">
    <div class="max-w-6xl mx-auto px-4 py-2.5 flex justify-between items-center gap-3">
      <span class="text-xs font-bold text-amber-400 tracking-wide uppercase">Painel da equipe</span>
      <div class="flex gap-2 items-center text-xs">
        <a href="#/" class="underline">Ver cardápio</a>
        <button v-if="user" type="button" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700" @click="logout">Sair</button>
      </div>
    </div>
  </div>

  <main id="conteudo">
    <p v-if="!isFirebaseConfigured" class="max-w-md mx-auto my-16 p-6 bg-white rounded-xl border border-slate-200 text-slate-700">
      O painel precisa do Firebase configurado (variáveis VITE_FIREBASE_* no .env).
    </p>
    <p v-else-if="!ready" role="status" class="text-center my-16 text-slate-600">Verificando acesso…</p>
    <form v-else-if="!user" class="max-w-sm mx-auto my-16 p-6 bg-white rounded-xl border border-slate-200 space-y-4" @submit.prevent="submit">
      <h1 class="text-xl font-black text-slate-900">Entrar no painel</h1>
      <div>
        <label for="staff-email" class="block text-xs font-bold mb-1">E-mail</label>
        <input id="staff-email" v-model="email" type="email" autocomplete="username" required class="w-full p-3 border border-slate-400 rounded-lg" />
      </div>
      <div>
        <label for="staff-password" class="block text-xs font-bold mb-1">Senha</label>
        <input id="staff-password" v-model="password" type="password" autocomplete="current-password" required class="w-full p-3 border border-slate-400 rounded-lg" />
      </div>
      <p v-if="error" role="alert" class="text-sm text-red-700">{{ error }}</p>
      <button type="submit" :disabled="busy" class="w-full bg-slate-900 text-white font-bold py-3 rounded-lg disabled:opacity-60">{{ busy ? 'Entrando…' : 'Entrar' }}</button>
    </form>
    <OrdersDashboard v-else />
  </main>
</template>
<!-- Fim de StaffPanel.vue -->
