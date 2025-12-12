<template>
  <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl transition-all duration-300 hover:shadow-2xl">
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold text-gray-800">Crear Cuenta de Empresa</h2>
      <p class="text-gray-500 text-sm mt-2">Configura tu espacio de trabajo en Smartventory</p>
    </div>

    <!-- Stepper -->
    <div class="flex items-center justify-center mb-8">
      <div class="flex items-center">
        <div :class="`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`">1</div>
        <div :class="`h-1 w-16 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`"></div>
        <div :class="`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`">2</div>
      </div>
    </div>

    <form @submit.prevent="register" class="space-y-6">
      
      <!-- Paso 1: Datos de la Empresa -->
      <div v-if="step === 1" class="space-y-4 animate-fade-in">
        <h3 class="text-lg font-semibold text-gray-700 border-b pb-2">Datos del Negocio</h3>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nombre de la Organización</label>
          <input v-model="form.nombre_empresa" type="text" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Mi Empresa S.A." required />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">País</label>
            <select v-model="form.pais" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="MX">México</option>
              <option value="CO">Colombia</option>
              <option value="AR">Argentina</option>
              <option value="ES">España</option>
              <option value="US">Estados Unidos</option>
              <option value="CL">Chile</option>
              <option value="PE">Perú</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Moneda Base</label>
            <select v-model="form.moneda" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="USD">USD - Dólar Estadounidense</option>
              <option value="MXN">MXN - Peso Mexicano</option>
              <option value="COP">COP - Peso Colombiano</option>
              <option value="EUR">EUR - Euro</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Zona Horaria</label>
          <select v-model="form.zona_horaria" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="UTC">UTC (Universal)</option>
            <option value="America/Mexico_City">America/Mexico_City</option>
            <option value="America/Bogota">America/Bogota</option>
            <option value="America/Argentina/Buenos_Aires">America/Argentina/Buenos_Aires</option>
            <option value="Europe/Madrid">Europe/Madrid</option>
          </select>
        </div>

        <div class="flex justify-end pt-4">
          <button type="button" @click="nextStep" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Siguiente &rarr;
          </button>
        </div>
      </div>

      <!-- Paso 2: Datos del Administrador -->
      <div v-if="step === 2" class="space-y-4 animate-fade-in">
        <h3 class="text-lg font-semibold text-gray-700 border-b pb-2">Datos del Administrador</h3>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
          <input v-model="form.nombre" type="text" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Juan Pérez" required />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
          <input v-model="form.correo" type="email" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="admin@miempresa.com" required />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <input v-model="form.contrasena" type="password" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="••••••••" required />
          <p class="text-xs text-gray-500 mt-1">Mínimo 8 caracteres</p>
        </div>

        <div class="flex justify-between pt-4">
          <button type="button" @click="step = 1" class="text-gray-600 hover:text-gray-800 px-4 py-2">
            &larr; Volver
          </button>
          <button type="submit" :disabled="cargando" class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
            <span v-if="cargando" class="mr-2">⏳</span>
            {{ cargando ? 'Creando cuenta...' : 'Finalizar Registro' }}
          </button>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mt-4">
        <p class="text-sm text-red-700">{{ error }}</p>
      </div>

    </form>

    <div class="mt-8 text-center border-t border-gray-100 pt-6">
      <p class="text-sm text-gray-600">
        ¿Ya tienes una cuenta? 
        <NuxtLink to="/login" class="font-medium text-blue-600 hover:text-blue-500 hover:underline">
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

const router = useRouter()
const step = ref(1)
const cargando = ref(false)
const error = ref('')

const form = ref({
  nombre_empresa: '',
  pais: 'MX',
  moneda: 'USD',
  zona_horaria: 'UTC',
  nombre: '',
  correo: '',
  contrasena: ''
})

const nextStep = () => {
  if (!form.value.nombre_empresa) {
    error.value = 'El nombre de la empresa es obligatorio'
    return
  }
  error.value = ''
  step.value = 2
}

const register = async () => {
  error.value = ''
  cargando.value = true
  
  try {
    const res = await $fetch('http://localhost:4000/api/users/register', {
      method: 'POST',
      body: form.value
    })
    
    // Auto-login con el token recibido
    localStorage.setItem('token', res.token)
    localStorage.setItem('rol', res.usuario.rol)
    localStorage.setItem('usuario', JSON.stringify(res.usuario))
    
    alert('¡Cuenta creada exitosamente! Bienvenido.')
    router.push('/dashboard')
  } catch (e) {
    error.value = e.data?.mensaje || 'Error al registrar la cuenta.'
  } finally {
    cargando.value = false
  }
}
</script>

<style>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
