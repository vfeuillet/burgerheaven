import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  // Ignorer le dossier template pour éviter les conflits
  ignore: [
    'template/**/*'
  ],

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
        // Open Graph
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
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' }
      ]
    }
  },
  
  // ✅ NOUVEAUX : Optimisations Nitro
  nitro: {
    compressPublicAssets: true,
    prerender: {
      crawlLinks: true,
      routes: ['/'],
      ignore: ['/admin']
    }
  },
  
  // ✅ NOUVEAUX : Optimisations de build
  experimental: {
    payloadExtraction: false
  },
  
  // ✅ NOUVEAUX : Router options
  router: {
    options: {
      strict: false
    }
  },
  
  compatibilityDate: '2025-08-12'
})