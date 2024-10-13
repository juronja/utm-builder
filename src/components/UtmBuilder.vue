<script setup>
import { ref, computed } from 'vue'

const url = ref('') 
const campaign = ref('')
const medium = ref('')
const source = ref('')
const content = ref('')
const term = ref('')

const dbHasEntries = ref(true)
const isCopied = ref(false)

// Make UTM tags logic
const compParam = computed(() => { if (campaign.value == '') { return '' } else { if (url.value.includes('?')) { return '&' } else { return '?' } } })
const compCampaign = computed(() => { if (campaign.value == '') { return '' } else { return 'utm_campaign=' + campaign.value } })
const compMedium = computed(() => { if (medium.value == '') { return '' } else { return '&utm_medium=' + medium.value } })
const compSource = computed(() => { if (source.value == '') { return '' } else { return '&utm_source=' + source.value } })
const compContent = computed(() => { if (content.value == '') { return '' } else { return '&utm_content=' + content.value } })
const compTerm = computed(() => { if (term.value == '') { return '' } else { return '&utm_term=' + term.value } })
const taggedUrl = computed(() => { return url.value + compParam.value + compCampaign.value + compMedium.value + compSource.value + compContent.value + compTerm.value })

// Copy and save tagged URL
function copyToClipboard() {
  navigator.clipboard.writeText(taggedUrl.value)
  .then(() => {
      console.log('Text copied to clipboard');
      isCopied.value = true
      setTimeout(() => {
        isCopied.value = false
      }, 1000 )
    })
    .catch(err => {
      console.error('Failed to copy text:', err);
    })
}

defineProps({
  h1_text: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="builder">
    <input type="text" v-model="url" placeholder="URL ..." id="url"><br />
    <input type="text" v-model="campaign" placeholder="Campaign Name ..." />
    <select id="utm-medium" v-model="medium">
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
    <input type="text" v-model="source" placeholder="Source ..." />
    <input type="text" v-model="content" placeholder="Content ..." />
    <input type="text" v-model="term" placeholder="Term ..." />
    <!-- <input type="text" v-model="Content" placeholder="Campaign Name ..." /> -->
  </div>
  <div class="btn-big-center">
    <!--<button>Tag 'em</button>-->
  </div>
  <hr>
  <div v-show="!dbHasEntries" class="url-output">
    <p>No tagged URLs just yet, fill the fields above ...</p>
  </div>
  <div v-show="dbHasEntries" class="url-output">
    <p>{{ taggedUrl }}</p>
    <button @click="copyToClipboard"> {{ isCopied ? 'Copied!' : 'Copy' }} </button>
  </div>
</template>

<style scoped>

#url {
  width: 100%;
}

.builder {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.btn-big-center {
  margin: 2rem 0 2rem 0;
  display: flex;
  justify-content: center;
}

.url-output {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 4rem;
  max-height: 8rem;
  overflow-y: auto; /* adds scrollbar */
  padding: 0.375rem 0.75rem 0.375rem 0.75rem;
  margin: 0 0 0.5rem 0;
  color: var(--color-text);
  background-color: var(--color-black);
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
  font-size: 0.75rem;
}

.url-output p {
  box-sizing: border-box;
  width: 100%;
  margin-right: 0.75rem;
  
}

button {
  font-size: 1.2rem;
}

</style>