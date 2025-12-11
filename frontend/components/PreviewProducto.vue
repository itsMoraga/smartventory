<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
    <div class="relative bg-white rounded-lg shadow-xl p-4 max-w-2xl w-full flex flex-col items-center">
      <button @click="$emit('close')" class="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full p-2 text-xl">&times;</button>
      <div v-if="fotos.length === 0" class="text-gray-400 text-sm mb-2">Sin imágenes</div>
      <div v-else class="flex flex-col items-center w-full">
        <img :src="getImageUrl(fotos[fotoActual].url)" class="max-h-[70vh] max-w-full rounded shadow-lg border-4 border-white mb-2" />
        <div class="flex gap-2 justify-center mt-2 flex-wrap">
          <img v-for="(foto, idx) in fotos" :key="foto.id_foto" :src="getImageUrl(foto.url)" class="w-16 h-16 object-cover rounded border cursor-pointer" :class="{ 'ring-2 ring-blue-500': idx === fotoActual }" @click="fotoActual = idx" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  idProducto: {
    type: [Number, String],
    required: true
  },
  isOpen: Boolean
})
const emit = defineEmits(['close'])

const fotos = ref([])
const fotoActual = ref(0)

function getImageUrl(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `http://localhost:4000/uploads/${url.replace('/uploads/', '')}`
}

async function cargarFotos() {
  if (!props.idProducto) return
  fotos.value = await $fetch(`http://localhost:4000/api/photos/producto/${props.idProducto}`)
  fotoActual.value = 0
}

onMounted(cargarFotos)
watch(() => props.idProducto, cargarFotos)
</script>
