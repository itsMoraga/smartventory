<template>
  <div>
    <div v-if="fotos.length === 0" class="text-gray-400 text-sm mb-2">Sin imágenes</div>
    <div v-else class="flex flex-wrap gap-2 mb-2">
      <div v-for="foto in fotos" :key="foto.id_foto" class="relative group">
        <img :src="getImageUrl(foto.url)" class="w-20 h-20 object-cover rounded border cursor-pointer" @click="abrirPreview(foto)" />
        <button @click="eliminarFoto(foto.id_foto)" class="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 text-xs opacity-80 group-hover:opacity-100 transition-opacity" title="Eliminar imagen">✕</button>
      </div>
    </div>
    <!-- Modal de previsualización -->
    <div v-if="preview" class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div class="relative">
        <img :src="getImageUrl(preview.url)" class="max-h-[80vh] max-w-[90vw] rounded shadow-lg border-4 border-white" />
        <button @click="preview = null" class="absolute top-2 right-2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-700 rounded-full p-2 text-xl">&times;</button>
      </div>
    </div>
    <form @submit.prevent="subirImagen" class="flex items-center gap-2">
      <input type="file" ref="fileInput" accept="image/*" class="hidden" @change="onFileChange" />
      <button type="button" @click="abrirFileInput" class="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm">Subir imagen</button>
      <span v-if="nombreArchivo" class="text-xs text-gray-500">{{ nombreArchivo }}</span>
      <button v-if="archivo" type="submit" class="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">Guardar</button>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  idProducto: {
    type: [Number, String],
    required: true
  }
})
const emit = defineEmits(['saved'])

const fotos = ref([])
const archivo = ref(null)
const nombreArchivo = ref('')
const fileInput = ref(null)
const preview = ref(null)
function abrirPreview(foto) {
  preview.value = foto
}

function getImageUrl(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `http://localhost:4000/uploads/${url.replace('/uploads/', '')}`
}

async function cargarFotos() {
  if (!props.idProducto) return
  fotos.value = await $fetch(`http://localhost:4000/api/photos/producto/${props.idProducto}`)
}

onMounted(cargarFotos)
watch(() => props.idProducto, cargarFotos)

function abrirFileInput() {
  fileInput.value.click()
}

function onFileChange(e) {
  archivo.value = e.target.files[0]
  nombreArchivo.value = archivo.value ? archivo.value.name : ''
}

async function subirImagen() {
  if (!archivo.value) return
  const formData = new FormData()
  formData.append('imagen', archivo.value)
  formData.append('id_producto', props.idProducto)
  const resp = await fetch('http://localhost:4000/api/photos', {
    method: 'POST',
    body: formData
  })
  if (!resp.ok) {
    const data = await resp.json().catch(() => ({}))
    alert(data.mensaje || 'Error al subir la imagen')
    return
  }
  archivo.value = null
  nombreArchivo.value = ''
  await cargarFotos()
  emit('saved')
}

async function eliminarFoto(id) {
  if (!confirm('¿Eliminar esta imagen?')) return
  try {
    await $fetch(`http://localhost:4000/api/photos/${id}`, { method: 'DELETE' })
  } catch (e) {
    alert(e.data?.mensaje || e.message || 'Error al eliminar la imagen')
  }
  await cargarFotos()
  emit('saved')
}
</script>
