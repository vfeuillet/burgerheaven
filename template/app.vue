<script setup lang="ts">
import { ref, provide } from 'vue'
import CookieBanner from '~/components/CookieBanner.vue'

const cookieBanner = ref<InstanceType<typeof CookieBanner> | null>(null)

// ✅ Fournit la fonction de reset aux composants enfants (index.vue)
provide('resetCookies', () => {
  if (cookieBanner.value?.resetCookies) {
    cookieBanner.value.resetCookies()
  } else {
    // Fallback direct si le composant n'est pas encore monté
    localStorage.removeItem('cookie-consent')
    localStorage.removeItem('cookie-consent-date')
    window.location.reload()
  }
})
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- CookieBanner avec ref pour y accéder -->
    <CookieBanner ref="cookieBanner" />
    
    <!-- Toutes les pages (index.vue contient le footer) -->
    <NuxtPage />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  overflow-x: hidden;
}

#__nuxt {
  margin: 0;
  padding: 0;
}
</style>