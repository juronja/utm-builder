<script setup>
import { onBeforeMount } from 'vue'
import { useDefinitionsStore } from '@/stores/definitions'

const definitions = useDefinitionsStore()

onBeforeMount( () => {
  definitions.getDefinitions()
})

</script>

<template>
  <h2>Settings</h2>
  <div class="wrapper">
    <div class="column section-box placement">
      <h3>Placement channel pairs</h3>
      <div class="input-row multi-input">
        <div class="input-box-placement">
          <input class="input-col-60" v-model="definitions.inputPlacementLong" @keyup.enter="definitions.addPlacementDefinition(definitions.inputPlacementLong)" type="text" name="Add Placement Long Option" id="add-placement-long">
          <i class="bi bi-link margin-left-right"></i>
          <input class="input-col-30 margin-top" v-model="definitions.inputPlacementShort" @keyup.enter="definitions.addPlacementDefinition(definitions.inputPlacementShort)" type="text" name="Add Placement Short Option" id="add-placement-short">
        </div>
        <button class="add-item-placement margin-left" @click="definitions.addPlacementDefinition(definitions.inputPlacementLong, definitions.inputPlacementShort)"><i class="bi bi-plus-circle-fill"></i> Add item</button>
      </div>
      <!-- <hr> -->
      <div class="definitions-row">
        <div v-if="definitions.isLoading">
          Loading definitions ...
        </div>
        <div v-else>
          <ul>
            <li v-for="item in definitions.data[0].sourceDefinitions2.sort()" :key="item">
              {{ item }}
              <span class="tag-del" @click="definitions.removePlacementDefinition(item)">x</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="column section-box medium">
      <h3>Medium</h3>
      <div>
        <div class="input-row">
          <input class="input-box-normal" v-model="definitions.inputMedium" @keyup.enter="definitions.addMediumDefinition(definitions.inputMedium)" type="text" name="Add Medium Option" id="add-medium">
          <button class="add-item-normal margin-left" @click="definitions.addMediumDefinition(definitions.inputMedium)"><i class="bi bi-plus-circle-fill"></i> Add item</button>
        </div>
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
    </div>
    <div class="column section-box source">
      <h3>Source</h3>
      <div class="input-row">
        <input class="input-box-normal" v-model="definitions.inputSource" @keyup.enter="definitions.addSourceDefinition(definitions.inputSource)" type="text" name="Add Source Option" id="add-source">
        <button class="add-item-normal margin-left" @click="definitions.addSourceDefinition(definitions.inputSource)"><i class="bi bi-plus-circle-fill"></i> Add item</button>
      </div>
      <!-- <hr> -->
      <div class="definitions-row">
        <div v-if="definitions.isLoading">
          Loading definitions ...
        </div>
        <div v-else>
          <ul>
            <li v-for="item in definitions.data[0].sourceDefinitions.sort()" :key="item">
              {{ item }}
              <span class="tag-del" @click="definitions.removeSourceDefinition(item)">x</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <div class="save-btn section-gap">
    <button @click="definitions.saveDefinitions">{{ definitions.isSaved ? 'Saved!' : 'Save' }}</button>
  </div>

</template>

<style scoped>

.wrapper {
  display: grid;
  grid-template-columns: auto auto auto auto;
  grid-auto-rows: auto;
  gap: 0.75rem;

  /* display: flex;
  flex-wrap: wrap;
  align-items: flex-start; */
}

/* Grid system */
.placement {
  grid-area: 1 / 1 / span 2 / span 2;
}

.medium {
  grid-area: 1 / 3 / span 1 / span 1;
}

.source {
  grid-area: 2 / 3 / span 1 / span 1;
}


.column {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  flex: 0 0 auto;
  padding: calc(var(--gutter-x)* .5);
}

.input-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin: 0.25rem 0 0 0;
  min-height: 2.5rem;
}


.margin-left {
  margin-left: 0.5rem;
}

.margin-left-right {
  margin: 0 0.25rem;
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
}

input, select {
  padding: var(--input-padding);
  color: var(--color-input-text);
  background-color: var(--color-input-background);
  border: 0;
}

.input-box-normal {
  width: 80%;
}

.add-item-normal {
  width: 30%;
}

.input-box-placement {
  width: 84%;
}

.add-item-placement {
  width: 16%;
}

.input-col-60 {
  flex: 0 0 auto;
  width: 65%;
}

.input-col-30 {
  flex: 0 0 auto;
  width: 30%;
}


/* Responsive layout */
@media screen and (max-width: 480px) {
  .wrapper {
    grid-template-columns: auto;
  }

  .placement {
  grid-area: 1 / 1 / span 1 / span 1;
  }

  .medium {
    grid-area: 2 / 1 / span 1 / span 1;
  }

  .source {
    grid-area: 3 / 1 / span 1 / span 1;
  }

  .margin-left-right {
    margin: 0 0.1rem;
  }

  .margin-left {
    margin-left: 0.3rem;
  }


  .input-col-60 {
    flex: 0 0 auto;
    width: 60%;
  }

  .input-col-30 {
    flex: 0 0 auto;
    width: 30%;
  }

  .multi-input {
    display: flex;
    flex-direction: column;
  }

  .input-box-normal {
    width: 60%;
  }
  .add-item-normal {
    width: 45%;
  }

  .input-box-placement {
    /* display: flex;
    flex-direction: column; */
    width: 100%;
  }

  .add-item-placement {
    margin-top: 0.5rem;
    width: 100%;
  }

}


</style>
