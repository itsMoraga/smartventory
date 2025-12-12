<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Gestión de Categorías</h1>
      <button 
        @click="abrirModalCrear"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-md"
      >
        <span class="mr-2 text-xl">+</span> Nueva Categoría
      </button>
    </div>

    <!-- Loading/Error states -->
    <div v-if="pending" class="text-center py-10">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
    </div>
    <div v-else-if="error" class="bg-red-100 text-red-700 p-4 rounded-lg mb-6 border border-red-200">
      Error al cargar categorías: {{ error.message }}
    </div>

    <!-- Grid de Categorías -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <CategoriaCard 
        v-for="cat in categories" 
        :key="cat.id_categoria" 
        :categoria="cat"
        @editar="abrirModalEditar"
        @eliminar="confirmarEliminar"
      />
    </div>

    <!-- Modal Formulario -->
    <CategoriaForm 
      :is-open="modalOpen"
      :categoria="categoriaEditando"
      @close="cerrarModal"
      @saved="recargarCategorias"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CategoriaCard from '~/components/CategoriaCard.vue'
import CategoriaForm from '~/components/CategoriaForm.vue'

const config = useRuntimeConfig()
const apiBase = config.public.apiBase || 'http://localhost:4000/api'

const modalOpen = ref(false)
const categoriaEditando = ref(null)

const { data: categories, pending, error, refresh } = await useFetch(`${apiBase}/categories`, {
    headers: {
        Authorization: `Bearer ${import.meta.client ? localStorage.getItem('token') : ''}`
    },
    server: false
})

const abrirModalCrear = () => {
  categoriaEditando.value = null
  modalOpen.value = true
}

const abrirModalEditar = (categoria) => {
  categoriaEditando.value = { ...categoria }
  modalOpen.value = true
}

const cerrarModal = () => {
  modalOpen.value = false
  categoriaEditando.value = null
}

const recargarCategorias = () => {
  refresh()
  cerrarModal()
}

const confirmarEliminar = async (id) => {
  if (!confirm('¿Estás seguro de eliminar esta categoría?')) return

  try {
    await $fetch(`${apiBase}/categories/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    refresh()
  } catch (e) {
    alert('Error al eliminar categoría: ' + (e.data?.mensaje || e.message))
  }
}
</script>
