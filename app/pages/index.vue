<script setup lang="ts">
  const { estResponsable } = useAuth()
  navigateTo(estResponsable.value ? '/resp/projets' : '/dev/contributions')
</script>

<template>
  <p>Chargement...</p>
</template>
