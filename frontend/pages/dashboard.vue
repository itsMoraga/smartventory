<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow p-4">
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <h1 class="text-xl font-bold text-blue-600">Smartventory</h1>
        <button @click="logout" class="text-gray-600 hover:text-red-500">Cerrar Sesión</button>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-10 px-4">
      <h2 class="text-2xl font-semibold mb-4">Panel de Control</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Tarjeta de Productos -->
        <NuxtLink to="/productos" class="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer block">
          <h3 class="text-lg font-medium text-gray-900">Productos</h3>
          <p class="mt-2 text-3xl font-bold text-blue-600">12</p>
          <p class="text-gray-500 text-sm">Gestionar inventario 2</p>
        </NuxtLink>

        <!-- Tarjeta de Categorías con acceso -->
        <NuxtLink to="/categorias" class="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer block">
          <h3 class="text-lg font-medium text-gray-900">Categorías</h3>
          <p class="mt-2 text-3xl font-bold text-green-600">5</p>
          <p class="text-gray-500 text-sm">Gestionar categorías →</p>
        </NuxtLink>

        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-medium text-gray-900">Usuarios</h3>
          <p class="mt-2 text-3xl font-bold text-purple-600">3</p>
          <p class="text-gray-500 text-sm">Usuarios registrados</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
const router = useRouter()

const logout = () => {
  // Aquí limpiaremos el estado del usuario luego
  router.push('/')
}
</script>
