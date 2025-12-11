<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer" @click="abrirPreview">
    <!-- Imagen real del producto si existe, si no, placeholder -->
    <div class="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
      <img v-if="producto.foto" :src="getImageUrl(producto.foto)" alt="Foto del producto" class="object-cover w-full h-full pointer-events-none" />
      <span v-else class="text-gray-400 text-4xl pointer-events-none">📷</span>
    </div>
    
    <div class="p-4">
      <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ producto.nombre }}</h3>
      <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ producto.descripcion || 'Sin descripción' }}</p>
      
      <div class="flex justify-between items-center" @click.stop>

        <span class="text-xl font-bold text-blue-600">${{ producto.precio }}</span>

        <!-- Alerta de stock bajo -->
        <span v-if="producto.cantidad <= producto.stock_minimo" class="ml-2 px-2 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded-full flex items-center" title="Stock bajo">
          <span class="mr-1">⚠️</span> Stock bajo
        </span>

        <div class="flex space-x-2">
          <button 
            v-if="rol === 'admin' || rol === 'operador'"
            @click="$emit('editar', producto)" 
            class="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            title="Editar"
          >
            ✏️
          </button>
          <button 
            v-if="rol === 'admin'"
            @click="$emit('eliminar', producto.id_producto)" 
            class="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
            title="Eliminar"
          >
            🗑️
          </button>
        </div>
      </div>
      <!-- Botón para mostrar historial de movimientos -->
      <div class="mt-4 flex justify-end space-x-2" @click.stop>
          <!-- Modal de previsualización de imágenes -->
          <PreviewProducto v-if="mostrarPreview" :idProducto="producto.id_producto" :isOpen="mostrarPreview" @close="mostrarPreview = false" />
        <button @click="mostrarHistorial = true" class="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-blue-100 font-semibold text-sm">Movimientos</button>
        <button @click="mostrarForm = true" class="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 font-semibold text-sm">Registrar movimiento</button>
      </div>

      <!-- Modal de historial -->
      <div v-if="mostrarHistorial" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 relative">
          <button @click="mostrarHistorial = false" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl">&times;</button>
          <HistorialMovimientos :idProducto="producto.id_producto" />
        </div>
      </div>

      <!-- Modal para registrar movimiento -->
      <MovimientoForm 
        v-if="mostrarForm" 
        :is-open="mostrarForm" 
        :id-producto="producto.id_producto" 
        :id-usuario="1" 
        @close="mostrarForm = false" 
        @saved="mostrarHistorial = true"
      />
    </div>
  </div>
</template>

<script setup>
const rol = localStorage.getItem('rol')
import { ref } from 'vue'
import HistorialMovimientos from './HistorialMovimientos.vue'
import MovimientoForm from './MovimientoForm.vue'
import PreviewProducto from './PreviewProducto.vue'
const mostrarPreview = ref(false)
function abrirPreview() {
  mostrarPreview.value = true
}

// Helper para construir la URL completa si es relativa
function getImageUrl(url) {
  if (!url) return ''
  // Si la url ya es absoluta, la usamos tal cual
  if (url.startsWith('http')) return url
  // Si es relativa, asumimos que el backend sirve las imágenes en /uploads
  return `http://localhost:4000/uploads/${url}`
}

const props = defineProps({
  producto: {
    type: Object,
    required: true
  }
})



const mostrarHistorial = ref(false)
const mostrarForm = ref(false)

function cerrarHistorial() {
  mostrarHistorial.value = false
}
function cerrarForm() {
  mostrarForm.value = false
}

defineEmits(['editar', 'eliminar'])
</script>