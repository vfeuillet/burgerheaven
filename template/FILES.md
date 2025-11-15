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

Tous sont **génériques et réutilisables**.

| Composant | Description | Personnalisation |
|-----------|-------------|------------------|
| **Header.vue** | Navigation principale responsive | ✅ Logo, liens menu, couleurs |
| **Hero.vue** | Bannière hero avec CTA | ✅ Titre, image de fond, boutons |
| **CartSidebar.vue** | Panier coulissant latéral | ✅ Frais de livraison, design |
| **CookieBanner.vue** | Gestion cookies RGPD | ✅ Catégories, liens légaux |
| **AdminLogin.vue** | Page de connexion admin | ✅ Mot de passe, design |

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

Routes de l'application.

| Page | Route | Description | Statut |
|------|-------|-------------|--------|
| **index.vue** | `/` | Page d'accueil exemple | ✅ Fournie (exemple) |
| **admin.vue** | `/admin` | Dashboard admin | ❌ À créer |
| **mentions-legales.vue** | `/mentions-legales` | Mentions légales | ❌ À créer |
| **commande/[code].vue** | `/commande/:code` | Suivi commande | ❌ À créer |

> **Note** : Seule la page `index.vue` est fournie comme exemple. Les autres pages sont à créer selon vos besoins (consultez CUSTOMIZE.md).

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

- 5 composants UI génériques
- 2 composables de logique métier
- 4 endpoints API serveur
- 1 page d'exemple
- 2 fichiers CSS (Tailwind + custom)
- Configuration complète (Nuxt, Tailwind, PostCSS, TypeScript)
- Documentation complète (README, CUSTOMIZE, CHANGELOG, FILES)

### ❌ À créer par vous

- Pages spécifiques à votre restaurant (admin, mentions légales, etc.)
- Composants métier (MenuSection, ProductGrid, etc.)
- Images et assets visuels (logo, photos produits, etc.)
- Configuration Strapi (collections, permissions)
- Comptes Stripe et webhooks

### ⚠️ À personnaliser

- Meta tags SEO dans `nuxt.config.ts`
- Couleurs et thème dans `tailwind.config.ts`
- Logo et liens dans `Header.vue`
- Textes et images dans tous les composants
- Variables d'environnement `.env`

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
