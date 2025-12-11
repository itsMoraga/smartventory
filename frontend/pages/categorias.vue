<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">Categorías</h1>
        <p class="text-gray-500 mt-1">Organiza tus productos en categorías</p>
      </div>
      <button 
        @click="abrirModalCrear"
        class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center font-semibold"
      >
        <span class="mr-2 text-xl">+</span> Nueva Categoría
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
      Error al cargar categorías: {{ error.message }}
    </div>

    <!-- Empty State -->
    <div v-else-if="categorias.length === 0" class="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
      <div class="text-6xl mb-4">📂</div>
      <h3 class="text-xl font-medium text-gray-900">No hay categorías</h3>
      <p class="text-gray-500 mt-2 mb-6">Crea categorías para organizar mejor tu inventario.</p>
      <button @click="abrirModalCrear" class="text-blue-600 font-medium hover:underline">Crear categoría</button>
    </div>

    <!-- Grid de Categorías -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <CategoriaCard 
        v-for="cat in categorias" 
        :key="cat.id_categoria" 
        :categoria="cat"
        @editar="abrirModalEditar"
        @eliminar="eliminarCategoria"
      />
    </div>

    <!-- Modal Formulario -->
    <CategoriaForm 
      :is-open="mostrarModal" 
      :categoria="categoriaSeleccionada"
      @close="cerrarModal"
      @saved="recargarCategorias"
    />
  </div>
</template>

<script setup>
const mostrarModal = ref(false)
const categoriaSeleccionada = ref(null)

// Fetch de categorías
const { data: categorias, pending, error, refresh } = await useFetch('http://localhost:4000/api/categories', {
  default: () => []
})

const abrirModalCrear = () => {
  categoriaSeleccionada.value = null
  mostrarModal.value = true
}

const abrirModalEditar = (categoria) => {
  categoriaSeleccionada.value = categoria
  mostrarModal.value = true
}

const cerrarModal = () => {
  mostrarModal.value = false
  categoriaSeleccionada.value = null
}

const recargarCategorias = () => {
  refresh()
}

const eliminarCategoria = async (id) => {
  if (!confirm('¿Estás seguro de eliminar esta categoría?')) return

  try {
    await $fetch(`http://localhost:4000/api/categories/${id}`, {
      method: 'DELETE'
    })
    refresh() // Recargar lista
  } catch (e) {
    alert('Error al eliminar: ' + e.message)
  }
}
</script>