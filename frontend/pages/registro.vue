<template>
  <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md transition-all duration-300 hover:shadow-2xl">
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold text-gray-800">Crear Cuenta</h2>
      <p class="text-gray-500 text-sm mt-2">Únete a Smartventory hoy mismo</p>
    </div>

    <form @submit.prevent="register" class="space-y-6">
      <!-- Bloque 1: Información de la Empresa -->
      <div class="border-b border-gray-100 pb-4 mb-4">
        <h3 class="text-lg font-semibold text-gray-700 mb-4">Información de la Empresa</h3>
        
        <!-- Nombre Empresa -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del Negocio</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span class="text-gray-400 text-lg">🏢</span>
            </div>
            <input 
              v-model="nombreEmpresa" 
              type="text" 
              class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none bg-gray-50 focus:bg-white" 
              placeholder="Mi Empresa S.A."
              required 
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <!-- País -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">País</label>
            <select v-model="pais" class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 focus:bg-white">
              <option value="MX">México</option>
              <option value="CO">Colombia</option>
              <option value="AR">Argentina</option>
              <option value="ES">España</option>
              <option value="US">Estados Unidos</option>
              <option value="CL">Chile</option>
              <option value="PE">Perú</option>
            </select>
          </div>
          <!-- Moneda -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Moneda</label>
            <select v-model="moneda" class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 focus:bg-white">
              <option value="USD">USD ($)</option>
              <option value="MXN">MXN ($)</option>
              <option value="COP">COP ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>
        </div>
        
        <!-- Zona Horaria -->
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Zona Horaria</label>
          <select v-model="zonaHoraria" class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 focus:bg-white">
            <option value="UTC">UTC</option>
            <option value="America/Mexico_City">America/Mexico_City</option>
            <option value="America/Bogota">America/Bogota</option>
            <option value="America/Argentina/Buenos_Aires">America/Argentina/Buenos_Aires</option>
            <option value="Europe/Madrid">Europe/Madrid</option>
          </select>
        </div>
      </div>

      <!-- Bloque 2: Información del Administrador -->
      <div>
        <h3 class="text-lg font-semibold text-gray-700 mb-4">Datos del Administrador</h3>
        
        <!-- Name Input -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span class="text-gray-400 text-lg">👤</span>
            </div>
            <input 
              v-model="nombre" 
              type="text" 
              class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none bg-gray-50 focus:bg-white" 
              placeholder="Juan Pérez"
              required 
            />
          </div>
        </div>

        <!-- Email Input -->
        <div class="mb-4">
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
          Registrando...
        </span>
        <span v-else>Crear Cuenta</span>
      </button>
    </form>

    <!-- Login Link -->
    <div class="mt-8 text-center border-t border-gray-100 pt-6">
      <p class="text-sm text-gray-600">
        ¿Ya tienes una cuenta? 
        <NuxtLink to="/login" class="font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors">
          Inicia sesión aquí
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
  layout: 'auth'
})

const nombre = ref('')
const correo = ref('')
const contrasena = ref('')
const nombreEmpresa = ref('')
const pais = ref('MX')
const moneda = ref('MXN')
const zonaHoraria = ref('America/Mexico_City')

const error = ref('')
const cargando = ref(false)
const mostrarPassword = ref(false)
const router = useRouter()

async function register() {
  error.value = ''
  cargando.value = true
  
  await new Promise(resolve => setTimeout(resolve, 800))

  try {
    const res = await $fetch('http://localhost:4000/api/users/register', {
      method: 'POST',
      body: { 
        nombre: nombre.value,
        correo: correo.value, 
        contrasena: contrasena.value,
        nombre_empresa: nombreEmpresa.value,
        pais: pais.value,
        moneda: moneda.value,
        zona_horaria: zonaHoraria.value
      }
    })
    
    // Auto-login tras registro exitoso
    localStorage.setItem('token', res.token)
    localStorage.setItem('rol', res.usuario.rol)
    localStorage.setItem('usuario', JSON.stringify(res.usuario))
    
    alert('Cuenta y Empresa creadas exitosamente.')
    router.push('/dashboard')
  } catch (e) {
    error.value = e.data?.mensaje || 'Error al registrar usuario.'
  } finally {
    cargando.value = false
  }
}
</script>
