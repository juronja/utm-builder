import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useURLRecentStore = defineStore('url-recent', () => {
  const data = ref([])
  let clientId = localStorage.getItem('clientId')

  // Fetch recent urls
  async function fetchTaggedUrls() {
    try {
      const response = await fetch(`api/users/${clientId}/get-tagged-urls`)
      data.value = await response.json()
    } catch(err) {
      console.log(err)
    }
  }

  // Copy li content
  async function toClipboard(item, index) {
    try {
      await navigator.clipboard.writeText(item)
      data.value[index].isCopied = true
      setTimeout(() => { data.value[index].isCopied = false }, 1000)
      console.log('Text copied:', item)
    } catch(err) {
      console.log('Cannot copy', err)
    }
  }


  return { data, fetchTaggedUrls, toClipboard }
})
