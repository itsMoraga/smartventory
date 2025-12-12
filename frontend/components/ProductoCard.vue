<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer" @click="abrirPreview">
    <!-- Imagen real del producto si existe, si no, placeholder -->
    <div class="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
      <img v-if="producto.foto" :src="getImageUrl(producto.foto)" alt="Foto del producto" class="object-cover w-full h-full pointer-events-none" />
      <span v-else class="text-gray-400 text-4xl pointer-events-none">📷</span>
    </div>
    
    <div class="p-4">
      <div class="flex justify-between items-start mb-2">
        <h3 class="text-lg font-semibold text-gray-800 leading-tight">{{ producto.nombre }}</h3>
        <span v-if="producto.cantidad <= producto.stock_minimo" class="px-2 py-1 text-xs font-bold bg-red-100 text-red-700 rounded-full whitespace-nowrap" title="Stock bajo">
          ⚠️ Bajo
        </span>
      </div>
      
      <div class="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
        <div>
          <p class="text-xs text-gray-400 uppercase">Ubicación</p>
          <p class="font-medium truncate">{{ producto.ubicacion || 'N/A' }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-400 uppercase">Stock</p>
          <p class="font-medium" :class="{'text-red-600 font-bold': producto.cantidad <= producto.stock_minimo}">
            {{ producto.cantidad }} {{ producto.unidad_medida || 'unidades' }}
          </p>
        </div>
        <div v-if="producto.Proveedor" class="col-span-2">
          <p class="text-xs text-gray-400 uppercase">Proveedor</p>
          <p class="font-medium truncate">{{ producto.Proveedor.nombre }}</p>
        </div>
      </div>
      
      <div class="flex justify-between items-center border-t pt-3" @click.stop>
        <div>
          <p class="text-xs text-gray-400 uppercase">Precio</p>
          <span class="text-xl font-bold text-blue-600">${{ producto.precio }}</span>
        </div>

        <div class="flex space-x-1">
          <button 
            v-if="rol === 'admin' || rol === 'operador'"
            @click="$emit('editar', producto)" 
            class="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            title="Editar"
          >
            ✏️
          </button>
          <button 
            v-if="rol === 'admin'"
            @click="$emit('eliminar', producto.id_producto)" 
            class="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
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