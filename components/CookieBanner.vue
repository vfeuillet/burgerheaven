<script setup lang="ts">
const showBanner = ref(false)
const showPreferences = ref(false)

// Catégories de cookies
const preferences = ref({
  necessary: true,
  analytics: false,
  marketing: false
})

onMounted(() => {
  const consent = localStorage.getItem('cookie-consent')
  const consentDate = localStorage.getItem('cookie-consent-date')
  
  if (!consent) {
    showBanner.value = true
  } else {
    const thirteenMonthsAgo = new Date()
    thirteenMonthsAgo.setMonth(thirteenMonthsAgo.getMonth() - 13)
    
    if (consentDate && new Date(consentDate) < thirteenMonthsAgo) {
      showBanner.value = true
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
  showBanner.value = false
  showPreferences.value = false
}

function refuseAll() {
  preferences.value.analytics = false
  preferences.value.marketing = false
  savePreferences()
  showBanner.value = false
  showPreferences.value = false
}

function saveCustomPreferences() {
  savePreferences()
  showPreferences.value = false
  showBanner.value = false
}

function savePreferences() {
  const consentData = {
    necessary: true,
    analytics: preferences.value.analytics,
    marketing: preferences.value.marketing
  }
  
  localStorage.setItem('cookie-consent', JSON.stringify(consentData))
  localStorage.setItem('cookie-consent-date', new Date().toISOString())
  
  applyPreferences()
}

function applyPreferences() {
  if (preferences.value.analytics) {
    console.log('Analytics activé')
  }
  
  if (preferences.value.marketing) {
    console.log('Marketing activé')
  }
}

function openPreferences() {
  showPreferences.value = true
}

// ✅ LIGNE CRITIQUE - NE PAS SUPPRIMER
defineExpose({ openPreferences })
</script>

<template>
  <!-- Bannière principale -->
  <div 
    v-if="showBanner && !showPreferences" 
    style="position: fixed; bottom: 0; left: 0; right: 0; background: #1f2937; color: white; padding: 1.5rem; z-index: 9999; box-shadow: 0 -4px 6px rgba(0,0,0,0.1);"
  >
    <div class="container mx-auto">
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <!-- Texte -->
        <div style="flex: 1;">
          <p style="font-size: 0.875rem; line-height: 1.5;">
            <strong style="font-size: 1rem;">🍪 Nous respectons votre vie privée</strong><br>
            Nous utilisons des cookies pour améliorer votre expérience. Vous pouvez accepter tous les cookies, les refuser ou personnaliser vos choix.
            <br>
            <a href="/mentions-legales" style="text-decoration: underline; color: #fbbf24;">En savoir plus</a>
          </p>
        </div>
        
        <!-- Boutons -->
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <!-- Tout refuser -->
          <button 
            @click="refuseAll"
            style="flex: 1; min-width: 150px; background: #4b5563; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; border: none; cursor: pointer; transition: background 0.2s;"
            onmouseover="this.style.background='#374151'" 
            onmouseout="this.style.background='#4b5563'"
          >
            Tout refuser
          </button>
          
          <!-- Personnaliser -->
          <button 
            @click="openPreferences"
            style="flex: 1; min-width: 150px; background: transparent; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; border: 2px solid white; cursor: pointer; transition: all 0.2s;"
            onmouseover="this.style.background='rgba(255,255,255,0.1)'" 
            onmouseout="this.style.background='transparent'"
          >
            Personnaliser
          </button>
          
          <!-- Tout accepter -->
          <button 
            @click="acceptAll"
            style="flex: 1; min-width: 150px; background: #fbbf24; color: #1f2937; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; border: none; cursor: pointer; transition: background 0.2s;"
            onmouseover="this.style.background='#f59e0b'" 
            onmouseout="this.style.background='#fbbf24'"
          >
            Tout accepter
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de préférences détaillées -->
  <div 
    v-if="showPreferences"
    style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 1rem;"
  >
    <div style="background: white; border-radius: 1rem; max-width: 600px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 2rem;">
      <h2 style="font-size: 1.5rem; font-weight: bold; color: #1f2937; margin-bottom: 1rem;">
        Paramètres des cookies
      </h2>
      
      <p style="color: #6b7280; margin-bottom: 2rem; font-size: 0.875rem;">
        Nous utilisons différents types de cookies. Vous pouvez choisir lesquels vous souhaitez autoriser.
      </p>
      
      <!-- Cookie nécessaires (non modifiables) -->
      <div style="border: 2px solid #e5e7eb; border-radius: 0.75rem; padding: 1rem; margin-bottom: 1rem; background: #f9fafb;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <h3 style="font-weight: 600; color: #1f2937;">Cookies nécessaires</h3>
          <span style="background: #10b981; color: white; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600;">
            Toujours actif
          </span>
        </div>
        <p style="font-size: 0.875rem; color: #6b7280;">
          Ces cookies sont essentiels au fonctionnement du site (panier, connexion). Ils ne peuvent pas être désactivés.
        </p>
      </div>
      
      <!-- Cookies analytics (optionnels) -->
      <div style="border: 2px solid #e5e7eb; border-radius: 0.75rem; padding: 1rem; margin-bottom: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
          <div style="flex: 1;">
            <h3 style="font-weight: 600; color: #1f2937; margin-bottom: 0.25rem;">Cookies analytiques</h3>
            <p style="font-size: 0.875rem; color: #6b7280;">
              Nous aident à comprendre comment vous utilisez notre site pour l'améliorer.
            </p>
          </div>
          <label style="position: relative; display: inline-block; width: 48px; height: 24px; flex-shrink: 0; margin-left: 1rem;">
            <input 
              type="checkbox" 
              v-model="preferences.analytics"
              style="opacity: 0; width: 0; height: 0;"
            >
            <span 
              :style="{
                position: 'absolute',
                cursor: 'pointer',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: preferences.analytics ? '#10b981' : '#d1d5db',
                transition: '0.4s',
                borderRadius: '24px'
              }"
            >
              <span 
                :style="{
                  position: 'absolute',
                  content: '',
                  height: '18px',
                  width: '18px',
                  left: preferences.analytics ? '26px' : '3px',
                  bottom: '3px',
                  backgroundColor: 'white',
                  transition: '0.4s',
                  borderRadius: '50%'
                }"
              ></span>
            </span>
          </label>
        </div>
      </div>
      
      <!-- Cookies marketing (optionnels) -->
      <div style="border: 2px solid #e5e7eb; border-radius: 0.75rem; padding: 1rem; margin-bottom: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
          <div style="flex: 1;">
            <h3 style="font-weight: 600; color: #1f2937; margin-bottom: 0.25rem;">Cookies marketing</h3>
            <p style="font-size: 0.875rem; color: #6b7280;">
              Utilisés pour vous proposer des publicités personnalisées.
            </p>
          </div>
          <label style="position: relative; display: inline-block; width: 48px; height: 24px; flex-shrink: 0; margin-left: 1rem;">
            <input 
              type="checkbox" 
              v-model="preferences.marketing"
              style="opacity: 0; width: 0; height: 0;"
            >
            <span 
              :style="{
                position: 'absolute',
                cursor: 'pointer',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: preferences.marketing ? '#10b981' : '#d1d5db',
                transition: '0.4s',
                borderRadius: '24px'
              }"
            >
              <span 
                :style="{
                  position: 'absolute',
                  content: '',
                  height: '18px',
                  width: '18px',
                  left: preferences.marketing ? '26px' : '3px',
                  bottom: '3px',
                  backgroundColor: 'white',
                  transition: '0.4s',
                  borderRadius: '50%'
                }"
              ></span>
            </span>
          </label>
        </div>
      </div>
      
      <!-- Boutons -->
      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
        <button 
          @click="refuseAll"
          style="flex: 1; min-width: 120px; background: #e5e7eb; color: #1f2937; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; border: none; cursor: pointer;"
        >
          Tout refuser
        </button>
        
        <button 
          @click="saveCustomPreferences"
          style="flex: 1; min-width: 120px; background: #1e3a8a; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; border: none; cursor: pointer;"
        >
          Enregistrer
        </button>
        
        <button 
          @click="acceptAll"
          style="flex: 1; min-width: 120px; background: #fbbf24; color: #1f2937; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; border: none; cursor: pointer;"
        >
          Tout accepter
        </button>
      </div>
    </div>
  </div>
</template>