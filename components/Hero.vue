<script setup lang="ts">
</script>

<template>
  <div 
    style="
      background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      min-height: 100vh;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      margin: 0;
      padding: 0;
    "
  >
    <div class="container mx-auto px-4 text-center">
      <!-- Titre principal en TRÈS GROS -->
      <h1 style="font-size: 4rem; font-weight: bold; color: white; margin-bottom: 1.5rem; line-height: 1.2;">
        Des burgers faits avec <span style="color: #fbbf24;">amour</span>
      </h1>
      
      <!-- Sous-titre en blanc, taille moyenne -->
      <p style="font-size: 1.25rem; color: white; margin-bottom: 2rem; max-width: 42rem; margin-left: auto; margin-right: auto;">
        Découvrez nos délicieuses spécialités préparées avec des ingrédients frais et locaux.
      </p>
      
      <!-- Boutons côte à côte -->
      <div style="display: flex; gap: 1rem; justify-content: center; align-items: center; flex-wrap: wrap;">
        <!-- Bouton JAUNE avec texte NOIR -->
        <a 
          href="#menu" 
          style="
            background-color: #fbbf24; 
            color: #000000; 
            font-weight: bold; 
            padding: 0.875rem 2rem; 
            border-radius: 9999px; 
            text-decoration: none;
            transition: all 0.3s;
            display: inline-block;
          "
          onmouseover="this.style.backgroundColor='#f59e0b'; this.style.transform='scale(1.05)'"
          onmouseout="this.style.backgroundColor='#fbbf24'; this.style.transform='scale(1)'"
        >
          Voir le menu
        </a>
        
        <!-- Bouton TRANSPARENT avec bordure et texte BLANC -->
        <a 
          href="#promotions" 
          style="
            background-color: transparent; 
            color: white; 
            border: 2px solid white;
            font-weight: bold; 
            padding: 0.875rem 2rem; 
            border-radius: 9999px; 
            text-decoration: none;
            transition: all 0.3s;
            display: inline-block;
          "
          onmouseover="this.style.backgroundColor='white'; this.style.color='#000000'"
          onmouseout="this.style.backgroundColor='transparent'; this.style.color='white'"
        >
          Commander maintenant
        </a>
      </div>
    </div>
    
    <!-- Flèche animée en bas -->
    <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2">
      <a href="#promotions" class="text-white animate-bounce">
        <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </a>
    </div>
  </div>
</template>