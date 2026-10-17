<script setup lang="ts">
  import type { Recap } from '~/types/api'

  const api = useApi()
  const recap = ref<Recap | null>(null)

  onMounted(async () => {
    recap.value = await api<Recap>('/me/recap')
  })
</script>

<template>
  <h1>Récapitulatif de mon temps</h1>
  <div v-if="recap" class="carte">
    <table>
      <thead>
        <tr>
          <th>Projet</th>
          <th>Temps passé</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in recap.parProjet" :key="r.projetId">
          <td>{{ r.projetNom }}</td>
          <td>{{ formatMinutes(r.totalMinutes) }}</td>
        </tr>
        <tr>
          <td><b>Total</b></td>
          <td>
            <b>{{ formatMinutes(recap.totalMinutes) }}</b>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
