<template>
  <div>
    <h2 class="text-3xl font-bold text-gray-800 mb-8">Panel de Control</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Tarjeta de Productos -->
      <NuxtLink to="/productos" class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer block relative group">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Productos</p>
            <h3 class="text-3xl font-bold text-gray-900 mt-2">{{ totalProductos }}</h3>
          </div>
          <span class="p-3 rounded-lg bg-blue-50 text-blue-600 text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">📦</span>
        </div>
        <p class="mt-4 text-sm text-gray-500 flex items-center">
          <span>Gestionar inventario</span>
          <span class="ml-1">→</span>
        </p>
        <div v-if="stockBajo > 0" class="absolute top-4 right-4 flex items-center bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold animate-pulse">
          ⚠️ {{ stockBajo }} stock bajo
        </div>
      </NuxtLink>

      <!-- Tarjeta de Categorías -->
      <NuxtLink to="/categorias" class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer block group">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Categorías</p>
            <h3 class="text-3xl font-bold text-gray-900 mt-2">5</h3>
          </div>
          <span class="p-3 rounded-lg bg-green-50 text-green-600 text-xl group-hover:bg-green-600 group-hover:text-white transition-colors">🏷️</span>
        </div>
        <p class="mt-4 text-sm text-gray-500 flex items-center">
          <span>Gestionar categorías</span>
          <span class="ml-1">→</span>
        </p>
      </NuxtLink>

      <!-- Tarjeta de Usuarios -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Usuarios</p>
            <h3 class="text-3xl font-bold text-gray-900 mt-2">3</h3>
          </div>
          <span class="p-3 rounded-lg bg-purple-50 text-purple-600 text-xl">👥</span>
        </div>
        <p class="mt-4 text-sm text-gray-500">Usuarios registrados</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const router = useRouter()

// Proteger acceso: redirigir si no hay token
if (!localStorage.getItem('token')) {
  router.push('/login')
}

const totalProductos = ref(0)
const stockBajo = ref(0)

onMounted(async () => {
  try {
    const productos = await $fetch('http://localhost:4000/api/products')
    totalProductos.value = productos.length
    stockBajo.value = productos.filter(p => p.cantidad <= p.stock_minimo).length
  } catch (e) {
    totalProductos.value = 0
    stockBajo.value = 0
  }
})
</script>
