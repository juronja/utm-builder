<script setup>
import { ref, onBeforeMount } from 'vue'

// States
const isCopiedRecent = ref(false)
const loadedUrls = ref([])

let clientId = localStorage.getItem('clientId')


// Get URLs from DB
onBeforeMount( async () => {
  try {
    const response = await fetch(`api/users/${clientId}/get-tagged-urls`)
    const data = await response.json()
    loadedUrls.value = data
  } catch(err) {
    console.log(err)
  }
})

// Copy content
async function toClipboardOnly(li_text_value) {
  try {
    await navigator.clipboard.writeText(li_text_value)
    isCopiedRecent.value = true
    setTimeout(() => { isCopiedRecent.value = false }, 1000)
    console.log('Text copied:', li_text_value)
  } catch(err) {
    console.log('Cannot copy')
  }
}

</script>

<template>
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

</style>