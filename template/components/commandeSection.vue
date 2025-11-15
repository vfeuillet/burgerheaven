<script setup lang="ts">
const { cart, subtotal, delivery, total, clear } = useCart()
const config = useRuntimeConfig()

const form = ref({
  nom_client: '',
  email_client: '',
  telephone: '',
  adresse: '',
  date_livraison: '',
  heure_livraison: '',
  mode_paiement: 'sur_place' // ✅ Mode par défaut
})

const loading = ref(false)
const error = ref('')
const success = ref(false)
const orderCode = ref('')

async function submitOrder() {
  if (!form.value.nom_client || !form.value.email_client) {
    error.value = 'Veuillez remplir au moins le nom et l\'email'
    return
  }

  if (cart.value.length === 0) {
    error.value = 'Votre panier est vide. Ajoutez des produits depuis le menu.'
    return
  }

  loading.value = true
  error.value = ''

  try {
    // 1️⃣ Créer la commande
    const commandeResponse = await $fetch<any>(config.public.strapiUrl + '/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation CreateCommande($data: CommandeInput!) {
            createCommande(data: $data) {
              documentId
              code_retrait
            }
          }
        `,
        variables: {
          data: {
            nom_client: form.value.nom_client,
            email_client: form.value.email_client,
            total: total.value,
            statut: 'en_attente',
            mode_paiement: form.value.mode_paiement // ✅ Enregistré correctement
          }
        }
      })
    })

    const commande = commandeResponse.data.createCommande

    // 2️⃣ Créer les lignes de commande
    for (const item of cart.value) {
      await $fetch<any>(config.public.strapiUrl + '/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            mutation CreateLigneDeCommande($data: LigneDeCommandeInput!) {
              createLigneDeCommande(data: $data) {
                documentId
              }
            }
          `,
          variables: {
            data: {
              commande: commande.documentId,
              produit: item.id, // ✅ CORRECTION : item.id au lieu de item.documentId
              quantite: item.qty,
              prix_unitaire: item.prix
            }
          }
        })
      })
    }

    orderCode.value = commande.code_retrait
    success.value = true
    clear()
    form.value = { 
      nom_client: '', 
      email_client: '', 
      telephone: '', 
      adresse: '', 
      date_livraison: '', 
      heure_livraison: '',
      mode_paiement: 'sur_place'
    }

  } catch (e: any) {
    console.error('Erreur complète:', e)
    error.value = 'Une erreur est survenue. Veuillez réessayer.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <!-- Message de succès -->
    <div v-if="success" class="bg-green-50 border-2 border-green-500 rounded-2xl p-8 text-center mb-8">
      <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 class="text-2xl font-bold text-green-900 mb-2">Commande confirmée !</h3>
      <p class="text-green-700 mb-4">Votre code de retrait :</p>
      <div class="bg-yellow-400 text-gray-900 text-4xl font-bold py-4 px-6 rounded-lg inline-block mb-4">
        {{ orderCode }}
      </div>
      <p class="text-gray-600 mb-2">Un email de confirmation a été envoyé.</p>
      <p class="text-sm text-orange-600 font-semibold">💵 Paiement à régler sur place lors du retrait</p>
    </div>

    <!-- Formulaire -->
    <div v-else class="grid md:grid-cols-2 gap-8">
      <!-- Informations de livraison -->
      <div class="bg-white rounded-2xl shadow-lg p-8">
        <h3 class="text-2xl font-bold text-gray-900 mb-6">Informations de livraison</h3>
        
        <form @submit.prevent="submitOrder" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
            <input v-model="form.nom_client" type="text" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent" placeholder="Jean Dupont" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input v-model="form.email_client" type="email" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent" placeholder="jean@example.com" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input v-model="form.telephone" type="tel" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent" placeholder="06 12 34 56 78" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
            <textarea v-model="form.adresse" rows="3" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent" placeholder="123 Rue Example, Paris"></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date de livraison</label>
              <input v-model="form.date_livraison" type="date" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Heure de livraison</label>
              <input v-model="form.heure_livraison" type="time" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent" />
            </div>
          </div>

          <!-- ✅ Section Mode de paiement -->
          <div class="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
            <label class="block text-sm font-medium text-gray-700 mb-3">Mode de paiement *</label>
            <div class="space-y-2">
              <label class="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-yellow-100 transition">
                <input 
                  v-model="form.mode_paiement" 
                  type="radio" 
                  value="sur_place" 
                  class="w-5 h-5 text-yellow-400 focus:ring-yellow-400"
                />
                <div>
                  <span class="text-gray-900 font-semibold">💵 Payer sur place</span>
                  <p class="text-xs text-gray-600">Réglez lors du retrait de votre commande</p>
                </div>
              </label>
              <label class="flex items-center gap-3 cursor-not-allowed p-3 rounded-lg opacity-50 bg-gray-100">
                <input 
                  type="radio" 
                  value="en_ligne" 
                  disabled 
                  class="w-5 h-5"
                />
                <div>
                  <span class="text-gray-500 font-semibold">💳 Payer en ligne</span>
                  <p class="text-xs text-gray-500">Bientôt disponible</p>
                </div>
              </label>
            </div>
          </div>

          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {{ error }}
          </div>
        </form>
      </div>

      <!-- Votre commande -->
      <div class="bg-yellow-50 rounded-2xl shadow-lg p-8">
        <h3 class="text-2xl font-bold text-gray-900 mb-6">Votre commande</h3>

        <!-- Liste des articles -->
        <div v-if="cart.length > 0" class="space-y-3 mb-6">
          <div class="flex justify-between text-sm font-medium">
            <span class="text-gray-700">Article</span>
            <span class="text-gray-700">Total</span>
          </div>
          <div v-for="item in cart" :key="item.id" class="flex justify-between text-sm border-b border-yellow-200 pb-2">
            <span class="text-gray-600">{{ item.nom }} × {{ item.qty }}</span>
            <span class="text-gray-900 font-semibold">€{{ (item.prix * item.qty).toFixed(2) }}</span>
          </div>
        </div>

        <div v-else class="text-center py-8">
          <p class="text-gray-500 mb-4">Votre panier est vide</p>
          <a href="#menu" class="text-yellow-600 hover:text-yellow-700 font-medium">
            Voir le menu →
          </a>
        </div>

        <!-- Totaux -->
        <div class="space-y-2 mb-6">
          <div class="flex justify-between text-gray-700">
            <span>Sous-total</span>
            <span>€{{ subtotal.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-gray-700">
            <span>Livraison</span>
            <span>€{{ delivery.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-2xl font-bold text-gray-900 pt-2 border-t-2 border-yellow-300">
            <span>Total</span>
            <span>€{{ total.toFixed(2) }}</span>
          </div>
        </div>

        <!-- Bouton -->
        <button
          @click="submitOrder"
          :disabled="loading || cart.length === 0"
          class="w-full bg-yellow-400 text-gray-900 py-4 rounded-lg font-bold text-lg hover:bg-yellow-500 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <svg v-if="loading" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <span>{{ loading ? 'Commande en cours...' : 'Confirmer la commande' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>