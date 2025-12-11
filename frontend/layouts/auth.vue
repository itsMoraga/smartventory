<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-blue-600 text-white text-3xl font-bold mb-4 shadow-lg">
          S
        </div>
        <h1 class="text-3xl font-bold text-gray-900">Smartventory</h1>
        <p class="text-gray-500 mt-2">Gestión inteligente para tu negocio</p>
      </div>
      <slot />
      <p class="text-center text-gray-400 text-sm mt-8">
        &copy; {{ new Date().getFullYear() }} Smartventory Inc.
      </p>
    </div>
  </div>
</template>
