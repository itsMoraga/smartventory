<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <div class="p-4">
      <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ categoria.nombre }}</h3>
      <div class="flex justify-end items-center space-x-2">
        <button 
          @click="$emit('editar', categoria)" 
          class="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          title="Editar"
        >
          ✏️
        </button>
        <button 
          @click="$emit('eliminar', categoria.id_categoria)" 
          class="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
          title="Eliminar"
        >
          🗑️
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  categoria: {
    type: Object,
    required: true
  }
})

defineEmits(['editar', 'eliminar'])
</script>