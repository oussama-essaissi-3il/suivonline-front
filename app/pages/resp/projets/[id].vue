<script setup lang="ts">
  import type { ProjetDetail, Utilisateur } from '~/types/api'

  const api = useApi()
  const route = useRoute()
  const id = route.params.id // le numero dans l'URL : /resp/projets/3 -> "3"

  const detail = ref<ProjetDetail | null>(null)
  const tousLesDevs = ref<Utilisateur[]>([])
  const devChoisi = ref(0)
  const nouveauQuota = ref(0)
  const erreur = ref('')

  // Les developpeurs qu'on peut encore affecter (pas deja affectes au projet)
  const devsDisponibles = computed(() =>
    tousLesDevs.value.filter(
      (u) =>
        u.role === 'DEVELOPPEUR' &&
        !detail.value?.developpeurs.some((d) => d.id === u.id),
    ),
  )

  async function charger() {
    detail.value = await api<ProjetDetail>(`/projets/${id}`)
    tousLesDevs.value = await api<Utilisateur[]>('/utilisateurs')
    nouveauQuota.value = detail.value.projet.quotaHeures
  }

  // REGLE : le responsable affecte un developpeur a un projet
  async function affecter() {
    if (!devChoisi.value) return
    await api(`/projets/${id}/developpeurs/${devChoisi.value}`, {
      method: 'POST',
    })
    devChoisi.value = 0
    await charger()
  }

  async function retirer(utilisateurId: number) {
    await api(`/projets/${id}/developpeurs/${utilisateurId}`, {
      method: 'DELETE',
    })
    await charger()
  }

  // REGLE : le responsable modifie le quota d'heures
  async function modifierQuota() {
    erreur.value = ''
    const p = detail.value!.projet
    try {
      await api(`/projets/${id}`, {
        method: 'PUT',
        body: {
          nom: p.nom,
          description: p.description,
          quotaHeures: nouveauQuota.value,
          serveurId: p.serveurId,
        },
      })
      await charger()
    } catch (e) {
      erreur.value = messageErreur(e)
    }
  }

  onMounted(charger)
</script>

<template>
  <NuxtLink to="/resp/projets">← Retour aux projets</NuxtLink>

  <template v-if="detail">
    <!-- Infos du projet -->
    <h1>
      {{ detail.projet.nom }}
      <span v-if="detail.projet.enDepassement" class="badge alerte"
        >⚠ Dépassement</span
      >
    </h1>
    <div class="carte">
      <p>{{ detail.projet.description }}</p>
      <p>
        Serveur : <b>{{ detail.projet.serveurNom }}</b> · Statut :
        <b>{{
          detail.projet.statut === 'EN_COURS' ? 'En cours' : 'Clôturé'
        }}</b>
        · Consommé :
        <b>{{ formatMinutes(detail.projet.minutesConsommees) }}</b> /
        {{ detail.projet.quotaHeures }} h
      </p>
      <form @submit.prevent="modifierQuota">
        <label
          >Quota (heures)
          <input v-model.number="nouveauQuota" type="number" min="0"
        /></label>
        <button type="submit">Modifier le quota</button>
      </form>
      <p v-if="erreur" class="erreur">{{ erreur }}</p>
    </div>

    <!-- Affectations (relation n,n) -->
    <div class="carte">
      <h3>Développeurs affectés</h3>
      <table>
        <tbody>
          <tr v-for="d in detail.developpeurs" :key="d.id">
            <td>{{ d.prenom }} {{ d.nom }}</td>
            <td>
              <button class="danger" @click="retirer(d.id)">Retirer</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="detail.developpeurs.length === 0">Aucun développeur affecté.</p>

      <form @submit.prevent="affecter" style="margin-top: 12px">
        <select v-model.number="devChoisi">
          <option :value="0" disabled>-- choisir un développeur --</option>
          <option v-for="u in devsDisponibles" :key="u.id" :value="u.id">
            {{ u.prenom }} {{ u.nom }}
          </option>
        </select>
        <button type="submit">Affecter</button>
      </form>
    </div>

    <!-- Qui a contribue, combien de temps -->
    <div class="carte">
      <h3>Temps par développeur</h3>
      <table>
        <tbody>
          <tr v-for="t in detail.tempsParDeveloppeur" :key="t.utilisateurId">
            <td>{{ t.prenom }} {{ t.nom }}</td>
            <td>{{ formatMinutes(t.totalMinutes) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Toutes les contributions du projet -->
    <div class="carte">
      <h3>Contributions</h3>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Développeur</th>
            <th>Durée</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in detail.contributions" :key="c.id">
            <td>{{ c.dateContrib }}</td>
            <td>{{ c.utilisateurNomComplet }}</td>
            <td>{{ formatMinutes(c.dureeMinutes) }}</td>
          </tr>
        </tbody>
      </table>
      <p v-if="detail.contributions.length === 0">Aucune contribution.</p>
    </div>
  </template>
</template>
