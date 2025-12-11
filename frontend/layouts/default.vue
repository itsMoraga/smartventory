<template>
  <div class="flex h-screen bg-gray-100 font-sans">
    <!-- Sidebar -->
    <aside class="w-64 bg-slate-900 text-white flex flex-col shadow-xl fixed h-full z-10 transition-all duration-300">
      <!-- Brand -->
      <div class="p-6 border-b border-slate-800 flex items-center space-x-3">
        <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl">S</div>
        <span class="text-xl font-bold tracking-wide">Smartventory</span>
      </div>
      
      <!-- Navigation -->
      <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
        <p class="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Menu</p>
        
        <NuxtLink to="/dashboard" active-class="bg-blue-600 text-white shadow-lg" class="flex items-center px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all group">
          <span class="mr-3 text-xl">📊</span>
          <span class="font-medium">Dashboard</span>
        </NuxtLink>

        <NuxtLink to="/productos" active-class="bg-blue-600 text-white shadow-lg" class="flex items-center px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all group">
          <span class="mr-3 text-xl">📦</span>
          <span class="font-medium">Productos</span>
        </NuxtLink>

        <NuxtLink to="/categorias" active-class="bg-blue-600 text-white shadow-lg" class="flex items-center px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all group">
          <span class="mr-3 text-xl">🏷️</span>
          <span class="font-medium">Categorías</span>
        </NuxtLink>

        <div v-if="esAdmin" class="pt-4 mt-4 border-t border-slate-800">
          <p class="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Admin</p>
          <NuxtLink to="/usuarios" active-class="bg-blue-600 text-white shadow-lg" class="flex items-center px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all group">
            <span class="mr-3 text-xl">👥</span>
            <span class="font-medium">Usuarios</span>
          </NuxtLink>
        </div>
      </nav>

      <!-- User Profile -->
      <div class="p-4 border-t border-slate-800 bg-slate-900">
        <div class="flex items-center mb-4 px-2">
          <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
            {{ iniciales }}
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-white">{{ nombreUsuario }}</p>
            <p class="text-xs text-slate-400 capitalize">{{ rol }}</p>
          </div>
        </div>
        <button @click="logout" class="w-full flex items-center justify-center px-4 py-2 border border-slate-700 rounded-lg text-sm font-medium text-slate-300 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors">
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>

    <!-- Main Content Wrapper -->
    <div class="flex-1 ml-64 flex flex-col min-h-screen">
      <!-- Top Header (Optional, for mobile toggle or breadcrumbs) -->
      <!-- <header class="bg-white shadow-sm h-16 flex items-center px-8"> ... </header> -->

      <!-- Page Content -->
      <main class="flex-1 p-8 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const nombreUsuario = ref('Usuario')
const rol = ref('')

const iniciales = computed(() => {
  return nombreUsuario.value.charAt(0).toUpperCase()
})

const esAdmin = computed(() => rol.value === 'admin')

onMounted(() => {
  // Recuperar datos del usuario
  const usuarioStr = localStorage.getItem('usuario')
  if (usuarioStr) {
    try {
      const usuario = JSON.parse(usuarioStr)
      nombreUsuario.value = usuario.nombre || 'Usuario'
      rol.value = usuario.rol || 'operador'
    } catch (e) {
      console.error('Error parsing usuario', e)
    }
  }
  
  // Si no hay token, redirigir (doble check)
  if (!localStorage.getItem('token')) {
    // router.push('/login') // Comentado para evitar bucles si se usa en login, se debe manejar con layout: false
  }
})

const logout = () => {
  if(confirm('¿Cerrar sesión?')) {
    localStorage.removeItem('token')
    localStorage.removeItem('rol')
    localStorage.removeItem('usuario')
    router.push('/login')
  }
}
</script>
