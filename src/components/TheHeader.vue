<script setup>
import { ref } from 'vue'

const tagState = ref('convention')

defineProps({
  h1_text: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="logoname">
    <!-- <i class="bi bi-link-45deg"></i> -->
    <img alt="UTM Builder logo" class="logo" src="@/assets/logo.svg" width="43" height="43" />
    <h1>{{ h1_text }}</h1>
  </div>
  <!-- <div class="navbar">
    <Transition mode="out-in" name="slide-up">
      <button v-if="tagState === 'convention'" @click="tagState = 'manual'" class="btn-tag">convention</button>
      <button v-else-if="tagState === 'manual'" @click="tagState = 'convention'" class="btn-tag">manual</button>
    </Transition>
  </div> -->
</template>

<style scoped>

.logoname {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  width: 65%;
}

.navbar {
  display: flex;
  justify-content: flex-end;
  width: 35%;
}


.tag {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

/* Responsive layout */
@media screen and (max-width: 480px) {
  .logoname {
    width: 80%;
  }
  .navbar {
    width: 20%;
  }
}

</style>
