<template>
  <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md transition-all duration-300 hover:shadow-2xl">
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold text-gray-800">Bienvenido de nuevo</h2>
      <p class="text-gray-500 text-sm mt-2">Ingresa tus credenciales para acceder</p>
    </div>

    <form @submit.prevent="login" class="space-y-6">
      <!-- Email Input -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span class="text-gray-400 text-lg">✉️</span>
          </div>
          <input 
            v-model="correo" 
            type="email" 
            class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none bg-gray-50 focus:bg-white" 
            placeholder="ejemplo@correo.com"
            required 
          />
        </div>
      </div>

      <!-- Password Input -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span class="text-gray-400 text-lg">🔒</span>
          </div>
          <input 
            v-model="contrasena" 
            :type="mostrarPassword ? 'text' : 'password'" 
            class="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none bg-gray-50 focus:bg-white" 
            placeholder="••••••••"
            required 
          />
          <button 
            type="button"
            @click="mostrarPassword = !mostrarPassword"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
          >
            <span v-if="mostrarPassword">👁️</span>
            <span v-else>👁️‍🗨️</span>
          </button>
        </div>
        <div class="flex justify-end mt-2">
          <a href="#" class="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg animate-pulse">
        <div class="flex">
          <div class="flex-shrink-0">
            <span class="text-red-500">⚠️</span>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-700">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <button 
        type="submit" 
        :disabled="cargando"
        class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <span v-if="cargando" class="flex items-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Iniciando sesión...
        </span>
        <span v-else>Iniciar Sesión</span>
      </button>
    </form>

    <!-- Register Link -->
    <div class="mt-8 text-center border-t border-gray-100 pt-6">
      <p class="text-sm text-gray-600">
        ¿No tienes una cuenta? 
        <NuxtLink to="/registro" class="font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors">
          Regístrate aquí
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const correo = ref('')
const contrasena = ref('')
const error = ref('')
const cargando = ref(false)
const mostrarPassword = ref(false)
const router = useRouter()

async function login() {
  error.value = ''
  cargando.value = true
  
  // Simular un pequeño delay para que se aprecie la animación de carga (UX)
  await new Promise(resolve => setTimeout(resolve, 800))

  try {
    const res = await $fetch('http://localhost:4000/api/users/login', {
      method: 'POST',
      body: { correo: correo.value, contrasena: contrasena.value }
    })
    
    localStorage.setItem('token', res.token)
    localStorage.setItem('rol', res.usuario.rol)
    localStorage.setItem('usuario', JSON.stringify(res.usuario))
    
    router.push('/dashboard')
  } catch (e) {
    error.value = e.data?.mensaje || 'Credenciales incorrectas. Inténtalo de nuevo.'
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>
/* Puedes personalizar estilos aquí */
</style>
