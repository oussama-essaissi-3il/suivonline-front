export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false,
  css: ['~/assets/css/main.css'], // ← NOUVEAU
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:8080/api',
    },
  },
})
