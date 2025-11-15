<script setup lang="ts">
const { add } = useCart()
const config = useRuntimeConfig()

type Produit = {
  id?: number
  documentId?: string
  nom?: string
  description?: string | null
  prix?: number
  prixPromo?: number | null
  enPromotion?: boolean
  image?: { url?: string } | null
  categorie?: string
}

// Utiliser l'API REST au lieu de GraphQL
const { data, pending, error } = await useFetch<{ data: Produit[] }>(
  `${config.public.strapiUrl}/api/produits?filters[enPromotion][$eq]=true&populate=*`,
  {
    server: true
  }
)

const produitsPromo = computed<Produit[]>(() => data.value?.data ?? [])

function addToCart(p: Produit) {
  const id = p.documentId ?? String(p.id ?? '')
  const nom = p.nom ?? ''
  const prix = p.prixPromo ? Number(p.prixPromo) : Number(p.prix ?? 0)
  const img: string | null = p?.image?.url ? fullUrl(p.image.url ?? null) : null
  add({ id, nom, prix, image: img, qty: 1 })
}

function fullUrl(path?: string | null): string {
  if (!path) return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80'
  if (path.startsWith('http')) return path
  return `${config.public.strapiUrl}${path}`
}

function calculerReduction(prixNormal?: number | null, prixPromo?: number | null): number {
  if (!prixNormal || !prixPromo) return 0
  return Math.round((1 - (prixPromo / prixNormal)) * 100)
}
</script>

<template>
  <section id="promotions" style="padding: 3rem 0 5rem 0; background: white;">
    <div class="container mx-auto px-4">
      
      <!-- En-tête de section -->
      <div class="text-center mb-8">
        <div style="display: inline-block; background-color: white; color: #dc2626; font-size: 0.875rem; font-weight: 700; padding: 0.5rem 1rem; border-radius: 9999px; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.05em; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <span style="margin-right: 0.25rem;">🔥</span>
          Offres limitées
        </div>
        
        <h2 style="font-size: 3rem; font-weight: bold; color: #1f2937; margin-bottom: 0.75rem;">
          Nos <span style="color: #fbbf24;">Promotions</span>
        </h2>
        
        <p style="font-size: 1.125rem; color: #4b5563; max-width: 48rem; margin: 0 auto;">
          Profitez de nos offres exceptionnelles avant qu'il ne soit trop tard !
        </p>
      </div>

      <!-- Chargement -->
      <div v-if="pending" class="text-center py-16">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-transparent"></div>
        <p class="mt-6 text-gray-600 text-lg">Chargement des offres...</p>
      </div>

      <!-- Aucune promo -->
      <div v-else-if="!produitsPromo.length" class="text-center py-16 bg-white rounded-3xl shadow-xl">
        <div class="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
          <span style="font-size: 3rem;">😔</span>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-3">Aucune promotion pour le moment</h3>
        <p class="text-gray-500 text-lg mb-6">Revenez bientôt pour découvrir nos offres !</p>
        <a href="#menu" class="inline-block bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-6 rounded-full transition">
          Voir le menu
        </a>
      </div>

      <!-- Grille des produits en promo -->
      <div 
        v-else 
        style="display: grid; gap: 2rem; grid-template-columns: repeat(auto-fit, minmax(320px, 380px)); justify-content: center;"
      >
        <article
          v-for="(item, i) in produitsPromo"
          :key="item.documentId ?? item.nom ?? String(i)"
          style="background-color: white; border-radius: 1rem; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); transition: all 0.3s; position: relative;"
          class="group hover:shadow-2xl hover:-translate-y-2"
        >
          <!-- Badge PROMO -->
          <div 
            v-if="item.prixPromo && item.prix"
            style="position: absolute; top: 1rem; right: 1rem; background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 0.5rem 1rem; border-radius: 9999px; font-weight: bold; font-size: 0.875rem; z-index: 10; box-shadow: 0 4px 6px rgba(0,0,0,0.3);"
          >
            <span style="margin-right: 0.25rem;">🔥</span>
            -{{ calculerReduction(item.prix, item.prixPromo) }}%
          </div>

          <!-- Image produit -->
          <div style="height: 192px; overflow: hidden; position: relative; background: linear-gradient(135deg, #fef3c7, #fde68a);">
            <img
              :src="fullUrl(item?.image?.url)"
              :alt="`${item?.nom ?? 'Produit en promotion'} - Économisez ${calculerReduction(item.prix, item.prixPromo)}%`"
              loading="lazy"
              decoding="async"
              width="400"
              height="192"
              style="width: 100%; height: 192px; object-fit: cover; transition: transform 0.5s;"
              class="group-hover:scale-110"
            />
          </div>

          <!-- Contenu -->
          <div style="padding: 1.5rem;">
            <!-- Nom et Prix -->
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.75rem;">
              <h3 style="font-size: 1.5rem; font-weight: bold; color: #1f2937;">
                {{ item?.nom ?? 'Produit' }}
              </h3>
              
              <div style="text-align: right; margin-left: 1rem; flex-shrink: 0;">
                <template v-if="item.prixPromo">
                  <div style="font-size: 1.5rem; font-weight: bold; color: #ef4444;">
                    €{{ Number(item.prixPromo).toFixed(2) }}
                  </div>
                  <div style="font-size: 0.875rem; color: #9ca3af; text-decoration: line-through;">
                    €{{ Number(item.prix ?? 0).toFixed(2) }}
                  </div>
                </template>
                <div v-else style="font-size: 1.5rem; font-weight: bold; color: #1f2937;">
                  €{{ Number(item.prix ?? 0).toFixed(2) }}
                </div>
              </div>
            </div>

            <!-- Description -->
            <p style="color: #6b7280; margin-bottom: 1rem; min-height: 3rem; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
              {{ item?.description ?? 'Profitez de cette offre exceptionnelle !' }}
            </p>

            <!-- Badge économie -->
            <div 
              v-if="item.prixPromo && item.prix"
              style="background: linear-gradient(135deg, #d1fae5, #a7f3d0); border: 2px solid #10b981; border-radius: 0.5rem; padding: 0.75rem; text-align: center; margin-bottom: 1rem;"
            >
              <span style="color: #065f46; font-weight: bold; font-size: 0.875rem;">
                💰 Vous économisez €{{ (Number(item.prix) - Number(item.prixPromo)).toFixed(2) }}
              </span>
            </div>

            <!-- Bouton CTA -->
            <button
              @click="addToCart(item)"
              style="width: 100%; background-color: #fbbf24; color: #1f2937; font-weight: bold; padding: 0.75rem 1.5rem; border-radius: 9999px; border: none; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 0.5rem;"
              class="hover:bg-yellow-500 hover:scale-105"
            >
              <span>Ajouter au panier</span>
              <svg style="width: 1.25rem; height: 1.25rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </article>
      </div>

    </div>
  </section>
</template>

<style scoped>
article {
  animation: fadeInUp 0.6s ease-out;
  animation-fill-mode: both;
}

article:nth-child(1) { animation-delay: 0.1s; }
article:nth-child(2) { animation-delay: 0.2s; }
article:nth-child(3) { animation-delay: 0.3s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive pour grille produits */
@media (max-width: 360px) {
  section > div > div[style*="grid-template-columns"] {
    grid-template-columns: 1fr !important;
    gap: 1.5rem !important;
  }
}

@media (max-width: 480px) {
  /* Cards produits plus compactes */
  article > div {
    padding: 1rem !important;
  }

  article h3 {
    font-size: 1.25rem !important;
  }

  article p {
    font-size: 0.875rem !important;
  }

  /* Badge économie plus petit */
  article > div > div[style*="background: linear-gradient(135deg, #d1fae5"] {
    padding: 0.5rem !important;
    font-size: 0.75rem !important;
  }
}
</style>