<script setup lang="ts">
  import type { Dashboard } from '~/types/api'

  const api = useApi()

  const aujourdhui = new Date().toISOString().slice(0, 10)
  const debut = ref(aujourdhui.slice(0, 8) + '01')
  const fin = ref(aujourdhui)

  const dashboard = ref<Dashboard | null>(null)

  async function charger() {
    dashboard.value = await api<Dashboard>(
      `/dashboard?debut=${debut.value}&fin=${fin.value}`,
    )
  }

  onMounted(charger)
</script>

<template>
  <h1>Tableau de bord</h1>

  <div class="carte">
    <form @submit.prevent="charger">
      <label>Du <input v-model="debut" type="date" /></label>
      <label>Au <input v-model="fin" type="date" /></label>
      <button type="submit">Afficher</button>
    </form>
  </div>

  <template v-if="dashboard">
    <div class="carte">
      <h3>Temps par développeur</h3>
      <table>
        <thead>
          <tr>
            <th>Développeur</th>
            <th>Temps total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in dashboard.tempsParDeveloppeur" :key="t.utilisateurId">
            <td>{{ t.prenom }} {{ t.nom }}</td>
            <td>{{ formatMinutes(t.totalMinutes) }}</td>
          </tr>
        </tbody>
      </table>
      <p v-if="dashboard.tempsParDeveloppeur.length === 0">
        Aucune contribution sur la période.
      </p>
    </div>

    <div class="carte">
      <h3>Projets en dépassement</h3>
      <table>
        <thead>
          <tr>
            <th>Projet</th>
            <th>Quota</th>
            <th>Consommé</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in dashboard.projetsEnDepassement" :key="p.id">
            <td>
              <NuxtLink :to="`/resp/projets/${p.id}`">{{ p.nom }}</NuxtLink>
            </td>
            <td>{{ p.quotaHeures }} h</td>
            <td>
              <span class="badge alerte">{{
                formatMinutes(p.minutesConsommees)
              }}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="dashboard.projetsEnDepassement.length === 0">
        Aucun projet en dépassement.
      </p>
    </div>

    <div class="carte">
      <h3>Projets clôturés récemment</h3>
      <table>
        <thead>
          <tr>
            <th>Projet</th>
            <th>Clôturé le</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in dashboard.projetsCloturesRecemment" :key="p.id">
            <td>{{ p.nom }}</td>
            <td>{{ p.dateCloture }}</td>
          </tr>
        </tbody>
      </table>
      <p v-if="dashboard.projetsCloturesRecemment.length === 0">
        Aucun projet clôturé ces 30 derniers jours.
      </p>
    </div>
  </template>
</template>
