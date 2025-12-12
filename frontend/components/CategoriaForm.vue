<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
      <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 class="text-lg font-semibold text-gray-800">
          {{ categoria?.id_categoria ? 'Editar Categoría' : 'Nueva Categoría' }}
        </h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">✕</button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input 
            v-model="form.nombre" 
            type="text" 
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="flex justify-end space-x-3 mt-6">
          <button 
            type="button" 
            @click="$emit('close')"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isOpen: Boolean,
  categoria: Object
})

const emit = defineEmits(['close', 'saved'])

const form = ref({ nombre: '' })

// Actualizar formulario cuando cambia la categoría seleccionada
watch(() => props.categoria, (newVal) => {
  if (newVal) {
    form.value = { ...newVal }
  } else {
    form.value = { nombre: '' }
  }
})

const handleSubmit = async () => {
  try {
    const url = props.categoria?.id_categoria 
      ? `http://localhost:4000/api/categories/${props.categoria.id_categoria}`
      : 'http://localhost:4000/api/categories'
    
    const method = props.categoria?.id_categoria ? 'PUT' : 'POST'

    await $fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: form.value
    })

    emit('saved')
    emit('close')
  } catch (e) {
    alert('Error al guardar: ' + (e.data?.mensaje || e.message))
  }
}
</script>