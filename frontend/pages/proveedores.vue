<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Gestión de Proveedores</h1>
      <button 
        @click="abrirModalCrear"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-md"
      >
        <span class="mr-2 text-xl">+</span> Nuevo Proveedor
      </button>
    </div>

    <div v-if="pending" class="text-center py-10">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
    </div>
    
    <div v-else-if="error" class="bg-red-100 text-red-700 p-4 rounded-lg mb-6 border border-red-200">
      Error al cargar proveedores: {{ error.message }}
    </div>

    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
              <th class="px-6 py-4">Empresa</th>
              <th class="px-6 py-4">Contacto</th>
              <th class="px-6 py-4">Teléfono</th>
              <th class="px-6 py-4">Email</th>
              <th class="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="prov in proveedores" :key="prov.id_proveedor" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 font-medium text-gray-900">{{ prov.nombre }}</td>
              <td class="px-6 py-4 text-gray-600">{{ prov.contacto || '-' }}</td>
              <td class="px-6 py-4 text-gray-600">{{ prov.telefono || '-' }}</td>
              <td class="px-6 py-4 text-gray-600">{{ prov.email || '-' }}</td>
              <td class="px-6 py-4 text-right space-x-2">
                <button @click="abrirModalEditar(prov)" class="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors" title="Editar">✏️</button>
                <button @click="confirmarEliminar(prov.id_proveedor)" class="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors" title="Eliminar">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Formulario -->
    <div v-if="modalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-800">
            {{ form.id_proveedor ? 'Editar Proveedor' : 'Nuevo Proveedor' }}
          </h3>
          <button @click="cerrarModal" class="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <form @submit.prevent="guardarProveedor" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre Empresa *</label>
            <input v-model="form.nombre" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre Contacto</label>
            <input v-model="form.contacto" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input v-model="form.telefono" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input v-model="form.email" type="email" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
            <textarea v-model="form.direccion" rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button type="button" @click="cerrarModal" class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">Cancelar</button>
            <button type="submit" class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()
const apiBase = config.public.apiBase || 'http://localhost:4000/api'

const modalOpen = ref(false)
const form = ref({
  id_proveedor: null,
  nombre: '',
  contacto: '',
  telefono: '',
  email: '',
  direccion: ''
})

const { data: proveedores, pending, error, refresh } = await useFetch(`${apiBase}/proveedores`, {
  headers: { Authorization: `Bearer ${import.meta.client ? localStorage.getItem('token') : ''}` },
  server: false
})

const abrirModalCrear = () => {
  form.value = { id_proveedor: null, nombre: '', contacto: '', telefono: '', email: '', direccion: '' }
  modalOpen.value = true
}

const abrirModalEditar = (prov) => {
  form.value = { ...prov }
  modalOpen.value = true
}

const cerrarModal = () => {
  modalOpen.value = false
}

const guardarProveedor = async () => {
  try {
    const method = form.value.id_proveedor ? 'PUT' : 'POST'
    const url = form.value.id_proveedor 
      ? `${apiBase}/proveedores/${form.value.id_proveedor}`
      : `${apiBase}/proveedores`
    
    // Sanitize payload: empty strings to null for optional fields
    const payload = {
      ...form.value,
      contacto: form.value.contacto || null,
      telefono: form.value.telefono || null,
      email: form.value.email || null,
      direccion: form.value.direccion || null
    }

    await $fetch(url, {
      method,
      body: payload,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    
    refresh()
    cerrarModal()
  } catch (e) {
    alert('Error al guardar: ' + (e.data?.mensaje || e.message))
  }
}

const confirmarEliminar = async (id) => {
  if (!confirm('¿Eliminar este proveedor?')) return
  try {
    await $fetch(`${apiBase}/proveedores/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    refresh()
  } catch (e) {
    alert('Error al eliminar: ' + (e.data?.mensaje || e.message))
  }
}
</script>
