import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useURLRecentStore = defineStore('url-recent', () => {
  const data = ref([])
  let clientId = localStorage.getItem('clientId')

  async function fetchTaggedUrls() {
    try {
      const response = await fetch(`api/users/${clientId}/get-tagged-urls`)
      data.value = await response.json()
    } catch(err) {
      console.log(err)
    }
  }

  return { data, fetchTaggedUrls }
})
