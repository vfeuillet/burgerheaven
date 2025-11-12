<script setup lang="ts">
import { ref } from 'vue'
import CookieBanner from '~/components/CookieBanner.vue'

// Référence au composant CookieBanner
const cookieBanner = ref<InstanceType<typeof CookieBanner> | null>(null)

// Fonction pour gérer les cookies depuis le footer
function manageCookies() {
  if (cookieBanner.value?.resetCookies) {
    cookieBanner.value.resetCookies()
  } else {
    localStorage.removeItem('cookie-consent')
    localStorage.removeItem('cookie-consent-date')
    window.location.reload()
  }
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- CookieBanner avec ref pour y accéder -->
    <CookieBanner ref="cookieBanner" />
    
    <!-- Toutes les pages -->
    <NuxtPage />
    
    <!-- Footer avec bouton cookies fonctionnel -->
    <footer class="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 mt-16">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center">
          <!-- Logo -->
          <div class="flex items-center justify-center gap-3 mb-6">
            <span class="text-5xl">🍔</span>
            <span class="text-3xl font-bold">BurgerHeaven</span>
          </div>
          
          <!-- Copyright -->
          <p class="text-gray-400 mb-4 text-lg">
            © 2025 BurgerHeaven - Tous droits réservés
          </p>
          
          <!-- ✅ TEXTE CORRIGÉ SANS BUG FLEX -->
          <p class="text-gray-500 mb-6 text-base" style="display: block !important;">
            Fait avec 
            <span class="text-red-500 mx-1 inline-block">❤️</span>
            amour et des ingrédients frais
          </p>
          
          <!-- Liens légaux -->
          <div class="flex items-center justify-center gap-3 text-sm text-gray-400">
            <NuxtLink to="/mentions-legales" class="hover:text-yellow-400 transition-colors">
              Mentions légales
            </NuxtLink>
            <span>•</span>
            <button 
              @click="manageCookies"
              class="hover:text-yellow-400 transition-colors cursor-pointer underline"
              style="background: none; border: none; color: inherit; font-size: inherit; padding: 0;"
            >
              Gérer les cookies
            </button>
          </div>
        </div>
      </div>
    </footer>
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