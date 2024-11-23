import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useDefinitionsStore } from '@/stores/definitions'

const definitions = useDefinitionsStore()

export const useLinkDefinitionsStore = defineStore('utm-link-definitions', () => {
  let clientId = localStorage.getItem('clientId')
  const isSaved = ref(false)
  const isLoading = ref(false)

  const inputLinkPlacementLong = ref('')
  const inputLinkPlacementShort = ref('')
  const inputLinkMedium = ref('')


  // Link Definitions
  const data = ref([])
  const dataDefault = ref([
    { _id: 'google-search-(s)-ppc', long: 'Google Search', short : '(S)', medium : 'ppc' },
    { _id: 'google-display-(gdn)-banner', long: 'Google Display', short : '(GDN)', medium : 'display' }
  ])


  // Make Name Syntax logic
  const compLinkDefinitionsId = computed(() => { return (`${inputLinkPlacementLong.value}-${inputLinkPlacementShort.value}-${inputLinkMedium.value}`).replace(/\s+/g, '-').toLowerCase() })


  // Save Link Definition
  async function saveLinkDefinition(newItem) {
    // Button text behavior
    isSaved.value = true
    setTimeout(() => { isSaved.value = false }, 1000)
    const payload = {
      _id: newItem,
      long: inputLinkPlacementLong.value,
      short: inputLinkPlacementShort.value,
      medium: inputLinkMedium.value,
      clientId: clientId
    }
    if (newItem.length !== 0) {
      data.value.push({
        _id: newItem
      })
    } else {
      console.error('Cannot add an empty item')
    }

    try {
    // Save to database
    await fetch(`api/users/${clientId}/save-link-definition`, {
      method: 'POST', // Specify the HTTP method (POST in this case)
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    // return await response.json() // not sure if I need this return
    } catch(err) {
      console.error(err)
    } finally {
      inputLinkPlacementLong.value = ''
      inputLinkPlacementShort.value = ''
      inputLinkMedium.value = ''
    }
  }

  // Remove Link Definition
  function removeLinkDefinition(item) {
    const index = data.value.indexOf(item)
    if (index !== -1) {
      data.value.splice(index, 1)
    }
  }



  // Get Link Definitions
  async function getLinkDefinitions() {
    isLoading.value = true
    try {
      // Get from database
      const response = await fetch(`api/users/${clientId}/get-link-definitions`)
      data.value = await response.json()
      // check if array empty
      if (data.value.length === 0) {
        data.value = dataDefault.value
      }
    } catch(err) {
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }



  return {
    data,
    isSaved,
    isLoading,
    inputLinkPlacementLong,
    inputLinkPlacementShort,
    inputLinkMedium,
    compLinkDefinitionsId,
    saveLinkDefinition,
    getLinkDefinitions,
    removeLinkDefinition
  }
})

