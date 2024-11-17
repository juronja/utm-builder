<script setup>
import { ref, onBeforeMount } from 'vue'
import { useDefinitionsStore } from '@/stores/definitions'

const definitions = useDefinitionsStore()

onBeforeMount( () => {
  definitions.getDefinitions()
})

</script>

<template>
  <h2>Settings</h2>
  <div class="column section-box">
    <h3>Medium options</h3>
    <div class="input-row">
      <input v-model="definitions.input" @keyup.enter="definitions.addMediumDefinition(definitions.input)" type="text" name="Add Medium Option" id="add-medium">
      <button class="add-item" @click="definitions.addMediumDefinition(definitions.input)"><i class="bi bi-plus-circle-fill"></i> Add item</button>
    </div>
    <!-- <hr> -->
    <div class="definitions-row">
      <div v-if="definitions.isLoading">
        Loading definitions ...
      </div>
      <div v-else>
        <ul>
          <li v-for="item in definitions.data[0].mediumDefinitions.sort()" :key="item">
            {{ item }}
            <span class="tag-del" @click="definitions.removeMediumDefinition(item)">x</span>
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
  padding: calc(var(--gutter-x)* .5);
}

.input-row {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 0.25rem 0 0 0;
  min-height: 2.5rem;
}

.definitions-row {
  font-size: 0.75rem;
  margin-top: 1rem;
  /* min-height: 3rem; */
  /* max-height: 6rem; */
  /* overflow-y: auto; adds scrollbar */
  background-color: var(--color-input-background);
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
}

input, select {
  padding: var(--input-padding);
  color: var(--color-input-text);
  background-color: var(--color-input-background);
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
  font-size: 1rem;
  transition: 0.15s ease-in-out;
}

input:focus {
  color: var(--color-input-text);
  outline: 0;
  border-color: var(--color-border-hover);
  box-shadow: 0 0 0 .25rem var(--color-shadow-hover);
}

.add-item {
  margin: 0 0 0 0.75rem;
}

ul {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  align-content: flex-start;
  padding: 0.25rem;
}

ul li {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  padding: var(--tag-padding);
  margin: 0.2rem;
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

.tag-del:hover {
  cursor: pointer;
}


.save-btn {
  display: flex;
  justify-content: center;
  width: 100%;
}



input, select {
  padding: var(--input-padding);
  margin: ;
  color: var(--color-input-text);
  background-color: var(--color-input-background);
  border: 0;
}

/* Responsive layout */
@media screen and (max-width: 480px) {
  input, select {
    width: 60%;
  }
  .add-item {
    width: 40%;
  }
}


</style>
