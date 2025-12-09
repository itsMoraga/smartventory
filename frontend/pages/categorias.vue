<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Navbar simple -->
    <nav class="bg-white shadow p-4 mb-8">
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <NuxtLink to="/dashboard" class="text-gray-500 hover:text-blue-600">← Volver</NuxtLink>
          <h1 class="text-xl font-bold text-gray-800">Gestión de Categorías</h1>
        </div>
        <button 
          @click="abrirModalCrear"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          + Nueva Categoría
        </button>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-4 pb-10">
      <!-- Loading State -->
      <div v-if="pending" class="text-center py-10">
        <p class="text-gray-500">Cargando categorías...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-10 text-red-500">
        Error al cargar categorías: {{ error.message }}
      </div>

      <!-- Empty State -->
      <div v-else-if="categorias.length === 0" class="text-center py-10 bg-white rounded-lg shadow">
        <p class="text-gray-500 mb-4">No hay categorías registradas</p>
        <button @click="abrirModalCrear" class="text-blue-600 hover:underline">Crear la primera</button>
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
    </main>

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