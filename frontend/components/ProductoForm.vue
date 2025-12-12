<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
      <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 class="text-lg font-semibold text-gray-800">
          {{ producto?.id_producto ? 'Editar Producto' : 'Nuevo Producto' }}
        </h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">✕</button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Galería de imágenes solo en edición -->
        <div v-if="producto?.id_producto" class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Imágenes</label>
          <GaleriaProducto :idProducto="producto.id_producto" @saved="emit('saved')" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Columna Izquierda: Información Básica -->
          <div class="space-y-4">
            <h4 class="font-medium text-gray-900 border-b pb-2">Información Básica</h4>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input 
                v-model="form.nombre" 
                type="text" 
                required
                maxlength="100"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p class="text-xs text-gray-400 text-right">{{ form.nombre.length }}/100</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea 
                v-model="form.descripcion" 
                rows="3"
                maxlength="500"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
              <p class="text-xs text-gray-400 text-right">{{ form.descripcion.length }}/500</p>
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

          <!-- Columna Derecha: Inventario y Precios -->
          <div class="space-y-4">
            <h4 class="font-medium text-gray-900 border-b pb-2">Inventario y Precios</h4>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Precio Venta</label>
                <input 
                  v-model="form.precio" 
                  type="number" 
                  step="0.01"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Costo Unitario</label>
                <input 
                  v-model="form.precio_costo" 
                  type="number" 
                  step="0.01"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                <select 
                  v-model="form.ubicacion" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>Seleccionar...</option>
                  <option value="Bodega Principal">Bodega Principal</option>
                  <option value="Estante A">Estante A</option>
                  <option value="Estante B">Estante B</option>
                  <option value="Mostrador">Mostrador</option>
                  <option value="Almacén Externo">Almacén Externo</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Unidad</label>
                <select 
                  v-model="form.unidad_medida" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="unidad">Unidad (pza)</option>
                  <option value="kg">Kilogramo (kg)</option>
                  <option value="g">Gramo (g)</option>
                  <option value="l">Litro (l)</option>
                  <option value="ml">Mililitro (ml)</option>
                  <option value="m">Metro (m)</option>
                  <option value="caja">Caja</option>
                  <option value="paquete">Paquete</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Cantidad Inicial</label>
                <input 
                  v-model="form.cantidad" 
                  type="number" 
                  min="0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :disabled="!!producto?.id_producto"
                  :class="{'bg-gray-100 cursor-not-allowed': !!producto?.id_producto}"
                />
                <p v-if="producto?.id_producto" class="text-xs text-gray-500 mt-1">Gestionar desde Movimientos</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Stock Mínimo</label>
                <input 
                  v-model="form.stock_minimo" 
                  type="number" 
                  min="1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Caducidad</label>
              <input 
                v-model="form.fecha_caducidad" 
                type="date" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
              <select 
                v-model="form.id_proveedor"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option :value="null">Seleccionar...</option>
                <option v-for="prov in proveedores" :key="prov.id_proveedor" :value="prov.id_proveedor">
                  {{ prov.nombre }}
                </option>
              </select>
            </div>
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
const proveedores = ref([])
const form = ref({
  nombre: '',
  descripcion: '',
  precio: '',
  id_categoria: null,
  id_proveedor: null,
  id_usuario: 1 // TODO: Obtener del usuario logueado real
})

// Cargar categorías y proveedores al montar
onMounted(async () => {
  try {
    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }
    
    const [cats, provs] = await Promise.all([
      $fetch('http://localhost:4000/api/categories', { headers }),
      $fetch('http://localhost:4000/api/proveedores', { headers })
    ])
    categorias.value = cats
    proveedores.value = provs
  } catch (e) {
    console.error('Error cargando datos', e)
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
      precio_costo: '',
      ubicacion: '',
      unidad_medida: 'unidad',
      fecha_caducidad: '',
      stock_minimo: 5,
      cantidad: 0,
      id_categoria: null,
      id_proveedor: null,
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

    const token = localStorage.getItem('token')
    await $fetch(url, {
      method,
      body: form.value,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    emit('saved')
    emit('close')
  } catch (e) {
    alert('Error al guardar: ' + (e.data?.mensaje || e.message))
  }
}
</script>