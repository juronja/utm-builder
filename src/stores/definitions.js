import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useDefinitionsStore = defineStore('utm-definitions', () => {
  let clientId = localStorage.getItem('clientId')
  const isSaved = ref(false)
  const isLoading = ref(false)
  const inputPlacementLong = ref('')
  const inputPlacementShort = ref('')
  const inputMedium = ref('')
  const inputSource = ref('')

  function toProperCase(string) {
    return string.replace(/\w\S*/g, text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase())
  }


  // All definitions
  const data = ref([{ }])
  const dataDefault = ref([{
    mediumDefinitions : ['affiliate', 'banner', 'content-text', 'cpc', 'direct', 'display', 'email', 'referral', 'social'],
    placementDefinitions : ['Google Search', 'Google Banners', 'Google Gmail', 'Google YouTube', 'Facebook', 'Direct buy - banner', 'Direct buy - editorial', 'Email', 'Twitter', 'LinkedIn', 'Blog', 'Affiliate', 'Referral', 'Influencer', 'Offline print', 'Whitepaper', 'Retail', 'Facebook post', 'Instagram post', 'Twitter post', 'LinkedIn post', 'App'],
    sourceDefinitions : ['google', 'facebook', 'twitter', 'linkedin', 'editorial', 'print', 'pdf', 'package', 'instagram', 'app'],
    sourceDefinitions2 : ['google', 'facebook', 'twitter', 'linkedin', 'editorial', 'print', 'pdf', 'package', 'instagram', 'app']

  }])


  // Get All Definitions
  async function getDefinitions() {
    isLoading.value = true
    try {
      // Get from database
      const response = await fetch(`api/users/${clientId}/get-definitions`)
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

  // Save All Definitions
  async function saveDefinitions() {
    // Button text behavior
    isSaved.value = true
    setTimeout(() => { isSaved.value = false }, 1000)

    try {
    const payload = {
      mediumDefinitions: data.value[0].mediumDefinitions,
      placementDefinitions: data.value[0].placementDefinitions,
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


  // Add Placement definition to list (pinia)
  function addPlacementDefinition(longItem, shortItem) {
    const normalizedLongItem = toProperCase(longItem)
    const normalizedShortItem = shortItem.toUpperCase()
    data.value[0].sourceDefinitions2.push( normalizedLongItem, normalizedShortItem )
    inputPlacementLong.value = ''
    inputPlacementShort.value = ''

  }

  // Remove Placement definition from list (pinia)
  function removePlacementDefinition(item) {
    const index = data.value[0].placementDefinitions.indexOf(item)
    if (index !== -1) {
      data.value[0].placementDefinitions.splice(index, 1)
    }
  }

  // Add medium definition to list (pinia)
  function addMediumDefinition(newItem) {
    const normalizedItem = newItem
      .replace(/\s+/g, '-')
      .replace(/š/g, 's')
      .replace(/ž/g, 'z')
      .replace(/č/g, 'c')
      .replace(/ć/g, 'c')
      .replace(/_/g, '-')
      .replace(/\//g, '-')
      .replace(/\\/g, '-')
      .replace(/\./g, '-')
      .toLowerCase()
    if (newItem.length !== 0) {
      data.value[0].mediumDefinitions.push( normalizedItem )
      inputMedium.value = ''
    } else {
      console.error('Cannot add an empty item')
    }
  }

  // Remove medium definition from list (pinia)
  function removeMediumDefinition(item) {
    const index = data.value[0].mediumDefinitions.indexOf(item)
    if (index !== -1) {
      data.value[0].mediumDefinitions.splice(index, 1)
    }
  }

  // Add Source definition to list (pinia)
  function addSourceDefinition(newItem) {
    const normalizedItem = newItem
      .replace(/\s+/g, '-')
      .replace(/š/g, 's')
      .replace(/ž/g, 'z')
      .replace(/č/g, 'c')
      .replace(/ć/g, 'c')
      .replace(/_/g, '-')
      .replace(/\//g, '-')
      .replace(/\\/g, '-')
      .replace(/\./g, '-')
      .toLowerCase()
    if (newItem.length !== 0) {
      data.value[0].sourceDefinitions.push( normalizedItem )
      inputSource.value = ''
    } else {
      console.error('Cannot add an empty item')
    }

  }

  // Remove Source definition from list (pinia)
  function removeSourceDefinition(item) {
    const index = data.value[0].sourceDefinitions.indexOf(item)
    if (index !== -1) {
      data.value[0].sourceDefinitions.splice(index, 1)
    }
  }



    return {
      data,
      isSaved,
      isLoading,
      inputPlacementLong,
      inputPlacementShort,
      inputMedium,
      inputSource,
      saveDefinitions,
      getDefinitions,
      addMediumDefinition,
      removeMediumDefinition,
      addSourceDefinition,
      removeSourceDefinition,
      addPlacementDefinition,
      removePlacementDefinition
    }
  })

