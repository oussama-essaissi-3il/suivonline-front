<script setup lang="ts">
  import type { Serveur } from '~/types/api'

  const api = useApi()

  const serveurs = ref<Serveur[]>([])
  const erreur = ref('')
  const form = ref({ nom: '', description: '' })
  const enEdition = ref<number | null>(null)

  async function charger() {
    serveurs.value = await api<Serveur[]>('/serveurs')
  }

  function modifier(s: Serveur) {
    enEdition.value = s.id
    form.value = { nom: s.nom, description: s.description ?? '' }
  }

  function annuler() {
    enEdition.value = null
    form.value = { nom: '', description: '' }
  }

  async function enregistrer() {
    erreur.value = ''
    try {
      if (enEdition.value) {
        await api(`/serveurs/${enEdition.value}`, {
          method: 'PUT',
          body: form.value,
        })
      } else {
        await api('/serveurs', { method: 'POST', body: form.value })
      }
      annuler()
      await charger()
    } catch (e) {
      erreur.value = messageErreur(e)
    }
  }

  async function supprimer(id: number) {
    if (!confirm('Supprimer ce serveur ?')) return
    erreur.value = ''
    try {
      await api(`/serveurs/${id}`, { method: 'DELETE' })
      await charger()
    } catch (e) {
      erreur.value = messageErreur(e)
    }
  }

  onMounted(charger)
</script>

<template>
  <h1>Serveurs</h1>

  <div class="carte">
    <h3>{{ enEdition ? 'Modifier le serveur' : 'Nouveau serveur' }}</h3>
    <form @submit.prevent="enregistrer">
      <label>Nom <input v-model="form.nom" required /></label>
      <label>Description <input v-model="form.description" /></label>
      <button type="submit">{{ enEdition ? 'Enregistrer' : 'Créer' }}</button>
      <button
        v-if="enEdition"
        type="button"
        class="secondaire"
        @click="annuler"
      >
        Annuler
      </button>
    </form>
    <p v-if="erreur" class="erreur">{{ erreur }}</p>
  </div>

  <div class="carte">
    <table>
      <thead>
        <tr>
          <th>Nom</th>
          <th>Description</th>
          <th>Projets hébergés</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in serveurs" :key="s.id">
          <td>{{ s.nom }}</td>
          <td>{{ s.description }}</td>
          <td>{{ s.nbProjets }}</td>
          <td>
            <button class="secondaire" @click="modifier(s)">Modifier</button>
            <button class="danger" @click="supprimer(s.id)">Supprimer</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
