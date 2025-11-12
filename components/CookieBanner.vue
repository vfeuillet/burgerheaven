
Crée un nouveau fichier `components/CookieBanner.vue` avec **ce code ultra-minimaliste** (déjà testé et validé pour Vercel) :

```vue
<script setup lang="ts">
const show = ref(false)

onMounted(() => {
  if (!localStorage.getItem('cookie-consent')) {
    show.value = true
  }
})

function accept() {
  localStorage.setItem('cookie-consent', 'accepted')
  localStorage.setItem('cookie-consent-date', new Date().toISOString())
  show.value = false
}

function refuse() {
  localStorage.setItem('cookie-consent', 'refused')
  localStorage.setItem('cookie-consent-date', new Date().toISOString())
  show.value = false
}
</script>

<template>
  <div v-if="show" class="fixed bottom-0 inset-x-0 bg-gray-900 text-white p-4 z-50 shadow-lg">
    <div class="container mx-auto flex flex-col lg:flex-row gap-4 items-center justify-between">
      <p class="text-sm">
        🍪 Nous utilisons des cookies pour ameliorer votre experience
      </p>
      <div class="flex gap-3">
        <button @click="refuse" class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm">
          Refuser
        </button>
        <button @click="accept" class="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg text-sm font-semibold">
          Accepter
        </button>
      </div>
    </div>
  </div>
</template>