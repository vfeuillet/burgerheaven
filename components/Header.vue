<script setup lang="ts">
const { totalItems } = useCart()
const isCartOpen = defineModel<boolean>('isCartOpen', { default: false })
const isMobileMenuOpen = ref(false)
const isScrolled = ref(false)

// Détecter le scroll
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

function handleScroll() {
  isScrolled.value = window.scrollY > 100
}

function scrollToSection(sectionId: string) {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
  isMobileMenuOpen.value = false
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function handleMouseOver(e: Event) {
  const target = e.target as HTMLElement
  target.style.color = '#fbbf24'
}

function handleMouseOut(e: Event) {
  const target = e.target as HTMLElement
  target.style.color = 'white'
}

function handleButtonMouseOver(e: Event) {
  const target = e.target as HTMLElement
  target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
}

function handleButtonMouseOut(e: Event) {
  const target = e.target as HTMLElement
  target.style.backgroundColor = 'transparent'
}
</script>

<template>
  <header 
    :style="{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: isScrolled ? '#1f2937' : 'transparent',
      color: 'white',
      zIndex: 9999,
      transition: 'background-color 0.3s ease',
      boxShadow: isScrolled ? '0 4px 6px rgba(0,0,0,0.1)' : 'none'
    }"
  >
    <div style="max-width: 1280px; margin: 0 auto; padding: 1.5rem 1.5rem; display: flex; align-items: center; justify-content: space-between;">
      
      <!-- Logo -->
      <div style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer;" @click="scrollToSection('hero')">
        <div style="width: 3rem; height: 3rem; background-color: #fbbf24; border-radius: 9999px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
          <span style="font-size: 1.5rem;">🍔</span>
        </div>
        <h1 style="font-size: 1.5rem; font-weight: bold; white-space: nowrap;">
          Burger<span style="color: #fbbf24;">Heaven</span>
        </h1>
      </div>

      <!-- Navigation Desktop -->
      <nav class="desktop-nav md-nav" style="display: none; gap: 2rem; align-items: center;">
        <button 
          @click="scrollToSection('menu')"
          @mouseover="handleMouseOver"
          @mouseout="handleMouseOut"
          style="color: white; font-weight: 500; font-size: 1.125rem; background: none; border: none; cursor: pointer; transition: color 0.2s;"
        >
          Menu
        </button>
        <button 
          @click="scrollToSection('promotions')"
          @mouseover="handleMouseOver"
          @mouseout="handleMouseOut"
          style="color: white; font-weight: 500; font-size: 1.125rem; background: none; border: none; cursor: pointer; transition: color 0.2s;"
        >
          Promotions
        </button>
        <button 
          @click="scrollToSection('trouver')"
          @mouseover="handleMouseOver"
          @mouseout="handleMouseOut"
          style="color: white; font-weight: 500; font-size: 1.125rem; background: none; border: none; cursor: pointer; transition: color 0.2s;"
        >
          Nous trouver
        </button>
      </nav>

      <!-- Boutons : Burger + Panier -->
      <div style="display: flex; align-items: center; gap: 1rem;">
        
        <!-- Bouton Burger Mobile -->
        <button 
          @click="toggleMobileMenu"
          class="burger-menu"
          style="display: none; flex-direction: column; gap: 0.25rem; cursor: pointer; padding: 0.5rem; background: transparent; border: none;"
        >
          <span style="width: 1.5rem; height: 2px; background-color: white; transition: all 0.3s;"></span>
          <span style="width: 1.5rem; height: 2px; background-color: white; transition: all 0.3s;"></span>
          <span style="width: 1.5rem; height: 2px; background-color: white; transition: all 0.3s;"></span>
        </button>

        <!-- Panier -->
        <button 
          @click="isCartOpen = true"
          @mouseover="handleButtonMouseOver"
          @mouseout="handleButtonMouseOut"
          style="position: relative; padding: 0.75rem; border-radius: 0.5rem; background: transparent; border: none; cursor: pointer; flex-shrink: 0; transition: background 0.2s;"
        >
          <svg style="width: 1.5rem; height: 1.5rem; color: white;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span 
            v-if="totalItems > 0"
            style="position: absolute; top: -0.25rem; right: -0.25rem; background-color: #fbbf24; color: #1f2937; font-size: 0.75rem; font-weight: bold; border-radius: 9999px; width: 1.5rem; height: 1.5rem; display: flex; align-items: center; justify-content: center;"
          >
            {{ totalItems }}
          </span>
        </button>
      </div>
    </div>

    <!-- Menu Mobile Overlay -->
    <div 
      class="mobile-overlay"
      :class="{ 'open': isMobileMenuOpen }"
      @click="isMobileMenuOpen = false"
    ></div>

    <!-- Menu Mobile -->
    <div 
      class="mobile-menu"
      :class="{ 'open': isMobileMenuOpen }"
    >
      <div style="display: flex; justify-content: flex-end; margin-bottom: 2rem;">
        <button 
          @click="isMobileMenuOpen = false"
          style="color: white; font-size: 2rem; background: none; border: none; cursor: pointer;"
        >
          ×
        </button>
      </div>
      
      <nav style="display: flex; flex-direction: column; gap: 1.5rem;">
        <button 
          @click="scrollToSection('menu')"
          style="color: white; font-weight: 600; font-size: 1.25rem; background: none; border: none; cursor: pointer; text-align: left; padding: 0.5rem 0; border-bottom: 1px solid rgba(255,255,255,0.1);"
        >
          Menu
        </button>
        <button 
          @click="scrollToSection('promotions')"
          style="color: white; font-weight: 600; font-size: 1.25rem; background: none; border: none; cursor: pointer; text-align: left; padding: 0.5rem 0; border-bottom: 1px solid rgba(255,255,255,0.1);"
        >
          Promotions
        </button>
        <button 
          @click="scrollToSection('trouver')"
          style="color: white; font-weight: 600; font-size: 1.25rem; background: none; border: none; cursor: pointer; text-align: left; padding: 0.5rem 0; border-bottom: 1px solid rgba(255,255,255,0.1);"
        >
          Nous trouver
        </button>
      </nav>
    </div>
  </header>
</template>

<style scoped>
@media (min-width: 768px) {
  .md-nav {
    display: flex !important;
  }
  .burger-menu {
    display: none !important;
  }
  .mobile-menu {
    display: none !important;
  }
  .mobile-overlay {
    display: none !important;
  }
}

@media (max-width: 768px) {
  .desktop-nav {
    display: none !important;
  }
  .burger-menu {
    display: flex !important;
  }
}
</style>