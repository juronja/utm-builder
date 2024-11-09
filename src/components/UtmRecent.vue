<script setup>
import { ref, onBeforeMount } from 'vue'
import { useURLRecentStore } from '@/stores/url-recent'

// States
const recentUrls = useURLRecentStore()
const data = ref([])

const test = ref([{ Urlz: 1 }, { Urlz: 2 }, { Urlz: 'tres' }, { Urlz: 4 }, { Urlz: 5 }])
test.value[2].isLol = true
const test2 = test.value[2]

let clientId = localStorage.getItem('clientId')


// Get URLs from DB
onBeforeMount( async () => {
  try {
    const response = await fetch(`api/users/${clientId}/get-tagged-urls`)
    data.value = await response.json()
  } catch(err) {
    console.log(err)
  }
})

// Copy content
async function toClipboardOnly(item, index) {
  try {
    await navigator.clipboard.writeText(item)
    data.value[index].isCopied = true
    setTimeout(() => { data.value[index].isCopied = false }, 1000)
    console.log('Text copied:', item)
  } catch(err) {
    console.log('Cannot copy', err)
  }
}

</script>

<template>
  <div>
    <h2>Recently tagged URLs</h2>
    {{ test2.isLol ? 'Copied!' : 'Copy' }}
    <div class="recent-box">
      <div v-if="data.length <= 0" class="url-recent">
        <p>No tagged URLs just yet, make some ...</p>
      </div>
      <ul v-if="data.length > 0">
        <li v-for="(item, index) in data" :key="item._id">
          {{item.taggedUrl}}
          <button @click="toClipboardOnly(item.taggedUrl, index)"> {{ item.isCopied ? 'Copied!' : 'Copy' }} </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>

/* .recent-box {
  padding: 0 calc(var(--gutter-x)* .2);
} */

.url-recent {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 3rem;
  max-height: 6rem;
  padding: var(--input-padding);
  margin: 0.5rem 0 0 0;
  background-color: var(--color-input-background);
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
  background-color: var(--color-input-background);
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
}

</style>
