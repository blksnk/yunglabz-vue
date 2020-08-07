<template>
  <nav id="nav">
    <router-link to="/">project presentation</router-link>
    <router-link to="/about-artist">about yunglabz</router-link>
    <router-link to="/track_list">track list</router-link>
  </nav>
</template>

<style lang="scss">
#nav {
  position: fixed;
  top: 2rem;
  left: 1rem;
  z-index: 4;

  a {
    display: block;
    margin-bottom: 0.5rem;
    color: $c-2;
    pointer-events: all;

    &:hover,
    &.router-link-exact-active {
      color: $c-1;
      text-decoration: underline;
    }
  }
}
</style>
