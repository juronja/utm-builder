import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import countries from 'i18n-iso-countries'
import english from 'i18n-iso-countries/langs/en.json'

export const useDefinitionsStore = defineStore('utm-definitions', () => {
  let clientId = localStorage.getItem('clientId')
  const isSaved = ref(false)
  const isDataLoading = ref(false)

  // Countries
  countries.registerLocale(english)
  const countriesList = countries.getNames("en", {select: "official"})

  const compCountryShort = computed (() => {
    if (!isDataLoading.value) {
      const countryCode = Object.keys(countriesList).find(code => {
        return countriesList[code] === inputCountry.value
      })
      return countryCode ? `(${countryCode})` : ''
    }
    return ''
  })


  // const isDataError = ref('')

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


  // Required fields Validation
  const urlRequired = ref(false)
  const placementRequired = ref(false)
  const sourceRequired = ref(false)
  const campaignRequired = ref(false)


  function inputReq(item) {
    if (item === 'url' && inputUrl.value == 0) {
      console.error('This field is required')
      urlRequired.value = true
    }
    if (item === 'placement' && inputPlacementLong.value == 0) {
      console.error('This field is required')
      placementRequired.value = true
    }
    if (item === 'source' && inputSource.value == 0) {
      console.error('This field is required')
      sourceRequired.value = true
    }
    if (item === 'campaign' && inputCampaignName.value == 0) {
      console.error('This field is required')
      campaignRequired.value = true
    }
  }


  //********* COMPUTED **********//

  const compParam = computed(() => { if (compCampaign.value !== '') { if (inputUrl.value.includes('?')) { return '&' } else { return '?' } } else { return '' } })
  const compSource = computed(() => { if (inputSource.value == '') { return '' } else { return '&utm_source=' + inputSource.value } })
  const compContent = computed(() => { if (inputContent.value == '') { return '' } else { return '&utm_content=' + inputContent.value } })
  const compTerm = computed(() => { if (inputTerm.value == '') { return '' } else { return '&utm_term=' + inputTerm.value } })
  const compCampaignId = computed(() => { if (inputCampaignId.value == '') { return '' } else { return '&utm_id=' + inputCampaignId.value } })
  const compCampaignType = computed(() => { if (inputCampaignType.value == '') { return '' } else { return `(${inputCampaignType.value})` } })

  const compMedium = computed(() => {
    if (!isDataLoading.value) {
      const linkItem = data.value[0].definitions.link.find(item => item._id === inputPlacementLong.value)
      return linkItem ? '&utm_medium=' + linkItem.mappings.medium : ''
    }
    return ''
  })

  const compPlacementShort = computed (() => {
    if (!isDataLoading.value) {
      const linkItem = data.value[0].definitions.link.find(item => item._id === inputPlacementLong.value)
      return linkItem ? `${linkItem.mappings.short}` : ''
    }
    return ''
  })

  const compCampaign = computed(() => {
    if (inputPlacementLong.value == '' && inputCampaignName.value == '' && inputCampaignType.value == '' ) {
        return ''
      } else {
        return (`utm_campaign=${compPlacementShort.value} ` + `${compCountryShort.value} ` + (`${inputCampaignName.value}`)
        .replace(/š/g, 's')
        .replace(/ž/g, 'z')
        .replace(/č/g, 'c')
        .replace(/ć/g, 'c')
        .replace(/_/g, '-')
        .replace(/\//g, '-')
        .replace(/\\/g, '-')
        .replace(/\./g, '-')
        .toLowerCase() +
        (` ${compCampaignType.value}`))
        .replace(/\s+/g, '+')
      }
  })


  // UTM combined tags
  const compTags = computed(() => { return (compMedium.value + compSource.value + compContent.value + compTerm.value + compCampaignId.value)
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

  // Final Tagged URL
  const compTaggedUrl = computed(() => { return inputUrl.value + compParam.value + compCampaign.value + compTags.value })


  // Make Campaign Name suggestion logic for Guided Tab
  const compCampaignNameSuggestion = computed(() => {
    if (!inputPlacementLong.value == 0 || !inputCampaignName.value == 0 || !inputCampaignType.value == 0) {
      return (`${compPlacementShort.value} ${compCountryShort.value} ${inputCampaignName.value} ${compCampaignType.value}`)
    }
    return ''
  })


  // Link Definition logic for Settings when saving
  const compLinkDefinitionsName = computed(() => {
    if (inputLinkPlacementLong.value == 0 || inputLinkPlacementShort.value == 0 || inputLinkMedium.value == 0) {
      return ''
    } else {
      return (`${inputLinkPlacementLong.value} = (${inputLinkPlacementShort.value}), ${inputLinkMedium.value}`)
    }
  })


  //********* FUNCTIONS **********//


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
      definitions: data.value[0].definitions
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


  // Proper Case function
  function toProperCase(string) {
    return string.replace(/\w\S*/g, text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase())
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
      if (key.includes(normalizedItem)) {
        console.error('Item already exists: ', normalizedItem)
      } else {
        key.push( normalizedItem )
      }
    } else {
      console.error('Cannot add an empty item')
    }
  }

  // Add Proper Case definition
  function addDefinitionProperCase(newItem, key) {
    const normalizedItem = toProperCase(newItem)
    if (newItem.length !== 0) {
      if (key.includes(normalizedItem)) {
        console.error('Item already exists: ', normalizedItem)
      } else {
        key.push( normalizedItem )
      }
    } else {
      console.error('Cannot add an empty item')
    }

  }

  // Add Upper Case definition
  function addDefinitionUpperCase(newItem, key) {
    const normalizedItem = newItem.toUpperCase()
    if (newItem.length !== 0) {
      if (key.includes(normalizedItem)) {
        console.error('Item already exists: ', normalizedItem)
      } else {
        key.push( normalizedItem )
      }
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
  function addLinkDefinition(newItem) {
    const key = data.value[0].definitions.link
    // Add to list
    if (newItem.length !== 0) {
      if (key.some(item => item['combinedName'] === newItem)) {
        console.error('Item already exists: ', newItem)
      } else {
        key.push({
          _id: inputLinkPlacementLong.value,
          combinedName: newItem,
          mappings: {
            short: inputLinkPlacementShort.value,
            medium: inputLinkMedium.value
          }
        })
      }
    } else {
      console.error('Cannot add an empty item')
    }
    inputLinkPlacementLong.value = ''
    inputLinkPlacementShort.value = ''
    inputLinkMedium.value = ''

  }

  // Remove Link Definition
  function removeLinkDefinition(item) {
    const index = data.value[0].definitions.link.indexOf(item)
    if (index !== -1) {
      data.value[0].definitions.link.splice(index, 1)
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
    compTaggedUrl,
    compCampaignNameSuggestion,
    compLinkDefinitionsName,
    inputLinkPlacementLong,
    inputLinkPlacementShort,
    inputLinkMedium,
    saveDefinitions,
    getDefinitions,
    addDefinition,
    addDefinitionProperCase,
    addDefinitionUpperCase,
    removeDefinition,
    addLinkDefinition,
    removeLinkDefinition,
    urlRequired,
    placementRequired,
    sourceRequired,
    campaignRequired,
    inputReq,
    countriesList,
    compCountryShort
  }
})

