<script setup lang="ts">
const props = defineProps<{
  commande: {
    documentId: string
    nom_client: string
    email_client: string
    total: number
    code_retrait: string
    statut: string
    mode_paiement?: string
    paiement_valide?: boolean  // ✅ AJOUTÉ
    createdAt: string
    creneau_retrait?: {
      heure_debut: string
      heure_fin: string
    } | null
    ligne_de_commandes?: Array<{
      quantite: number
      prix_unitaire: number
      produit?: {
        nom: string
      } | null
    }> | null
  }
}>()

const emit = defineEmits<{
  updateStatut: [statut: string]
  validerPaiement: []  // ✅ AJOUTÉ
}>()

const statutLabels: Record<string, { label: string; color: string; bg: string }> = {
  en_attente: { label: '⏳ En attente', color: '#f59e0b', bg: '#fef3c7' },
  en_preparation: { label: '👨‍🍳 En préparation', color: '#3b82f6', bg: '#dbeafe' },
  prete: { label: '✅ Prête', color: '#10b981', bg: '#d1fae5' },
  retiree: { label: '📦 Retirée', color: '#6b7280', bg: '#f3f4f6' }
}

const showDetails = ref(false)

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatHeure(heure: string): string {
  if (!heure) return ''
  if (heure.includes('T')) {
    const date = new Date(heure)
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  }
  return heure.substring(0, 5)
}

function changeStatut(newStatut: string) {
  emit('updateStatut', newStatut)
}
</script>

<template>
  <div style="background: white; border-radius: 1rem; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-left: 4px solid;" :style="{ borderLeftColor: statutLabels[commande.statut]?.color || '#6b7280' }">
    <!-- Header -->
    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
      <div style="flex: 1;">
        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; flex-wrap: wrap;">
          <h3 style="font-size: 1.25rem; font-weight: bold; color: #111827;">
            {{ commande.nom_client }}
          </h3>
          
          <!-- Badge Statut -->
          <span 
            style="padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600;"
            :style="{ 
              color: statutLabels[commande.statut]?.color || '#6b7280',
              background: statutLabels[commande.statut]?.bg || '#f3f4f6'
            }"
          >
            {{ statutLabels[commande.statut]?.label || commande.statut }}
          </span>

          <!-- ✅ Badge Paiement (MODIFIÉ) -->
          <span 
            v-if="commande.mode_paiement === 'sur_place' && !commande.paiement_valide"
            style="padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; background: #f97316; color: white;"
          >
            💵 À payer
          </span>
          <span 
            v-else-if="commande.mode_paiement === 'sur_place' && commande.paiement_valide"
            style="padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; background: #10b981; color: white;"
          >
            ✅ Payé sur place
          </span>
          <span 
            v-else-if="commande.mode_paiement === 'en_ligne'"
            style="padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; background: #10b981; color: white;"
          >
            ✅ Payé en ligne
          </span>
        </div>

        <p style="color: #6b7280; font-size: 0.875rem;">{{ commande.email_client }}</p>
        <p style="color: #9ca3af; font-size: 0.75rem; margin-top: 0.25rem;">
          {{ formatDate(commande.createdAt) }}
        </p>
      </div>

      <div style="text-align: right;">
        <div style="font-size: 1.5rem; font-weight: bold; color: #fbbf24;">
          €{{ commande.total.toFixed(2) }}
        </div>
        <div style="background: #111827; color: #fbbf24; padding: 0.375rem 0.75rem; border-radius: 0.375rem; font-weight: bold; font-size: 0.875rem; margin-top: 0.5rem;">
          #{{ commande.code_retrait }}
        </div>
      </div>
    </div>

    <!-- Créneau -->
    <div v-if="commande.creneau_retrait" style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 0.5rem; padding: 0.75rem; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
      <span style="font-size: 1.25rem;">⏰</span>
      <span style="font-weight: 600; color: #111827;">
        Retrait : {{ formatHeure(commande.creneau_retrait.heure_debut) }} - {{ formatHeure(commande.creneau_retrait.heure_fin) }}
      </span>
    </div>

    <!-- Détails commande (collapsible) -->
    <button 
      @click="showDetails = !showDetails"
      style="width: 100%; text-align: left; color: #f59e0b; font-size: 0.875rem; font-weight: 500; border: none; background: none; cursor: pointer; padding: 0.5rem 0; display: flex; align-items: center; gap: 0.5rem;"
    >
      <svg 
        :style="{ transform: showDetails ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }"
        style="width: 1rem; height: 1rem;" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
      {{ showDetails ? 'Masquer' : 'Voir' }} les détails
    </button>

    <div v-if="showDetails" style="background: #f9fafb; border-radius: 0.5rem; padding: 1rem; margin-bottom: 1rem;">
      <h4 style="font-weight: 600; color: #374151; margin-bottom: 0.75rem; font-size: 0.875rem;">Articles commandés :</h4>
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        <div 
          v-for="(ligne, idx) in commande.ligne_de_commandes" 
          :key="idx"
          style="display: flex; justify-content: space-between; font-size: 0.875rem; color: #6b7280;"
        >
          <span>{{ ligne.quantite }}x {{ ligne.produit?.nom || 'Produit' }}</span>
          <span style="font-weight: 600;">€{{ (ligne.quantite * ligne.prix_unitaire).toFixed(2) }}</span>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
      <!-- Boutons de statut -->
      <button
        v-if="commande.statut === 'en_attente'"
        @click="changeStatut('en_preparation')"
        style="flex: 1; background: #3b82f6; color: white; padding: 0.625rem 1rem; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem; border: none; cursor: pointer; transition: all 0.2s;"
      >
        👨‍🍳 Commencer préparation
      </button>

      <button
        v-if="commande.statut === 'en_preparation'"
        @click="changeStatut('prete')"
        style="flex: 1; background: #10b981; color: white; padding: 0.625rem 1rem; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem; border: none; cursor: pointer; transition: all 0.2s;"
      >
        ✅ Marquer comme prête
      </button>

      <button
        v-if="commande.statut === 'prete'"
        @click="changeStatut('retiree')"
        style="flex: 1; background: #6b7280; color: white; padding: 0.625rem 1rem; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem; border: none; cursor: pointer; transition: all 0.2s;"
      >
        📦 Marquer comme retirée
      </button>

      <button
        v-if="commande.statut === 'retiree'"
        disabled
        style="flex: 1; background: #e5e7eb; color: #9ca3af; padding: 0.625rem 1rem; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem; border: none; cursor: not-allowed;"
      >
        ✓ Terminée
      </button>

      <!-- ✅ NOUVEAU : Bouton Valider paiement -->
      <button
        v-if="commande.mode_paiement === 'sur_place' && !commande.paiement_valide"
        @click="emit('validerPaiement')"
        style="flex: 1; background: #10b981; color: white; padding: 0.625rem 1rem; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem; border: none; cursor: pointer; transition: all 0.2s;"
      >
        💰 Confirmer le paiement
      </button>
    </div>
  </div>
</template>

<style scoped>
button:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>