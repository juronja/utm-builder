<script setup>
defineProps({
  h1_text: {
    type: String,
    required: true
  }
})
</script>

<template>
    <!-- <img alt="UTM builder logo" class="logo" src="@/assets/logo.svg" width="50" height="50" /> -->
    <h1>{{ h1_text }}</h1>
</template>

<style scoped>

.logo {
    margin-right: 1rem;
}
</style>
