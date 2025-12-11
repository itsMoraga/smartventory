<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Navbar simple -->
    <nav class="bg-white shadow p-4 mb-8">
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <NuxtLink to="/dashboard" class="text-gray-500 hover:text-blue-600">← Volver</NuxtLink>
          <h1 class="text-xl font-bold text-gray-800">Gestión de Productos</h1>
        </div>
        <button 
          v-if="rol === 'admin' || rol === 'operador'"
          @click="abrirModalCrear"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          + Nuevo Producto
        </button>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-4 pb-10">
      <!-- Filtro por categoría -->
      <div class="mb-6 max-w-xs">
        <CategoriaSelect 
          v-if="categorias.length > 0"
          :categorias="categorias" 
          v-model="categoriaSeleccionada"
        />
      </div>

      <!-- Barra de búsqueda y filtros -->
      <div class="mb-6 max-w-md flex items-center space-x-4">
        <input
          v-model="busqueda"
          type="text"
          placeholder="Buscar productos por nombre o descripción..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          @click="mostrarSoloStockBajo = !mostrarSoloStockBajo; mostrarSoloAgotados = false"
          :class="mostrarSoloStockBajo ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'"
          class="px-4 py-2 rounded-md font-semibold transition-colors"
        >
          <span v-if="mostrarSoloStockBajo">Mostrar todos</span>
          <span v-else>Solo stock bajo ⚠️</span>
        </button>
        <button
          @click="mostrarSoloAgotados = !mostrarSoloAgotados; mostrarSoloStockBajo = false"
          :class="mostrarSoloAgotados ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700'"
          class="px-4 py-2 rounded-md font-semibold transition-colors"
        >
          <span v-if="mostrarSoloAgotados">Mostrar todos</span>
          <span v-else>Solo agotados 🛑</span>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="text-center py-10">
        <p class="text-gray-500">Cargando productos...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-10 text-red-500">
        Error al cargar productos: {{ error.message }}
      </div>

      <!-- Empty State -->
      <div v-else-if="productosFiltrados.length === 0" class="text-center py-10 bg-white rounded-lg shadow">
        <p class="text-gray-500 mb-4">No hay productos registrados</p>
        <button @click="abrirModalCrear" class="text-blue-600 hover:underline">Crear el primero</button>
      </div>

      <!-- Grid de Productos con scroll infinito -->
      <div 
        v-else 
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        ref="gridRef"
      >
        <ProductoCard 
          v-for="prod in productosScroll" 
          :key="prod.id_producto" 
          :producto="prod"
          @editar="abrirModalEditar"
          @eliminar="eliminarProducto"
        />
      </div>
      <div v-if="cargandoMas" class="text-center py-4 text-gray-500">Cargando más productos...</div>
    </main>

    <!-- Modal Formulario -->
    <ProductoForm 
      :is-open="mostrarModal" 
      :producto="productoSeleccionado"
      @close="cerrarModal"
      @saved="recargarProductos"
    />
  </div>
</template>

<script setup>
const rol = ref(localStorage.getItem('rol'))
import CategoriaSelect from '~/components/CategoriaSelect.vue'

const mostrarModal = ref(false)
const productoSeleccionado = ref(null)

// Fetch de productos
const { data: productos, pending, error, refresh } = await useFetch('http://localhost:4000/api/products', {
  default: () => []
})

// Fetch de categorías para el filtro
const { data: categorias = [] } = await useFetch('http://localhost:4000/api/categories', {
  default: () => []
})

const categoriaSeleccionada = ref(null)
const busqueda = ref('')

const mostrarSoloStockBajo = ref(false)
const mostrarSoloAgotados = ref(false)
const productosFiltrados = computed(() => {
  let lista = productos.value
  if (categoriaSeleccionada.value) {
    lista = lista.filter(p => p.id_categoria === categoriaSeleccionada.value)
  }
  if (busqueda.value.trim()) {
    // Normalizar búsqueda: quitar espacios, minúsculas
    const q = busqueda.value.trim().toLowerCase().replace(/\s+/g, '')
    lista = lista.filter(p => {
      // Normalizar nombre y descripción
      const nombreNorm = (p.nombre || '').toLowerCase().replace(/\s+/g, '')
      const descNorm = (p.descripcion || '').toLowerCase().replace(/\s+/g, '')
      return nombreNorm.includes(q) || descNorm.includes(q)
    })
  }
  if (mostrarSoloStockBajo.value && !mostrarSoloAgotados.value) {
    lista = lista.filter(p => p.cantidad <= p.stock_minimo && p.cantidad > 0)
  } else if (mostrarSoloAgotados.value) {
    lista = lista.filter(p => p.cantidad === 0)
  }
  return lista
})

// Scroll infinito
const gridRef = ref(null)
const productosScroll = ref([])
const pageSize = 12
const page = ref(1)
const cargandoMas = ref(false)

function cargarMas(reset = false) {
  if (reset) {
    page.value = 1
    productosScroll.value = []
  }
  cargandoMas.value = true
  setTimeout(() => {
    const start = 0
    const end = page.value * pageSize
    productosScroll.value = productosFiltrados.value.slice(start, end)
    cargandoMas.value = false
  }, 300)
}

watch([
  productosFiltrados,
  mostrarSoloStockBajo,
  mostrarSoloAgotados,
  categoriaSeleccionada,
  busqueda
], () => {
  cargarMas(true)
})

onMounted(() => {
  cargarMas(true)
  window.addEventListener('scroll', handleScroll)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

function handleScroll() {
  const bottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200
  if (bottom && productosScroll.value.length < productosFiltrados.value.length) {
    page.value++
    cargarMas()
  }
}

const abrirModalCrear = () => {
  productoSeleccionado.value = null
  mostrarModal.value = true
}

const abrirModalEditar = (producto) => {
  productoSeleccionado.value = producto
  mostrarModal.value = true
}

const cerrarModal = () => {
  mostrarModal.value = false
  productoSeleccionado.value = null
}

const recargarProductos = () => {
  refresh()
}

const eliminarProducto = async (id) => {
  if (!confirm('¿Estás seguro de eliminar este producto?')) return

  try {
    const token = localStorage.getItem('token')
    await $fetch(`http://localhost:4000/api/products/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    refresh() // Recargar lista
  } catch (e) {
    alert('Error al eliminar: ' + e.message)
  }
}
</script>