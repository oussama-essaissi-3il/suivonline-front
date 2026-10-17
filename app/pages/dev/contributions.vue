<script setup lang="ts">
  import type { Contribution, Projet } from '~/types/api'

  const api = useApi()

  const contributions = ref<Contribution[]>([])
  const mesProjets = ref<Projet[]>([])
  const tri = ref('date') // 'date' ou 'projet'
  const erreur = ref('')
  const succes = ref('')
  const aujourdhui = new Date().toISOString().slice(0, 10)
  const form = ref({ projetId: 0, dureeMinutes: 60, dateContrib: aujourdhui })

  // On ne propose que les projets EN COURS (regle du sujet)
  const projetsActifs = computed(() =>
    mesProjets.value.filter((p) => p.statut === 'EN_COURS'),
  )

  async function charger() {
    contributions.value = await api<Contribution[]>(
      `/me/contributions?tri=${tri.value}`,
    )
    mesProjets.value = await api<Projet[]>('/me/projets')
  }

  async function declarer() {
    erreur.value = ''
    succes.value = ''
    try {
      await api('/me/contributions', { method: 'POST', body: form.value })
      succes.value = 'Contribution enregistrée'
      form.value = { projetId: 0, dureeMinutes: 60, dateContrib: aujourdhui }
      await charger()
    } catch (e) {
      erreur.value = messageErreur(e) // ex : "Ce projet est cloture"
    }
  }

  onMounted(charger)
</script>

<template>
  <h1>Mes contributions</h1>

  <!-- Declarer une contribution -->
  <div class="carte">
    <h3>Déclarer du temps</h3>
    <form @submit.prevent="declarer">
      <label
        >Projet
        <select v-model.number="form.projetId" required>
          <option :value="0" disabled>-- choisir --</option>
          <option v-for="p in projetsActifs" :key="p.id" :value="p.id">
            {{ p.nom }}
          </option>
        </select>
      </label>
      <label
        >Durée (minutes)
        <input
          v-model.number="form.dureeMinutes"
          type="number"
          min="1"
          required
      /></label>
      <label
        >Date
        <input
          v-model="form.dateContrib"
          type="date"
          :max="aujourdhui"
          required
      /></label>
      <button type="submit">Déclarer</button>
    </form>
    <p v-if="erreur" class="erreur">{{ erreur }}</p>
    <p v-if="succes" style="color: var(--vert)">{{ succes }}</p>
  </div>

  <!-- Liste triable -->
  <div class="carte">
    <form>
      <label
        >Trier par
        <!-- @change : a chaque changement de tri, on recharge depuis le back -->
        <select v-model="tri" @change="charger">
          <option value="date">Date</option>
          <option value="projet">Projet</option>
        </select>
      </label>
    </form>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Projet</th>
          <th>Durée</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in contributions" :key="c.id">
          <td>{{ c.dateContrib }}</td>
          <td>{{ c.projetNom }}</td>
          <td>{{ formatMinutes(c.dureeMinutes) }}</td>
        </tr>
      </tbody>
    </table>
    <p v-if="contributions.length === 0">Aucune contribution.</p>
  </div>
</template>
