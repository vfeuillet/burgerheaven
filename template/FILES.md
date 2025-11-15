# 📂 Liste complète des fichiers du template

Ce document liste tous les fichiers inclus dans le template avec leur rôle.

## 📄 Fichiers racine

| Fichier | Rôle | Modifiable |
|---------|------|------------|
| **README.md** | Documentation principale du template | ❌ Lecture seule |
| **CUSTOMIZE.md** | Guide de personnalisation pas à pas | ❌ Lecture seule |
| **CHANGELOG.md** | Historique des versions | ❌ Lecture seule |
| **FILES.md** | Ce fichier - Liste des fichiers | ❌ Lecture seule |
| **package.json** | Dépendances npm du projet | ✅ Personnaliser nom/version |
| **nuxt.config.ts** | Configuration Nuxt | ✅ Personnaliser SEO/meta |
| **tailwind.config.ts** | Configuration Tailwind CSS | ✅ Ajouter couleurs/thème |
| **postcss.config.cjs** | Configuration PostCSS | ❌ Ne pas modifier |
| **tsconfig.json** | Configuration TypeScript | ❌ Ne pas modifier |
| **app.vue** | Layout principal de l'application | ⚠️ Modifier avec précaution |
| **error.vue** | Page d'erreur globale | ✅ Personnaliser design |
| **.gitignore** | Fichiers ignorés par Git | ✅ Ajouter si besoin |
| **.env.example** | Exemple variables d'environnement | ✅ Compléter avec vos valeurs |

---

## 🧩 Composants (`/components`)

**10 composants complets** pour un site de restaurant fonctionnel.

### Composants UI génériques

| Composant | Description | Personnalisation |
|-----------|-------------|------------------|
| **Header.vue** | Navigation principale responsive | ✅ Logo, liens menu, couleurs |
| **Hero.vue** | Bannière hero avec CTA | ✅ Titre, image de fond, boutons |
| **CartSidebar.vue** | Panier coulissant latéral | ✅ Frais de livraison, design |
| **CookieBanner.vue** | Gestion cookies RGPD | ✅ Catégories, liens légaux |
| **AdminLogin.vue** | Page de connexion admin | ✅ Mot de passe, design |

### Composants métier restaurant

| Composant | Description | Personnalisation |
|-----------|-------------|------------------|
| **MenuSection.vue** | Menu produits avec filtres catégories | ✅ Requêtes GraphQL, design |
| **PromotionsSection.vue** | Section promotions avec badges | ✅ Requêtes GraphQL, design |
| **CreneauSelector.vue** | Sélecteur créneaux de retrait | ✅ Logique horaires |
| **CommandeCard.vue** | Carte commande pour admin | ✅ Statuts, design |
| **commandeSection.vue** | Formulaire de commande | ✅ Champs, validation |

### Comment utiliser les composants

```vue
<template>
  <div>
    <Header />
    <Hero title="Titre" subtitle="Sous-titre" />
    <CartSidebar />
    <CookieBanner />
  </div>
</template>
```

---

## 🔧 Composables (`/composables`)

Logique métier réutilisable.

| Composable | Description | Utilisation |
|------------|-------------|-------------|
| **useCart.ts** | Gestion complète du panier | `const cart = useCart()` |
| **useGql.ts** | Wrapper GraphQL Strapi | `const gql = useGql()` |

### Exemple useCart
```typescript
const cart = useCart()

cart.add({ id: '1', nom: 'Produit', prix: 10, image: '...', quantite: 1 })
cart.inc('1')
cart.dec('1')
cart.remove('1')
cart.clear()

console.log(cart.items)
console.log(cart.total)
```

### Exemple useGql
```typescript
const gql = useGql()

const { data } = await gql({
  query: `query { produits { nom prix } }`,
  variables: {}
})
```

---

## 📄 Pages (`/pages`)

**4 pages complètes et fonctionnelles** incluses dans le template.

| Page | Route | Description | Contenu |
|------|-------|-------------|---------|
| **index.vue** | `/` | Page d'accueil complète | ✅ Hero, Promotions, Menu, Avis clients, Infos pratiques |
| **admin.vue** | `/admin` | Dashboard admin complet | ✅ Gestion commandes, filtres, recherche, validation paiements |
| **mentions-legales.vue** | `/mentions-legales` | Mentions légales RGPD | ✅ Cookies, conservation données, droits utilisateurs |
| **commande/[code].vue** | `/commande/:code` | Suivi commande client | ✅ Détails commande, statut, ligne de commandes |

> ✨ **Toutes les pages sont fournies !** Il vous suffit de personnaliser les textes et de configurer Strapi.

---

## 🌐 API Serveur (`/server/api`)

Endpoints backend Nuxt.

| Endpoint | Méthode | Description | Modification |
|----------|---------|-------------|--------------|
| **gql.post.ts** | POST | Proxy GraphQL vers Strapi | ❌ Ne pas modifier |
| **create-checkout-session.post.ts** | POST | Créer session Stripe | ⚠️ Modifier redirect URLs |
| **config.get.ts** | GET | Config runtime publique | ❌ Ne pas modifier |
| **ping.get.ts** | GET | Health check serveur | ❌ Ne pas modifier |

### Routes d'API

```
POST   /api/gql
POST   /api/create-checkout-session
GET    /api/config
GET    /api/ping
```

---

## 🎨 Assets (`/assets`)

Fichiers CSS et ressources.

| Fichier | Description | Modification |
|---------|-------------|--------------|
| **css/tailwind.css** | Directives Tailwind | ❌ Ne pas modifier |
| **css/main.css** | Styles personnalisés et animations | ✅ Ajouter vos styles |

### Classes CSS disponibles (main.css)

- `.fade-in` : Animation apparition
- `.slide-up` : Animation glissement
- Styles menu mobile responsive
- Transitions panier et modals

---

## 📁 Public (`/public`)

Fichiers statiques accessibles publiquement.

| Fichier | Description | À remplacer |
|---------|-------------|-------------|
| **robots.txt** | Configuration robots crawl | ✅ Personnaliser |
| **favicon.ico** | Icône du site | ✅ Remplacer par votre favicon |
| **og-image.jpg** | Image Open Graph (réseaux sociaux) | ✅ Créer (1200x630px) |

> **Note** : Ajoutez vos images, logos et autres assets statiques ici.

---

## 📊 Récapitulatif

### ✅ Fichiers fournis et prêts à l'emploi

- **10 composants Vue** (5 UI génériques + 5 métier restaurant)
- **2 composables** de logique métier (panier, GraphQL)
- **4 endpoints API** serveur (GraphQL, Stripe, config, ping)
- **4 pages complètes** (accueil, admin, suivi commande, mentions légales)
- **2 fichiers CSS** (Tailwind + animations custom)
- **Configuration complète** (Nuxt 4, Tailwind, PostCSS, TypeScript)
- **Documentation exhaustive** (README, CUSTOMIZE, CHANGELOG, FILES)
- **Script d'installation** automatique (setup.sh)

### ⚠️ À configurer (pas de code à écrire)

- **Strapi CMS** : Créer les collections (Produit, Commande, etc.) et générer le token API
- **Stripe** : Créer compte et copier les clés API
- **Variables d'environnement** : Remplir le fichier `.env`

### 🎨 À personnaliser (contenu uniquement)

- **Branding** : Logo, nom restaurant, couleurs
- **Textes** : Titres, descriptions, slogans
- **Images** : Photos produits, hero, favicon
- **Meta tags SEO** : Title, description, Open Graph
- **Mot de passe admin** : Changer le mot de passe par défaut

> 🎉 **Aucun code à écrire !** Le template est 100% fonctionnel. Configurez Strapi et personnalisez le contenu.

---

## 🎯 Où commencer ?

1. **Installer** → Suivez le README.md section "Installation"
2. **Configurer** → Remplissez le fichier `.env`
3. **Personnaliser** → Suivez le CUSTOMIZE.md
4. **Développer** → Créez vos pages spécifiques
5. **Déployer** → Build et mise en production

---

## 📚 Liens vers la documentation

| Document | Usage |
|----------|-------|
| [README.md](./README.md) | Vue d'ensemble et installation |
| [CUSTOMIZE.md](./CUSTOMIZE.md) | Guide de personnalisation |
| [CHANGELOG.md](./CHANGELOG.md) | Historique des versions |
| [FILES.md](./FILES.md) | Ce document |

---

**Dernière mise à jour** : 15 novembre 2025
