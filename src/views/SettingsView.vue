<script setup>
import UtmRecent from '@/components/UtmRecent.vue';
</script>

<template>
  <h2>Settings</h2>
  <h3>Definitions</h3>
    <div class="column">
      <label for="add-medium">Medium options</label>
      <input type="text" name="Add Medium Option" id="add-medium">
      <ol>
        <li>cpc</li>
        <li>display</li>
        <li>banner</li>
      </ol>
    </div>

</template>

<style scoped>

.column {
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
  width: 20%;

}



</style>
