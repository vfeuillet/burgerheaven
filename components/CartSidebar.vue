<script setup lang="ts">
import { loadStripe } from '@stripe/stripe-js'

const isOpen = defineModel<boolean>({ required: true })
const { cart, inc, dec, remove, subtotal, delivery, total, clear } = useCart()
const config = useRuntimeConfig()

const showCheckout = ref(false)
const paymentMethod = ref<'stripe' | 'cash'>('cash')
const selectedCreneau = ref<string | null>(null)
const form = ref({
  nom_client: '',
  email_client: ''
})
const loading = ref(false)
const error = ref('')

function closeCart() {
  isOpen.value = false
  showCheckout.value = false
  paymentMethod.value = 'cash'
  selectedCreneau.value = null
}

function continueShopping() {
  isOpen.value = false
  const menuSection = document.getElementById('menu')
  if (menuSection) {
    menuSection.scrollIntoView({ behavior: 'smooth' })
  }
}

async function submitOrder() {
  if (!form.value.nom_client || !form.value.email_client) {
    error.value = 'Veuillez remplir tous les champs'
    return
  }

  if (!selectedCreneau.value) {
    error.value = 'Veuillez sélectionner un créneau de retrait'
    return
  }

  loading.value = true
  error.value = ''

  try {
    if (paymentMethod.value === 'stripe') {
      await processStripePayment()
    } else {
      await processCashPayment()
    }
  } catch (e: any) {
    console.error('Erreur:', e)
    error.value = 'Une erreur est survenue. Veuillez réessayer.'
    loading.value = false
  }
}

async function processCashPayment() {
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
    creneau_retrait: selectedCreneau.value,
    mode_paiement: 'sur_place'  // ✅ AJOUTÉ
  }
}
    })
  })

  const commande = commandeResponse.data.createCommande
  console.log('✅ Commande créée:', commande)

  // Créer les lignes de commande et collecter leurs IDs
  const ligneIds: string[] = []
  
  for (const item of cart.value) {
    console.log('🔍 Création ligne pour:', item.nom)
    
    const ligneResponse = await $fetch<any>(config.public.strapiUrl + '/graphql', {
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
            quantite: item.qty,
            prix_unitaire: item.prix,
            produit: item.id,
            commande: commande.documentId
          }
        }
      })
    })
    
    const ligneId = ligneResponse.data.createLigneDeCommande.documentId
    ligneIds.push(ligneId)
    console.log('✅ Ligne créée:', ligneId)
  }

  // Mettre à jour la commande avec les lignes (relation bidirectionnelle)
  console.log('🔗 Liaison des lignes à la commande...')
  await $fetch<any>(config.public.strapiUrl + '/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        mutation UpdateCommande($documentId: ID!, $data: CommandeInput!) {
          updateCommande(documentId: $documentId, data: $data) {
            documentId
            ligne_de_commandes {
              documentId
            }
          }
        }
      `,
      variables: {
        documentId: commande.documentId,
        data: {
          ligne_de_commandes: ligneIds
        }
      }
    })
  })
  
  console.log('✅ Commande mise à jour avec les lignes')

  alert(`✅ Commande validée ! Votre code de retrait : ${commande.code_retrait}\n\nPaiement sur place à la récupération.`)
  clear()
  closeCart()
  form.value = { nom_client: '', email_client: '' }
  loading.value = false
}

async function processStripePayment() {
  const stripeKey = config.public.stripePublicKey as string
  const stripe = await loadStripe(stripeKey)
  
  if (!stripe) {
    error.value = 'Erreur de chargement du système de paiement'
    loading.value = false
    return
  }

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
    creneau_retrait: selectedCreneau.value,
    mode_paiement: 'en_ligne'  // ✅ AJOUTÉ
  }
}
    })
  })

  const commande = commandeResponse.data.createCommande
  console.log('✅ Commande créée:', commande)

  // Créer les lignes de commande et collecter leurs IDs
  const ligneIds: string[] = []
  
  for (const item of cart.value) {
    console.log('🔍 Création ligne pour:', item.nom)
    
    const ligneResponse = await $fetch<any>(config.public.strapiUrl + '/graphql', {
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
            quantite: item.qty,
            prix_unitaire: item.prix,
            produit: item.id,
            commande: commande.documentId
          }
        }
      })
    })
    
    const ligneId = ligneResponse.data.createLigneDeCommande.documentId
    ligneIds.push(ligneId)
    console.log('✅ Ligne créée:', ligneId)
  }

  // Mettre à jour la commande avec les lignes (relation bidirectionnelle)
  console.log('🔗 Liaison des lignes à la commande...')
  await $fetch<any>(config.public.strapiUrl + '/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        mutation UpdateCommande($documentId: ID!, $data: CommandeInput!) {
          updateCommande(documentId: $documentId, data: $data) {
            documentId
            ligne_de_commandes {
              documentId
            }
          }
        }
      `,
      variables: {
        documentId: commande.documentId,
        data: {
          ligne_de_commandes: ligneIds
        }
      }
    })
  })
  
  console.log('✅ Commande mise à jour avec les lignes')

  const items = cart.value.map(item => ({
    name: item.nom,
    amount: Math.round(item.prix * 100),
    quantity: item.qty
  }))

  const response = await $fetch<{ url: string }>('/api/create-checkout-session', {
    method: 'POST',
    body: {
      items,
      customerEmail: form.value.email_client,
      orderCode: commande.code_retrait
    }
  })

  window.location.href = response.url
}

function handleMouseOver(e: Event) {
  const target = e.target as HTMLElement
  target.style.backgroundColor = '#f3f4f6'
}

function handleMouseOut(e: Event) {
  const target = e.target as HTMLElement
  target.style.backgroundColor = 'transparent'
}
</script>

<template>
  <!-- Overlay -->
  <div 
    v-if="isOpen"
    @click="closeCart"
    style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 9998;"
  ></div>

  <!-- Sidebar -->
  <div 
    v-if="isOpen"
    style="position: fixed; top: 0; right: 0; bottom: 0; width: 100%; max-width: 28rem; background: white; z-index: 9999; box-shadow: -4px 0 20px rgba(0,0,0,0.3); display: flex; flex-direction: column; overflow: hidden;"
  >
    <!-- Header -->
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 1.5rem; border-bottom: 1px solid #e5e7eb;">
      <h2 style="font-size: 1.5rem; font-weight: bold; color: #111827;">Votre panier</h2>
      <button 
        @click="closeCart" 
        @mouseover="handleMouseOver"
        @mouseout="handleMouseOut"
        style="padding: 0.5rem; border: none; background: none; cursor: pointer; border-radius: 9999px; transition: background 0.2s;"
      >
        <svg style="width: 1.5rem; height: 1.5rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Content -->
    <div style="flex: 1; overflow-y: auto; padding: 1.5rem;">
      <!-- Panier vide -->
      <div v-if="cart.length === 0 && !showCheckout" style="text-align: center; padding: 3rem 0;">
        <p style="color: #6b7280; font-size: 1.125rem; margin-bottom: 1.5rem;">Votre panier est vide</p>
      </div>

      <!-- Articles -->
      <div v-else-if="!showCheckout" style="display: flex; flex-direction: column; gap: 1rem;">
        <div v-for="item in cart" :key="item.id" style="display: flex; gap: 1rem; background: #f9fafb; padding: 1rem; border-radius: 0.5rem;">
          <img 
            :src="item.image || 'https://placehold.co/80x80/FFD700/000000?text=Burger'" 
            :alt="item.nom"
            style="width: 5rem; height: 5rem; object-fit: cover; border-radius: 0.5rem;"
          />
          <div style="flex: 1;">
            <h3 style="font-weight: bold; color: #111827;">{{ item.nom }}</h3>
            <p style="color: #f59e0b; font-weight: 600;">€{{ item.prix.toFixed(2) }}</p>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem;">
              <button @click="dec(item.id)" style="width: 1.75rem; height: 1.75rem; background: #e5e7eb; border: none; border-radius: 0.25rem; cursor: pointer; font-weight: bold;">-</button>
              <span style="font-weight: 600;">{{ item.qty }}</span>
              <button @click="inc(item.id)" style="width: 1.75rem; height: 1.75rem; background: #e5e7eb; border: none; border-radius: 0.25rem; cursor: pointer; font-weight: bold;">+</button>
              <button @click="remove(item.id)" style="margin-left: auto; color: #ef4444; border: none; background: none; cursor: pointer;">
                <svg style="width: 1.25rem; height: 1.25rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Formulaire de commande -->
      <div v-else style="display: flex; flex-direction: column; gap: 1rem;">
        <button @click="showCheckout = false" style="color: #f59e0b; display: flex; align-items: center; gap: 0.5rem; border: none; background: none; cursor: pointer; font-weight: 500; padding: 0;">
          <svg style="width: 1.25rem; height: 1.25rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </button>
        
        <div>
          <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.25rem;">Nom complet *</label>
          <input v-model="form.nom_client" type="text" required style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 1rem;" placeholder="Jean Dupont" />
        </div>
        
        <div>
          <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.25rem;">Email *</label>
          <input v-model="form.email_client" type="email" required style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 1rem;" placeholder="jean@example.com" />
        </div>

        <!-- Sélecteur de créneau -->
        <div style="border: 2px solid #e5e7eb; border-radius: 0.5rem; padding: 1rem;">
          <CreneauSelector v-model="selectedCreneau" />
        </div>

        <!-- Choix du mode de paiement -->
        <div style="border: 2px solid #e5e7eb; border-radius: 0.5rem; padding: 1rem;">
          <label style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.75rem;">Mode de paiement</label>
          
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <label style="display: flex; align-items: center; padding: 0.75rem; border: 2px solid; border-radius: 0.5rem; cursor: pointer; transition: all 0.2s;" :style="paymentMethod === 'cash' ? 'border-color: #fbbf24; background: #fef3c7;' : 'border-color: #e5e7eb; background: white;'">
              <input type="radio" v-model="paymentMethod" value="cash" style="margin-right: 0.75rem;" />
              <div style="flex: 1;">
                <div style="font-weight: 600; color: #111827;">💵 Payer sur place</div>
                <div style="font-size: 0.75rem; color: #6b7280;">Réglez lors de la récupération</div>
              </div>
            </label>

            <label style="display: flex; align-items: center; padding: 0.75rem; border: 2px solid; border-radius: 0.5rem; cursor: pointer; transition: all 0.2s;" :style="paymentMethod === 'stripe' ? 'border-color: #6366f1; background: #eef2ff;' : 'border-color: #e5e7eb; background: white;'">
              <input type="radio" v-model="paymentMethod" value="stripe" style="margin-right: 0.75rem;" />
              <div style="flex: 1;">
                <div style="font-weight: 600; color: #111827;">💳 Payer maintenant</div>
                <div style="font-size: 0.75rem; color: #6b7280;">Carte bancaire sécurisée</div>
              </div>
            </label>
          </div>
        </div>

        <div v-if="error" style="background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; padding: 0.75rem 1rem; border-radius: 0.5rem; font-size: 0.875rem;">
          {{ error }}
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div v-if="cart.length > 0" style="border-top: 1px solid #e5e7eb; padding: 1.5rem; background: #f9fafb; display: flex; flex-direction: column; gap: 1rem;">
      <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.875rem;">
        <div style="display: flex; justify-content: space-between; color: #6b7280;">
          <span>Sous-total</span>
          <span>€{{ subtotal.toFixed(2) }}</span>
        </div>
        <div style="display: flex; justify-content: space-between; color: #6b7280;">
          <span>Livraison</span>
          <span>€{{ delivery.toFixed(2) }}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 1.25rem; font-weight: bold; color: #111827;">
          <span>Total</span>
          <span>€{{ total.toFixed(2) }}</span>
        </div>
      </div>

      <button 
        v-if="!showCheckout"
        @click="showCheckout = true"
        style="width: 100%; background: #fbbf24; color: #111827; padding: 0.75rem; border-radius: 9999px; font-weight: bold; border: none; cursor: pointer; transition: background 0.2s;"
      >
        Passer commande
      </button>

      <button 
        v-else
        @click="submitOrder"
        :disabled="loading"
        :style="loading ? 'background: #d1d5db; cursor: not-allowed;' : 'background: #fbbf24;'"
        style="width: 100%; color: #111827; padding: 0.75rem; border-radius: 9999px; font-weight: bold; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: background 0.2s;"
      >
        <svg v-if="loading" style="animation: spin 1s linear infinite; width: 1.25rem; height: 1.25rem;" fill="none" viewBox="0 0 24 24">
          <circle style="opacity: 0.25;" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path style="opacity: 0.75;" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <span v-if="!loading && paymentMethod === 'stripe'">💳 Payer €{{ total.toFixed(2) }}</span>
        <span v-else-if="!loading">✓ Valider la commande</span>
        <span v-else>Traitement...</span>
      </button>

      <button @click="continueShopping" style="width: 100%; color: #f59e0b; font-size: 0.875rem; font-weight: 500; border: none; background: none; cursor: pointer; padding: 0;">
        ← Continuer vos achats
      </button>
    </div>
  </div>
</template>

<style scoped>
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>