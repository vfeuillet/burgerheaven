<script setup lang="ts">
const { add } = useCart()
const config = useRuntimeConfig()

const query = `
  query {
    produits(pagination: { limit: 100 }) {
      documentId
      nom
      description
      prix
      prixPromo
      enPromotion
      categorie
      image { url }
    }
  }
`

type Produit = {
  documentId?: string | null
  nom?: string | null
  description?: string | null
  prix?: number | null
  prixPromo?: number | null
  enPromotion?: boolean | null
  image?: { url?: string | null } | null
  categorie?: string | null
}

type GqlResponse = { data?: { produits?: Produit[] | null } | null }

const { data, pending, error, refresh } = await useAsyncData<GqlResponse>(
  'produits-menu',
  () => useGql<GqlResponse>(query),
  { server: true }
)

const produits = computed<Produit[]>(() => data.value?.data?.produits ?? [])

const categories = computed<string[]>(() => {
  const set = new Set<string>()
  for (const p of produits.value) {
    const nom = (p?.categorie ?? '').trim()
    if (nom) set.add(nom)
  }
  return Array.from(set)
})

const activeCat = ref<string | null>(null)
watchEffect(() => {
  if (!activeCat.value && categories.value.length > 0) {
    activeCat.value = categories.value[0] ?? null
  }
})

const produitsFiltres = computed<Produit[]>(() => {
  const cat = activeCat.value
  if (!cat) return produits.value
  return produits.value.filter(p => (p?.categorie ?? '').trim() === cat.trim())
})

function addToCart(p: Produit) {
  const id = p.documentId ?? ''
  const nom = p.nom ?? ''
  const prix = p.enPromotion && p.prixPromo ? Number(p.prixPromo) : Number(p.prix ?? 0)
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
  <section id="menu" style="padding: 3rem 0 5rem 0; background-color: white;">
    <div class="container mx-auto px-4">
      
    <!-- En-tête de section (SANS badge) -->
<div class="text-center mb-8">
  <h2 style="font-size: 3rem; font-weight: bold; color: #1f2937; margin-bottom: 0.75rem;">
    Notre <span style="color: #fbbf24;">Menu</span>
  </h2>
  
  <p style="font-size: 1.125rem; color: #4b5563; max-width: 48rem; margin: 0 auto;">
    Découvrez nos spécialités préparées avec des ingrédients frais et de qualité.
  </p>
</div>

      <!-- Filtres catégories (STYLE AMÉLIORÉ) -->
      <div v-if="categories.length > 0" class="flex justify-center mb-10">
        <div style="display: inline-flex; gap: 0.75rem; background-color: #f3f4f6; padding: 0.5rem; border-radius: 9999px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <button
            v-for="cat in categories"
            :key="cat"
            @click="activeCat = cat"
            :style="{
              padding: '0.75rem 1.5rem',
              borderRadius: '9999px',
              fontWeight: 'bold',
              fontSize: '1rem',
              transition: 'all 0.3s',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: cat === activeCat ? '#fbbf24' : 'transparent',
              color: cat === activeCat ? '#1f2937' : '#6b7280',
              boxShadow: cat === activeCat ? '0 4px 6px rgba(0,0,0,0.2)' : 'none',
              transform: cat === activeCat ? 'scale(1.05)' : 'scale(1)'
            }"
            class="hover-filter-btn"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <!-- Chargement -->
      <div v-if="pending" class="text-center py-16">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent"></div>
        <p class="mt-6 text-gray-600 text-lg">Chargement du menu...</p>
      </div>

      <!-- Erreur -->
      <div v-else-if="error" class="text-center py-16">
        <p class="text-red-600 mb-4 text-lg">Une erreur est survenue.</p>
        <button @click="refresh()" class="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-6 rounded-full transition">
          Réessayer
        </button>
      </div>

      <!-- Grille des produits -->
      <div 
        v-else-if="produitsFiltres.length > 0" 
        style="display: grid; gap: 2rem; grid-template-columns: repeat(auto-fit, minmax(320px, 380px)); justify-content: center;"
      >
        <article
          v-for="(item, i) in produitsFiltres"
          :key="item.documentId ?? item.nom ?? String(i)"
          style="background-color: white; border-radius: 1rem; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); transition: all 0.3s; position: relative;"
          class="group hover:shadow-2xl hover:-translate-y-2"
        >
          <!-- Badge PROMO -->
          <div 
            v-if="item.enPromotion && item.prixPromo && item.prix"
            style="position: absolute; top: 1rem; right: 1rem; background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 0.5rem 1rem; border-radius: 9999px; font-weight: bold; font-size: 0.875rem; z-index: 10; box-shadow: 0 4px 6px rgba(0,0,0,0.3);"
          >
            <span style="margin-right: 0.25rem;">🔥</span>
            -{{ calculerReduction(item.prix, item.prixPromo) }}%
          </div>

          <!-- Image produit -->
          <div style="height: 192px; overflow: hidden; position: relative; background: linear-gradient(135deg, #fef3c7, #fde68a);">
           <img
                :src="fullUrl(item?.image?.url)"
                :alt="item?.nom ?? 'Produit'"
                loading="lazy"
                decoding="async"
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
                <template v-if="item.enPromotion && item.prixPromo">
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
              {{ item?.description ?? 'Délicieux produit préparé avec soin' }}
            </p>

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

      <!-- Aucun produit -->
      <div v-else class="text-center py-16">
        <div class="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
          <span style="font-size: 3rem;">😔</span>
        </div>
        <p class="text-gray-500 text-lg">Aucun produit disponible dans cette catégorie.</p>
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

.hover-filter-btn:hover {
  background-color: #e5e7eb !important;
}

.hover-filter-btn:active {
  transform: scale(0.98) !important;
}
</style>