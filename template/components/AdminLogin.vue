<script setup lang="ts">
const emit = defineEmits<{
  authenticated: []
}>()

const password = ref('')
const error = ref('')

// Mot de passe simple (en production, utiliser une vraie auth)
const ADMIN_PASSWORD = 'admin123'

function login() {
  if (password.value === ADMIN_PASSWORD) {
    // Stocker dans localStorage
    localStorage.setItem('admin_logged_in', 'true')
    emit('authenticated')
  } else {
    error.value = 'Mot de passe incorrect'
    password.value = ''
  }
}
</script>

<template>
  <div style="min-height: 100vh; background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); display: flex; align-items: center; justify-content: center; padding: 1.5rem;">
    <div style="background: white; padding: 3rem; border-radius: 1rem; box-shadow: 0 20px 50px rgba(0,0,0,0.2); max-width: 28rem; width: 100%;">
      <!-- Logo -->
      <div style="text-align: center; margin-bottom: 2rem;">
        <div style="width: 5rem; height: 5rem; background: #fbbf24; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 3rem; margin-bottom: 1rem;">
          🍔
        </div>
        <h1 style="font-size: 2rem; font-weight: bold; color: #111827; margin-bottom: 0.5rem;">
          Burger<span style="color: #fbbf24;">Heaven</span>
        </h1>
        <p style="color: #6b7280; font-size: 0.875rem;">Dashboard Administrateur</p>
      </div>

      <!-- Formulaire -->
      <form @submit.prevent="login" style="display: flex; flex-direction: column; gap: 1.5rem;">
        <div>
          <label style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.5rem;">
            Mot de passe
          </label>
          <input 
            v-model="password"
            type="password" 
            placeholder="Entrez le mot de passe"
            style="width: 100%; padding: 0.75rem 1rem; border: 2px solid #e5e7eb; border-radius: 0.5rem; font-size: 1rem; transition: border-color 0.2s;"
            @focus="error = ''"
          />
        </div>

        <div v-if="error" style="background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; padding: 0.75rem; border-radius: 0.5rem; font-size: 0.875rem; text-align: center;">
          {{ error }}
        </div>

        <button 
          type="submit"
          style="width: 100%; background: #fbbf24; color: #111827; padding: 0.875rem; border-radius: 0.5rem; font-weight: bold; font-size: 1rem; border: none; cursor: pointer; transition: all 0.2s;"
        >
          Se connecter
        </button>
      </form>

      <p style="margin-top: 1.5rem; text-align: center; font-size: 0.75rem; color: #9ca3af;">
        Mot de passe par défaut : <code style="background: #f3f4f6; padding: 0.125rem 0.375rem; border-radius: 0.25rem;">admin123</code>
      </p>
    </div>
  </div>
</template>

<style scoped>
input:focus {
  outline: none;
  border-color: #fbbf24;
}

button:hover {
  background: #f59e0b;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
}
</style>