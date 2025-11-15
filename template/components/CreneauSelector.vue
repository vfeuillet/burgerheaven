<script setup lang="ts">
const config = useRuntimeConfig()

// Props et emits
const selectedCreneau = defineModel<string | null>({ default: null })

// Types
type Creneau = {
  documentId: string
  heure_debut: string
  heure_fin: string
  max_commande: number
}

type Commande = {
  creneau_retrait?: { documentId: string } | null
}

type CreneauWithCount = Creneau & {
  commandesCount: number
  isAvailable: boolean
}

// Requête GraphQL pour récupérer les créneaux
const creneauxQuery = `
  query {
    creneauRetraits {
      documentId
      heure_debut
      heure_fin
      max_commande
    }
  }
`

// Requête GraphQL pour récupérer toutes les commandes avec leur créneau
const commandesQuery = `
  query {
    commandes {
      documentId
      creneau_retrait {
        documentId
      }
    }
  }
`

// Récupérer les créneaux
const { data: creneauxData, pending: creneauxPending } = await useAsyncData(
  'creneaux',
  async () => {
    const response = await $fetch<any>(config.public.strapiUrl + '/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: creneauxQuery })
    })
    return response.data?.creneauRetraits ?? []
  }
)

// Récupérer les commandes
const { data: commandesData, pending: commandesPending } = await useAsyncData(
  'commandes-creneaux',
  async () => {
    const response = await $fetch<any>(config.public.strapiUrl + '/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: commandesQuery })
    })
    return response.data?.commandes ?? []
  }
)

// Calculer les créneaux avec disponibilité
const creneauxAvecDispo = computed<CreneauWithCount[]>(() => {
  const creneaux = creneauxData.value || []
  const commandes = commandesData.value || []

  return creneaux.map((creneau: Creneau) => {
    // Compter combien de commandes sont liées à ce créneau
    const commandesCount = commandes.filter(
      (cmd: Commande) => cmd.creneau_retrait?.documentId === creneau.documentId
    ).length

    // Vérifier si le créneau est disponible
    const isAvailable = commandesCount < creneau.max_commande

    return {
      ...creneau,
      commandesCount,
      isAvailable
    }
  })
})

// Sélectionner un créneau
function selectCreneau(documentId: string) {
  selectedCreneau.value = documentId
}

// Formater l'heure pour l'affichage
function formatHeure(heure: string): string {
  if (!heure) return ''
  
  // Si c'est un DateTime ISO (2025-01-01T14:30:00.000Z)
  if (heure.includes('T')) {
    const date = new Date(heure)
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
  }
  
  // Si format HH:MM:SS, on garde juste HH:MM
  return heure.substring(0, 5)
}
</script>

<template>
  <div>
    <label style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.75rem;">
      ⏰ Choisissez votre créneau de retrait *
    </label>

    <!-- Loading -->
    <div v-if="creneauxPending || commandesPending" style="text-align: center; padding: 2rem; color: #6b7280;">
      <div style="display: inline-block; width: 2rem; height: 2rem; border: 3px solid #e5e7eb; border-top-color: #fbbf24; border-radius: 50%; animation: spin 1s linear infinite;"></div>
      <p style="margin-top: 0.5rem; font-size: 0.875rem;">Chargement des créneaux...</p>
    </div>

    <!-- Liste des créneaux -->
    <div v-else style="display: grid; gap: 0.75rem;">
      <button
        v-for="creneau in creneauxAvecDispo"
        :key="creneau.documentId"
        @click="creneau.isAvailable ? selectCreneau(creneau.documentId) : null"
        :disabled="!creneau.isAvailable"
        :style="{
          padding: '1rem',
          border: '2px solid',
          borderRadius: '0.5rem',
          cursor: creneau.isAvailable ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s',
          textAlign: 'left',
          background: !creneau.isAvailable 
            ? '#f3f4f6' 
            : (selectedCreneau === creneau.documentId ? '#fef3c7' : 'white'),
          borderColor: !creneau.isAvailable
            ? '#d1d5db'
            : (selectedCreneau === creneau.documentId ? '#fbbf24' : '#e5e7eb'),
          opacity: creneau.isAvailable ? 1 : 0.6
        }"
      >
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="flex: 1;">
            <div style="font-weight: 600; font-size: 1.125rem; color: #111827; margin-bottom: 0.25rem;">
              {{ formatHeure(creneau.heure_debut) }} - {{ formatHeure(creneau.heure_fin) }}
            </div>
            <div style="font-size: 0.75rem; color: #6b7280;">
              <span v-if="creneau.isAvailable">
                {{ creneau.max_commande - creneau.commandesCount }} place(s) disponible(s)
              </span>
              <span v-else style="color: #ef4444; font-weight: 600;">
                ❌ Complet
              </span>
            </div>
          </div>

          <!-- Indicateur de sélection -->
          <div
            v-if="selectedCreneau === creneau.documentId"
            style="width: 1.5rem; height: 1.5rem; background: #fbbf24; border-radius: 50%; display: flex; align-items: center; justify-content: center;"
          >
            <svg style="width: 1rem; height: 1rem; color: white;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      </button>
    </div>

    <!-- Message si aucun créneau disponible -->
    <div v-if="!creneauxPending && creneauxAvecDispo.length === 0" style="text-align: center; padding: 2rem; color: #6b7280; background: #f9fafb; border-radius: 0.5rem;">
      <p style="font-size: 0.875rem;">Aucun créneau disponible pour le moment.</p>
    </div>

    <!-- Message d'erreur si rien n'est sélectionné -->
    <div v-if="!selectedCreneau && creneauxAvecDispo.length > 0" style="margin-top: 0.5rem; font-size: 0.75rem; color: #f59e0b;">
      * Veuillez sélectionner un créneau de retrait
    </div>
  </div>
</template>

<style scoped>
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>