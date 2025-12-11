<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
        <p class="text-gray-500 mt-1">Administra el acceso de tu equipo</p>
      </div>
      <button 
        @click="abrirModalCrear"
        class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center font-semibold"
      >
        <span class="mr-2 text-xl">+</span> Nuevo Usuario
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
      Error al cargar usuarios: {{ error.message }}
    </div>

    <!-- Tabla de Usuarios -->
    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
              <th class="px-6 py-4">Usuario</th>
              <th class="px-6 py-4">Correo</th>
              <th class="px-6 py-4">Rol</th>
              <th class="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="user in usuarios" :key="user.id_usuario" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold mr-3">
                    {{ user.nombre.charAt(0).toUpperCase() }}
                  </div>
                  <span class="font-medium text-gray-900">{{ user.nombre }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-gray-600">{{ user.correo }}</td>
              <td class="px-6 py-4">
                <span 
                  class="px-3 py-1 rounded-full text-xs font-semibold"
                  :class="{
                    'bg-purple-100 text-purple-700': user.rol === 'admin',
                    'bg-blue-100 text-blue-700': user.rol === 'operador',
                    'bg-gray-100 text-gray-700': user.rol === 'lectura'
                  }"
                >
                  {{ user.rol }}
                </span>
              </td>
              <td class="px-6 py-4 text-right space-x-2">
                <button 
                  @click="abrirModalEditar(user)" 
                  class="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  Editar
                </button>
                <button 
                  @click="eliminarUsuario(user.id_usuario)" 
                  class="text-red-600 hover:text-red-800 font-medium text-sm"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Formulario -->
    <UsuarioForm 
      :is-open="mostrarModal" 
      :usuario="usuarioSeleccionado"
      @close="cerrarModal"
      @saved="recargarUsuarios"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import UsuarioForm from '~/components/UsuarioForm.vue'

const router = useRouter()
const mostrarModal = ref(false)
const usuarioSeleccionado = ref(null)
const usuarios = ref([])
const pending = ref(true)
const error = ref(null)

// Cargar usuarios
const cargarUsuarios = async () => {
  pending.value = true
  error.value = null
  try {
    const token = localStorage.getItem('token')
    usuarios.value = await $fetch('http://localhost:4000/api/users', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  } catch (e) {
    error.value = e
    // Si es error de autorización (401/403), redirigir o mostrar mensaje
    if (e.response?.status === 401 || e.response?.status === 403) {
      alert('No tienes permisos para ver esta sección')
      router.push('/dashboard')
    }
  } finally {
    pending.value = false
  }
}

onMounted(() => {
  // Verificar rol admin
  const rol = localStorage.getItem('rol')
  if (rol !== 'admin') {
    alert('Acceso restringido a administradores')
    router.push('/dashboard')
    return
  }
  cargarUsuarios()
})

const abrirModalCrear = () => {
  usuarioSeleccionado.value = null
  mostrarModal.value = true
}

const abrirModalEditar = (user) => {
  usuarioSeleccionado.value = user
  mostrarModal.value = true
}

const cerrarModal = () => {
  mostrarModal.value = false
  usuarioSeleccionado.value = null
}

const recargarUsuarios = () => {
  cargarUsuarios()
}

const eliminarUsuario = async (id) => {
  if (!confirm('¿Estás seguro de eliminar este usuario?')) return

  try {
    const token = localStorage.getItem('token')
    await $fetch(`http://localhost:4000/api/users/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    cargarUsuarios()
  } catch (e) {
    alert('Error al eliminar: ' + (e.data?.mensaje || e.message))
  }
}
</script>
