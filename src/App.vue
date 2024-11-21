<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue'
import { onBeforeMount } from 'vue'
import { v4 as uuid } from 'uuid'

let clientId = localStorage.getItem('clientId')

const tagState = ref('convention')


// Set ClientID
onBeforeMount( async () => {
  try {
    if (!clientId) {
      clientId = uuid()
      localStorage.setItem('clientId', clientId)
    }
  } catch(err) {
    console.error(err)
  }
})

</script>

<template>
  <header>
    <div class="logo">
      <img alt="UTM Builder logo" src="@/assets/logo.svg" width="300" height="45" />
    </div>
  <!-- <div class="navbar">
    <Transition mode="out-in" name="slide-up">
      <button v-if="tagState === 'convention'" @click="tagState = 'manual'" class="btn-tag">convention</button>
      <button v-else-if="tagState === 'manual'" @click="tagState = 'convention'" class="btn-tag">manual</button>
    </Transition>
    </div> -->
    <div class="navigation">
      <i alt="Menu" class="bi bi-list"></i>
      <nav>
        <RouterLink to="/manual" title="Manual">Manual</RouterLink>
        <RouterLink to="/guided" title="Guided">Guided</RouterLink>
        <RouterLink to="/settings" title="Settings"><i alt="Settings" class="bi bi-gear-fill"></i></RouterLink>
      </nav>
    </div>
  </header>
  <main>
    <RouterView />
  </main>
  <footer>
    <a href="https://github.com/juronja/utm-builder" target="_blank" class="github">GitHub <i class="bi bi-github"></i></a>
  </footer>
</template>

<style scoped>

.logo {
  display: flex;
  align-items: center;
  width: 60%;
}

.navigation {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 2rem;
  width: 40%;
}

.bi-list {
  display: none;
  padding: 0 1rem;
}

nav {
  display: flex;
  font-size: 1.25rem;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a:first-of-type {
  border: 0;
}

.github {
  background-color: grey;
  padding: calc(var(--gutter-x)* .1) calc(var(--gutter-x)* .3);
  color: var(--color-button-text);
  border-radius: 0.25rem;
  font-size: 0.75rem;
}

/* .tag {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
} */

/* Responsive layout */
@media screen and (max-width: 480px) {
  .logo {
    width: 80%;
  }

  .navigation {
    width: 20%;
  }

  nav {
    display: none;
  }

  .bi-list {
    display: flex;
  }

}


</style>
