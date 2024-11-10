import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useDefinitionsStore = defineStore('utm-definitions', () => {
  const mediumOptions = ref([
  { data: "cpc" },
  { data: "display" },
  { data: "banner" },
  { data: "content-text" },
  { data: "email" },
  { data: "affiliate" },
  { data: "referral" },
  { data: "direct" },
  { data: "social" }
])



  return { mediumOptions }
})
