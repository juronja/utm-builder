<script setup>
import { ref, computed } from 'vue'
import UtmRecent from '@/components/UtmRecent.vue';
import { useDefinitionsStore } from '@/stores/definitions'

// States
const store = useDefinitionsStore()
let clientId = localStorage.getItem('clientId')

const isCopied = ref(false)
const isCleared = ref(false)


// Make UTM tags logic
const compParam = computed(() => { if (store.inputManCampaign == '') { return '' } else { if (store.inputManUrl.includes('?')) { return '&' } else { return '?' } } })
const compCampaign = computed(() => { if (store.inputManCampaign == '') { return '' } else { return 'utm_campaign=' + store.inputManCampaign } })
const compMedium = computed(() => { if (store.inputManMedium == '') { return '' } else { return '&utm_medium=' + store.inputManMedium } })
const compSource = computed(() => { if (store.inputManSource == '') { return '' } else { return '&utm_source=' + store.inputManSource } })
const compContent = computed(() => { if (store.inputManContent == '') { return '' } else { return '&utm_content=' + store.inputManContent } })
const compTerm = computed(() => { if (store.inputManTerm == '') { return '' } else { return '&utm_term=' + store.inputManTerm } })
const compCampaignId = computed(() => { if (store.inputManCampaignId == '') { return '' } else { return '&utm_id=' + store.inputManCampaignId } })
const compTags = computed(() => { return (compParam.value + compCampaign.value + compMedium.value + compSource.value + compContent.value + compTerm.value + compCampaignId.value)
  .replace(/\s+/g, '+')
  .replace(/š/g, 's')
  .replace(/ž/g, 'z')
  .replace(/č/g, 'c')
  .replace(/ć/g, 'c')
  .replace(/_/g, '-')
  .replace(/\//g, '-')
  .replace(/\\/g, '-')
  .replace(/\./g, '-')
  .toLowerCase()
})
const compTaggedUrl = computed(() => { return store.inputManUrl + compTags.value })


// Clear content
function clearAll() {
  store.inputManUrl = ''
  store.inputManCampaign = ''
  store.inputManMedium = ''
  store.inputManSource = ''
  store.inputManContent = ''
  store.inputManTerm = ''
  store.inputManCampaignId = ''
  isCleared.value = true
  setTimeout(() => { isCleared.value = false }, 1000)
}

function inputReq(item) {
    if (item === 'url' && store.inputManUrl == 0) {
      console.error('This field is required')
      store.urlRequired = true
    }
    if (item === 'source' && store.inputManSource == 0) {
      console.error('This field is required')
      store.sourceRequired = true
    }
    if (item === 'campaign' && store.inputManCampaign == 0) {
      console.error('This field is required')
      store.campaignRequired = true
    }
    if (item === 'medium' && store.inputManMedium == 0) {
      console.error('This field is required')
      store.mediumRequired = true
    }
  }


// Copy and save tagged URL
async function toClipboardAndSave() {
  if (!compTaggedUrl.value == 0) {
    try {
    navigator.clipboard.writeText(compTaggedUrl.value)
    console.log('Text copied to clipboard')
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
      <h1>Manual tagging</h1>
    <div class="builder">
      <div class="row col-100">
        <label for="utm-url">Destination URL*</label>
        <input @blur="inputReq('url')" type="url" name="Destination URL" v-model="store.inputManUrl" id="utm-url">
        <div v-if="store.urlRequired" class="input-req-validation">This field is required</div>
      </div>
      <div class="row col-40">
        <label for="utm-campaign">Campaign name*</label>
        <input @blur="inputReq('campaign')" type="text" v-model="store.inputManCampaign" id="utm-campaign" />
        <div v-if="store.campaignRequired" class="input-req-validation">This field is required</div>
      </div>
      <div class="row col-20">
        <label for="utm-medium">Medium*</label>
        <input @blur="inputReq('medium')" type="text" v-model="store.inputManMedium" id="utm-medium" />
        <div v-if="store.mediumRequired" class="input-req-validation">This field is required</div>
      </div>
      <div class="row col-40">
        <label for="utm-source">Source*</label>
        <input @blur="inputReq('source')" type="text" v-model="store.inputManSource" id="utm-source" />
        <div v-if="store.sourceRequired" class="input-req-validation">This field is required</div>
      </div>
      <div class="row col-40">
        <label for="utm-content">Content</label>
        <input type="text" v-model="store.inputManContent" id="utm-content" />
      </div>
      <div class="row col-30">
        <label for="utm-term">Term</label>
        <input type="text" v-model="store.inputManTerm" id="utm-term" />
      </div>
      <div class="row col-30">
        <label for="utm-campaignId">Campaign ID</label>
        <input type="text" v-model="store.inputManCampaignId" id="utm-campaignId" />
      </div>
      <p>* Required</p>
    </div>
    <hr>
    <div class="output-box">
      <div class="output">
        <p> {{ compTaggedUrl ? compTaggedUrl : 'Fill the fields above to make a tagged URL here ...' }} </p>
        <!-- add copy validation on the button -->
        <button class="button" @click="clearAll"> {{ isCleared ? 'Cleared!' : 'Clear' }} </button>
        <button class="button" @click="toClipboardAndSave"> {{ isCopied ? 'Copied!' : 'Copy' }} </button>
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

.section-box {
  padding: 0.1rem 0;
  background-color: var(--color-section-background);
  border-radius: 0.25rem;
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
  .col-50, .col-40, .col-30, .col-20 {
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
