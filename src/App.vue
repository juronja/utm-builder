<script setup>
import MainHeader from './components/MainHeader.vue'
</script>

<template>
  <header>
    <MainHeader />
  </header>
  <main>
    <div class="builder">
      <input type="text" id="url" placeholder="URL ..." /><br />
      <input type="text" placeholder="Campaign Name ..." />
      <input type="text" placeholder="Medium ..." />
      <input type="text" placeholder="Source ..." />
      <input type="text" placeholder="Content ..." />
      <!-- <input type="text" v-model="Content" placeholder="Campaign Name ..." /> -->
    </div>
  </main>
</template>

<style scoped>



#url {
  width: 100%;
}

.builder {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
</style>