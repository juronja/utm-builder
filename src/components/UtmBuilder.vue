<script setup>
import { ref, computed, onBeforeMount } from 'vue'
import { v4 as uuid } from 'uuid'

// States
const url = ref('') 
const campaign = ref('')
const medium = ref('')
const source = ref('')
const content = ref('')
const term = ref('')

const isCopied = ref(false)
const isCopiedRecent = ref(false)
const isCleared = ref(false)
const loadedUrls = ref([])
const tagState = ref('convention')



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

// Get URLs from DB
onBeforeMount( async () => {
  try {
    if (!clientId) {
      clientId = uuid()
      localStorage.setItem('clientId', clientId)
    }
    const response = await fetch(`api/users/${clientId}/get-tagged-urls`)
    const data = await response.json()
    loadedUrls.value = data
    console.log(loadedUrls.value)
  } catch(err) {
    console.log(err)
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

// Copy content
async function toClipboardOnly(li_text_value) {
  try {
    await navigator.clipboard.writeText(li_text_value)
    isCopiedRecent.value = true
    setTimeout(() => { isCopiedRecent.value = false }, 1000)
    console.log('Text copied!')
    console.log(li_text_value)
  } catch(err) {
    console.log('Cannot copy')
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
      console.error('Oops error:', err);
    }
  } else {
    console.error('Nothing to copy, no tagged URLs');
  }
}

</script>

<template>
  <h2>Make your URLs</h2>
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
      <div class="tag">
        <label for="utm-medium">Medium</label>
        <Transition mode="out-in" name="slide-up">
          <button v-if="tagState === 'convention'" @click="tagState = 'manual'" class="btn-tag">convention</button>
          <button v-else-if="tagState === 'manual'" @click="tagState = 'convention'" class="btn-tag">manual</button>
        </Transition>
      </div>
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
  <div>
    <h2>Recently tagged URLs</h2>
    <div class="recent-box">
      <div v-if="loadedUrls.length <= 0" class="url-recent">
        <p>No tagged URLs just yet, make some ...</p>
      </div>
      <ul v-if="loadedUrls.length > 0">
        <li v-for="item in loadedUrls" :key="item.taggedUrl">
          {{ item.taggedUrl }}
          <button @click="toClipboardOnly(item.taggedUrl)"> {{ isCopiedRecent ? 'Copied!' : 'Copy' }} </button>
        </li>
      </ul>
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
  padding-right: calc(var(--gutter-x)* .2);
  padding-left: calc(var(--gutter-x)* .2);
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

.tag {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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

.btn-copy {
  margin: 2rem 0 2rem 0;
  display: flex;
  justify-content: center;
}

.output-box {
  padding: 0 calc(var(--gutter-x)* .2);
}

.url-output {
  display: flex;
  align-items: center;
  min-height: 4rem;
  max-height: 8rem;
  overflow-x: auto; /* adds scrollbar */
  padding: var(--input-padding);
  margin-bottom: 3rem;
  color: var(--color-text);
  background-color: var(--color-black);
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
  font-size: 0.75rem;
}

.recent-box {
  padding: 0 calc(var(--gutter-x)* .2);
}

.url-recent {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 3rem;
  max-height: 6rem;
  padding: var(--input-padding);
  margin: 0.5rem 0 0 0;
  color: var(--color-text);
  background-color: var(--color-black);
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
  font-size: 0.75rem;
}

.url-recent-listing button {
  align-content: flex-start;
}

ul {
  list-style-type: none;
  padding: 0;
  font-size: 0.75rem;
  
}

ul li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 3rem;
  max-height: 6rem;
  overflow-x: auto; /* adds scrollbar */
  padding: var(--input-padding);
  margin: 0.5rem 0 0 0;
  color: var(--color-text);
  background-color: var(--color-black);
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
}

.url-output p {
  box-sizing: border-box;
  width: 100%;
  margin-right: 0.75rem;
  
}

</style>