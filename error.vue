<script setup lang="ts">
const error = useError()
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center px-4">
      <h1 style="font-size: 6rem; font-weight: bold; color: #fbbf24;">
        {{ error?.statusCode || 500 }}
      </h1>
      
      <h2 style="font-size: 2rem; font-weight: bold; color: #1f2937; margin-bottom: 1rem;">
        {{ error?.statusCode === 404 ? 'Page non trouvée' : 'Une erreur est survenue' }}
      </h2>
      
      <p style="color: #6b7280; margin-bottom: 2rem;">
        {{ error?.message || 'Désolé, quelque chose s\'est mal passé.' }}
      </p>
      
      <NuxtLink 
        to="/" 
        style="background: #fbbf24; color: #1f2937; padding: 1rem 2rem; border-radius: 9999px; font-weight: bold; text-decoration: none; display: inline-block;"
      >
        Retour à l'accueil
      </NuxtLink>
    </div>
  </div>
</template>