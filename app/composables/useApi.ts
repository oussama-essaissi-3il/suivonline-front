type Options = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: object
}

export const useApi = () => {
  const config = useRuntimeConfig()
  const { token, logout } = useAuth()

  // Renvoie une fonction : api<Projet[]>('/projets')
  return <T>(url: string, options: Options = {}) =>
    $fetch<T>(config.public.apiBase + url, {
      ...options,
      headers: { Authorization: `Bearer ${token.value}` }, // le token, comme dans Bruno
      onResponseError({ response }) {
        if (response.status === 401) logout() // token expire -> retour a la connexion
      },
    })
}

// Recupere le "message" de l'ErreurDto renvoye par le back (etape 5 du back)
export function messageErreur(e: any): string {
  return e?.data?.message ?? 'Une erreur est survenue'
}
