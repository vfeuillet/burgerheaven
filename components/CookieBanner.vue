<script setup lang="ts">
const cookiesAccepted = ref(false)

onMounted(() => {
  cookiesAccepted.value = localStorage.getItem('cookies-accepted') === 'true'
})

function acceptCookies() {
  localStorage.setItem('cookies-accepted', 'true')
  cookiesAccepted.value = true
}
</script>

<template>
  <div 
    v-if="!cookiesAccepted" 
    style="position: fixed; bottom: 0; left: 0; right: 0; background: #1f2937; color: white; padding: 1.5rem; z-index: 9999; box-shadow: 0 -4px 6px rgba(0,0,0,0.1);"
  >
    <div class="container mx-auto flex items-center justify-between gap-4 flex-wrap">
      <p style="font-size: 0.875rem;">
        🍪 Nous utilisons des cookies pour améliorer votre expérience. 
        En continuant, vous acceptez notre 
        <a href="/mentions-legales" style="text-decoration: underline;">politique de confidentialité</a>.
      </p>
      
      <button 
        @click="acceptCookies"
        style="background: #fbbf24; color: #1f2937; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: bold; border: none; cursor: pointer;"
      >
        J'accepte
      </button>
    </div>
  </div>
</template>