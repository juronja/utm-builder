<script setup>
import { RouterLink, RouterView } from 'vue-router'
import TheHeader from './components/TheHeader.vue'
import UtmBuilderManual from './components/UtmBuilderManual.vue'
import UtmRecent from './components/UtmRecent.vue'

import { onBeforeMount } from 'vue'
import { v4 as uuid } from 'uuid'

let clientId = localStorage.getItem('clientId')

// Set ClientID
onBeforeMount( async () => {
  try {
    if (!clientId) {
      clientId = uuid()
      localStorage.setItem('clientId', clientId)
    }
  } catch(err) {
    console.log(err)
  }
})

</script>

<template>
  <header>
    <TheHeader h1_text="UTM Builder"/>

    <nav>
        <RouterLink to="/">Manual</RouterLink>
        <RouterLink to="/advanced">Advanced</RouterLink>
        <RouterLink to="/settings">Settings</RouterLink>
    </nav>
  </header>
  <main>
    <UtmBuilderManual title="Tag URLs manually" />
    <UtmRecent title="Recently tagged URLs"/>
    <RouterView />
</main>
</template>

<style scoped>


</style>