<template>
  <div>
    <!-- Header de la página -->
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">Gestión de Productos</h1>
        <p class="text-gray-500 mt-1">Administra tu inventario, precios y stock</p>
      </div>
      <button 
        v-if="rol === 'admin' || rol === 'operador'"
        @click="abrirModalCrear"
        class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center font-semibold"
      >
        <span class="mr-2 text-xl">+</span> Nuevo Producto
      </button>
    </div>

    <!-- Filtros y Búsqueda -->
    <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8">
      <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
        <!-- Búsqueda -->
        <div class="relative w-full md:w-96">
          <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
          <input
            v-model="busqueda"
            type="text"
            placeholder="Buscar por nombre..."
            class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <!-- Filtros Rápidos -->
        <div class="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
          <button
            @click="mostrarSoloStockBajo = !mostrarSoloStockBajo; mostrarSoloAgotados = false"
            :class="mostrarSoloStockBajo ? 'bg-red-100 text-red-700 border-red-200' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'"
            class="px-4 py-2 rounded-lg border text-sm font-medium transition-all whitespace-nowrap flex items-center"
          >
            <span class="mr-2">⚠️</span> Stock Bajo
          </button>
          <button
            @click="mostrarSoloAgotados = !mostrarSoloAgotados; mostrarSoloStockBajo = false"
            :class="mostrarSoloAgotados ? 'bg-orange-100 text-orange-700 border-orange-200' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'"
            class="px-4 py-2 rounded-lg border text-sm font-medium transition-all whitespace-nowrap flex items-center"
          >
            <span class="mr-2">🛑</span> Agotados
          </button>
        </div>

        <!-- Categoría -->
        <div class="w-full md:w-64">
          <CategoriaSelect 
            v-if="categorias.length > 0"
            :categorias="categorias" 
            v-model="categoriaSeleccionada"
          />
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
      Error al cargar productos: {{ error.message }}
    </div>

    <!-- Empty State -->
    <div v-else-if="productosFiltrados.length === 0" class="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
      <div class="text-6xl mb-4">📦</div>
      <h3 class="text-xl font-medium text-gray-900">No se encontraron productos</h3>
      <p class="text-gray-500 mt-2 mb-6">Intenta ajustar los filtros o crea un nuevo producto.</p>
      <button @click="abrirModalCrear" class="text-blue-600 font-medium hover:underline">Crear producto</button>
    </div>

    <!-- Grid de Productos -->
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
    
    <div v-if="cargandoMas" class="flex justify-center py-8">
      <div class="animate-pulse text-gray-400 font-medium">Cargando más...</div>
    </div>

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