# ✅ Checklist complète de personnalisation

Guide exhaustif pour transformer le template en votre site de restaurant.

---

## 🎯 ÉTAPE 1 : Configuration de base (.env)

### Fichier : `.env` (copier depuis `.env.example`)

```bash
# Strapi CMS
NUXT_STRAPI_TOKEN=votre_token_strapi_ici
NUXT_PUBLIC_GRAPHQL_ENDPOINT=https://votre-strapi.com/graphql
NUXT_PUBLIC_STRAPI_URL=https://votre-strapi.com

# Stripe
NUXT_STRIPE_SECRET_KEY=sk_test_ou_live_votre_cle
NUXT_PUBLIC_STRIPE_KEY=pk_test_ou_live_votre_cle
```

**Où obtenir ces valeurs :**
- **NUXT_STRAPI_TOKEN** : Strapi Admin → Settings → API Tokens → Create new token
- **Endpoints Strapi** : URL de votre instance Strapi (local ou hébergée)
- **Clés Stripe** : Dashboard Stripe → Developers → API Keys

---

## 🎨 ÉTAPE 2 : Branding et identité

### Fichier : `nuxt.config.ts`

Remplacer les valeurs suivantes :

```typescript
app: {
  head: {
    title: 'VOTRE_NOM_RESTAURANT - Votre slogan',  // Ligne 32

    meta: [
      {
        name: 'description',
        content: 'Votre description SEO ici' // Ligne 39
      },
      {
        property: 'og:title',
        content: 'VOTRE_NOM_RESTAURANT - Votre slogan' // Ligne 43
      },
      {
        property: 'og:description',
        content: 'Votre description courte' // Ligne 44
      },
      {
        name: 'twitter:title',
        content: 'VOTRE_NOM_RESTAURANT - Votre slogan' // Ligne 48
      },
      {
        name: 'twitter:description',
        content: 'Votre description courte' // Ligne 49
      },
    ]
  }
}
```

**Exemple BurgerHeaven :**
```typescript
title: 'BurgerHeaven - Les meilleurs burgers artisanaux'
description: 'Découvrez BurgerHeaven, vos burgers artisanaux...'
```

---

### Fichier : `package.json`

```json
{
  "name": "votre-restaurant-nom",  // Ligne 2
  "description": "Site de votre restaurant avec e-commerce"  // Ligne 4
}
```

---

## 🎨 ÉTAPE 3 : Couleurs et design

### Fichier : `tailwind.config.ts`

Ajouter vos couleurs personnalisées :

```typescript
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        // Ajoutez vos couleurs ici
        'primary': '#FF6B35',      // Couleur principale
        'secondary': '#004E89',    // Couleur secondaire
        'accent': '#FFD700',       // Couleur accent
      }
    }
  }
}
```

**Exemple BurgerHeaven :**
- Orange vif pour les CTA
- Noir pour le header
- Blanc pour le fond

---

## 📄 ÉTAPE 4 : Page d'accueil (index.vue)

### Fichier : `pages/index.vue`

#### Section 1 : Hero Banner (lignes ~10-20)

```vue
<Hero
  title="VOTRE TITRE PRINCIPAL"
  subtitle="Votre slogan accrocheur"
/>
```

**Exemple BurgerHeaven :**
```vue
<Hero
  title="Les meilleurs burgers artisanaux de Paris"
  subtitle="100% fait maison avec des produits frais et locaux"
/>
```

---

#### Section 2 : Promotions (ligne ~25)

```vue
<PromotionsSection />
```

Aucun changement ici, les promotions viennent de Strapi automatiquement.

---

#### Section 3 : Menu complet (ligne ~30)

```vue
<MenuSection />
```

Aucun changement ici, le menu vient de Strapi automatiquement.

---

#### Section 4 : Localisation et horaires (lignes ~35-90)

**À REMPLACER COMPLÈTEMENT** :

```vue
<!-- Localisation et Horaires -->
<section id="localisation" class="py-16 px-4 bg-white">
  <div class="max-w-7xl mx-auto">
    <h2 class="text-4xl font-bold text-center mb-12">Trouvez-nous</h2>

    <div class="grid md:grid-cols-2 gap-8">
      <!-- Localisation -->
      <div class="bg-gray-50 p-8 rounded-lg">
        <h3 class="text-2xl font-bold mb-4">📍 Notre adresse</h3>
        <p class="text-lg mb-2">VOTRE ADRESSE COMPLÈTE</p>
        <p class="text-lg mb-2">CODE_POSTAL VILLE</p>
        <p class="text-gray-600 mt-4">
          🚇 STATION DE MÉTRO LA PLUS PROCHE
        </p>
      </div>

      <!-- Horaires -->
      <div class="bg-gray-50 p-8 rounded-lg">
        <h3 class="text-2xl font-bold mb-4">🕒 Nos horaires</h3>
        <div class="space-y-2 text-lg">
          <p><strong>Lundi - Vendredi :</strong> VOS_HORAIRES</p>
          <p><strong>Samedi :</strong> VOS_HORAIRES</p>
          <p><strong>Dimanche :</strong> VOS_HORAIRES</p>
        </div>
        <p class="mt-4 text-gray-600">
          📞 VOTRE_NUMERO_TELEPHONE<br>
          ✉️ VOTRE_EMAIL
        </p>
      </div>
    </div>
  </div>
</section>
```

**Exemple BurgerHeaven :**
```vue
<p class="text-lg mb-2">42 Avenue des Champs-Élysées</p>
<p class="text-lg mb-2">75008 Paris</p>
<p class="text-gray-600 mt-4">🚇 Métro Franklin D. Roosevelt (Ligne 1, 9)</p>

<p><strong>Lundi - Vendredi :</strong> 11h30 - 22h00</p>
<p><strong>Samedi :</strong> 12h00 - 23h00</p>
<p><strong>Dimanche :</strong> 12h00 - 21h00</p>

<p class="mt-4 text-gray-600">
  📞 01 42 25 18 24<br>
  ✉️ contact@burgerheaven.fr
</p>
```

---

#### Section 5 : Avis clients (lignes ~95-160)

**Personnaliser les témoignages** :

```vue
<!-- Avis clients -->
<section class="py-16 px-4 bg-gray-50">
  <div class="max-w-7xl mx-auto">
    <h2 class="text-4xl font-bold text-center mb-12">Ce que disent nos clients</h2>

    <div class="grid md:grid-cols-3 gap-8">
      <!-- Avis 1 -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="flex mb-4">
          <span class="text-yellow-500 text-xl">⭐⭐⭐⭐⭐</span>
        </div>
        <p class="text-gray-700 mb-4 italic">
          "VOTRE TÉMOIGNAGE CLIENT 1"
        </p>
        <p class="font-semibold">— NOM CLIENT 1</p>
      </div>

      <!-- Avis 2 -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="flex mb-4">
          <span class="text-yellow-500 text-xl">⭐⭐⭐⭐⭐</span>
        </div>
        <p class="text-gray-700 mb-4 italic">
          "VOTRE TÉMOIGNAGE CLIENT 2"
        </p>
        <p class="font-semibold">— NOM CLIENT 2</p>
      </div>

      <!-- Avis 3 -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="flex mb-4">
          <span class="text-yellow-500 text-xl">⭐⭐⭐⭐⭐</span>
        </div>
        <p class="text-gray-700 mb-4 italic">
          "VOTRE TÉMOIGNAGE CLIENT 3"
        </p>
        <p class="font-semibold">— NOM CLIENT 3</p>
      </div>
    </div>
  </div>
</section>
```

**Exemple BurgerHeaven :**
```vue
<p>"Les meilleurs burgers de Paris ! La viande est parfaitement cuite..."</p>
<p class="font-semibold">— Sophie M.</p>
```

---

#### Section 6 : Footer (lignes ~165-200)

```vue
<footer class="bg-gray-900 text-white py-12">
  <div class="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
    <!-- Colonne 1 -->
    <div>
      <h3 class="text-xl font-bold mb-4">VOTRE_NOM_RESTAURANT</h3>
      <p class="text-gray-400">
        Votre description courte de restaurant
      </p>
    </div>

    <!-- Colonne 2 -->
    <div>
      <h3 class="text-xl font-bold mb-4">Liens rapides</h3>
      <ul class="space-y-2">
        <li><a href="#menu" class="text-gray-400 hover:text-white">Notre menu</a></li>
        <li><a href="#localisation" class="text-gray-400 hover:text-white">Nous trouver</a></li>
        <li><a href="/mentions-legales" class="text-gray-400 hover:text-white">Mentions légales</a></li>
      </ul>
    </div>

    <!-- Colonne 3 -->
    <div>
      <h3 class="text-xl font-bold mb-4">Suivez-nous</h3>
      <div class="flex gap-4">
        <a href="VOTRE_FACEBOOK" class="text-gray-400 hover:text-white text-2xl">📘</a>
        <a href="VOTRE_INSTAGRAM" class="text-gray-400 hover:text-white text-2xl">📷</a>
        <a href="VOTRE_TWITTER" class="text-gray-400 hover:text-white text-2xl">🐦</a>
      </div>
    </div>
  </div>

  <div class="text-center mt-8 pt-8 border-t border-gray-800">
    <p class="text-gray-400">
      © 2025 VOTRE_NOM_RESTAURANT - Tous droits réservés
    </p>
  </div>
</footer>
```

**Exemple BurgerHeaven :**
```vue
<h3>BurgerHeaven</h3>
<p>Des burgers artisanaux préparés avec passion depuis 2020</p>
<a href="https://facebook.com/burgerheaven">📘</a>
<p>© 2025 BurgerHeaven - Tous droits réservés</p>
```

---

## 🧩 ÉTAPE 5 : Composants

### Fichier : `components/Header.vue`

#### Ligne ~15 : Logo

```vue
<div class="logo">
  <NuxtLink to="/" class="text-2xl font-bold">
    VOTRE_NOM_RESTAURANT
  </NuxtLink>
</div>
```

**OU avec image :**

```vue
<div class="logo">
  <NuxtLink to="/">
    <img src="/logo.png" alt="VOTRE_NOM_RESTAURANT" class="h-12" />
  </NuxtLink>
</div>
```

**Exemple BurgerHeaven :**
```vue
<NuxtLink to="/" class="text-2xl font-bold">
  🍔 BurgerHeaven
</NuxtLink>
```

---

#### Lignes ~25-35 : Menu de navigation

```vue
<nav class="hidden md:flex gap-8">
  <a href="#accueil" class="hover:text-orange-500">Accueil</a>
  <a href="#menu" class="hover:text-orange-500">VOTRE_MENU_TITRE</a>
  <a href="#promotions" class="hover:text-orange-500">VOTRE_PROMO_TITRE</a>
  <a href="#localisation" class="hover:text-orange-500">VOTRE_LOCALISATION_TITRE</a>
</nav>
```

**Exemple BurgerHeaven :**
```vue
<a href="#menu">Notre Menu</a>
<a href="#promotions">Promotions</a>
<a href="#localisation">Nous trouver</a>
```

---

### Fichier : `components/Hero.vue`

#### Lignes ~5-20 : Contenu par défaut

Si vous n'utilisez pas de props, modifiez les valeurs par défaut :

```vue
<script setup>
defineProps({
  title: {
    type: String,
    default: 'VOTRE TITRE PAR DÉFAUT'
  },
  subtitle: {
    type: String,
    default: 'Votre sous-titre par défaut'
  },
  backgroundImage: {
    type: String,
    default: '/hero-bg.jpg'  // Votre image de fond
  }
})
</script>
```

**Image de fond** : Placez votre image dans `/public/hero-bg.jpg`

---

### Fichier : `components/CartSidebar.vue`

#### Ligne ~120 : Frais de livraison

```vue
const delivery = computed(() => {
  return 2.50  // MODIFIER ICI : vos frais de livraison
})
```

**OU gratuit au-dessus d'un montant :**

```vue
const delivery = computed(() => {
  return subtotal.value >= 30 ? 0 : 3.50  // Gratuit si > 30€, sinon 3.50€
})
```

**Exemple BurgerHeaven :**
```vue
const delivery = computed(() => 2.50)  // Toujours 2.50€
```

---

#### Lignes ~200-250 : Textes du formulaire

Personnaliser les labels et placeholders :

```vue
<input
  v-model="customerName"
  placeholder="Votre nom complet"  // PERSONNALISER
  class="..."
/>

<input
  v-model="customerEmail"
  placeholder="votre.email@exemple.com"  // PERSONNALISER
  class="..."
/>
```

---

### Fichier : `components/CookieBanner.vue`

#### Ligne ~60 : Liens légaux

```vue
<a href="/mentions-legales#cookies" class="underline">
  notre politique de cookies
</a>
```

Vérifiez que ces liens pointent vers vos pages légales.

---

## 👨‍💼 ÉTAPE 6 : Page Admin

### Fichier : `pages/admin.vue`

#### Ligne ~50 : Mot de passe admin

**IMPORTANT - CHANGER ABSOLUMENT :**

```vue
const handleLogin = (password: string) => {
  if (password === 'VOTRE_MOT_DE_PASSE_SÉCURISÉ') {  // LIGNE ~50
    isAuthenticated.value = true
    localStorage.setItem('admin_auth', 'true')
  } else {
    alert('Mot de passe incorrect')
  }
}
```

**Exemple BurgerHeaven :**
```vue
if (password === 'admin123') {  // À CHANGER EN PRODUCTION !
```

⚠️ **Sécurité** : En production, utilisez un vrai système d'authentification !

---

#### Lignes ~100-150 : Statuts de commande

Si vous voulez d'autres statuts :

```vue
const statusColors = {
  'en_attente': 'bg-yellow-100 text-yellow-800',
  'en_preparation': 'bg-blue-100 text-blue-800',
  'prete': 'bg-green-100 text-green-800',
  'recuperee': 'bg-gray-100 text-gray-800',
  // Ajoutez vos statuts personnalisés ici
  'annulee': 'bg-red-100 text-red-800',
}
```

---

## 📜 ÉTAPE 7 : Mentions légales

### Fichier : `pages/mentions-legales.vue`

**REMPLACER TOUTES LES INFORMATIONS :**

#### Lignes ~10-30 : Éditeur du site

```vue
<h2>Éditeur du site</h2>
<p><strong>Raison sociale :</strong> VOTRE_RAISON_SOCIALE</p>
<p><strong>Adresse :</strong> VOTRE_ADRESSE_COMPLÈTE</p>
<p><strong>SIRET :</strong> VOTRE_NUMERO_SIRET</p>
<p><strong>Email :</strong> VOTRE_EMAIL</p>
<p><strong>Téléphone :</strong> VOTRE_TELEPHONE</p>
```

**Exemple BurgerHeaven :**
```vue
<p><strong>Raison sociale :</strong> BurgerHeaven SARL</p>
<p><strong>Adresse :</strong> 42 Avenue des Champs-Élysées, 75008 Paris</p>
<p><strong>SIRET :</strong> 123 456 789 00012</p>
<p><strong>Email :</strong> contact@burgerheaven.fr</p>
```

---

#### Lignes ~35-50 : Hébergeur

```vue
<h2>Hébergeur</h2>
<p><strong>Nom :</strong> NOM_HÉBERGEUR</p>
<p><strong>Adresse :</strong> ADRESSE_HÉBERGEUR</p>
```

**Exemples :**
- Vercel : Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789
- Netlify : Netlify Inc., 2325 3rd Street, Suite 296, San Francisco, CA 94107
- OVH : OVH SAS, 2 rue Kellermann, 59100 Roubaix, France

---

#### Lignes ~80-100 : Conservation des données

```vue
<p>
  Les données sont conservées pendant <strong>VOTRE_DURÉE</strong>
  à compter de la commande.
</p>
```

**Exemple BurgerHeaven :**
```vue
<p>Les données sont conservées pendant <strong>13 mois</strong>...</p>
```

---

## 🎨 ÉTAPE 8 : Assets visuels

### Fichiers à créer/remplacer dans `/public`

| Fichier | Dimensions | Description |
|---------|-----------|-------------|
| **favicon.ico** | 32x32px | Icône du site |
| **logo.png** | 200x60px (environ) | Logo du restaurant |
| **hero-bg.jpg** | 1920x1080px | Image de fond hero |
| **og-image.jpg** | 1200x630px | Image réseaux sociaux |

**Où les placer :**
```
public/
├── favicon.ico
├── logo.png
├── hero-bg.jpg
└── og-image.jpg
```

**Référencer dans le code :**
- Header : `/logo.png`
- Hero : `/hero-bg.jpg`
- Meta OG : `/og-image.jpg`

---

## 🗄️ ÉTAPE 9 : Configuration Strapi

### Collections à créer dans Strapi

#### 1. Collection "Produit"

```
Champs :
├── nom (Text, required)
├── description (Rich Text)
├── prix (Decimal, required)
├── prixPromo (Decimal, nullable)
├── enPromotion (Boolean, default: false)
├── image (Media - Single, required)
└── categorie (Relation → Categorie)
```

#### 2. Collection "Categorie"

```
Champs :
├── nom (Text, required)
├── slug (UID, from: nom)
└── ordre (Number, default: 0)
```

**Exemple de catégories BurgerHeaven :**
- Burgers classiques
- Burgers signature
- Accompagnements
- Desserts
- Boissons

#### 3. Collection "Commande"

```
Champs :
├── code_retrait (Text, unique, required)
├── nom_client (Text, required)
├── email_client (Email, required)
├── telephone_client (Text)
├── total (Decimal, required)
├── statut (Enumeration: en_attente, en_preparation, prete, recuperee)
├── mode_paiement (Enumeration: especes, stripe)
├── paiement_valide (Boolean, default: false)
├── creneau_retrait (Relation → CreneauRetrait)
└── ligne_de_commandes (Relation → LigneDeCommande, has many)
```

#### 4. Collection "LigneDeCommande"

```
Champs :
├── quantite (Number, required)
├── prix_unitaire (Decimal, required)
├── produit (Relation → Produit)
└── commande (Relation → Commande)
```

#### 5. Collection "CreneauRetrait"

```
Champs :
├── heure_debut (Time, required)
├── heure_fin (Time, required)
├── max_commande (Number, default: 10)
└── actif (Boolean, default: true)
```

**Exemple créneaux BurgerHeaven :**
- 12:00 - 13:00 (max: 15 commandes)
- 13:00 - 14:00 (max: 15 commandes)
- 19:00 - 20:00 (max: 20 commandes)
- 20:00 - 21:00 (max: 20 commandes)

---

### Permissions Strapi

**Public (non authentifié) :**
- ✅ Produit : `find`, `findOne`
- ✅ Categorie : `find`, `findOne`
- ✅ CreneauRetrait : `find`, `findOne`
- ✅ Commande : `create`, `findOne`
- ✅ LigneDeCommande : `create`

**Authenticated (avec token) :**
- ✅ Commande : `find`, `update`
- ✅ Tous les autres : accès complet

---

## 💳 ÉTAPE 10 : Configuration Stripe

### 1. Créer un compte Stripe

1. Aller sur [dashboard.stripe.com](https://dashboard.stripe.com)
2. Créer un compte
3. Activer le mode Test

### 2. Récupérer les clés

**Mode Test :**
- Developers → API Keys
- Copier **Publishable key** (pk_test_...) → `NUXT_PUBLIC_STRIPE_KEY`
- Copier **Secret key** (sk_test_...) → `NUXT_STRIPE_SECRET_KEY`

### 3. Tester les paiements

Cartes de test Stripe :
- **Succès** : 4242 4242 4242 4242
- **Échec** : 4000 0000 0000 0002
- **3D Secure** : 4000 0025 0000 3155

### 4. Passer en production (plus tard)

1. Compléter la vérification d'identité Stripe
2. Activer le compte en mode Live
3. Remplacer les clés test par les clés live dans `.env`

---

## 🚀 ÉTAPE 11 : Lancement

### 1. Installation

```bash
cd template/
npm install
```

### 2. Configuration

```bash
cp .env.example .env
# Remplir le fichier .env avec vos valeurs
```

### 3. Développement

```bash
npm run dev
```

Le site sera accessible sur `http://localhost:3000`

### 4. Vérifications

- [ ] Page d'accueil s'affiche correctement
- [ ] Les produits Strapi apparaissent dans le menu
- [ ] Le panier fonctionne
- [ ] Le formulaire de commande fonctionne
- [ ] La page admin est accessible avec le bon mot de passe
- [ ] Le paiement Stripe fonctionne (mode test)

---

## 📋 Récapitulatif final

### ✅ Configuration technique

- [x] `.env` rempli avec tokens Strapi et Stripe
- [x] Collections Strapi créées et remplies
- [x] Permissions Strapi configurées
- [x] Compte Stripe créé et configuré

### ✅ Personnalisation contenu

- [x] Nom du restaurant partout
- [x] Logo et favicon
- [x] Couleurs du thème
- [x] Textes de la page d'accueil
- [x] Adresse et horaires
- [x] Avis clients
- [x] Mentions légales
- [x] Mot de passe admin changé

### ✅ Assets visuels

- [x] Images dans `/public`
- [x] Photos des produits dans Strapi

---

## 🎯 Temps estimé

- Configuration Strapi : **1-2 heures**
- Personnalisation textes/images : **2-3 heures**
- Tests et ajustements : **1-2 heures**

**Total : ~6 heures** pour un site complet et fonctionnel ! 🎉

---

## 💡 Besoin d'aide ?

Consultez les autres guides :
- `README.md` - Vue d'ensemble
- `CUSTOMIZE.md` - Guide de personnalisation
- `FILES.md` - Liste des fichiers

Bon courage ! 🚀
