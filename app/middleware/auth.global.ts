export default defineNuxtRouteMiddleware((to) => {
  const { token, estResponsable } = useAuth()

  if (to.path === '/login') return // la connexion est publique
  if (!token.value) return navigateTo('/login') // pas connecte -> connexion

  // Mauvais role -> retour a l'accueil
  if (to.path.startsWith('/resp') && !estResponsable.value)
    return navigateTo('/')
  if (to.path.startsWith('/dev') && estResponsable.value) return navigateTo('/')
})
