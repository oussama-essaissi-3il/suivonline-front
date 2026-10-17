<script setup lang="ts">
  import type { Utilisateur, Role } from '~/types/api'

  const api = useApi()

  const utilisateurs = ref<Utilisateur[]>([])
  const erreur = ref('')
  const enEdition = ref<number | null>(null)
  const formVide = {
    nom: '',
    prenom: '',
    email: '',
    motPasse: '',
    role: 'DEVELOPPEUR' as Role,
  }
  const form = ref({ ...formVide })

  async function charger() {
    utilisateurs.value = await api<Utilisateur[]>('/utilisateurs')
  }

  function modifier(u: Utilisateur) {
    enEdition.value = u.id
    // Mot de passe vide = le back garde l'ancien
    form.value = {
      nom: u.nom,
      prenom: u.prenom,
      email: u.email,
      motPasse: '',
      role: u.role,
    }
  }

  function annuler() {
    enEdition.value = null
    form.value = { ...formVide }
  }

  async function enregistrer() {
    erreur.value = ''
    try {
      if (enEdition.value) {
        await api(`/utilisateurs/${enEdition.value}`, {
          method: 'PUT',
          body: form.value,
        })
      } else {
        await api('/utilisateurs', { method: 'POST', body: form.value })
      }
      annuler()
      await charger()
    } catch (e) {
      erreur.value = messageErreur(e)
    }
  }

  async function supprimer(id: number) {
    if (!confirm('Supprimer ce compte ?')) return
    erreur.value = ''
    try {
      await api(`/utilisateurs/${id}`, { method: 'DELETE' })
      await charger()
    } catch (e) {
      erreur.value = messageErreur(e)
    }
  }

  onMounted(charger)
</script>

<template>
  <h1>Utilisateurs</h1>

  <div class="carte">
    <h3>{{ enEdition ? 'Modifier le compte' : 'Nouveau compte' }}</h3>
    <form @submit.prevent="enregistrer">
      <label>Nom <input v-model="form.nom" required /></label>
      <label>Prénom <input v-model="form.prenom" required /></label>
      <label>Email <input v-model="form.email" type="email" required /></label>
      <label
        >Mot de passe
        <input
          v-model="form.motPasse"
          type="password"
          :required="!enEdition"
          :placeholder="enEdition ? 'vide = inchangé' : ''"
        />
      </label>
      <label
        >Rôle
        <select v-model="form.role">
          <option value="DEVELOPPEUR">Développeur</option>
          <option value="RESPONSABLE">Responsable</option>
        </select>
      </label>
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
          <th>Email</th>
          <th>Rôle</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="u in utilisateurs" :key="u.id">
          <td>{{ u.prenom }} {{ u.nom }}</td>
          <td>{{ u.email }}</td>
          <td>
            <span
              class="badge"
              :class="u.role === 'RESPONSABLE' ? 'alerte' : 'ok'"
            >
              {{ u.role === 'RESPONSABLE' ? 'Responsable' : 'Développeur' }}
            </span>
          </td>
          <td>
            <button class="secondaire" @click="modifier(u)">Modifier</button>
            <button class="danger" @click="supprimer(u.id)">Supprimer</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
