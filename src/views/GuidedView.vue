<script setup>
import { ref, computed, onBeforeMount } from 'vue'
import UtmRecent from '@/components/UtmRecent.vue'
import { useDefinitionsStore } from '@/stores/definitions';

// States
const definitions = useDefinitionsStore()

const isCopied = ref(false)
const isCleared = ref(false)

let clientId = localStorage.getItem('clientId')


const compTaggedUrl = computed(() => { return definitions.inputUrl + definitions.compParam + definitions.compTags })


// Clear content
function clearAll() {
  definitions.inputUrl = ''
  definitions.inputCampaignName = ''
  definitions.inputMedium = ''
  definitions.inputSource = ''
  definitions.inputContent = ''
  definitions.inputTerm = ''
  definitions.inputCampaignId = ''
  isCleared.value = true
  console.log('Text cleared')
  setTimeout(() => { isCleared.value = false }, 1000)
}

// Get definitions on load
onBeforeMount( () => {
  definitions.getDefinitions()
})


// Copy and save tagged URL
async function toClipboardAndSave() {
  if (!compTaggedUrl.value == 0) {
    try {
    navigator.clipboard.writeText(compTaggedUrl.value)
    isCopied.value = true
    setTimeout(() => { isCopied.value = false }, 1000)

    // Save for backend
    const payload = {
      taggedUrl: compTaggedUrl.value,
      clientId: clientId
    }
    await fetch(`api/users/${clientId}/save-tagged-url`, {
      method: 'POST', // Specify the HTTP method (POST in this case)
      body: JSON.stringify(payload),
      headers: {
       'Content-Type': 'application/json',
       'Accept': 'application/json'
      }
    })
    // return await response.json() // not sure if I need this return
    } catch(err) {
      console.error(err)
    }
  } else {
    console.error('Nothing to copy, no tagged URLs');
  }
}

</script>

<template>
  <div class="section-box">
      <h1>Guided tagging</h1>
    <div class="builder">
      <div class="row col-100">
        <label for="utm-url">Destination URL*</label>
        <input type="url" name="Destination URL" v-model="definitions.inputUrl" id="utm-url">
      </div>
      <div class="row col-40">
        <label for="utm-placement">Placement channel*</label>
        <select v-model="definitions.inputPlacementLong" id="utm-placement">
          <option selected value></option>
          <option v-for="item in definitions.data.placementLongDefinitions" :key="item">
            {{ item }}
          </option>
        </select>
      </div>
      <div class="row col-60">
        <label for="utm-campaign">Campaign name*</label>
        <input type="text" v-model="definitions.inputCampaignName" id="utm-campaign" />
      </div>
      <div class="row col-20">
        <label for="utm-campaign-type">Campaign Type</label>
        <select v-model="definitions.inputCampaignType" id="utm-campaign-type">
          <option selected value></option>
          <option v-for="item in definitions.data.campaignTypeDefinitions" :key="item">
            {{ item }}
          </option>
        </select>
      </div>
      <div class="row col-40">
        <label for="utm-source">Source*</label>
        <select v-model="definitions.inputSource" id="utm-source">
          <option selected value></option>
          <option v-for="item in definitions.data.sourceDefinitions" :key="item">
            {{ item }}
          </option>
        </select>
      </div>
      <div class="row col-20">
        <label for="utm-campaignId">Campaign ID</label>
        <input type="text" v-model="definitions.inputCampaignId" id="utm-campaignId" />
      </div>
      <div class="row col-20">
        <label for="utm-country">Country</label>
        <input type="text" v-model="definitions.inputCountry" id="utm-country" />
      </div>
      <div class="row col-50">
        <label for="utm-content">Content</label>
        <input type="text" v-model="definitions.inputContent" id="utm-content" />
      </div>
      <div class="row col-50">
        <label for="utm-term">Term</label>
        <input type="text" v-model="definitions.inputTerm" id="utm-term" />
      </div>
      <p>* Required</p>
    </div>
    <hr>
    <div class="output-box">
      <h2>Tagged URL</h2>
      <div class="output">
        <p> {{ compTaggedUrl ? compTaggedUrl : 'Fill the fields above to make a tagged URL here ...' }} </p>
        <!-- add copy validation on the button -->
        <button @click="clearAll"> {{ isCleared ? 'Cleared!' : 'Clear' }} </button>
        <button @click="toClipboardAndSave"> {{ isCopied ? 'Copied!' : 'Copy' }} </button>
      </div>
      <h2>Campaign name suggestion</h2>
      <div class="output">
        <p> {{ compTaggedUrl ? compPlacement : 'Fill the fields above to make a Campaign name suggestion ...' }} </p>
        <!-- add copy validation on the button -->
        <button @click="clearAll"> {{ isCleared ? 'Cleared!' : 'Clear' }} </button>
        <button @click="toClipboardAndSave"> {{ isCopied ? 'Copied!' : 'Copy' }} </button>
      </div>
    </div>
  </div>
  <div class="section-gap">
    <UtmRecent />
  </div>

</template>

<style scoped>

input, select {
  padding: var(--input-padding);
  margin: 0.25rem 0 0 0;
  min-height: 2.1rem;
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

button {
  margin: 0 0 0 0.5rem;
}

.section-box h1 {
  padding: 0 calc(var(--gutter-x)* .5);
}

.builder {
  display: flex;
  flex-wrap: wrap;
}

.builder p {
  display: block;
  font-size: 0.75rem;
  padding: 0 calc(var(--gutter-x)* .5);
}

.row {
  display: flex;
  flex-direction: column;
  padding: 0 calc(var(--gutter-x)* .5);
  padding-bottom: calc(var(--gutter-y)* .5);
}

/* Responsive layout */
@media screen and (max-width: 480px) {
  .col-50, .col-60, .col-40, .col-30, .col-20 {
    width: 100%;
    margin-top: 0;
  }
}

label {
  display: inline-block;
  padding: 0 calc(var(--gutter-x)* .1);
}

.output-box {
  padding: 0 calc(var(--gutter-x)* .5);
}

.output {
  display: flex;
  align-items: center;
  min-height: 4rem;
  max-height: 8rem;
  overflow-x: auto; /* adds scrollbar */
  padding: var(--input-padding);
  margin-bottom: 1rem;
  background-color: var(--color-input-background);
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
  font-size: 0.75rem;
}

.output p {
  box-sizing: border-box;
  width: 100%;
  margin-right: 0.75rem;

}

</style>
