<script setup lang="ts">
const config = useRuntimeConfig()
const isAuthenticated = ref(false)
const filter = ref<string>('all')
const searchQuery = ref('')
const sortBy = ref<'date' | 'montant'>('date')
const sortOrder = ref<'asc' | 'desc'>('desc')

// Vérifier si déjà connecté
onMounted(() => {
  if (process.client) {
    isAuthenticated.value = localStorage.getItem('admin_logged_in') === 'true'
  }
})

function handleAuthenticated() {
  isAuthenticated.value = true
}

function logout() {
  if (process.client) {
    localStorage.removeItem('admin_logged_in')
    isAuthenticated.value = false
  }
}

// ✅ Requête GraphQL avec paiement_valide
const commandesQuery = `
  query {
    commandes(sort: "createdAt:desc", pagination: { limit: 200 }) {
      documentId
      nom_client
      email_client
      total
      code_retrait
      statut
      mode_paiement
      paiement_valide
      createdAt
      creneau_retrait {
        heure_debut
        heure_fin
      }
      ligne_de_commandes {
        quantite
        prix_unitaire
        produit {
          nom
        }
      }
    }
  }
`

const { data: commandesData, pending, refresh } = await useAsyncData(
  'admin-commandes',
  async () => {
    if (!isAuthenticated.value) return []
    const response = await $fetch<any>(config.public.strapiUrl + '/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: commandesQuery })
    })
    return response.data?.commandes ?? []
  },
  { 
    server: false,
    watch: [isAuthenticated]
  }
)

const commandes = computed(() => commandesData.value || [])

// Filtrer + Rechercher + Trier
const commandesFiltrees = computed(() => {
  let result = [...commandes.value]
  
  // Filtrer par statut
  if (filter.value !== 'all') {
    result = result.filter((cmd: any) => cmd.statut === filter.value)
  }
  
  // Rechercher
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter((cmd: any) => 
      cmd.nom_client?.toLowerCase().includes(query) ||
      cmd.email_client?.toLowerCase().includes(query) ||
      cmd.code_retrait?.toLowerCase().includes(query)
    )
  }
  
  // Trier
  result.sort((a: any, b: any) => {
    let comparison = 0
    
    if (sortBy.value === 'date') {
      comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    } else if (sortBy.value === 'montant') {
      comparison = a.total - b.total
    }
    
    return sortOrder.value === 'asc' ? comparison : -comparison
  })
  
  return result
})

// Stats
const stats = computed(() => {
  const all = commandes.value
  return {
    total: all.length,
    en_attente: all.filter((c: any) => c.statut === 'en_attente').length,
    en_preparation: all.filter((c: any) => c.statut === 'en_preparation').length,
    prete: all.filter((c: any) => c.statut === 'prete').length,
    retiree: all.filter((c: any) => c.statut === 'retiree').length,
    chiffre_affaires: all.reduce((sum: number, c: any) => sum + c.total, 0),
    paiement_en_ligne: all.filter((c: any) => c.mode_paiement === 'en_ligne').length,
    // ✅ MODIFIÉ : Ne compte que les commandes sur_place NON validées
    paiement_sur_place: all.filter((c: any) => c.mode_paiement === 'sur_place' && !c.paiement_valide).length,
    // ✅ AJOUTÉ : Compteur des paiements validés sur place
    paiement_valide: all.filter((c: any) => c.mode_paiement === 'sur_place' && c.paiement_valide).length,
  }
})

// Mettre à jour le statut
async function updateStatut(documentId: string, newStatut: string) {
  try {
    const mutation = {
      query: `
        mutation UpdateCommande($documentId: ID!, $data: CommandeInput!) {
          updateCommande(documentId: $documentId, data: $data) {
            documentId
            statut
          }
        }
      `,
      variables: {
        documentId: documentId,
        data: { statut: newStatut }
      }
    }
    
    const response = await $fetch<any>(config.public.strapiUrl + '/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mutation)
    })
    
    if (response.errors) {
      console.error('❌ Erreurs GraphQL:', response.errors)
      alert(`Erreur: ${response.errors[0]?.message || 'Erreur inconnue'}`)
      return
    }
    
    if (!response.data?.updateCommande) {
      alert('Erreur: La commande n\'a pas pu être mise à jour')
      return
    }
    
    // Rafraîchir
    await refresh()
    
  } catch (error: any) {
    console.error('❌ ERREUR:', error)
    alert(`Erreur: ${error.message || 'Impossible de mettre à jour'}`)
  }
}

// ✅ NOUVEAU : Valider le paiement
async function validerPaiement(documentId: string) {
  try {
    const mutation = {
      query: `
        mutation UpdateCommande($documentId: ID!, $data: CommandeInput!) {
          updateCommande(documentId: $documentId, data: $data) {
            documentId
            paiement_valide
          }
        }
      `,
      variables: {
        documentId: documentId,
        data: { paiement_valide: true }
      }
    }
    
    const response = await $fetch<any>(config.public.strapiUrl + '/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mutation)
    })
    
    if (response.errors) {
      console.error('❌ Erreurs GraphQL:', response.errors)
      alert(`Erreur: ${response.errors[0]?.message || 'Erreur inconnue'}`)
      return
    }
    
    // Rafraîchir
    await refresh()
    
  } catch (error: any) {
    console.error('❌ ERREUR:', error)
    alert(`Erreur: ${error.message || 'Impossible de valider'}`)
  }
}

// Export CSV
function exportCSV() {
  const csv = [
    ['Date', 'Client', 'Email', 'Code retrait', 'Montant', 'Statut', 'Mode de paiement', 'Paiement validé'].join(','),
    ...commandesFiltrees.value.map((cmd: any) => [
      new Date(cmd.createdAt).toLocaleDateString('fr-FR'),
      cmd.nom_client,
      cmd.email_client,
      cmd.code_retrait,
      `€${cmd.total.toFixed(2)}`,
      cmd.statut,
      cmd.mode_paiement === 'en_ligne' ? 'Payé en ligne' : 'À payer sur place',
      cmd.paiement_valide ? 'Oui' : 'Non'
    ].join(','))
  ].join('\n')
  
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `commandes_${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// Toggle tri
function toggleSort(field: 'date' | 'montant') {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = field
    sortOrder.value = 'desc'
  }
}

// Auto-refresh
onMounted(() => {
  if (process.client && isAuthenticated.value) {
    const interval = setInterval(() => {
      if (isAuthenticated.value) {
        refresh()
      }
    }, 30000)

    onUnmounted(() => clearInterval(interval))
  }
})
</script>

<template>
  <div>
    <!-- Login -->
    <AdminLogin v-if="!isAuthenticated" @authenticated="handleAuthenticated" />

    <!-- Dashboard -->
    <div v-else style="min-height: 100vh; background: #f3f4f6;">
      <!-- Header -->
      <header style="background: #111827; color: white; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="max-width: 80rem; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <span style="font-size: 2rem;">🍔</span>
            <div>
              <h1 style="font-size: 1.5rem; font-weight: bold;">
                Burger<span style="color: #fbbf24;">Heaven</span>
              </h1>
              <p style="color: #9ca3af; font-size: 0.875rem;">Dashboard Administrateur</p>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 1rem;">
            <button 
              @click="exportCSV"
              style="background: #10b981; color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; border: none; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; font-weight: 500;"
              title="Exporter en CSV"
            >
              <svg style="width: 1.25rem; height: 1.25rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV
            </button>
            <button 
              @click="refresh()"
              style="background: #374151; color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; border: none; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; font-weight: 500;"
            >
              <svg style="width: 1.25rem; height: 1.25rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Actualiser
            </button>
            <button 
              @click="logout"
              style="background: #ef4444; color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; border: none; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; font-weight: 500;"
            >
              <svg style="width: 1.25rem; height: 1.25rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <!-- Content -->
      <main style="max-width: 80rem; margin: 0 auto; padding: 2rem;">
        <!-- Stats Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
          <div style="background: white; padding: 1.5rem; border-radius: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <div style="color: #6b7280; font-size: 0.875rem; margin-bottom: 0.5rem;">Total commandes</div>
            <div style="font-size: 2rem; font-weight: bold; color: #111827;">{{ stats.total }}</div>
          </div>

          <div style="background: white; padding: 1.5rem; border-radius: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <div style="color: #6b7280; font-size: 0.875rem; margin-bottom: 0.5rem;">En attente</div>
            <div style="font-size: 2rem; font-weight: bold; color: #f59e0b;">{{ stats.en_attente }}</div>
          </div>

          <div style="background: white; padding: 1.5rem; border-radius: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <div style="color: #6b7280; font-size: 0.875rem; margin-bottom: 0.5rem;">En préparation</div>
            <div style="font-size: 2rem; font-weight: bold; color: #3b82f6;">{{ stats.en_preparation }}</div>
          </div>

          <div style="background: white; padding: 1.5rem; border-radius: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <div style="color: #6b7280; font-size: 0.875rem; margin-bottom: 0.5rem;">Prêtes</div>
            <div style="font-size: 2rem; font-weight: bold; color: #10b981;">{{ stats.prete }}</div>
          </div>

          <div style="background: white; padding: 1.5rem; border-radius: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <div style="color: #6b7280; font-size: 0.875rem; margin-bottom: 0.5rem;">💳 Payé en ligne</div>
            <div style="font-size: 2rem; font-weight: bold; color: #10b981;">{{ stats.paiement_en_ligne }}</div>
          </div>

          <div style="background: white; padding: 1.5rem; border-radius: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <div style="color: #6b7280; font-size: 0.875rem; margin-bottom: 0.5rem;">💵 À payer</div>
            <div style="font-size: 2rem; font-weight: bold; color: #f59e0b;">{{ stats.paiement_sur_place }}</div>
          </div>

          <div style="background: white; padding: 1.5rem; border-radius: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <div style="color: #6b7280; font-size: 0.875rem; margin-bottom: 0.5rem;">Chiffre d'affaires</div>
            <div style="font-size: 2rem; font-weight: bold; color: #fbbf24;">€{{ stats.chiffre_affaires.toFixed(2) }}</div>
          </div>
        </div>

        <!-- Recherche + Tri -->
        <div style="background: white; padding: 1.5rem; border-radius: 1rem; margin-bottom: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
            <!-- Barre de recherche -->
            <div style="flex: 1; min-width: 250px; position: relative;">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Rechercher par nom, email ou code retrait..."
                style="width: 100%; padding: 0.75rem 1rem 0.75rem 2.5rem; border: 2px solid #e5e7eb; border-radius: 0.5rem; font-size: 1rem;"
              />
              <svg style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); width: 1.25rem; height: 1.25rem; color: #9ca3af;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <!-- Boutons de tri -->
            <button
              @click="toggleSort('date')"
              :style="{ background: sortBy === 'date' ? '#111827' : '#f3f4f6', color: sortBy === 'date' ? 'white' : '#6b7280' }"
              style="padding: 0.75rem 1rem; border-radius: 0.5rem; border: none; cursor: pointer; font-weight: 500; display: flex; align-items: center; gap: 0.5rem;"
            >
              📅 Date
              <span v-if="sortBy === 'date'">{{ sortOrder === 'desc' ? '↓' : '↑' }}</span>
            </button>
            
            <button
              @click="toggleSort('montant')"
              :style="{ background: sortBy === 'montant' ? '#111827' : '#f3f4f6', color: sortBy === 'montant' ? 'white' : '#6b7280' }"
              style="padding: 0.75rem 1rem; border-radius: 0.5rem; border: none; cursor: pointer; font-weight: 500; display: flex; align-items: center; gap: 0.5rem;"
            >
              💰 Montant
              <span v-if="sortBy === 'montant'">{{ sortOrder === 'desc' ? '↓' : '↑' }}</span>
            </button>
          </div>
        </div>

        <!-- Filtres -->
        <div style="background: white; padding: 1rem; border-radius: 1rem; margin-bottom: 2rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <button
              @click="filter = 'all'"
              :style="{ background: filter === 'all' ? '#111827' : '#f3f4f6', color: filter === 'all' ? 'white' : '#6b7280' }"
              style="padding: 0.5rem 1rem; border-radius: 0.5rem; border: none; cursor: pointer; font-weight: 500; transition: all 0.2s;"
            >
              Toutes ({{ stats.total }})
            </button>
            <button
              @click="filter = 'en_attente'"
              :style="{ background: filter === 'en_attente' ? '#f59e0b' : '#fef3c7', color: filter === 'en_attente' ? 'white' : '#f59e0b' }"
              style="padding: 0.5rem 1rem; border-radius: 0.5rem; border: none; cursor: pointer; font-weight: 500; transition: all 0.2s;"
            >
              ⏳ En attente ({{ stats.en_attente }})
            </button>
            <button
              @click="filter = 'en_preparation'"
              :style="{ background: filter === 'en_preparation' ? '#3b82f6' : '#dbeafe', color: filter === 'en_preparation' ? 'white' : '#3b82f6' }"
              style="padding: 0.5rem 1rem; border-radius: 0.5rem; border: none; cursor: pointer; font-weight: 500; transition: all 0.2s;"
            >
              👨‍🍳 En préparation ({{ stats.en_preparation }})
            </button>
            <button
              @click="filter = 'prete'"
              :style="{ background: filter === 'prete' ? '#10b981' : '#d1fae5', color: filter === 'prete' ? 'white' : '#10b981' }"
              style="padding: 0.5rem 1rem; border-radius: 0.5rem; border: none; cursor: pointer; font-weight: 500; transition: all 0.2s;"
            >
              ✅ Prêtes ({{ stats.prete }})
            </button>
            <button
              @click="filter = 'retiree'"
              :style="{ background: filter === 'retiree' ? '#6b7280' : '#f3f4f6', color: filter === 'retiree' ? 'white' : '#6b7280' }"
              style="padding: 0.5rem 1rem; border-radius: 0.5rem; border: none; cursor: pointer; font-weight: 500; transition: all 0.2s;"
            >
              📦 Retirées ({{ stats.retiree }})
            </button>
          </div>
        </div>

        <!-- Résultats -->
        <div v-if="searchQuery" style="background: white; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <p style="color: #6b7280; font-size: 0.875rem;">
            {{ commandesFiltrees.length }} résultat(s) pour "{{ searchQuery }}"
          </p>
        </div>

        <!-- Loading -->
        <div v-if="pending" style="text-align: center; padding: 3rem;">
          <div style="display: inline-block; width: 3rem; height: 3rem; border: 4px solid #e5e7eb; border-top-color: #fbbf24; border-radius: 50%; animation: spin 1s linear infinite;"></div>
          <p style="margin-top: 1rem; color: #6b7280;">Chargement des commandes...</p>
        </div>

        <!-- Liste des commandes -->
        <div v-else-if="commandesFiltrees.length > 0" style="display: grid; gap: 1.5rem;">
          <CommandeCard
            v-for="commande in commandesFiltrees"
            :key="commande.documentId"
            :commande="commande"
            @update-statut="(statut: string) => updateStatut(commande.documentId, statut)"
            @valider-paiement="() => validerPaiement(commande.documentId)"
          />
        </div>

        <!-- Aucune commande -->
        <div v-else style="background: white; padding: 3rem; border-radius: 1rem; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <span style="font-size: 4rem; display: block; margin-bottom: 1rem;">📭</span>
          <h3 style="font-size: 1.5rem; font-weight: bold; color: #111827; margin-bottom: 0.5rem;">
            Aucune commande
          </h3>
          <p style="color: #6b7280;">
            {{ searchQuery ? 'Aucun résultat pour cette recherche' : (filter === 'all' ? 'Aucune commande pour le moment' : 'Aucune commande avec ce statut') }}
          </p>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

button:hover {
  opacity: 0.9;
}

input:focus {
  outline: none;
  border-color: #fbbf24;
}
</style>