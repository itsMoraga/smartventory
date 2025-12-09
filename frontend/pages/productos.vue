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

      <!-- Grid de Productos -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <ProductoCard 
          v-for="prod in productosFiltrados" 
          :key="prod.id_producto" 
          :producto="prod"
          @editar="abrirModalEditar"
          @eliminar="eliminarProducto"
        />
      </div>
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

const productosFiltrados = computed(() => {
  if (!categoriaSeleccionada.value) return productos.value
  return productos.value.filter(p => p.id_categoria === categoriaSeleccionada.value)
})

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
    await $fetch(`http://localhost:4000/api/products/${id}`, {
      method: 'DELETE'
    })
    refresh() // Recargar lista
  } catch (e) {
    alert('Error al eliminar: ' + e.message)
  }
}
</script>