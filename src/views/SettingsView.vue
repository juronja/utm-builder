<script setup>
import { onBeforeMount, watchEffect } from 'vue'
import { useDefinitionsStore } from '@/stores/definitions'

const definitions = useDefinitionsStore()

// watchEffect(() => {
//   if (definitions.getDefinitions()) {
//     onBeforeMount( () => {
//       definitions.getDefinitions()
//       console.log(definitions.data)
//     })
//   }
// })

</script>

<template>
  <h2>Settings</h2>
  <h3>Medium options</h3>
  <div class="column section-box">
    <label for="add-medium">Add item</label>
    <div class="input-row">
      <input @keyup.enter="definitions.addMediumDefinition($event.target.value); $event.target.value = ''" type="text" name="Add Medium Option" id="add-medium">
      <span class="enter"><i class="bi bi-arrow-return-left"></i></span>
    </div>
    <hr>
    <div class="definitions-row">
      <div v-if="definitions.isLoading">
        Loading definitions ...
      </div>
      <div v-else>
        <ul>
          <li v-for="item in definitions.data[0].mediumDefinitions.sort()" :key="item">
            {{ item }}
            <span class="tag-del">x</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div class="save-btn section-gap">
    <button @click="definitions.saveDefinitions">{{ definitions.isSaved ? 'Saved!' : 'Save' }}</button>
  </div>

</template>

<style scoped>

.column {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  flex: 0 0 auto;
  width: 100%;

}

.input-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0.25rem 0 0 0;
  min-height: 2.1rem;
  color: var(--color-input-text);
  background-color: var(--color-input-background);
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
  font-size: 1rem;
  transition: 0.15s ease-in-out;
}

.definitions-row {
  padding: 0;
  font-size: 0.75rem;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  align-content: flex-start;
  /* min-height: 3rem; */
  /* max-height: 6rem; */
  /* overflow-y: auto; adds scrollbar */
  padding: 0.25rem;
  background-color: var(--color-input-background);
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
}

input, select {
  padding: var(--input-padding);
  color: var(--color-input-text);
  background-color: var(--color-input-background);
  border: 0;
}

input:focus {
  color: var(--color-input-text);
  outline: 0;
  border-color: var(--color-border-hover);
  /* box-shadow: 0 0 0 .25rem var(--color-shadow-hover); */
  border-radius: 0.25rem;
}

.enter {
  padding: 0rem 0.4rem;
}

ul {
  list-style-type: none;
  padding: 0;
  font-size: 0.75rem;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  align-content: flex-start;
  /* min-height: 3rem; */
  /* max-height: 6rem; */
  /* overflow-y: auto; adds scrollbar */
  padding: 0.25rem;
  background-color: var(--color-input-background);
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
}

ul li {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  padding: var(--tag-padding);
  margin: 2.5px;
  color: var(--color-button-text);
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;

}

.tag-del {
  padding: 0.075rem 0.3rem;
  margin-left: 0.4rem;
  background-color: var(--color-danger);
  border-radius: 0.25rem;
}

.save-btn {
  display: flex;
  justify-content: center;
  width: 100%;
}

</style>
