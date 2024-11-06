<script setup>
import { ref, computed } from 'vue'

// States
const url = ref('')
const campaign = ref('')
const medium = ref('')
const source = ref('')
const content = ref('')
const term = ref('')

const isCopied = ref(false)
const isCleared = ref(false)

let clientId = localStorage.getItem('clientId')

// Make UTM tags logic
const compParam = computed(() => { if (campaign.value == '') { return '' } else { if (url.value.includes('?')) { return '&' } else { return '?' } } })
const compCampaign = computed(() => { if (campaign.value == '') { return '' } else { return 'utm_campaign=' + campaign.value } })
const compMedium = computed(() => { if (medium.value == '') { return '' } else { return '&utm_medium=' + medium.value } })
const compSource = computed(() => { if (source.value == '') { return '' } else { return '&utm_source=' + source.value } })
const compContent = computed(() => { if (content.value == '') { return '' } else { return '&utm_content=' + content.value } })
const compTerm = computed(() => { if (term.value == '') { return '' } else { return '&utm_term=' + term.value } })
const compTags = computed(() => { return (compParam.value + compCampaign.value + compMedium.value + compSource.value + compContent.value + compTerm.value).replace(/\s+/g, '+').replace(/š/g, 's').replace(/ž/g, 'z').replace(/č/g, 'c').replace(/ć/g, 'c').replace(/_/g, '-').replace(/\./g, '-') })
const compTaggedUrl = computed(() => { return url.value + compTags.value })

// Text variables
defineProps({
  title: {
    type: String,
    required: true
  }
})

// Clear content
function clearAll() {
  url.value = ''
  campaign.value = ''
  medium.value = ''
  source.value = ''
  content.value = ''
  term.value = ''
  isCleared.value = true
  console.log('Text cleared')
  setTimeout(() => { isCleared.value = false }, 1000)
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
      console.error('Oops error:', err);
    }
  } else {
    console.error('Nothing to copy, no tagged URLs');
  }
}

</script>

<template>
  <h2>{{ title }}</h2>
  <div class="builder">
    <div class="row col-100">
      <label for="utm-url">Destination URL</label>
      <input type="text" v-model="url" id="utm-url">
    </div>
    <div class="row col-75">
      <label for="utm-campaign">Campaign name</label>
      <input type="text" v-model="campaign" id="utm-campaign" />
    </div>
    <div class="row col-25">
      <label for="utm-medium">Medium</label>
      <select v-model="medium" id="utm-medium">
        <option value="cpc">cpc</option>
        <option value="display">display</option>
        <option value="banner">banner</option>
        <option value="content-text">content-text</option>
        <option value="email">email</option>
        <option value="affiliate">affiliate</option>
        <option value="referral">referral</option>
        <option value="direct">direct</option>
        <option value="social">social</option>
      </select>
    </div>
    <div class="row col-33">
      <label for="utm-source">Source</label>
      <input type="text" v-model="source" id="utm-source" />
    </div>
    <div class="row col-33">
      <label for="utm-content">Content</label>
      <input type="text" v-model="content" id="utm-content" />
    </div>
    <div class="row col-33">
      <label for="utm-term">Term</label>
      <input type="text" v-model="term" id="utm-term" />
    </div>
    <!-- <input type="text" v-model="Content" placeholder="Campaign Name ..." /> -->
  </div>
  <hr>
  <div class="output-box">
    <div class="url-output">
      <p> {{ compTaggedUrl ? compTaggedUrl : 'Fill the fields above to make a tagged URL here ...' }} </p>
      <!-- add copy validation on the button -->
      <button @click="clearAll"> {{ isCleared ? 'Cleared!' : 'Clear' }} </button>
      <button @click="toClipboardAndSave"> {{ isCopied ? 'Copied!' : 'Copy' }} </button>
    </div>
  </div>
</template>

<style scoped>

.builder {
  display: flex;
  flex-wrap: wrap;
}

.row {
  display: flex;
  flex-direction: column;
  padding: 0 calc(var(--gutter-x)* .5);
  padding-bottom: calc(var(--gutter-y)* .5);
}

.col-100 {
  flex: 0 0 auto;
  width: 100%;
}

.col-75 {
  flex: 0 0 auto;
  width: 75%;
}

.col-50 {
  flex: 0 0 auto;
  width: 50%;
}

.col-33 {
  flex: 0 0 auto;
  width: 33.33%;
}

.col-25 {
  flex: 0 0 auto;
  width: 25%;
}

/* Responsive layout */
@media screen and (max-width: 480px) {
  .col-75, .col-50, .col-33, .col-25 {
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

.url-output {
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

.url-output p {
  box-sizing: border-box;
  width: 100%;
  margin-right: 0.75rem;

}

</style>
