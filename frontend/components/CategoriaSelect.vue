<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1">Filtrar por categoría</label>
    <select v-model="model" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
      <option :value="null">Todas</option>
      <option v-for="cat in categorias" :key="cat.id_categoria" :value="cat.id_categoria">
        {{ cat.nombre }}
      </option>
    </select>
  </div>
</template>

<script setup>
const props = defineProps({
  categorias: {
    type: Array,
    required: true
  },
  modelValue: {
    type: [Number, null],
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>
