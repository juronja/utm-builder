<script setup>
import { ref } from 'vue'
const url = ref('') 
const campaign = ref('')
const source = ref('')
const content = ref('')

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
    <!-- <input type="text" v-model="Content" placeholder="Campaign Name ..." /> -->
  </div>
  <div class="btn-big-center">
    <button>Tag 'em</button>
  </div>
  <hr>
  <div v-show="!dbHasEntries">
    <p>No tagged URLs just yet, go make some ...</p>
  </div>
  <div v-show="dbHasEntries" class="url-output">
    <p>{{ url }}{{ '?'.concat('utm_campaign=',campaign,'&utm_medium=',medium,'&utm_source=',source,'&utm_content=',content) }}</p>
    <button>Copy</button>
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
  padding: 0.375rem 0.75rem 0.375rem 0.75rem;
  margin: 0 0 0.5rem 0;
  color: var(--color-text);
  background-color: var(--color-black);
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
  font-size: 0.75rem;
}

.url-output p {
  margin-right: 0.75rem;
}

button {
  font-size: 1.2rem;
}

</style>

<script>
export default {
  data() {
    return {
      url: "",
      campaign: "",
      dbHasEntries: true
    }
  },
  methods: {
    makeUtmLinks() {
  
    }
  }
}
</script>