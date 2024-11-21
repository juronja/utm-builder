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

  function toProperCase(string) {
    return string.replace(/\w\S*/g, text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase())
  }

  // Link Definitions

  const linkDefinitionsDefault = ref([{
    linkDefinitions : ['affiliate', 'banner', 'content-text', 'cpc', 'direct', 'display', 'email', 'referral', 'social']
  }])


  // Make Name Syntax logic
  const compLinkDefinitions = computed(() => { return definitions.inputLinkPlacementLong + " 🔗 " + definitions.inputLinkPlacementShort + " " + definitions.inputLinkMedium })


  // Save Link Definitions
  async function saveLinkDefinitions() {
    // Button text behavior
    isSaved.value = true
    setTimeout(() => { isSaved.value = false }, 1000)

    try {
    const payload = {
      _id: 'all-link-definitions',
      linkDefinitions: data.value[0].linkDefinitions,
      clientId: clientId
    }
    // Save to database
    await fetch(`api/users/${clientId}/save-definitions`, {
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
    }
  }

    return {
      isSaved,
      isLoading,
      inputLinkPlacementLong,
      inputLinkPlacementShort,
      inputLinkMedium,
      compLinkDefinitions,
    }
  })

