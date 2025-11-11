import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  css: [
    '@/assets/css/tailwind.css',
    '@/assets/css/main.css'
  ],
  
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {}
    }
  },
  
  devtools: { enabled: false },
  
  pages: true,
  
  runtimeConfig: {
    strapiToken: process.env.NUXT_STRAPI_TOKEN,
    stripeSecretKey: process.env.NUXT_STRIPE_SECRET_KEY,
    public: {
      graphqlEndpoint: process.env.NUXT_PUBLIC_GRAPHQL_ENDPOINT,
      strapiUrl: process.env.NUXT_PUBLIC_STRAPI_URL || 'http://localhost:1337',
      stripePublicKey: process.env.NUXT_PUBLIC_STRIPE_KEY
    }
  },
  
  // ✅ SEO et meta tags
  app: {
    head: {
      title: 'BurgerHeaven - Les meilleurs burgers artisanaux',
      htmlAttrs: {
        lang: 'fr'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Découvrez BurgerHeaven, vos burgers artisanaux préparés avec des ingrédients frais et locaux. Livraison rapide et service de qualité à Paris.' },
        { name: 'format-detection', content: 'telephone=no' },
        
        // Open Graph (Facebook, LinkedIn)
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'BurgerHeaven - Les meilleurs burgers artisanaux' },
        { property: 'og:description', content: 'Burgers artisanaux avec ingrédients frais. Livraison rapide à Paris.' },
        { property: 'og:image', content: '/og-image.jpg' },
        
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'BurgerHeaven - Les meilleurs burgers artisanaux' },
        { name: 'twitter:description', content: 'Burgers artisanaux avec ingrédients frais.' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        // Préchargement Google Fonts (si besoin)
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' }
      ]
    }
  },
  
  compatibilityDate: '2025-08-12'
})