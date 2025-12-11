<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
      <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 class="text-lg font-semibold text-gray-800">
          {{ producto?.id_producto ? 'Editar Producto' : 'Nuevo Producto' }}
        </h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">✕</button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <!-- Galería de imágenes solo en edición -->
        <div v-if="producto?.id_producto" class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Imágenes</label>
          <GaleriaProducto :idProducto="producto.id_producto" @saved="emit('saved')" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input 
            v-model="form.nombre" 
            type="text" 
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea 
            v-model="form.descripcion" 
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Precio</label>
            <input 
              v-model="form.precio" 
              type="number" 
              step="0.01"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select 
              v-model="form.id_categoria"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option :value="null">Seleccionar...</option>
              <option v-for="cat in categorias" :key="cat.id_categoria" :value="cat.id_categoria">
                {{ cat.nombre }}
              </option>
            </select>
          </div>
        </div>

        <!-- Campo oculto o temporal para usuario -->
        <input type="hidden" v-model="form.id_usuario" />

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
import GaleriaProducto from './GaleriaProducto.vue'
const props = defineProps({
  isOpen: Boolean,
  producto: Object
})

const emit = defineEmits(['close', 'saved'])

const categorias = ref([])
const form = ref({
  nombre: '',
  descripcion: '',
  precio: '',
  id_categoria: null,
  id_usuario: 1 // TODO: Obtener del usuario logueado real
})

// Cargar categorías al montar
onMounted(async () => {
  try {
    categorias.value = await $fetch('http://localhost:4000/api/categories')
  } catch (e) {
    console.error('Error cargando categorías', e)
  }
})

// Actualizar formulario cuando cambia el producto seleccionado
watch(() => props.producto, (newVal) => {
  if (newVal) {
    form.value = { ...newVal }
  } else {
    form.value = {
      nombre: '',
      descripcion: '',
      precio: '',
      id_categoria: null,
      id_usuario: 1
    }
  }
})

const handleSubmit = async () => {
  try {
    const url = props.producto?.id_producto 
      ? `http://localhost:4000/api/products/${props.producto.id_producto}`
      : 'http://localhost:4000/api/products'
    
    const method = props.producto?.id_producto ? 'PUT' : 'POST'

    await $fetch(url, {
      method,
      body: form.value
    })

    emit('saved')
    emit('close')
  } catch (e) {
    alert('Error al guardar: ' + (e.data?.mensaje || e.message))
  }
}
</script>