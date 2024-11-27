import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {countries} from 'i18n-iso-countries'

export const useDefinitionsStore = defineStore('utm-definitions', () => {
  let clientId = localStorage.getItem('clientId')
  const isSaved = ref(false)
  const isDataLoading = ref(false)
  const isDataError = ref('')

  // Guided inputs
  const inputUrl = ref('')
  const inputCampaignName = ref('')
  const inputCampaignType = ref('')
  const inputCampaignId = ref('')
  const inputPlacementLong = ref('')
  const inputPlacementShort = ref('')
  const inputMedium = ref('')
  const inputSource = ref('')
  const inputContent = ref('')
  const inputTerm = ref('')
  const inputCountry = ref('')

  // Definition inputs
  const inputDefCampaignType = ref('')
  const inputDefPlacementLong = ref('')
  const inputDefPlacementShort = ref('')
  const inputDefMedium = ref('')
  const inputDefSource = ref('')
  const inputDefContentCreative = ref('')
  const inputDefBannerSize = ref('')

  const inputLinkPlacementLong = ref('')
  const inputLinkPlacementShort = ref('')
  const inputLinkMedium = ref('')

  // All definitions
  const data = ref({})


  function toProperCase(string) {
    return string.replace(/\w\S*/g, text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase())
  }

  // Make UTM tags logic for Guided Tab
  const compCampaign = computed(() => {
    if (inputPlacementLong.value == '' && inputCampaignName.value == '' && inputCampaignType.value == '' ) {
        return ''
      } else {
        if (inputCampaignType.value == '') {
          return 'utm_campaign=' + inputCampaignName.value
        } else {
          return `utm_campaign=${inputCampaignName.value} (${inputCampaignType.value})`
        }
      }
    })
  const compParam = computed(() => { if (compCampaign.value !== '') { if (inputUrl.value.includes('?')) { return '&' } else { return '?' } } else { return '' } })
  const compMedium = computed(() => { if (inputMedium.value == '') { return '' } else { return '&utm_medium=' + inputMedium.value } })

  const compSource = computed(() => { if (inputSource.value == '') { return '' } else { return '&utm_source=' + inputSource.value } })
  const compContent = computed(() => { if (inputContent.value == '') { return '' } else { return '&utm_content=' + inputContent.value } })
  const compTerm = computed(() => { if (inputTerm.value == '') { return '' } else { return '&utm_term=' + inputTerm.value } })
  const compCampaignId = computed(() => { if (inputCampaignId.value == '') { return '' } else { return '&utm_id=' + inputCampaignId.value } })

  const compTags = computed(() => { return (compCampaign.value + compMedium.value + compSource.value + compContent.value + compTerm.value + compCampaignId.value)
    .replace(/\s+/g, '+')
    .replace(/š/g, 's')
    .replace(/ž/g, 'z')
    .replace(/č/g, 'c')
    .replace(/ć/g, 'c')
    .replace(/_/g, '-')
    .replace(/\//g, '-')
    .replace(/\\/g, '-')
    .replace(/\./g, '-')
    .toLowerCase()
  })

  // Make Link Name Syntax logic
  const compLinkDefinitionsId = computed(() => {
    if (inputLinkPlacementLong.value == 0 || inputLinkPlacementShort.value == 0 || inputLinkMedium.value == 0) {
      return ''
    } else {
      return (`${inputLinkPlacementLong.value}-${inputLinkPlacementShort.value}-${inputLinkMedium.value}`).replace(/\s+/g, '-').toLowerCase()
    }
  })



  // Get All Definitions
  async function getDefinitions() {
    isDataLoading.value = true

    try {
      // Get data from database
      const response = await fetch(`api/users/${clientId}/get-definitions`)
      data.value = await response.json()

      // Validate IF response IS empty..
      if (data.value.length === 0) {
        // .. assign default values from json file instead
        const getDefinitionsFromFile = await fetch('/defaultDefinitions.json')
        data.value = await getDefinitionsFromFile.json()
      }
    } catch(error) {
      // isDataError.value = error.stringify() // Validation for errors oyu can use inside html
      console.error("Error fetching definitions:", error)
    } finally {
      isDataLoading.value = false
    }
  }

  // Save All Definitions
  async function saveDefinitions() {
    // Button text behavior
    isSaved.value = true
    setTimeout(() => { isSaved.value = false }, 1000)

    try {
    const payload = {
      _id: "userId",
      clientId: clientId,
      definitions: {
        placementLong: {
          items: data.value[0].definitions.placementLong.items,
          required: data.value[0].definitions.placementLong.required
        },
        placementShort: {
          items: data.value[0].definitions.placementShort.items,
          required: data.value[0].definitions.placementShort.required
        },
        medium: {
          items: data.value[0].definitions.medium.items,
          required: data.value[0].definitions.medium.required
        },
        source: {
          items: data.value[0].definitions.source.items,
          required: data.value[0].definitions.source.required
        },
        campaignType: {
          items: data.value[0].definitions.campaignType.items,
          required: data.value[0].definitions.campaignType.required
        },
        contentCreative: {
          items: data.value[0].definitions.contentCreative.items,
          required: data.value[0].definitions.contentCreative.required
        },
        bannerSize: {
          items: data.value[0].definitions.bannerSize.items,
          required: data.value[0].definitions.bannerSize.required
        },
        link: {
          items: data.value[0].definitions.link.items,
          required: data.value[0].definitions.link.required
        }
      }
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
    } catch(error) {
      console.error(error)
    }
  }

  // Add definition
  function addDefinition(newItem, key) {
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
      key.push( normalizedItem )
    } else {
      console.error('Cannot add an empty item')
    }
  }

  // Add Proper Case definition
  function addDefinitionProperCase(newItem, key) {
    const normalizedItem = toProperCase(newItem)
    if (newItem.length !== 0) {
      key.push( normalizedItem )
    } else {
      console.error('Cannot add an empty item')
    }

  }

  // Add Upper Case definition
  function addDefinitionUpperCase(newItem, key) {
    const normalizedItem = newItem.toUpperCase()
    if (newItem.length !== 0) {
      key.push( normalizedItem )
    } else {
      console.error('Cannot add an empty item')
    }

  }

  // Remove Definition
  function removeDefinition(item, key) {
    const index = key.indexOf(item)
    if (index !== -1) {
      key.splice(index, 1)
    }
  }

  // Add Link Definition
  async function addLinkDefinition(newItem) {

    // Add to list
    if (newItem.length !== 0) {
      data.value[0].definitions.link.items.push({
        _id: newItem,
        long: inputLinkPlacementLong.value,
        short: inputLinkPlacementShort.value,
        medium: inputLinkMedium.value,
        })
    } else {
      console.error('Cannot add an empty item')
    }
    inputLinkPlacementLong.value = ''
    inputLinkPlacementShort.value = ''
    inputLinkMedium.value = ''

  }

  // Remove Link Definition
  function removeLinkDefinition(item) {
    const index = data.value[0].definitions.link.items.indexOf(item)
    if (index !== -1) {
      data.value[0].definitions.link.items.splice(index, 1)
    }
  }


  return {
    data,
    isSaved,
    isDataLoading,
    inputUrl,
    inputPlacementLong,
    inputPlacementShort,
    inputCampaignName,
    inputCampaignId,
    inputCampaignType,
    inputMedium,
    inputSource,
    inputContent,
    inputTerm,
    inputCountry,
    inputDefCampaignType,
    inputDefPlacementLong,
    inputDefPlacementShort,
    inputDefMedium,
    inputDefSource,
    inputDefContentCreative,
    inputDefBannerSize,
    compParam,
    compTags,
    inputLinkPlacementLong,
    inputLinkPlacementShort,
    inputLinkMedium,
    compLinkDefinitionsId,
    saveDefinitions,
    getDefinitions,
    addDefinition,
    addDefinitionProperCase,
    addDefinitionUpperCase,
    removeDefinition,
    addLinkDefinition,
    removeLinkDefinition
  }
})

