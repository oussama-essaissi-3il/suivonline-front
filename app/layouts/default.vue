<script setup lang="ts">
  const { utilisateur, estResponsable, logout } = useAuth()
</script>

<template>
  <nav class="navbar">
    <span class="logo">SuivOnline</span>

    <!-- Menu du RESPONSABLE -->
    <template v-if="estResponsable">
      <NuxtLink to="/resp/projets">Projets</NuxtLink>
      <NuxtLink to="/resp/utilisateurs">Utilisateurs</NuxtLink>
      <NuxtLink to="/resp/serveurs">Serveurs</NuxtLink>
      <NuxtLink to="/resp/dashboard">Tableau de bord</NuxtLink>
    </template>

    <!-- Menu du DEVELOPPEUR -->
    <template v-else>
      <NuxtLink to="/dev/contributions">Mes contributions</NuxtLink>
      <NuxtLink to="/dev/projets">Mes projets</NuxtLink>
      <NuxtLink to="/dev/recap">Mon temps</NuxtLink>
    </template>

    <div class="droite">
      <span>{{ utilisateur?.prenom }} {{ utilisateur?.nom }}</span>
      <button class="secondaire" @click="logout">Déconnexion</button>
    </div>
  </nav>

  <main class="contenu">
    <slot />
  </main>
</template>
