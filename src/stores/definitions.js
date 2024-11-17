import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useDefinitionsStore = defineStore('utm-definitions', () => {
  let clientId = localStorage.getItem('clientId')
  const isSaved = ref(false)
  const isLoading = ref(false)

  // All definitions
  const data = ref([{
    mediumDefinitions : ["affiliate", "cpc", "display", "banner", "content-text", "email", "referral", "direct", "social"]

  }])

  // Add medium option to list (pinia)
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
    data.value[0].mediumDefinitions.push( normalizedItem )
  }

  // Get All Definitions
  async function getDefinitions() {
    isLoading.value = true
    try {
      const response = await fetch(`api/users/${clientId}/get-definitions`)
      data.value = await response.json()
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
    // Save for backend
    const payload = {
      mediumDefinitions: data.value[0].mediumDefinitions,
      clientId: clientId
    }

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

    return { data, isSaved, isLoading, saveDefinitions, getDefinitions, addMediumDefinition }
  })

