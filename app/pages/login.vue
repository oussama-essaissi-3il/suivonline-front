<script setup lang="ts">
  // Cette page n'a pas le menu (pas encore connecte)
  definePageMeta({ layout: false })

  const { login } = useAuth()

  // ref = variable REACTIVE : quand elle change, l'affichage se met a jour
  const email = ref('')
  const motPasse = ref('')
  const erreur = ref('')

  async function seConnecter() {
    erreur.value = ''
    try {
      await login(email.value, motPasse.value)
      navigateTo('/')
    } catch (e) {
      erreur.value = messageErreur(e) // "Email ou mot de passe incorrect"
    }
  }
</script>

<template>
  <div class="contenu" style="max-width: 400px; margin-top: 100px">
    <div class="carte">
      <h1>SuivOnline</h1>
      <!-- .prevent = empeche le rechargement de la page a l'envoi du formulaire -->
      <form
        @submit.prevent="seConnecter"
        style="flex-direction: column; align-items: stretch"
      >
        <label>Email <input v-model="email" type="email" required /></label>
        <label
          >Mot de passe <input v-model="motPasse" type="password" required
        /></label>
        <p v-if="erreur" class="erreur">{{ erreur }}</p>
        <button type="submit">Se connecter</button>
      </form>
    </div>
  </div>
</template>
