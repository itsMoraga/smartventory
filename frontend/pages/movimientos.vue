<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">Historial de Movimientos</h1>
        <p class="text-gray-500 mt-1">Registro completo de entradas y salidas</p>
      </div>
      <div class="flex gap-2">
        <button 
          @click="cargarMovimientos"
          class="bg-white text-gray-600 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center font-medium"
        >
          🔄 Actualizar
        </button>
      </div>
    </div>

    <!-- Filtros -->
    <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8">
      <div class="flex flex-col md:flex-row gap-4 items-center">
        <!-- Búsqueda -->
        <div class="relative w-full md:w-96">
          <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
          <input
            v-model="busqueda"
            type="text"
            placeholder="Buscar por producto o usuario..."
            class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <!-- Filtro Tipo -->
        <select 
          v-model="filtroTipo"
          class="w-full md:w-48 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los tipos</option>
          <option value="entrada">Entradas</option>
          <option value="salida">Salidas</option>
          <option value="ajuste">Ajustes</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
      Error al cargar movimientos: {{ error.message }}
    </div>

    <!-- Tabla de Movimientos -->
    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
              <th class="px-6 py-4">Fecha</th>
              <th class="px-6 py-4">Producto</th>
              <th class="px-6 py-4">Tipo</th>
              <th class="px-6 py-4 text-right">Cantidad</th>
              <th class="px-6 py-4">Usuario</th>
              <th class="px-6 py-4">Observaciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="mov in movimientosFiltrados" :key="mov.id_movimiento" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 text-gray-600 whitespace-nowrap">
                {{ new Date(mov.fecha).toLocaleString() }}
              </td>
              <td class="px-6 py-4 font-medium text-gray-900">
                {{ mov.Producto?.nombre || 'Producto eliminado' }}
              </td>
              <td class="px-6 py-4">
                <span 
                  class="px-3 py-1 rounded-full text-xs font-semibold flex items-center w-fit"
                  :class="{
                    'bg-green-100 text-green-700': mov.tipo === 'entrada',
                    'bg-red-100 text-red-700': mov.tipo === 'salida',
                    'bg-yellow-100 text-yellow-700': mov.tipo === 'ajuste'
                  }"
                >
                  <span class="mr-1 text-sm">
                    {{ mov.tipo === 'entrada' ? '⬇️' : mov.tipo === 'salida' ? '⬆️' : '⚖️' }}
                  </span>
                  {{ mov.tipo.charAt(0).toUpperCase() + mov.tipo.slice(1) }}
                </span>
              </td>
              <td class="px-6 py-4 text-right font-mono font-medium">
                {{ mov.cantidad }}
              </td>
              <td class="px-6 py-4 text-gray-600">
                <div class="flex items-center">
                  <div class="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold mr-2 text-gray-600">
                    {{ (mov.Usuario?.nombre || '?').charAt(0).toUpperCase() }}
                  </div>
                  {{ mov.Usuario?.nombre || 'Desconocido' }}
                </div>
              </td>
              <td class="px-6 py-4 text-gray-500 text-sm italic max-w-xs truncate">
                {{ mov.observaciones || '-' }}
              </td>
            </tr>
            <tr v-if="movimientosFiltrados.length === 0">
              <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                No se encontraron movimientos con los filtros actuales.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const movimientos = ref([])
const pending = ref(true)
const error = ref(null)
const busqueda = ref('')
const filtroTipo = ref('')

const cargarMovimientos = async () => {
  pending.value = true
  error.value = null
  try {
    const token = localStorage.getItem('token')
    movimientos.value = await $fetch('http://localhost:4000/api/movimientos', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  } catch (e) {
    error.value = e
    if (e.response?.status === 401) {
      router.push('/login')
    }
  } finally {
    pending.value = false
  }
}

const movimientosFiltrados = computed(() => {
  let lista = movimientos.value

  if (filtroTipo.value) {
    lista = lista.filter(m => m.tipo === filtroTipo.value)
  }

  if (busqueda.value.trim()) {
    const q = busqueda.value.toLowerCase()
    lista = lista.filter(m => 
      (m.Producto?.nombre || '').toLowerCase().includes(q) ||
      (m.Usuario?.nombre || '').toLowerCase().includes(q) ||
      (m.observaciones || '').toLowerCase().includes(q)
    )
  }

  return lista
})

onMounted(() => {
  if (!localStorage.getItem('token')) {
    router.push('/login')
    return
  }
  cargarMovimientos()
})
</script>
