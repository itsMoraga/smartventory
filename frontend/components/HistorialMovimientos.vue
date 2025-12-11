<template>
  <div>
    <h2 class="text-lg font-bold mb-4">Historial de Movimientos</h2>
    <div v-if="pending" class="text-gray-500">Cargando movimientos...</div>
    <div v-else-if="error" class="text-red-500">Error al cargar movimientos</div>
    <div v-else-if="movimientos.length === 0" class="text-gray-400">No hay movimientos registrados para este producto.</div>
    <table v-else class="w-full text-sm bg-white rounded shadow">
      <thead>
        <tr class="bg-gray-100">
          <th class="px-2 py-1 text-left">Fecha</th>
          <th class="px-2 py-1 text-left">Tipo</th>
          <th class="px-2 py-1 text-left">Cantidad</th>
          <th class="px-2 py-1 text-left">Usuario</th>
          <th class="px-2 py-1 text-left">Observaciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="mov in movimientos" :key="mov.id_movimiento">
          <td class="px-2 py-1">{{ new Date(mov.fecha).toLocaleString() }}</td>
          <td class="px-2 py-1">{{ mov.tipo }}</td>
          <td class="px-2 py-1">{{ mov.cantidad }}</td>
          <td class="px-2 py-1">{{ mov.Usuario?.nombre || 'N/A' }}</td>
          <td class="px-2 py-1">{{ mov.observaciones || '-' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const props = defineProps({
  idProducto: {
    type: Number,
    required: true
  }
})

const { data: movimientos = [], pending, error } = await useFetch(`http://localhost:4000/api/movimientos/producto/${props.idProducto}`, {
  default: () => []
})
</script>
