<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue'
import { onBeforeMount } from 'vue'
import { v4 as uuid } from 'uuid'

let clientId = localStorage.getItem('clientId')
const navOpen = ref(false)


// Set client ID on load
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

function navIsOpen() {
  navOpen.value = !navOpen.value
}


</script>

<template>
  <header>
    <div class="logo">
      <img alt="UTM Builder logo" src="@/assets/logo.svg" width="300" height="45" />
    </div>
    <div class="navigation">
        <Transition mode="out-in">
        <button v-if="navOpen === false" class="hamburger" @click="navIsOpen" type="button">
          <span class="hamburger-box">
            <span class="hamburger-inner"></span>
          </span>
        </button>
        <button v-else-if="navOpen === true" class="hamburger is-active" @click="navIsOpen" type="button">
          <span class="hamburger-box">
            <span class="hamburger-inner"></span>
          </span>
        </button>
        </Transition>
      <nav class="nav-desktop">
        <RouterLink to="/manual" title="Manual">Manual</RouterLink>
        <RouterLink to="/guided" title="Guided">Guided</RouterLink>
        <RouterLink to="/settings" title="Settings"><i alt="Settings" class="bi bi-gear-fill"></i></RouterLink>
      </nav>
    </div>
    <div v-if="navOpen" class="nav-overlay">
      <nav class="nav-mobile">
        <RouterLink to="/manual" title="Manual" @click="navIsOpen">Manual</RouterLink>
        <RouterLink to="/guided" title="Guided" @click="navIsOpen">Guided</RouterLink>
        <RouterLink to="/settings" title="Settings" @click="navIsOpen"><i alt="Settings" class="bi bi-gear-fill"></i></RouterLink>
      </nav>
    </div>
  </header>
  <main v-if="!navOpen">
    <RouterView />
  </main>
  <footer v-if="!navOpen">
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

.hamburger {
  display: none;
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

.nav-desktop {
  display: flex;
  font-size: 1.25rem;
}

.nav-desktop a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

.nav-desktop a:first-of-type {
  border: 0;
}

.nav-mobile {
  display: none;
}
.github {
  background-color: grey;
  padding: calc(var(--gutter-x)* .1) calc(var(--gutter-x)* .3);
  color: var(--color-button-text);
  border-radius: 0.25rem;
  font-size: 0.75rem;
}


/* Responsive layout */
@media screen and (max-width: 480px) {
  .logo {
    width: 80%;
  }

  .navigation {
    width: 20%;
  }

  .nav-desktop {
    display: none;
  }

  .hamburger {
    display: flex;
  }

  .nav-mobile {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 2rem;
  }

  .nav-mobile a {
    display: flex;
    justify-content: center;
    padding: 0.5rem 0;
    width: 75%;
    border-top: 1px solid var(--color-border);
  }

  .nav-mobile a:first-of-type {
    border: 0;
  }

  .nav-overlay {
    position: fixed;
    top: calc(var(--app-padding-top) + var(--header-height));
    right: 0;
    bottom: 0;
    left: 0;
    padding: 3rem 1.75rem;
    z-index: 1;
    background-color: var(--color-background);
    height: calc(100vh - var(--app-padding-top) - var(--header-height));
  }
}


</style>
