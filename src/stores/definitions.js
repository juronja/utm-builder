import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useDefinitionsStore = defineStore('utm-definitions', () => {
  let clientId = localStorage.getItem('clientId')
  const isSaved = ref(false)
  const isLoading = ref(false)
  const input = ref('')

  // All definitions
  const data = ref([{ }])
  const dataDefault = ref([{
    mediumDefinitions : ["affiliate", "banner", "content-text", "cpc", "direct", "display",  "email", "referral", "social"]

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
    data.value[0].mediumDefinitions.push( normalizedItem )
    input.value = ''
  }

  // Remove medium definition from list (pinia)
  function removeMediumDefinition(item) {
    const index = data.value[0].mediumDefinitions.indexOf(item)
    if (index !== -1) {
      data.value[0].mediumDefinitions.splice(index, 1)
    }
  }


    return { data, isSaved, isLoading, input, saveDefinitions, getDefinitions, addMediumDefinition, removeMediumDefinition }
  })

