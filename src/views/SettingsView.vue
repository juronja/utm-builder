<script setup>
import { onBeforeMount } from 'vue'
import { useDefinitionsStore } from '@/stores/definitions'

const definitions = useDefinitionsStore()

// Get definitions on load
onBeforeMount( () => {
  definitions.getDefinitions()
})

</script>

<template>
  <h1>Settings</h1>
  <h2>Input definitions</h2>
  <div class="wrapper">
    <div class="column section-box placement-long">
      <h3>Placement Channels</h3>
      <div class="input-row">
        <input class="input-box-normal" v-model="definitions.inputDefPlacementLong" @keyup.enter="definitions.addDefinitionProperCase(definitions.inputDefPlacementLong, definitions.data.placementLongDefinitions); definitions.inputDefPlacementLong = ''" type="text" name="Add Placement Long Option" id="add-placement-long">
        <button class="add-item-normal margin-left" @click="definitions.addDefinitionProperCase(definitions.inputDefPlacementLong, definitions.data.placementLongDefinitions); definitions.inputDefPlacementLong = ''"><i class="bi bi-plus-circle-fill"></i> Add item</button>
      </div>
      <div class="definitions-row">
        <div v-if="definitions.isLoading">
          Loading definitions ...
        </div>
        <div v-else>
          <ul>
            <li v-for="item in definitions.data.placementLongDefinitions.sort()" :key="item">
              {{ item }}
              <span class="tag-del" @click="definitions.removeDefinition(item, definitions.data.placementLongDefinitions)">x</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="column section-box placement-short">
      <h3>Placement Channels Short</h3>
      <div class="input-row">
        <input class="input-box-normal" v-model="definitions.inputDefPlacementShort" @keyup.enter="definitions.addDefinitionUpperCase(definitions.inputDefPlacementShort, definitions.data.placementShortDefinitions); definitions.inputDefPlacementShort = ''" type="text" name="Add Placement Short Option" id="add-placement-short">
        <button class="add-item-normal margin-left" @click="definitions.addDefinitionUpperCase(definitions.inputDefPlacementShort, definitions.data.placementShortDefinitions); definitions.inputDefPlacementShort = ''"><i class="bi bi-plus-circle-fill"></i> Add item</button>
      </div>
      <div class="definitions-row">
        <div v-if="definitions.isLoading">
          Loading definitions ...
        </div>
        <div v-else>
          <ul>
            <li v-for="item in definitions.data.placementShortDefinitions.sort()" :key="item">
              {{ item }}
              <span class="tag-del" @click="definitions.removeDefinition(item, definitions.data.placementShortDefinitions)">x</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="column section-box medium">
      <h3>Medium</h3>
      <div>
        <div class="input-row">
          <input class="input-box-normal" v-model="definitions.inputDefMedium" @keyup.enter="definitions.addDefinition(definitions.inputDefMedium, definitions.data.mediumDefinitions); definitions.inputDefMedium = ''" type="text" name="Add Medium Option" id="add-medium">
          <button class="add-item-normal margin-left" @click="definitions.addDefinition(definitions.inputDefMedium, definitions.data.mediumDefinitions); definitions.inputDefMedium = ''"><i class="bi bi-plus-circle-fill"></i> Add item</button>
        </div>
        <div class="definitions-row">
          <div v-if="definitions.isLoading">
            Loading definitions ...
          </div>
          <div v-else>
            <ul>
              <li v-for="item in definitions.data.mediumDefinitions.sort()" :key="item">
                {{ item }}
                <span class="tag-del" @click="definitions.removeDefinition(item, definitions.data.mediumDefinitions)">x</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="column section-box source">
      <h3>Source</h3>
      <div class="input-row">
        <input class="input-box-normal" v-model="definitions.inputDefSource" @keyup.enter="definitions.addDefinition(definitions.inputDefSource, definitions.data.sourceDefinitions); definitions.inputDefSource = ''" type="text" name="Add Source Option" id="add-source">
        <button class="add-item-normal margin-left" @click="definitions.addDefinition(definitions.inputDefSource, definitions.data.sourceDefinitions); definitions.inputDefSource = ''"><i class="bi bi-plus-circle-fill"></i> Add item</button>
      </div>
      <div class="definitions-row">
        <div v-if="definitions.isLoading">
          Loading definitions ...
        </div>
        <div v-else>
          <ul>
            <li v-for="item in definitions.data.sourceDefinitions.sort()" :key="item">
              {{ item }}
              <span class="tag-del" @click="definitions.removeDefinition(item, definitions.data.sourceDefinitions)">x</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="column section-box campaign-type">
      <h3>Campaign Type</h3>
      <div class="input-row">
        <input class="input-box-normal" v-model="definitions.inputDefCampaignType" @keyup.enter="definitions.addDefinitionUpperCase(definitions.inputDefCampaignType, definitions.data.campaignTypeDefinitions); definitions.inputDefCampaignType = ''" type="text" name="Add Campaign Type Option" id="add-campaign-type">
        <button class="add-item-normal margin-left" @click="definitions.addDefinitionUpperCase(definitions.inputDefCampaignType, definitions.data.campaignTypeDefinitions); definitions.inputDefCampaignType = ''"><i class="bi bi-plus-circle-fill"></i> Add item</button>
      </div>
      <!-- <hr> -->
      <div class="definitions-row">
        <div v-if="definitions.isLoading">
          Loading definitions ...
        </div>
        <div v-else>
          <ul>
            <li v-for="item in definitions.data.campaignTypeDefinitions.sort()" :key="item">
              {{ item }}
              <span class="tag-del" @click="definitions.removeDefinition(item, definitions.data.campaignTypeDefinitions)">x</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="column section-box content-creative">
      <h3>Content Creative</h3>
      <div>
        <div class="input-row">
          <input class="input-box-normal" v-model="definitions.inputDefContentCreative" @keyup.enter="definitions.addDefinition(definitions.inputDefContentCreative, definitions.data.contentCreativesDefinitions); definitions.inputDefContentCreative = ''" type="text" name="Add Content Creative Option" id="add-content-creative">
          <button class="add-item-normal margin-left" @click="definitions.addDefinition(definitions.inputDefContentCreative, definitions.data.contentCreativesDefinitions); definitions.inputDefContentCreative = ''"><i class="bi bi-plus-circle-fill"></i> Add item</button>
        </div>
        <div class="definitions-row">
          <div v-if="definitions.isLoading">
            Loading definitions ...
          </div>
          <div v-else>
            <ul>
              <li v-for="item in definitions.data.contentCreativesDefinitions.sort()" :key="item">
                {{ item }}
                <span class="tag-del" @click="definitions.removeDefinition(item, definitions.data.contentCreativesDefinitions)">x</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="column section-box banner-size">
      <h3>Banner Size</h3>
      <div class="input-row">
        <input class="input-box-normal" v-model="definitions.inputDefBannerSize" @keyup.enter="definitions.addDefinition(definitions.inputDefBannerSize, definitions.data.bannerSizeDefinitions); definitions.inputDefBannerSize = ''" type="text" name="Add Banner Size Option" id="add-banner-size">
        <button class="add-item-normal margin-left" @click="definitions.addDefinition(definitions.inputDefBannerSize, definitions.data.bannerSizeDefinitions); definitions.inputDefBannerSize = ''"><i class="bi bi-plus-circle-fill"></i> Add item</button>
      </div>
      <div class="definitions-row">
        <div v-if="definitions.isLoading">
          Loading definitions ...
        </div>
        <div v-else>
          <ul>
            <li v-for="item in definitions.data.bannerSizeDefinitions.sort()" :key="item">
              {{ item }}
              <span class="tag-del" @click="definitions.removeDefinition(item, definitions.data.bannerSizeDefinitions)">x</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <h2 class="section-gap">Link definitions</h2>
  <div class="link-box section-box">
    <h3>Your links</h3>
    <div class="link-row">
      <p>IF</p>
      <div class="link-column">
        <label for="link-placement">Placement channel</label>
        <select v-model="definitions.inputLinkPlacementLong" id="link-placement">
          <option selected value></option>
          <option v-for="item in definitions.data.placementLongDefinitions" :key="item">
            {{ item }}
          </option>
        </select>
      </div>
      <p>THEN</p>
      <div class="link-column">
        <label for="link-placement-short">Short</label>
        <select v-model="definitions.inputLinkPlacementShort" id="link-placement-short">
          <option selected value></option>
          <option v-for="item in definitions.data.placementShortDefinitions" :key="item">
            {{ item }}
          </option>
        </select>
      </div>
      <div class="col">
        <i class="bi bi-link margin-left-right link-column"></i>
      </div>
      <div class="link-column">
        <label for="link-medium">Medium</label>
        <select v-model="definitions.inputLinkMedium" id="link-medium">
          <option selected value></option>
          <option v-for="item in definitions.data.mediumDefinitions" :key="item">
            {{ item }}
          </option>
        </select>
      </div>
      <div class="link-column col-30">
        <button class="add-item-link margin-left" @click="definitions.addLinkDefinition(definitions.compLinkDefinitionsId)"><i class="bi bi-plus-circle-fill"></i> Add item</button>
      </div>

    </div>
    <div class="link-definitions-row">
      <div v-if="definitions.isLoading">
        Loading definitions ...
      </div>
      <div v-else>
        <ul>
          <li v-for="item in definitions.data.linkDefinitions" :key="item">
            {{ item._id }}
            <span class="tag-del" @click="definitions.removeLinkDefinition(item)">x</span>
          </li>
        </ul>
      </div>
    </div>

  </div>
  <div class="save-btn section-gap">
    <button @click="definitions.saveDefinitions">{{ definitions.isSaved ? 'Saved!' : 'Save definitions' }}</button>
  </div>


</template>

<style scoped>

.wrapper {
  display: grid;
  grid-template-columns: auto auto auto;
  grid-auto-rows: auto;
  gap: 0.75rem;

  /* display: flex;
  flex-wrap: wrap;
  align-items: flex-start; */
}

/* Grid system */
.placement-long {
  grid-area: 1 / 1 / span 2 / span 1;
}

.placement-short {
  grid-area: 1 / 2 / span 1 / span 1;
}

.campaign-type {
  grid-area: 1 / 3 / span 1 / span 1;
}

.medium {
  grid-area: 2 / 2 / span 1 / span 1;
}

.source {
  grid-area: 2 / 3 / span 1 / span 1;
}

.content-creative {
  grid-area: 3 / 1 / span 1 / span 1;
}

.banner-size {
  grid-area: 3 / 2 / span 1 / span 1;
}


.column {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  flex: 0 0 auto;
  padding: calc(var(--gutter-x)* .5);
}

.link-box {
  padding: calc(var(--gutter-x)* .5);
}

.link-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-end;
  /* flex: 0 0 auto; */
}

.link-row p {
  font-size: 1.2rem;
  margin: 0 0.75rem;
  color: var(--color-primary);
}

.link-column {
  display: flex;
  flex-direction: column;
}

.link-bullet {
  padding-right: 0.75rem;
}

.bi-link {
  font-size: 2rem;
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
  margin: 0 0.5rem;
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

.link-definitions-row {
  font-size: 0.75rem;
  margin-top: 1rem;
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
  background-color: var(--color-input-background);
  border-radius: 0.25rem;
}

.tag-del {
  padding: 0.075rem 0.3rem;
  margin-left: 0.4rem;
  color: var(--color-danger);
  background-color: var(--color-section-background);
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
  width: 70%;
}

.add-item-normal {
  width: 35%;
}

.add-item-link {
  width: 35%;
}


/* Responsive layout */
@media screen and (max-width: 480px) {
  .wrapper {
    grid-template-columns: auto;
  }

  /* Grid system */
  .placement-long {
    grid-area: 1 / 1 / span 1 / span 1;
  }

  .placement-short {
    grid-area: 2 / 1 / span 1 / span 1;
  }

  .campaign-type {
    grid-area: 3 / 1 / span 1 / span 1;
  }

  .medium {
    grid-area: 4 / 1 / span 1 / span 1;
  }

  .source {
    grid-area: 5 / 1/ span 1 / span 1;
  }

  .content-creative {
    grid-area: 6 / 1 / span 1 / span 1;
  }

  .banner-size {
    grid-area: 7 / 1 / span 1 / span 1;
  }

  .margin-left-right {
    margin: 0 0.1rem;
  }

  .margin-left {
    margin-left: 0.3rem;
  }

  .input-box-normal {
    width: 60%;
  }

  .add-item-normal {
    width: 45%;
  }

  .link-row {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: flex-start;
  }

  .add-item-link {
    margin-top: 1.5rem;
    align-items: center;
    width: 100%;
  }


}


</style>
