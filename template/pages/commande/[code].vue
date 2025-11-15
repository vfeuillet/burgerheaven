<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()

const code = route.params.code as string

// Récupérer les détails de la commande
const { data: commande, error } = await useAsyncData(`commande-${code}`, async () => {
  try {
    const response = await $fetch<any>(config.public.strapiUrl + '/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query GetCommande($code: String!) {
            commandes(filters: { code_retrait: { eq: $code } }) {
              documentId
              code_retrait
              nom_client
              email_client
              total
              statut
              createdAt
              ligne_de_commandes {
                documentId
                quantite
                prix_unitaire
                produit {
                  nom
                  prix
                }
              }
            }
          }
        `,
        variables: { code }
      })
    })

    const commandes = response.data.commandes
    return commandes && commandes.length > 0 ? commandes[0] : null
  } catch (e) {
    console.error('Erreur chargement commande:', e)
    return null
  }
})

const statusLabels: Record<string, string> = {
  en_attente: 'En attente',
  en_preparation: 'En préparation',
  prete: 'Prête',
  livree: 'Livrée'
}

const statusColors: Record<string, string> = {
  en_attente: 'bg-yellow-100 text-yellow-800',
  en_preparation: 'bg-blue-100 text-blue-800',
  prete: 'bg-green-100 text-green-800',
  livree: 'bg-gray-100 text-gray-800'
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-2xl mx-auto px-4">
      <!-- Erreur -->
      <div v-if="error || !commande" class="bg-white rounded-lg shadow p-8 text-center">
        <svg class="mx-auto h-16 w-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Commande introuvable</h2>
        <p class="text-gray-600 mb-6">Le code de retrait {{ code }} n'existe pas.</p>
        <NuxtLink to="/" class="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition">
          Retour à l'accueil
        </NuxtLink>
      </div>

      <!-- Succès -->
      <div v-else>
        <!-- En-tête succès -->
        <div class="bg-white rounded-lg shadow p-8 text-center mb-6">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 mb-2">Commande confirmée !</h1>
          <p class="text-gray-600">Merci {{ commande.nom_client }}, votre commande a été enregistrée.</p>
        </div>

        <!-- Code de retrait -->
        <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-8 text-center mb-6">
          <p class="text-orange-100 text-sm font-medium uppercase tracking-wide mb-2">
            Votre code de retrait
          </p>
          <div class="bg-white/20 backdrop-blur rounded-lg px-6 py-4 inline-block mb-3">
            <p class="text-5xl font-bold text-white tracking-wider font-mono">
              {{ commande.code_retrait }}
            </p>
          </div>
          <p class="text-orange-50 text-sm">
            Présentez ce code au comptoir pour récupérer votre commande
          </p>
        </div>

        <!-- Statut -->
        <div class="bg-white rounded-lg shadow p-6 mb-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-900">Statut de la commande</h2>
            <span 
              :class="statusColors[commande.statut] || 'bg-gray-100 text-gray-800'"
              class="px-3 py-1 rounded-full text-sm font-medium"
            >
              {{ statusLabels[commande.statut] || commande.statut }}
            </span>
          </div>
          
          <div class="text-sm text-gray-600">
            <p>Commandé le {{ new Date(commande.createdAt).toLocaleDateString('fr-FR', { 
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) }}</p>
            <p>Email : {{ commande.email_client }}</p>
          </div>
        </div>

        <!-- Détails commande -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Détails de la commande</h2>
          
          <div class="space-y-3 mb-4">
            <div 
              v-for="ligne in commande.ligne_de_commandes" 
              :key="ligne.documentId"
              class="flex justify-between text-sm"
            >
              <span class="text-gray-700">
                {{ ligne.produit.nom }} 
                <span class="text-gray-500">× {{ ligne.quantite }}</span>
              </span>
              <span class="font-medium text-gray-900">
                {{ (ligne.prix_unitaire * ligne.quantite).toFixed(2) }} €
              </span>
            </div>
          </div>

          <div class="border-t pt-3">
            <div class="flex justify-between text-xl font-bold text-gray-900">
              <span>Total</span>
              <span>{{ commande.total.toFixed(2) }} €</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="mt-6 text-center space-y-3">
          <p class="text-sm text-gray-600">
            Un email de confirmation a été envoyé à {{ commande.email_client }}
          </p>
          <NuxtLink 
            to="/" 
            class="inline-block text-orange-600 hover:text-orange-700 font-medium"
          >
            ← Retour à l'accueil
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>