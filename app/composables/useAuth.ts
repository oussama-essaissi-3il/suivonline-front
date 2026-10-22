import type { LoginResponse, Utilisateur } from '~/types/api'

export const useAuth = () => {
  const config = useRuntimeConfig()

  const token = useState<string | null>('token', () =>
    localStorage.getItem('token'),
  )
  const utilisateur = useState<Utilisateur | null>('utilisateur', () => {
    const u = localStorage.getItem('utilisateur')
    return u ? JSON.parse(u) : null
  })

  const estResponsable = computed(
    () => utilisateur.value?.role === 'RESPONSABLE',
  )

  async function login(email: string, motPasse: string) {
    const rep = await $fetch<LoginResponse>(
      `${config.public.apiBase}/auth/login`,
      {
        method: 'POST',
        body: { email, motPasse },
      },
    )
    token.value = rep.token
    utilisateur.value = rep.utilisateur
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
