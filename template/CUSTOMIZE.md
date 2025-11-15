# 🎨 Guide de personnalisation

Ce guide vous accompagne pas à pas pour transformer ce template en votre propre site de restaurant.

> ✨ **Bonne nouvelle !** Toutes les pages et fonctionnalités sont déjà codées. Vous devez juste personnaliser les textes, images, couleurs et configurer Strapi.

## ✅ Checklist de personnalisation

### 1️⃣ Branding et identité visuelle

#### Modifier le nom du restaurant
- [ ] `nuxt.config.ts` → Changer tous les `title` et `description`
- [ ] `package.json` → Changer `name` et `description`
- [ ] `components/Header.vue` → Modifier le texte du logo

#### Personnaliser les couleurs
- [ ] `tailwind.config.ts` → Ajouter vos couleurs dans `theme.extend.colors`
- [ ] `components/Header.vue` → Adapter les classes de couleur (bg-*, text-*)
- [ ] `components/Hero.vue` → Adapter le style de fond et des boutons

Exemple :
```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        'brand-orange': '#FF6B35',
        'brand-dark': '#1A1A1A',
        'brand-light': '#F5F5F5'
      }
    }
  }
}
```

#### Remplacer les images
- [ ] `/public/favicon.ico` → Votre favicon
- [ ] `/public/og-image.jpg` → Image Open Graph (1200x630px)
- [ ] Hero background → Modifier dans `components/Hero.vue`

---

### 2️⃣ Configuration Strapi

#### Créer les collections de contenu

**Collection "Produit" :**
```
Champs :
- nom (Text, required)
- description (Rich Text)
- prix (Decimal, required)
- prixPromo (Decimal, nullable)
- enPromotion (Boolean, default: false)
- image (Media - Single, required)
- categorie (Relation → Categorie)
```

**Collection "Categorie" :**
```
Champs :
- nom (Text, required)
- slug (UID, from: nom)
- ordre (Number)
```

**Collection "Commande" :**
```
Champs :
- code_retrait (Text, unique, required)
- nom_client (Text, required)
- email_client (Email, required)
- telephone_client (Text)
- total (Decimal, required)
- statut (Enumeration: en_attente, en_preparation, prete, recuperee)
- mode_paiement (Enumeration: especes, stripe)
- paiement_valide (Boolean, default: false)
- createdAt (Date, auto)
- ligne_de_commandes (Relation → LigneDeCommande, has many)
```

**Collection "LigneDeCommande" :**
```
Champs :
- quantite (Number, required)
- prix_unitaire (Decimal, required)
- produit (Relation → Produit)
- commande (Relation → Commande)
```

#### Configurer les permissions Strapi

**Public (non authentifié) :**
- ✅ Produit : `find`, `findOne`
- ✅ Categorie : `find`, `findOne`
- ✅ Commande : `create`, `findOne` (par code_retrait uniquement)
- ✅ LigneDeCommande : `create`

**Authenticated (avec token) :**
- ✅ Commande : `find`, `update`
- ✅ Tous les champs accessibles

#### Générer le token API
1. Strapi Admin → Settings → API Tokens
2. Create new token → Name: "Nuxt App"
3. Token type: **Full access** ou **Custom** (selon besoins)
4. Copier le token dans `.env` → `NUXT_STRAPI_TOKEN`

---

### 3️⃣ Configuration Stripe

#### Mode Test (développement)
1. Créer un compte Stripe → [dashboard.stripe.com](https://dashboard.stripe.com)
2. Aller dans **Developers → API Keys**
3. Copier :
   - **Publishable key** (pk_test_...) → `NUXT_PUBLIC_STRIPE_KEY`
   - **Secret key** (sk_test_...) → `NUXT_STRIPE_SECRET_KEY`

#### Mode Production
1. Activer votre compte Stripe (vérification identité)
2. Basculer en mode **Live**
3. Copier les clés de production (pk_live_... et sk_live_...)
4. Configurer les webhooks (voir section ci-dessous)

#### Webhooks Stripe (production)
1. Strapi → Settings → Webhooks → Add endpoint
2. URL : `https://votre-domaine.com/api/webhooks/stripe`
3. Events : `checkout.session.completed`, `payment_intent.succeeded`
4. Copier le **Signing secret** → `NUXT_STRIPE_WEBHOOK_SECRET`

---

### 4️⃣ Créer vos pages

#### Page d'accueil
Créer `pages/index.vue` :

```vue
<template>
  <div>
    <Header />
    <Hero
      title="Bienvenue chez [Nom Restaurant]"
      subtitle="Votre slogan ici"
      backgroundImage="/hero-bg.jpg"
    />

    <!-- Votre section de produits ici -->

    <CartSidebar />
    <CookieBanner />
  </div>
</template>

<script setup>
// Votre logique ici
</script>
```

#### Page admin
Créer `pages/admin.vue` :

```vue
<template>
  <div>
    <AdminLogin v-if="!isAuthenticated" @login="handleLogin" />

    <div v-else>
      <!-- Votre dashboard admin ici -->
      <h1>Tableau de bord</h1>
      <button @click="logout">Déconnexion</button>
    </div>
  </div>
</template>

<script setup>
const isAuthenticated = ref(false)

const handleLogin = (password) => {
  if (password === 'votre_mot_de_passe_admin') {
    isAuthenticated.value = true
  }
}

const logout = () => {
  isAuthenticated.value = false
}
</script>
```

#### Page mentions légales
Créer `pages/mentions-legales.vue` avec vos informations légales.

---

### 5️⃣ Personnaliser le Header

#### Modifier les liens de navigation
Éditer `components/Header.vue` :

```vue
<template>
  <nav class="menu">
    <a href="#accueil">Accueil</a>
    <a href="#menu">Notre Menu</a>
    <a href="#apropos">À propos</a>
    <a href="#contact">Contact</a>
  </nav>
</template>
```

#### Modifier le logo
Option 1 - Texte :
```vue
<div class="logo">
  <NuxtLink to="/">Nom Restaurant</NuxtLink>
</div>
```

Option 2 - Image :
```vue
<div class="logo">
  <NuxtLink to="/">
    <img src="/logo.png" alt="Nom Restaurant" class="h-10" />
  </NuxtLink>
</div>
```

---

### 6️⃣ Personnaliser le Hero

Éditer `components/Hero.vue` :

```vue
<template>
  <section
    class="hero"
    :style="{ backgroundImage: `url(${backgroundImage})` }"
  >
    <div class="hero-content">
      <h1>{{ title }}</h1>
      <p>{{ subtitle }}</p>

      <div class="cta-buttons">
        <a href="#menu" class="btn btn-primary">Voir le menu</a>
        <a href="#reservation" class="btn btn-secondary">Réserver</a>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: String,
  subtitle: String,
  backgroundImage: String
})
</script>
```

---

### 7️⃣ Créer votre section de produits

Créer `components/ProductGrid.vue` :

```vue
<template>
  <section class="products">
    <h2>Notre Menu</h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        v-for="product in products"
        :key="product.id"
        class="product-card"
      >
        <img :src="product.image" :alt="product.nom" />
        <h3>{{ product.nom }}</h3>
        <p>{{ product.description }}</p>
        <p class="price">{{ product.prix }}€</p>

        <button @click="addToCart(product)">
          Ajouter au panier
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
const cart = useCart()
const gql = useGql()

// Récupérer les produits depuis Strapi
const { data: products } = await gql({
  query: `
    query {
      produits {
        id
        documentId
        nom
        description
        prix
        image { url }
      }
    }
  `
})

const addToCart = (product) => {
  cart.add({
    id: product.documentId,
    nom: product.nom,
    prix: product.prix,
    image: product.image.url,
    quantite: 1
  })
}
</script>
```

---

### 8️⃣ Modifier les frais de livraison

Éditer `composables/useCart.ts` :

```typescript
const delivery = computed(() => {
  // Livraison gratuite au-dessus de 30€
  return subtotal.value >= 30 ? 0 : 3.50
})
```

---

### 9️⃣ Personnaliser les cookies

Éditer `components/CookieBanner.vue` :

```typescript
// Modifier les liens
const privacyLink = '/mentions-legales#cookies'
const termsLink = '/conditions-generales'

// Modifier les catégories
const cookieCategories = [
  {
    id: 'necessary',
    name: 'Cookies nécessaires',
    description: 'Indispensables au fonctionnement du site (panier)',
    required: true
  },
  {
    id: 'analytics',
    name: 'Cookies analytiques',
    description: 'Google Analytics pour améliorer l\'expérience',
    required: false
  },
  {
    id: 'marketing',
    name: 'Cookies marketing',
    description: 'Publicités personnalisées Facebook/Instagram',
    required: false
  }
]
```

---

### 🔟 Finaliser pour la production

#### Vérifications avant mise en ligne
- [ ] Tester toutes les pages sur mobile
- [ ] Tester le panier et le paiement Stripe
- [ ] Vérifier les liens externes
- [ ] Optimiser les images (WebP, compression)
- [ ] Générer un sitemap.xml
- [ ] Configurer robots.txt
- [ ] Activer HTTPS
- [ ] Configurer les webhooks Stripe
- [ ] Changer le mot de passe admin

#### Variables d'environnement production
```env
# Production
NUXT_STRAPI_TOKEN=votre_token_production
NUXT_PUBLIC_GRAPHQL_ENDPOINT=https://cms.votre-domaine.com/graphql
NUXT_PUBLIC_STRAPI_URL=https://cms.votre-domaine.com

NUXT_STRIPE_SECRET_KEY=sk_live_...
NUXT_PUBLIC_STRIPE_KEY=pk_live_...
NUXT_STRIPE_WEBHOOK_SECRET=whsec_...
```

#### Build et déploiement
```bash
# Build
npm run build

# Tester le build
npm run preview

# Déployer sur Netlify/Vercel/serveur
```

---

## 🎯 Exemples de personnalisation

### Exemple 1 : Pizzeria
- Couleurs : Rouge (#D32F2F), Blanc, Vert (#388E3C)
- Logo : Pizza slice SVG
- Catégories : Classiques, Végétariennes, Spécialités
- Hero : Photo de pizza au four à bois

### Exemple 2 : Restaurant japonais
- Couleurs : Rouge foncé (#8B0000), Noir, Or (#FFD700)
- Logo : Calligraphie japonaise
- Catégories : Sushis, Makis, Tempuras, Desserts
- Hero : Planche de sushis artistique

### Exemple 3 : Food truck
- Couleurs : Jaune (#FFC107), Noir, Rouge (#FF5252)
- Logo : Camion stylisé
- Catégories : Burgers, Tacos, Desserts, Boissons
- Hero : Photo du food truck en action

---

## 📞 Besoin d'aide ?

Si vous êtes bloqué, vérifiez :
1. Les logs console navigateur (F12)
2. Les logs serveur Nuxt
3. Les logs Strapi
4. La documentation officielle

Bon courage pour votre projet ! 🚀
