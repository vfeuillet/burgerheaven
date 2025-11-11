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