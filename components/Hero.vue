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
      <!-- Titre principal -->
      <h1 style="font-size: 4rem; font-weight: bold; color: white; margin-bottom: 1.5rem; line-height: 1.2; text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);">
        Des burgers faits avec <span style="color: #fbbf24;">amour</span>
      </h1>
      
      <!-- Sous-titre -->
      <p style="font-size: 1.25rem; color: white; margin-bottom: 2rem; max-width: 42rem; margin-left: auto; margin-right: auto; text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);">
        Découvrez nos délicieuses spécialités préparées avec des ingrédients frais et locaux.
      </p>
      
      <!-- Boutons -->
      <div style="display: flex; gap: 1rem; justify-content: center; align-items: center; flex-wrap: wrap;">
        <!-- Bouton JAUNE (contraste OK) -->
        <a 
          href="#menu"
          aria-label="Voir le menu des burgers"
          style="
            background-color: #fbbf24; 
            color: #000000; 
            font-weight: bold; 
            padding: 0.875rem 2rem; 
            border-radius: 9999px; 
            text-decoration: none;
            transition: all 0.3s;
            display: inline-block;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
          "
          onmouseover="this.style.backgroundColor='#f59e0b'; this.style.transform='scale(1.05)'"
          onmouseout="this.style.backgroundColor='#fbbf24'; this.style.transform='scale(1)'"
        >
          Voir le menu
        </a>
        
        <!-- ✅ Bouton BLANC (contraste amélioré) -->
        <a 
          href="#promotions"
          aria-label="Commander maintenant"
          style="
            background: rgba(255, 255, 255, 0.95);
            color: #1f2937;
            border: 2px solid #fbbf24;
            font-weight: 700;
            padding: 0.875rem 2rem;
            border-radius: 9999px;
            text-decoration: none;
            transition: all 0.3s;
            display: inline-block;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
          "
          onmouseover="this.style.backgroundColor='#fbbf24'; this.style.color='#000000'; this.style.transform='scale(1.05)'"
          onmouseout="this.style.backgroundColor='rgba(255, 255, 255, 0.95)'; this.style.color='#1f2937'; this.style.transform='scale(1)'"
        >
          Commander maintenant
        </a>
      </div>
    </div>
    
    <!-- Flèche animée -->
    <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2">
      <a 
        href="#promotions"
        aria-label="Voir les promotions"
        class="text-white animate-bounce"
      >
        <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </a>
    </div>
  </div>
</template>