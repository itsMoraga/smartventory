<template>
  <div>
    <h2 class="text-3xl font-bold text-gray-800 mb-8">Panel de Control</h2>
    
    <!-- KPIs -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <!-- Tarjeta de Valor Inventario -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Valor Total</p>
            <h3 class="text-3xl font-bold text-gray-900 mt-2">${{ stats.kpis.valorTotalInventario?.toLocaleString() || '0' }}</h3>
          </div>
          <span class="p-3 rounded-lg bg-yellow-50 text-yellow-600 text-xl">💰</span>
        </div>
        <p class="mt-4 text-sm text-gray-500">Costo total del inventario</p>
      </div>

      <!-- Tarjeta de Productos -->
      <NuxtLink to="/productos" class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer block relative group">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Productos</p>
            <h3 class="text-3xl font-bold text-gray-900 mt-2">{{ stats.kpis.totalProductos }}</h3>
          </div>
          <span class="p-3 rounded-lg bg-blue-50 text-blue-600 text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">📦</span>
        </div>
        <p class="mt-4 text-sm text-gray-500 flex items-center">
          <span>Gestionar inventario</span>
          <span class="ml-1">→</span>
        </p>
      </NuxtLink>

      <!-- Tarjeta de Categorías -->
      <NuxtLink to="/categorias" class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer block group">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Categorías</p>
            <h3 class="text-3xl font-bold text-gray-900 mt-2">{{ stats.kpis.totalCategorias }}</h3>
          </div>
          <span class="p-3 rounded-lg bg-green-50 text-green-600 text-xl group-hover:bg-green-600 group-hover:text-white transition-colors">🏷️</span>
        </div>
        <p class="mt-4 text-sm text-gray-500 flex items-center">
          <span>Gestionar categorías</span>
          <span class="ml-1">→</span>
        </p>
      </NuxtLink>

      <!-- Tarjeta de Usuarios -->
      <NuxtLink to="/usuarios" class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer block group">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Usuarios</p>
            <h3 class="text-3xl font-bold text-gray-900 mt-2">{{ stats.kpis.totalUsuarios }}</h3>
          </div>
          <span class="p-3 rounded-lg bg-purple-50 text-purple-600 text-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">👥</span>
        </div>
        <p class="mt-4 text-sm text-gray-500 flex items-center">
          <span>Gestionar usuarios</span>
          <span class="ml-1">→</span>
        </p>
      </NuxtLink>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Alerta de Stock Bajo -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-red-50">
          <h3 class="font-bold text-red-800 flex items-center">
            <span class="mr-2">⚠️</span> Alerta de Stock Bajo
          </h3>
          <span class="text-xs font-semibold bg-red-200 text-red-800 px-2 py-1 rounded-full">
            {{ stats.stockBajo.length }} productos
          </span>
        </div>
        <div v-if="stats.stockBajo.length === 0" class="p-8 text-center text-gray-500">
          ✅ Todo el inventario está en niveles óptimos.
        </div>
        <ul v-else class="divide-y divide-gray-100">
          <li v-for="prod in stats.stockBajo" :key="prod.id_producto" class="p-4 hover:bg-gray-50 transition-colors">
            <div class="flex justify-between items-center">
              <div>
                <p class="font-medium text-gray-800">{{ prod.nombre }}</p>
                <p class="text-xs text-gray-500">Mínimo requerido: {{ prod.stock_minimo }}</p>
              </div>
              <div class="text-right">
                <span class="text-lg font-bold text-red-600">{{ prod.cantidad }}</span>
                <p class="text-xs text-gray-400">en stock</p>
              </div>
            </div>
          </li>
        </ul>
        <div class="p-4 bg-gray-50 border-t border-gray-100 text-center">
          <NuxtLink to="/productos" class="text-sm text-blue-600 font-medium hover:underline">Ver inventario completo</NuxtLink>
        </div>
      </div>

      <!-- Últimos Movimientos -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 class="font-bold text-gray-800 flex items-center">
            <span class="mr-2">⏱️</span> Actividad Reciente
          </h3>
        </div>
        <div v-if="stats.ultimosMovimientos.length === 0" class="p-8 text-center text-gray-500">
          No hay movimientos recientes.
        </div>
        <ul v-else class="divide-y divide-gray-100">
          <li v-for="mov in stats.ultimosMovimientos" :key="mov.id_movimiento" class="p-4 hover:bg-gray-50 transition-colors">
            <div class="flex items-center space-x-3">
              <div :class="`w-2 h-2 rounded-full ${mov.tipo_movimiento === 'ENTRADA' ? 'bg-green-500' : 'bg-red-500'}`"></div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-800">
                  {{ mov.Producto?.nombre || 'Producto eliminado' }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ new Date(mov.fecha).toLocaleDateString() }} - {{ mov.Usuario?.nombre }}
                </p>
              </div>
              <div :class="`font-bold ${mov.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}`">
                {{ mov.tipo === 'entrada' ? '+' : '-' }}{{ mov.cantidad }}
              </div>
            </div>
          </li>
        </ul>
        <div class="p-4 bg-gray-50 border-t border-gray-100 text-center">
          <NuxtLink to="/movimientos" class="text-sm text-blue-600 font-medium hover:underline">Ver historial completo</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const router = useRouter()

// Estado inicial
const stats = ref({
  kpis: {
    totalProductos: 0,
    totalCategorias: 0,
    totalUsuarios: 0,
    valorTotalInventario: 0
  },
  stockBajo: [],
  ultimosMovimientos: []
})

onMounted(async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    router.push('/login')
    return
  }

  try {
    const data = await $fetch('http://localhost:4000/api/dashboard', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    stats.value = data
  } catch (e) {
    console.error('Error cargando dashboard:', e)
  }
})
</script>
