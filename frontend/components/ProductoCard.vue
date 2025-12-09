<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <!-- Placeholder para imagen (luego implementaremos la real) -->
    <div class="h-48 bg-gray-200 flex items-center justify-center">
      <span class="text-gray-400 text-4xl">📷</span>
    </div>
    
    <div class="p-4">
      <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ producto.nombre }}</h3>
      <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ producto.descripcion || 'Sin descripción' }}</p>
      
      <div class="flex justify-between items-center">
        <span class="text-xl font-bold text-blue-600">${{ producto.precio }}</span>
        
        <div class="flex space-x-2">
          <button 
            @click="$emit('editar', producto)" 
            class="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            title="Editar"
          >
            ✏️
          </button>
          <button 
            @click="$emit('eliminar', producto.id_producto)" 
            class="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
            title="Eliminar"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  producto: {
    type: Object,
    required: true
  }
})

defineEmits(['editar', 'eliminar'])
</script>