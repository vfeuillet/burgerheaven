<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header avec navigation -->
    <Header />

    <!-- Bannière Hero -->
    <Hero
      title="Bienvenue dans votre restaurant"
      subtitle="Commandez vos plats préférés en ligne"
    />

    <!-- Section exemple de contenu -->
    <section class="py-16 px-4 max-w-7xl mx-auto">
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-gray-800 mb-4">
          Template prêt à l'emploi
        </h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Personnalisez cette page selon vos besoins. Consultez le fichier
          <code class="bg-gray-200 px-2 py-1 rounded">CUSTOMIZE.md</code>
          pour le guide complet de personnalisation.
        </p>
      </div>

      <!-- Grille de fonctionnalités -->
      <div class="grid md:grid-cols-3 gap-8 mt-12">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="text-4xl mb-4">🛒</div>
          <h3 class="text-xl font-bold mb-2">Panier intelligent</h3>
          <p class="text-gray-600">
            Gestion complète du panier avec localStorage et calcul automatique.
          </p>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="text-4xl mb-4">💳</div>
          <h3 class="text-xl font-bold mb-2">Paiement Stripe</h3>
          <p class="text-gray-600">
            Intégration Stripe sécurisée pour les paiements en ligne.
          </p>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="text-4xl mb-4">📱</div>
          <h3 class="text-xl font-bold mb-2">Responsive design</h3>
          <p class="text-gray-600">
            Design mobile-first optimisé pour tous les écrans.
          </p>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="text-4xl mb-4">🍪</div>
          <h3 class="text-xl font-bold mb-2">Gestion cookies RGPD</h3>
          <p class="text-gray-600">
            Bannière de consentement conforme aux réglementations.
          </p>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="text-4xl mb-4">🔐</div>
          <h3 class="text-xl font-bold mb-2">Interface admin</h3>
          <p class="text-gray-600">
            Dashboard protégé pour gérer vos commandes.
          </p>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="text-4xl mb-4">🎨</div>
          <h3 class="text-xl font-bold mb-2">Personnalisable</h3>
          <p class="text-gray-600">
            Tailwind CSS pour personnaliser facilement le design.
          </p>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="mt-16 bg-blue-600 text-white rounded-lg p-8 text-center">
        <h3 class="text-3xl font-bold mb-4">Prêt à commencer ?</h3>
        <p class="text-lg mb-6">
          Consultez le README.md pour installer et configurer votre projet.
        </p>
        <div class="flex gap-4 justify-center flex-wrap">
          <a
            href="#"
            class="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Voir la documentation
          </a>
          <a
            href="/admin"
            class="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
          >
            Accès admin
          </a>
        </div>
      </div>
    </section>

    <!-- Footer exemple -->
    <footer class="bg-gray-800 text-white py-8 mt-16">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <p class="text-gray-400">
          Template Restaurant E-Commerce - Nuxt 4 + Vue 3 + Strapi + Stripe
        </p>
        <p class="text-gray-500 text-sm mt-2">
          Personnalisez ce footer selon vos besoins
        </p>
      </div>
    </footer>

    <!-- Composants globaux -->
    <CartSidebar />
    <CookieBanner />
  </div>
</template>

<script setup>
// Meta tags SEO pour cette page
useHead({
  title: 'Restaurant Template - Accueil',
  meta: [
    {
      name: 'description',
      content: 'Template moderne pour site de restaurant avec commande en ligne'
    }
  ]
})
</script>
