<script setup lang="ts">
import CartSidebar from '~/components/CartSidebar.vue'

const isCartOpen = ref(false)
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <Header v-model:is-cart-open="isCartOpen" />

    <!-- Hero Section -->
    <Hero />

    <!-- Section Promotions -->
    <PromotionsSection />

    <!-- Menu Section -->
    <MenuSection />

  
    <!-- Section "Nous trouver" + Avis combinés -->
<section id="trouver" style="padding: 3rem 0 5rem 0; background-color: #f9fafb;">
  <div class="container mx-auto px-4">
    
    <!-- En-tête centré -->
    <div class="text-center mb-12">
      <h2 style="font-size: 3rem; font-weight: bold; color: #1f2937; margin-bottom: 0.75rem;">
        Nous <span style="color: #fbbf24;">trouver</span>
      </h2>
      <p style="font-size: 1.125rem; color: #6b7280; max-width: 48rem; margin: 0 auto;">
        Venez nous rendre visite dans notre établissement chaleureux.
      </p>
    </div>

    <!-- Layout 2 colonnes -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; max-width: 1400px; margin: 0 auto;">
      
      <!-- COLONNE GAUCHE : Carte + Horaires -->
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        
        <!-- Carte Google Maps -->
        <div style="background-color: white; border-radius: 1.5rem; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); height: 400px;">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9916256937586!2d2.292292615674!3d48.858370079287!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e2964e34e2d%3A0x8ddca9ee380ef7e0!2sTour%20Eiffel!5e0!3m2!1sfr!2sfr!4v1234567890"
            width="100%" 
            height="100%" 
            style="border:0;" 
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        <!-- Horaires d'ouverture -->
        <div style="background-color: white; border-radius: 1.5rem; padding: 2rem; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
          <h3 style="font-size: 1.75rem; font-weight: bold; color: #1f2937; margin-bottom: 1.5rem;">
            Horaires d'ouverture
          </h3>
          
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div style="display: flex; justify-content: space-between; padding-bottom: 1rem; border-bottom: 2px solid #f3f4f6;">
              <span style="font-weight: 600; color: #374151;">Lundi - Vendredi</span>
              <span style="font-weight: bold; color: #1f2937;">11h00 - 22h00</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding-bottom: 1rem; border-bottom: 2px solid #f3f4f6;">
              <span style="font-weight: 600; color: #374151;">Samedi</span>
              <span style="font-weight: bold; color: #1f2937;">11h00 - 23h00</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="font-weight: 600; color: #374151;">Dimanche</span>
              <span style="font-weight: bold; color: #1f2937;">11h00 - 21h00</span>
            </div>
          </div>
        </div>
      </div>

      <!-- COLONNE DROITE : Avis clients -->
      <div>
        <h3 style="font-size: 2rem; font-weight: bold; color: #1f2937; margin-bottom: 1.5rem; text-align: center;">
          Ce que nos clients disent
        </h3>

        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          
          <!-- Avis 1 -->
          <div style="background-color: white; border-radius: 1rem; padding: 1.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
              <div style="width: 3rem; height: 3rem; background: linear-gradient(135deg, #fbbf24, #f59e0b); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
                👨
              </div>
              <div>
                <h4 style="font-weight: bold; color: #1f2937; font-size: 1.125rem;">Jean Dupont</h4>
                <div style="color: #fbbf24; font-size: 1.125rem;">⭐⭐⭐⭐⭐</div>
              </div>
            </div>
            <p style="color: #6b7280; font-style: italic; line-height: 1.6;">
              "Les burgers sont exceptionnels ! Les ingrédients sont frais et le service est rapide. Je recommande vivement !"
            </p>
          </div>

          <!-- Avis 2 -->
          <div style="background-color: white; border-radius: 1rem; padding: 1.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
              <div style="width: 3rem; height: 3rem; background: linear-gradient(135deg, #fbbf24, #f59e0b); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
                👩
              </div>
              <div>
                <h4 style="font-weight: bold; color: #1f2937; font-size: 1.125rem;">Marie Lambert</h4>
                <div style="color: #fbbf24; font-size: 1.125rem;">⭐⭐⭐⭐⭐</div>
              </div>
            </div>
            <p style="color: #6b7280; font-style: italic; line-height: 1.6;">
              "Adorable petit fast-food avec une ambiance conviviale. Les frites sont croustillantes à l'extérieur et fondantes à l'intérieur !"
            </p>
          </div>

          <!-- Avis 3 -->
          <div style="background-color: white; border-radius: 1rem; padding: 1.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
              <div style="width: 3rem; height: 3rem; background: linear-gradient(135deg, #fbbf24, #f59e0b); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
                👨
              </div>
              <div>
                <h4 style="font-weight: bold; color: #1f2937; font-size: 1.125rem;">Thomas Martin</h4>
                <div style="color: #fbbf24; font-size: 1.125rem;">⭐⭐⭐⭐⭐</div>
              </div>
            </div>
            <p style="color: #6b7280; font-style: italic; line-height: 1.6;">
              "Je commande régulièrement chez BurgerHeaven, toujours à l'heure et les plats bien emballés. Qualité au top !"
            </p>
          </div>

        </div>
      </div>

    </div>
  </div>
</section>
    <!-- Footer -->
    <footer class="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center">
          <div class="flex items-center justify-center gap-3 mb-6">
            <span class="text-5xl">🍔</span>
            <span class="text-3xl font-bold">BurgerHeaven</span>
          </div>
          <p class="text-gray-400 mb-4 text-lg">© 2025 BurgerHeaven - Tous droits réservés</p>
          <p class="text-gray-500 flex items-center justify-center gap-2">
            <span>Fait avec</span>
            <svg class="w-5 h-5 text-red-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
            </svg>
            <span>et des ingrédients frais</span>
          </p>
        </div>
      </div>
    </footer>

    <!-- Cart Sidebar -->
    <CartSidebar v-model="isCartOpen" />
  </div>
</template>