<script setup>
import MainHeader from './components/MainHeader.vue'
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
    <MainHeader h1_text="UTM Builder App"/>
  </header>
  <main>
    <UtmBuilderManual />
    <UtmRecent />
  </main>
</template>

<style scoped>


</style>