<template>
  <div class="max-w-sm mx-auto mt-10 p-6 bg-white rounded shadow">
    <h2 class="text-xl font-bold mb-4">Iniciar sesión</h2>
    <form @submit.prevent="login">
      <div class="mb-4">
        <label class="block mb-1">Correo</label>
        <input v-model="correo" type="email" class="w-full border rounded px-3 py-2" required />
      </div>
      <div class="mb-4">
        <label class="block mb-1">Contraseña</label>
        <input v-model="contrasena" type="password" class="w-full border rounded px-3 py-2" required />
      </div>
      <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded">Entrar</button>
      <div v-if="error" class="mt-3 text-red-600">{{ error }}</div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const correo = ref('')
const contrasena = ref('')
const error = ref('')
const router = useRouter()

async function login() {
  error.value = ''
  try {
    const res = await $fetch('http://localhost:4000/api/users/login', {
      method: 'POST',
      body: { correo: correo.value, contrasena: contrasena.value }
    })
    // Guardar token y rol en localStorage
    localStorage.setItem('token', res.token)
    localStorage.setItem('rol', res.usuario.rol)
    localStorage.setItem('usuario', JSON.stringify(res.usuario))
    // Redirigir al dashboard
    router.push('/dashboard')
  } catch (e) {
    error.value = e.data?.mensaje || 'Error al iniciar sesión'
  }
}
</script>

<style scoped>
/* Puedes personalizar estilos aquí */
</style>
