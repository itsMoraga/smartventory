
<script setup>
const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const handleLogin = async () => {
  error.value = '' // Limpiar errores previos
  
  try {
    // Petición al backend
    const response = await $fetch('http://localhost:4000/api/users/login', {
      method: 'POST',
      body: {
        correo: email.value,
        contrasena: password.value
      }
    })

    console.log('Login exitoso:', response)
    // Si todo sale bien, redirigir al dashboard
    router.push('/dashboard')

  } catch (err) {
    console.error('Error en login:', err)
    // Mostrar mensaje de error si falla (ej: credenciales incorrectas)
    error.value = err.data?.mensaje || 'Error al iniciar sesión. Verifica tus datos.'
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="max-w-sm w-full bg-white rounded-lg shadow-md p-8">
      <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">Smartventory</h1>
      
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
          <input 
            type="email" 
            v-model="email" 
            required
            class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="ejemplo@correo.com"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <input 
            type="password" 
            v-model="password" 
            required
            class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="••••••••"
          />
        </div>

        <div v-if="error" class="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
          {{ error }}
        </div>

        <button 
          type="submit" 
          class="w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition duration-200"
        >
          Entrar
        </button>
      </form>
    </div>
  </div>
</template>