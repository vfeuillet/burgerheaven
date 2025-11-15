# 🍽️ Template Restaurant E-Commerce

Template moderne et complet pour site de restaurant avec commande en ligne, développé avec **Nuxt 4** + **Vue 3** + **Strapi CMS** + **Stripe**.

## 🎯 Caractéristiques principales

### ✅ Fonctionnalités incluses

- **Navigation responsive** avec menu mobile hamburger
- **Bannière Hero** personnalisable avec CTA
- **Panier d'achat** avec gestion localStorage
- **Paiement en ligne** via Stripe + paiement sur place
- **Gestion des cookies** conforme RGPD
- **Interface admin** protégée par mot de passe
- **API serveur** sécurisée avec proxy GraphQL
- **Design mobile-first** avec Tailwind CSS
- **Accessibilité** (ARIA labels, contraste)
- **SEO optimisé** (meta tags, Open Graph, Twitter Cards)

### 🛠️ Stack technique

| Technologie | Version | Usage |
|------------|---------|-------|
| **Nuxt** | 4.0.1 | Framework SSR/SSG |
| **Vue** | 3.5.17 | Framework UI |
| **TypeScript** | ✓ | Typage statique |
| **Tailwind CSS** | 4.1.12 | Styling utilitaire |
| **Strapi** | - | CMS Headless (GraphQL) |
| **Stripe** | 19.1.0 | Paiements en ligne |

---

## 📁 Structure du projet

```
restaurant-template/
├── components/          # Composants Vue réutilisables
│   ├── Header.vue       # Navigation principale
│   ├── Hero.vue         # Bannière hero
│   ├── CartSidebar.vue  # Panier d'achat
│   ├── CookieBanner.vue # Gestion cookies RGPD
│   └── AdminLogin.vue   # Page de connexion admin
│
├── composables/         # Logique réutilisable
│   ├── useCart.ts       # Gestion état panier
│   └── useGql.ts        # Wrapper GraphQL
│
├── pages/               # Routes (à créer selon vos besoins)
│   └── (vos pages ici)
│
├── server/api/          # Endpoints API serveur
│   ├── gql.post.ts                      # Proxy GraphQL Strapi
│   ├── create-checkout-session.post.ts  # Sessions Stripe
│   ├── config.get.ts                    # Configuration runtime
│   └── ping.get.ts                      # Health check
│
├── assets/css/          # Styles globaux
│   ├── main.css         # Animations et responsive
│   └── tailwind.css     # Directives Tailwind
│
├── public/              # Assets statiques
│
├── .env.example         # Variables d'environnement
├── nuxt.config.ts       # Configuration Nuxt
├── tailwind.config.ts   # Configuration Tailwind
└── package.json         # Dépendances
```

---

## 🚀 Installation

### 1. Prérequis

- **Node.js** v18+ et npm
- **Strapi CMS** configuré (local ou distant)
- **Compte Stripe** (mode test ou production)

### 2. Cloner et installer

```bash
# Cloner le template
git clone <votre-repo> mon-restaurant
cd mon-restaurant

# Installer les dépendances
npm install
```

### 3. Configuration environnement

Copier `.env.example` vers `.env` et remplir les valeurs :

```bash
cp .env.example .env
```

**Variables requises :**

```env
# Strapi CMS
NUXT_STRAPI_TOKEN=votre_token_api_strapi
NUXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:1337/graphql
NUXT_PUBLIC_STRAPI_URL=http://localhost:1337

# Stripe
NUXT_STRIPE_SECRET_KEY=sk_test_votre_cle_secrete
NUXT_PUBLIC_STRIPE_KEY=pk_test_votre_cle_publique
```

### 4. Lancer le projet

```bash
# Mode développement
npm run dev

# Build production
npm run build

# Prévisualiser production
npm run preview
```

Le site sera accessible sur `http://localhost:3000`

---

## 🧩 Composants génériques

### 1. **Header.vue** - Navigation
Navigation principale responsive avec :
- Logo cliquable (retour accueil)
- Menu de navigation
- Icône panier avec badge quantité
- Menu mobile hamburger

**Props à personnaliser :**
```vue
<Header />
```

### 2. **Hero.vue** - Bannière principale
Bannière hero avec image de fond, titre, description et boutons CTA.

**Props :**
```vue
<Hero
  title="Votre titre ici"
  subtitle="Votre sous-titre"
  backgroundImage="/votre-image.jpg"
/>
```

### 3. **CartSidebar.vue** - Panier d'achat
Panier coulissant avec :
- Liste des articles (image, nom, prix, quantité)
- Boutons +/- pour ajuster quantités
- Calcul automatique (sous-total + livraison + total)
- Formulaire de checkout (nom, email, mode paiement)
- Intégration Stripe Checkout

**Utilisation :**
```vue
<CartSidebar />
```

### 4. **CookieBanner.vue** - Gestion cookies
Bannière cookies conforme RGPD avec :
- Consentement initial
- Modal de préférences détaillées
- Catégories : nécessaires, analytiques, marketing
- Persistance dans localStorage

**Utilisation :**
```vue
<CookieBanner />
```

### 5. **AdminLogin.vue** - Authentification admin
Page de connexion simple par mot de passe.

**Utilisation :**
```vue
<AdminLogin @login="handleLogin" />
```

---

## 🔧 Composables

### `useCart()`
Gestion complète du panier d'achat.

**Méthodes :**
```typescript
const cart = useCart()

cart.add(item)           // Ajouter un article
cart.inc(itemId)         // Incrémenter quantité
cart.dec(itemId)         // Décrémenter quantité
cart.remove(itemId)      // Retirer un article
cart.clear()             // Vider le panier

// Propriétés réactives
cart.items               // Liste des articles
cart.totalItems          // Nombre total d'articles
cart.subtotal            // Sous-total
cart.delivery            // Frais de livraison (€2.50)
cart.total               // Total TTC
```

**Structure d'un article :**
```typescript
{
  id: string
  nom: string
  prix: number
  image: string
  quantite: number
}
```

### `useGql()`
Wrapper pour requêtes GraphQL vers Strapi.

**Utilisation :**
```typescript
const gql = useGql()

const { data } = await gql({
  query: `
    query {
      produits {
        id
        nom
        prix
      }
    }
  `,
  variables: {}
})
```

---

## 🌐 API Serveur

### `POST /api/gql`
Proxy GraphQL vers Strapi avec token d'authentification.

**Requête :**
```json
{
  "query": "query { produits { id nom } }",
  "variables": {}
}
```

### `POST /api/create-checkout-session`
Créer une session de paiement Stripe.

**Requête :**
```json
{
  "items": [
    { "nom": "Burger", "prix": 12.50, "quantite": 2 }
  ],
  "email": "client@example.com",
  "orderCode": "CMD123456"
}
```

**Réponse :**
```json
{
  "url": "https://checkout.stripe.com/..."
}
```

### `GET /api/config`
Récupérer la configuration runtime.

### `GET /api/ping`
Health check serveur (retourne `"pong"`).

---

## 🎨 Personnalisation

### 1. Modifier les couleurs (Tailwind)

Éditer `tailwind.config.ts` :

```typescript
export default {
  theme: {
    extend: {
      colors: {
        primary: '#FF6B35',    // Votre couleur principale
        secondary: '#004E89'   // Votre couleur secondaire
      }
    }
  }
}
```

### 2. Modifier le SEO

Éditer `nuxt.config.ts` dans la section `app.head` :

```typescript
app: {
  head: {
    title: 'Mon Restaurant - Slogan',
    meta: [
      {
        name: 'description',
        content: 'Votre description SEO'
      },
      // ...autres meta tags
    ]
  }
}
```

### 3. Personnaliser les animations

Les animations sont dans `assets/css/main.css` :
- `.fade-in` : Apparition en fondu
- `.slide-up` : Glissement vers le haut
- Animations du menu mobile
- Transitions du panier

---

## 📊 Intégration Strapi

### Modèles de contenu recommandés

#### Collection "Produit"
```
- nom (Text)
- description (Rich Text)
- prix (Decimal)
- prixPromo (Decimal, nullable)
- enPromotion (Boolean)
- image (Media)
- categorie (Relation)
```

#### Collection "Categorie"
```
- nom (Text)
- slug (UID)
- ordre (Number)
```

#### Collection "Commande"
```
- code_retrait (Text, unique)
- nom_client (Text)
- email_client (Email)
- total (Decimal)
- statut (Enumeration: en_attente, en_preparation, prete, recuperee)
- mode_paiement (Enumeration: especes, stripe)
- paiement_valide (Boolean)
- ligne_de_commandes (Relation)
```

### Requêtes GraphQL exemples

**Récupérer les produits :**
```graphql
query {
  produits {
    id
    documentId
    nom
    description
    prix
    prixPromo
    enPromotion
    image {
      url
    }
    categorie {
      nom
    }
  }
}
```

---

## 💳 Intégration Stripe

### Configuration côté serveur
Le fichier `server/api/create-checkout-session.post.ts` gère :
- Création de la session Stripe
- Calcul automatique du montant
- Redirection après paiement

### Flux de paiement
1. Client remplit le formulaire dans `CartSidebar`
2. Sélection du mode de paiement (espèces ou Stripe)
3. Si Stripe → Appel API `/api/create-checkout-session`
4. Redirection vers Stripe Checkout
5. Retour sur le site après paiement

### Webhooks (à implémenter)
Pour valider automatiquement les paiements, configurer un webhook Stripe :
```
POST /api/webhooks/stripe
```

---

## 🔒 Sécurité

### Variables d'environnement
- ✅ Token Strapi côté serveur uniquement
- ✅ Clé secrète Stripe jamais exposée au client
- ✅ Validation des données côté serveur

### Recommandations
- Changer le mot de passe admin par défaut
- Utiliser HTTPS en production
- Configurer CORS sur Strapi
- Valider les webhooks Stripe avec signature

---

## 📱 Responsive Design

Le template est **mobile-first** avec breakpoints :

- **Mobile** : < 768px
- **Tablet** : 768px - 1024px
- **Desktop** : > 1024px

Tous les composants sont testés et optimisés pour chaque taille d'écran.

---

## 🌍 SEO & Performance

### Optimisations incluses
- ✅ Meta tags (title, description)
- ✅ Open Graph (Facebook, LinkedIn)
- ✅ Twitter Cards
- ✅ Compression assets (Nitro)
- ✅ Lazy loading images
- ✅ Preconnect fonts
- ✅ Sitemap auto-généré

### Lighthouse (objectifs)
- Performance : 90+
- Accessibilité : 95+
- SEO : 100
- Best Practices : 95+

---

## 🧪 Tests

### Tester le panier
```typescript
// Dans la console navigateur
const cart = useCart()
cart.add({ id: '1', nom: 'Test', prix: 10, image: '', quantite: 1 })
console.log(cart.items)
```

### Tester l'API GraphQL
```bash
curl -X POST http://localhost:3000/api/gql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ produits { nom } }"}'
```

### Tester Stripe (mode test)
Utiliser les cartes de test Stripe :
- **Succès** : 4242 4242 4242 4242
- **Échec** : 4000 0000 0000 0002

---

## 📝 TODO pour production

- [ ] Changer le mot de passe admin
- [ ] Configurer les variables d'env production
- [ ] Activer les clés Stripe production
- [ ] Configurer le domaine dans Strapi
- [ ] Configurer les webhooks Stripe
- [ ] Ajouter Google Analytics (si cookies acceptés)
- [ ] Tester le formulaire de contact
- [ ] Vérifier les mentions légales
- [ ] Optimiser les images (WebP)
- [ ] Configurer le sitemap.xml

---

## 🤝 Support & Contribution

Pour toute question ou amélioration, n'hésitez pas à ouvrir une issue ou une pull request.

### Licence
MIT - Libre d'utilisation pour vos projets personnels et commerciaux.

---

## 📚 Ressources

- [Documentation Nuxt 4](https://nuxt.com/docs)
- [Documentation Vue 3](https://vuejs.org/)
- [Documentation Strapi](https://docs.strapi.io/)
- [Documentation Stripe](https://stripe.com/docs)
- [Documentation Tailwind CSS](https://tailwindcss.com/)

---

**Développé avec ❤️ pour la communauté restaurant**
