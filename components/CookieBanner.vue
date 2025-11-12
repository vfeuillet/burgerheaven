<script setup lang="ts">
const showBanner = ref(false)
const showPreferences = ref(false)

const preferences = ref({
  necessary: true,
  analytics: false,
  marketing: false,
})

// CNIL: Durée de conservation = 13 mois
const CONSENT_DURATION_MONTHS = 13

onMounted(() => {
  const consent = localStorage.getItem('cookie-consent')
  const consentDate = localStorage.getItem('cookie-consent-date')
  
  if (!consent) {
    showBanner.value = true
  } else {
    const expiryDate = new Date()
    expiryDate.setMonth(expiryDate.getMonth() - CONSENT_DURATION_MONTHS)
    
    if (consentDate && new Date(consentDate) < expiryDate) {
      showBanner.value = true // Consentement expire
    } else {
      const saved = JSON.parse(consent)
      preferences.value = { ...preferences.value, ...saved }
      applyPreferences()
    }
  }
})

function acceptAll() {
  preferences.value.analytics = true
  preferences.value.marketing = true
  savePreferences()
}

function refuseAll() {
  preferences.value.analytics = false
  preferences.value.marketing = false
  savePreferences()
}

function saveCustomPreferences() {
  savePreferences()
}

function savePreferences() {
  const consentData = {
    necessary: true,
    analytics: preferences.value.analytics,
    marketing: preferences.value.marketing,
  }
  
  localStorage.setItem('cookie-consent', JSON.stringify(consentData))
  localStorage.setItem('cookie-consent-date', new Date().toISOString())
  
  showBanner.value = false
  showPreferences.value = false
  applyPreferences()
}

function applyPreferences() {
  // CNIL: Respect des choix
  if (preferences.value.analytics) {
    // Active Google Analytics ici
    console.log('✅ Analytics active')
  }
  
  if (preferences.value.marketing) {
    // Active Facebook Pixel ici
    console.log('✅ Marketing active')
  }
}

function openPreferences() {
  showPreferences.value = true
}

defineExpose({ openPreferences })
</script>

<template>
  <!-- CNIL: Banniere visible sans scroll -->
  <div 
    v-if="showBanner && !showPreferences" 
    class="fixed bottom-0 inset-x-0 bg-gray-800 text-white p-6 z-50 shadow-2xl"
    role="dialog" 
    aria-label="Gestion des cookies"
  >
    <div class="container mx-auto max-w-6xl">
      <div class="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div class="flex-1">
          <p class="text-sm lg:text-base">
            <strong class="text-lg">🍪 Nous respectons votre vie privee</strong><br>
            Nous utilisons des cookies pour ameliorer votre experience. 
            Vous pouvez choisir ci-dessous.<br>
            <a 
              href="/mentions-legales" 
              class="text-yellow-400 underline hover:text-yellow-300"
            >
              Consulter notre politique de cookies
            </a>
          </p>
        </div>
        
        <div class="flex flex-wrap gap-3 w-full lg:w-auto">
          <!-- CNIL: Bouton "Tout refuser" AU MEME NIVEAU -->
          <button 
            @click="refuseAll"
            class="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors flex-1 lg:flex-none"
          >
            Tout refuser
          </button>
          
          <button 
            @click="openPreferences"
            class="px-6 py-3 border-2 border-white text-white hover:bg-white hover:text-gray-800 rounded-lg font-semibold transition-colors flex-1 lg:flex-none"
          >
            Personnaliser
          </button>
          
          <!-- CNIL: Bouton "Tout accepter" pas plus mis en avant -->
          <button 
            @click="acceptAll"
            class="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg font-semibold transition-colors flex-1 lg:flex-none"
          >
            Tout accepter
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal preferences -->
  <div 
    v-if="showPreferences"
    class="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
    role="dialog" 
    aria-label="Parametres des cookies"
  >
    <div class="bg-white rounded-xl max-w-2xl w-full max-h-screen overflow-y-auto p-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">
        Parametres des cookies
      </h2>
      
      <p class="text-gray-600 mb-6 text-sm">
        Duree de conservation : 13 mois. 
        <a href="/mentions-legales" class="text-blue-600 underline">
          Politique de confidentialite
        </a>
      </p>

      <!-- Cookie necessaire -->
      <div class="border-2 border-green-200 bg-green-50 rounded-lg p-4 mb-4">
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-semibold text-gray-900">Cookies necessaires</h3>
          <span class="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            Toujours actif
          </span>
        </div>
        <p class="text-sm text-gray-600">
          Essentiels au fonctionnement basique du site (panier, navigation).
        </p>
      </div>

      <!-- Cookie analytique -->
      <div class="border-2 border-gray-200 rounded-lg p-4 mb-4">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h3 class="font-semibold text-gray-900 mb-1">Cookies analytiques</h3>
            <p class="text-sm text-gray-600">
              Mesure d'audience (Google Analytics) - anonymise IP conforme RGPD
            </p>
          </div>
          <label class="relative inline-block w-12 h-6 flex-shrink-0">
            <input 
              type="checkbox" 
              v-model="preferences.analytics"
              class="sr-only"
            >
            <span 
              class="absolute inset-0 rounded-full transition-colors"
              :class="preferences.analytics ? 'bg-green-500' : 'bg-gray-300'"
            ></span>
            <span 
              class="absolute bottom-1 left-1 h-4 w-4 bg-white rounded-full transition-transform"
              :class="preferences.analytics ? 'translate-x-6' : 'translate-x-0'"
            ></span>
          </label>
        </div>
      </div>

      <!-- Cookie marketing -->
      <div class="border-2 border-gray-200 rounded-lg p-4 mb-6">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h3 class="font-semibold text-gray-900 mb-1">Cookies marketing</h3>
            <p class="text-sm text-gray-600">
              Publicites ciblees (Facebook Pixel) - uniquement si consentement
            </p>
          </div>
          <label class="relative inline-block w-12 h-6 flex-shrink-0">
            <input 
              type="checkbox" 
              v-model="preferences.marketing"
              class="sr-only"
            >
            <span 
              class="absolute inset-0 rounded-full transition-colors"
              :class="preferences.marketing ? 'bg-green-500' : 'bg-gray-300'"
            ></span>
            <span 
              class="absolute bottom-1 left-1 h-4 w-4 bg-white rounded-full transition-transform"
              :class="preferences.marketing ? 'translate-x-6' : 'translate-x-0'"
            ></span>
          </label>
        </div>
      </div>

      <div class="flex flex-wrap gap-3">
        <button 
          @click="refuseAll"
          class="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex-1"
        >
          Tout refuser
        </button>
        
        <button 
          @click="saveCustomPreferences"
          class="px-6 py-3 bg-blue-800 text-white rounded-lg font-semibold hover:bg-blue-900 transition-colors flex-1"
        >
          Enregistrer mes choix
        </button>
        
        <button 
          @click="acceptAll"
          class="px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg font-semibold hover:bg-yellow-500 transition-colors flex-1"
        >
          Tout accepter
        </button>
      </div>
    </div>
  </div>
</template>