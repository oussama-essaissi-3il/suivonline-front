import type { LoginResponse, Utilisateur } from '~/types/api'

export const useAuth = () => {
  const config = useRuntimeConfig()

  // useState = une variable PARTAGEE entre toutes les pages.
  // Valeur de depart : ce qui a ete sauve dans le navigateur (si on avait deja ete connecte)
  const token = useState<string | null>('token', () =>
    localStorage.getItem('token'),
  )
  const utilisateur = useState<Utilisateur | null>('utilisateur', () => {
    const u = localStorage.getItem('utilisateur')
    return u ? JSON.parse(u) : null
  })

  // computed = valeur calculee, mise a jour automatiquement
  const estResponsable = computed(
    () => utilisateur.value?.role === 'RESPONSABLE',
  )

  async function login(email: string, motPasse: string) {
    // Appel a POST /api/auth/login (le seul appel SANS token)
    const rep = await $fetch<LoginResponse>(
      `${config.public.apiBase}/auth/login`,
      {
        method: 'POST',
        body: { email, motPasse },
      },
    )
    token.value = rep.token
    utilisateur.value = rep.utilisateur
    // On sauve dans le navigateur pour rester connecte si on recharge la page
    localStorage.setItem('token', rep.token)
    localStorage.setItem('utilisateur', JSON.stringify(rep.utilisateur))
  }

  function logout() {
    token.value = null
    utilisateur.value = null
    localStorage.clear()
    navigateTo('/login')
  }

  return { token, utilisateur, estResponsable, login, logout }
}
