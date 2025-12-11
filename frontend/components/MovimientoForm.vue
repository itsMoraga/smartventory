<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
      <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 class="text-lg font-semibold text-gray-800">
          Registrar Movimiento
        </h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">✕</button>
      </div>
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de movimiento</label>
          <select v-model="form.tipo" required class="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option value="entrada">Entrada</option>
            <option value="salida">Salida</option>
            <option value="ajuste">Ajuste</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
          <input v-model.number="form.cantidad" type="number" min="1" required class="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
          <input v-model="form.observaciones" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        <div class="flex justify-end space-x-3 mt-6">
          <button type="button" @click="$emit('close')" class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">Cancelar</button>
          <button type="submit" class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">Registrar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isOpen: Boolean,
  idProducto: Number,
  idUsuario: Number // puedes obtenerlo del contexto de sesión si lo tienes
})

const emit = defineEmits(['close', 'saved'])

const form = ref({
  tipo: 'entrada',
  cantidad: 1,
  observaciones: ''
})

const handleSubmit = async () => {
  try {
    await $fetch('http://localhost:4000/api/movimientos', {
      method: 'POST',
      body: {
        id_producto: props.idProducto,
        tipo: form.value.tipo,
        cantidad: form.value.cantidad,
        id_usuario: props.idUsuario || 1,
        observaciones: form.value.observaciones
      }
    })
    emit('saved')
    emit('close')
  } catch (e) {
    alert('Error al registrar movimiento: ' + (e.data?.mensaje || e.message))
  }
}
</script>
