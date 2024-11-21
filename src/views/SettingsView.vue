<script setup>
import { onBeforeMount } from 'vue'
import { useDefinitionsStore } from '@/stores/definitions'
import { useLinkDefinitionsStore } from '@/stores/definitions-link';

const definitions = useDefinitionsStore()
const linkDefinitions = useLinkDefinitionsStore()

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
        <input class="input-box-normal" v-model="definitions.inputPlacementLong" @keyup.enter="definitions.addPlacementLongDefinition(definitions.inputPlacementLong)" type="text" name="Add Placement Long Option" id="add-placement-long">
        <button class="add-item-normal margin-left" @click="definitions.addPlacementLongDefinition(definitions.inputPlacementLong)"><i class="bi bi-plus-circle-fill"></i> Add item</button>
      </div>
      <div class="definitions-row">
        <div v-if="definitions.isLoading">
          Loading definitions ...
        </div>
        <div v-else>
          <ul>
            <li v-for="item in definitions.data[0].placementLongDefinitions.sort()" :key="item">
              {{ item }}
              <span class="tag-del" @click="definitions.removePlacementLongDefinition(item)">x</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="column section-box placement-short">
      <h3>Placement Channels Short</h3>
      <div class="input-row">
        <input class="input-box-normal" v-model="definitions.inputPlacementShort" @keyup.enter="definitions.addPlacementShortDefinition(definitions.inputPlacementShort)" type="text" name="Add Placement Short Option" id="add-placement-short">
        <button class="add-item-normal margin-left" @click="definitions.addPlacementShortDefinition(definitions.inputPlacementShort)"><i class="bi bi-plus-circle-fill"></i> Add item</button>
      </div>
      <div class="definitions-row">
        <div v-if="definitions.isLoading">
          Loading definitions ...
        </div>
        <div v-else>
          <ul>
            <li v-for="item in definitions.data[0].placementShortDefinitions.sort()" :key="item">
              {{ item }}
              <span class="tag-del" @click="definitions.removePlacementShortDefinition(item)">x</span>
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
    <div class="column section-box campaign-type">
      <h3>Campaign Type</h3>
      <div class="input-row">
        <input class="input-box-normal" v-model="definitions.inputCampaignType" @keyup.enter="definitions.addCampaignTypeDefinition(definitions.inputCampaignType)" type="text" name="Add Campaign Type Option" id="add-campaign-type">
        <button class="add-item-normal margin-left" @click="definitions.addCampaignTypeDefinition(definitions.inputCampaignType)"><i class="bi bi-plus-circle-fill"></i> Add item</button>
      </div>
      <!-- <hr> -->
      <div class="definitions-row">
        <div v-if="definitions.isLoading">
          Loading definitions ...
        </div>
        <div v-else>
          <ul>
            <li v-for="item in definitions.data[0].campaignTypeDefinitions.sort()" :key="item">
              {{ item }}
              <span class="tag-del" @click="definitions.removeCampaignTypeDefinition(item)">x</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="column section-box content-creative">
      <h3>Content Creative</h3>
      <div>
        <div class="input-row">
          <input class="input-box-normal" v-model="definitions.inputContentCreative" @keyup.enter="definitions.addContentCreativeDefinition(definitions.inputContentCreative)" type="text" name="Add Content Creative Option" id="add-content-creative">
          <button class="add-item-normal margin-left" @click="definitions.addContentCreativeDefinition(definitions.inputContentCreative)"><i class="bi bi-plus-circle-fill"></i> Add item</button>
        </div>
        <div class="definitions-row">
          <div v-if="definitions.isLoading">
            Loading definitions ...
          </div>
          <div v-else>
            <ul>
              <li v-for="item in definitions.data[0].contentCreativesDefinitions.sort()" :key="item">
                {{ item }}
                <span class="tag-del" @click="definitions.removeContentCreativeDefinition(item)">x</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="column section-box banner-size">
      <h3>Banner Size</h3>
      <div class="input-row">
        <input class="input-box-normal" v-model="definitions.inputBannerSize" @keyup.enter="definitions.addBannerSizeDefinition(definitions.inputBannerSize)" type="text" name="Add Banner Size Option" id="add-banner-size">
        <button class="add-item-normal margin-left" @click="definitions.addBannerSizeDefinition(definitions.inputBannerSize)"><i class="bi bi-plus-circle-fill"></i> Add item</button>
      </div>
      <div class="definitions-row">
        <div v-if="definitions.isLoading">
          Loading definitions ...
        </div>
        <div v-else>
          <ul>
            <li v-for="item in definitions.data[0].bannerSizeDefinitions.sort()" :key="item">
              {{ item }}
              <span class="tag-del" @click="definitions.removeBannerSizeDefinition(item)">x</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <div class="save-btn section-gap">
    <button @click="definitions.saveDefinitions">{{ definitions.isSaved ? 'Saved!' : 'Save definitions' }}</button>
  </div>
  <h2 class="section-gap">Link definitions</h2>
  <div class="link-box section-box">
    <h3>Your links</h3>
    <div class="link-row">
      <div class="link-column ">
        <label for="link-placement">Placement channel</label>
        <select v-model="linkDefinitions.inputLinkPlacementLong" id="link-placement">
          <option v-for="item in definitions.data[0].placementLongDefinitions" :key="item">
            {{ item }}
          </option>
        </select>
      </div>
      <div>
        <i class="bi bi-link margin-left-right link-column"></i>
      </div>
      <div class="link-column">
        <label for="link-placement-short">Placement channel short</label>
        <select v-model="linkDefinitions.inputLinkPlacementShort" id="link-placement-short">
          <option v-for="item in definitions.data[0].placementShortDefinitions" :key="item">
            {{ item }}
          </option>
        </select>
      </div>
      <div>
        <i class="bi bi-link margin-left-right link-column"></i>
      </div>
      <div class="link-column">
        <label for="link-medium">Medium</label>
        <select v-model="linkDefinitions.inputLinkMedium" id="link-medium">
          <option v-for="item in definitions.data[0].mediumDefinitions" :key="item">
            {{ item }}
          </option>
        </select>
      </div>
      <div class="link-column">
        <button class="add-item-normal margin-left" @click="definitions.addBannerSizeDefinition(definitions.inputBannerSize)"><i class="bi bi-plus-circle-fill"></i> Add item</button>
      </div>

    </div>
    <div>{{ linkDefinitions.compLinkDefinitions }}</div>
    <div class="link-definitions-row">
      <div v-if="linkDefinitions.isLoading">
        Loading definitions ...
      </div>
      <div v-else>
        <ul>
          <li v-for="item in definitions.data[0].bannerSizeDefinitions.sort()" :key="item">
            {{ item }}
            <span class="tag-del" @click="definitions.removeBannerSizeDefinition(item)">x</span>
          </li>
        </ul>
      </div>
    </div>

  </div>
  <div class="save-btn section-gap">
    <button @click="definitions.saveDefinitions">{{ linkDefinitions.isSaved ? 'Saved!' : 'Save links' }}</button>
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

.link-definitions-row {
  /* font-size: 0.75rem; */
  margin-top: 1rem;
  /* background-color: var(--color-input-background);
  border: 1px solid var(--color-border);
  border-radius: 0.25rem; */
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

  .input-box-normal {
    width: 60%;
  }
  .add-item-normal {
    width: 45%;
  }

}


</style>
