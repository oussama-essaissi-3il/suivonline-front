<script setup lang="ts">
  import type { Projet } from '~/types/api'

  const api = useApi()
  const projets = ref<Projet[]>([])

  onMounted(async () => {
    projets.value = await api<Projet[]>('/me/projets')
  })
</script>

<template>
  <h1>Mes projets</h1>
  <div class="carte">
    <table>
      <thead>
        <tr>
          <th>Projet</th>
          <th>Description</th>
          <th>Serveur</th>
          <th>Statut</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in projets" :key="p.id">
          <td>{{ p.nom }}</td>
          <td>{{ p.description }}</td>
          <td>{{ p.serveurNom }}</td>
          <td>
            <span
              class="badge"
              :class="p.statut === 'EN_COURS' ? 'ok' : 'neutre'"
            >
              {{ p.statut === 'EN_COURS' ? 'En cours' : 'Clôturé' }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-if="projets.length === 0">Vous n'êtes affecté à aucun projet.</p>
  </div>
</template>
