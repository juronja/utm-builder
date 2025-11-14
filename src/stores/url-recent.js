import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useURLRecentStore = defineStore('url-recent', () => {
  let clientId = localStorage.getItem('clientId')
  const data = ref([])

  // Get recent urls
  async function getTaggedUrls() {
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
      console.error(err)
    }
  }


  return { data, getTaggedUrls, toClipboard }
})
