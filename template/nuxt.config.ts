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

  // SEO et meta tags - À PERSONNALISER
  app: {
    head: {
      title: 'Restaurant Template - Votre restaurant en ligne',
      htmlAttrs: {
        lang: 'fr'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Template de site web pour restaurant avec commande en ligne, paiement Stripe et gestion admin.' },
        { name: 'format-detection', content: 'telephone=no' },
        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Restaurant Template' },
        { property: 'og:description', content: 'Template de site web pour restaurant avec commande en ligne.' },
        { property: 'og:image', content: '/og-image.jpg' },
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Restaurant Template' },
        { name: 'twitter:description', content: 'Template de site web pour restaurant.' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' }
      ]
    }
  },

  // Optimisations Nitro
  nitro: {
    compressPublicAssets: true,
    prerender: {
      crawlLinks: true,
      routes: ['/'],
      ignore: ['/admin']
    }
  },

  // Optimisations de build
  experimental: {
    payloadExtraction: false
  },

  // Router options
  router: {
    options: {
      strict: false
    }
  },

  compatibilityDate: '2025-08-12'
})
