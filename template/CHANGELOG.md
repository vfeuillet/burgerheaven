# Changelog

Toutes les modifications notables de ce template seront documentées dans ce fichier.

## [1.0.0] - 2025-11-15

### ✨ Version initiale

#### Composants génériques
- **Header.vue** : Navigation responsive avec menu mobile
- **Hero.vue** : Bannière hero personnalisable
- **CartSidebar.vue** : Panier d'achat complet
- **CookieBanner.vue** : Gestion cookies RGPD
- **AdminLogin.vue** : Authentification admin simple

#### Composables
- **useCart.ts** : Gestion complète du panier avec localStorage
- **useGql.ts** : Wrapper GraphQL pour Strapi

#### API Serveur
- **gql.post.ts** : Proxy GraphQL sécurisé
- **create-checkout-session.post.ts** : Intégration Stripe
- **config.get.ts** : Configuration runtime
- **ping.get.ts** : Health check

#### Configuration
- Configuration Nuxt 4 optimisée
- Tailwind CSS 4 avec PostCSS
- TypeScript prêt à l'emploi
- SEO et meta tags configurés

#### Documentation
- README.md complet avec exemples
- CUSTOMIZE.md pour la personnalisation
- .env.example pour la configuration
- Page d'exemple index.vue

#### Features
- ✅ Design responsive mobile-first
- ✅ Panier avec persistence localStorage
- ✅ Paiement Stripe + paiement sur place
- ✅ Gestion cookies conforme RGPD
- ✅ Interface admin protégée
- ✅ Optimisations performance (Nitro)
- ✅ Accessibilité (ARIA labels)

---

## Prochaines versions prévues

### [1.1.0] - À venir
- [ ] Système de recherche de produits
- [ ] Filtres avancés par catégorie
- [ ] Mode sombre (dark mode)
- [ ] Multilingue (i18n)

### [1.2.0] - À venir
- [ ] Système de réservation de table
- [ ] Programme de fidélité
- [ ] Avis clients et notation
- [ ] Intégration Google Maps

### [2.0.0] - À venir
- [ ] Migration vers Nuxt 5 (quand disponible)
- [ ] Support de multiples restaurants
- [ ] Tableau de bord analytics
- [ ] Application mobile (Ionic/Capacitor)

---

## Comment contribuer

Si vous avez des suggestions ou corrections :
1. Fork le projet
2. Créez une branche (`git checkout -b feature/amelioration`)
3. Commit vos changements (`git commit -m 'Ajout de...'`)
4. Push vers la branche (`git push origin feature/amelioration`)
5. Ouvrez une Pull Request

---

## Support

Pour signaler un bug ou demander une fonctionnalité, ouvrez une issue sur le repository.
