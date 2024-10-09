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
    <div class="btn-big-center">
      <button>Tag 'em</button>
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

.btn-big-center {
  margin: 2rem 0 2rem 0;
  display: flex;
  justify-content: center;
}

button {
  font-size: 1.2rem;
}

</style>