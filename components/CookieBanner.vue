<script setup lang="ts">
import { ref, onMounted } from 'vue'

const showBanner = ref(false)
const showPreferences = ref(false)

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
      try {
        const saved = JSON.parse(consent)
        preferences.value = { ...preferences.value, ...saved }
        applyPreferences()
      } catch {
        showBanner.value = true
      }
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
    console.log('Analytics active')
  }
  
  if (preferences.value.marketing) {
    console.log('Marketing active')
  }
}

function openPreferences() {
  showPreferences.value = true
}

const resetCookies = () => {
  localStorage.removeItem('cookie-consent')
  localStorage.removeItem('cookie-consent-date')
  preferences.value = { necessary: true, analytics: false, marketing: false }
  showBanner.value = true
  showPreferences.value = false
}

defineExpose({ 
  openPreferences,
  resetCookies
})
</script>

<template>
  <!-- Overlay sombre -->
  <div 
    v-if="showBanner && !showPreferences"
    style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.8); z-index: 9998; backdrop-filter: blur(3px);"
    @click="refuseAll"
  ></div>

  <!-- Bannière principale -->
  <div 
    v-if="showBanner && !showPreferences" 
    style="position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); max-width: 900px; width: calc(100% - 2rem); background: #2d2d2d; color: white; padding: 2rem; z-index: 9999; border-radius: 12px 12px 0 0; box-shadow: 0 -10px 40px rgba(0,0,0,0.5);"
    role="region"
    aria-label="Bannière cookies"
  >
    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
      <div>
        <h2 style="font-size: 1.375rem; font-weight: 700; color: white; margin-bottom: 0.75rem;">
          🍪 La protection de votre vie privée nous importe
        </h2>
        <p style="font-size: 0.875rem; line-height: 1.6; color: #d1d1d1;">
          Nous utilisons des cookies pour améliorer votre expérience, analyser le trafic et personnaliser les publicités. 
          Vous pouvez choisir ci-dessous.<br>
          <a 
            href="/mentions-legales" 
            style="color: #fbbf24; text-decoration: underline;"
            onmouseover="this.style.color='#fcd34d'" 
            onmouseout="this.style.color='#fbbf24'"
          >
            Consulter notre politique de cookies
          </a>
        </p>
      </div>
      
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
        <button 
          @click="refuseAll"
          type="button"
          style="background: none; border: none; color: #d1d1d1; font-size: 0.875rem; text-decoration: underline; cursor: pointer; padding: 0; flex-shrink: 0;"
          onmouseover="this.style.color='white'" 
          onmouseout="this.style.color='#d1d1d1'"
        >
          Cookies nécessaires uniquement
        </button>
        
        <div style="flex: 1;"></div>
        
        <button 
          @click="openPreferences"
          type="button"
          style="padding: 0.875rem 1.75rem; border: 2px solid white; background: transparent; color: white; border-radius: 6px; font-weight: 600; font-size: 0.9375rem; cursor: pointer; transition: all 0.2s; flex-shrink: 0;"
          onmouseover="this.style.background='rgba(255,255,255,0.1)'" 
          onmouseout="this.style.background='transparent'"
        >
          Personnaliser
        </button>
        
        <button 
          @click="acceptAll"
          type="button"
          style="padding: 0.875rem 1.75rem; background: white; color: #2d2d2d; border: none; border-radius: 6px; font-weight: 700; font-size: 0.9375rem; cursor: pointer; transition: all 0.2s; flex-shrink: 0;"
          onmouseover="this.style.background='#f3f3f3'" 
          onmouseout="this.style.background='white'"
        >
          Tout accepter
        </button>
      </div>
    </div>
  </div>

  <!-- Modal de préférences -->
  <div 
    v-if="showPreferences"
    style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 1rem; backdrop-filter: blur(5px);"
    @click.self="showPreferences = false"
    role="dialog"
    aria-modal="true"
    aria-labelledby="cookie-modal-title"
  >
    <div style="background: white; border-radius: 12px; max-width: 600px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 2.5rem; box-shadow: 0 20px 60px rgba(0,0,0,0.3);" @click.stop>
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
        <h2 id="cookie-modal-title" style="font-size: 1.5rem; font-weight: bold; color: #1f2937; flex: 1;">
          Paramètres des cookies
        </h2>
        <button 
          @click="showPreferences = false" 
          type="button"
          aria-label="Fermer les préférences"
          style="color: #6b7280; background: none; border: none; cursor: pointer; font-size: 1.5rem; line-height: 1;"
          onmouseover="this.style.color='#1f2937'" 
          onmouseout="this.style.color='#6b7280'"
        >
          ×
        </button>
      </div>
      
      <p style="color: #6b7280; margin-bottom: 2rem; font-size: 0.875rem;">
        Nous utilisons différents types de cookies. Vous pouvez choisir ceux que vous souhaitez autoriser.
      </p>
      
      <div style="border: 2px solid #e5e7eb; border-radius: 0.75rem; padding: 1rem; margin-bottom: 1rem; background: #f9fafb;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <h3 style="font-weight: 600; color: #1f2937;">Cookies nécessaires</h3>
          <span style="background: #10b981; color: white; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600;">
            Toujours actif
          </span>
        </div>
        <p style="font-size: 0.875rem; color: #6b7280;">
          Essentiels au fonctionnement du panier et de la navigation. Ils ne peuvent pas être désactivés.
        </p>
      </div>
      
      <div style="border: 2px solid #e5e7eb; border-radius: 0.75rem; padding: 1rem; margin-bottom: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
          <div style="flex: 1;">
            <h3 style="font-weight: 600; color: #1f2937; margin-bottom: 0.25rem;">Cookies analytiques</h3>
            <p style="font-size: 0.875rem; color: #6b7280;">
              Mesure d'audience (Google Analytics) - anonymise IP conforme RGPD
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
      
      <div style="border: 2px solid #e5e7eb; border-radius: 0.75rem; padding: 1rem; margin-bottom: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
          <div style="flex: 1;">
            <h3 style="font-weight: 600; color: #1f2937; margin-bottom: 0.25rem;">Cookies marketing</h3>
            <p style="font-size: 0.875rem; color: #6b7280;">
              Publicités ciblées (Facebook Pixel) - uniquement avec votre accord
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
      
      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
        <button 
          @click="saveCustomPreferences"
          style="flex: 1; min-width: 120px; background: #2d2d2d; color: white; padding: 0.875rem 1.5rem; border-radius: 6px; font-weight: 600; border: none; cursor: pointer; transition: background 0.2s;"
          onmouseover="this.style.background='#1f2937'" 
          onmouseout="this.style.background='#2d2d2d'"
        >
          Enregistrer
        </button>
        
        <button 
          @click="acceptAll"
          style="flex: 1; min-width: 120px; background: #fbbf24; color: #1f2937; padding: 0.875rem 1.5rem; border-radius: 6px; font-weight: 600; border: none; cursor: pointer; transition: background 0.2s;"
          onmouseover="this.style.background='#f59e0b'" 
          onmouseout="this.style.background='#fbbf24'"
        >
          Tout accepter
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 768px) {
  div[style*="bottom: 0"] {
    border-radius: 12px 12px 0 0 !important;
    padding: 1.5rem !important;
  }
  
  div[style*="display: flex; gap: 1rem"] {
    flex-direction: column !important;
    align-items: stretch !important;
  }
  
  div[style*="flex: 1"] {
    display: none !important;
  }
  
  button {
    width: 100% !important;
  }
}
</style>