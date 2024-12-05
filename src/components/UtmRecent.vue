<script setup>
import { onBeforeMount } from 'vue'
import { useURLRecentStore } from '@/stores/url-recent'

// States
const recentUrls = useURLRecentStore()

onBeforeMount( () => {
  recentUrls.getTaggedUrls()
})

</script>

<template>
  <div>
    <h1>Recently copied URLs</h1>
    <div class="recent-box">
      <div v-if="recentUrls.data.length <= 0" class="url-recent">
        <p>No tagged URLs just yet, make some ...</p>
      </div>
      <ul v-else>
        <li v-for="(item, index) in recentUrls.data" :key="item._id">
          {{item.taggedUrl}}
          <button class="button" @click="recentUrls.toClipboard(item.taggedUrl, index)"> {{ item.isCopied ? 'Copied!' : 'Copy' }} </button>
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
