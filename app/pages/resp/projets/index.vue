<script setup lang="ts">
  import type { Projet, Serveur } from '~/types/api'

  const api = useApi()

  const projets = ref<Projet[]>([])
  const serveurs = ref<Serveur[]>([])
  const erreur = ref('')
  const form = ref({ nom: '', description: '', quotaHeures: 10, serveurId: 0 })

  async function charger() {
    projets.value = await api<Projet[]>('/projets')
    serveurs.value = await api<Serveur[]>('/serveurs')
  }

  async function creer() {
    erreur.value = ''
    try {
      await api('/projets', { method: 'POST', body: form.value })
      form.value = { nom: '', description: '', quotaHeures: 10, serveurId: 0 }
      await charger()
    } catch (e) {
      erreur.value = messageErreur(e)
    }
  }

  async function cloturer(id: number) {
    if (!confirm('Clôturer ce projet ?')) return
    await api(`/projets/${id}/cloture`, { method: 'PATCH' })
    await charger()
  }

  onMounted(charger)
</script>

<template>
  <h1>Projets</h1>

  <div class="carte">
    <h3>Nouveau projet</h3>
    <form @submit.prevent="creer">
      <label>Nom <input v-model="form.nom" required /></label>
      <label
        >Quota (heures)
        <input v-model.number="form.quotaHeures" type="number" min="0" required
      /></label>
      <label
        >Serveur
        <select v-model.number="form.serveurId" required>
          <option :value="0" disabled>-- choisir --</option>
          <option v-for="s in serveurs" :key="s.id" :value="s.id">
            {{ s.nom }}
          </option>
        </select>
      </label>
      <label>Description <input v-model="form.description" /></label>
      <button type="submit">Créer</button>
    </form>
    <p v-if="erreur" class="erreur">{{ erreur }}</p>
  </div>

  <div class="carte">
    <table>
      <thead>
        <tr>
          <th>Nom</th>
          <th>Serveur</th>
          <th>Quota</th>
          <th>Consommé</th>
          <th>Statut</th>
          <th>Dépassement</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in projets" :key="p.id">
          <td>
            <NuxtLink :to="`/resp/projets/${p.id}`">{{ p.nom }}</NuxtLink>
          </td>
          <td>{{ p.serveurNom }}</td>
          <td>{{ p.quotaHeures }} h</td>
          <td>{{ formatMinutes(p.minutesConsommees) }}</td>
          <td>
            <span
              class="badge"
              :class="p.statut === 'EN_COURS' ? 'ok' : 'neutre'"
            >
              {{ p.statut === 'EN_COURS' ? 'En cours' : 'Clôturé' }}
            </span>
          </td>
          <td>
            <span v-if="p.enDepassement" class="badge alerte"
              >⚠ Dépassement</span
            >
          </td>
          <td>
            <button
              v-if="p.statut === 'EN_COURS'"
              class="danger"
              @click="cloturer(p.id)"
            >
              Clôturer
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-if="projets.length === 0">Aucun projet.</p>
  </div>
</template>
