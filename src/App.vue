<template>
  <div id="app">
    <GL
      v-bind="{
        mouse,
        lerped,
      }"
    />
    <router-view v-if="$store.state.glLoaded" />
    <Navigation />
    <TrackControls />
    <CustomCursor
      v-bind="{
        mouse,
        lerped,
      }"
    />
  </div>
</template>

<script>
import TrackControls from '@/components/TrackControls.vue';
import Navigation from '@/components/Navigation.vue';
import CustomCursor from '@/components/CustomCursor.vue';
import GL from '@/components/GL.vue';
import { setCssVar, lerp } from '@/helpers/animation';

export default {
  name: 'App',
  components: {
    CustomCursor,
    GL,
    TrackControls,
    Navigation,
  },
  data() {
    return {
      scroll: {
        x: 0,
        y: 0,
      },
      mouse: {
        x: 0,
        y: 0,
      },
      lerped: {
        x: 0,
        y: 0,
      },
    };
  },
  computed: {
    viewport() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      return {
        width,
        height,
        ratio: width / height,
      };
    },
  },
  methods: {
    updateMousePos(e) {
      this.mouse = {
        x: e.clientX,
        y: e.clientY,
      };
    },
    updateLerp() {
      this.lerped = {
        x: lerp(this.lerped.x, this.mouse.x, 0.1),
        y: lerp(this.lerped.y, this.mouse.y, 0.1),
      };
      setCssVar('mouse-x', `${this.lerped.x}px`);
      setCssVar('mouse-y', `${this.lerped.y}px`);

      requestAnimationFrame(this.updateLerp);
    },
    updateScrollPos() {
      this.scroll.x = window.scrollX;
      this.scroll.y = window.scrollY;
      setCssVar('scroll-y', `${this.scroll.y}px`);
    },
  },
  mounted() {
    document.addEventListener('wheel', this.updateScrollPos);
    document.addEventListener('mousemove', this.updateMousePos);
    requestAnimationFrame(this.updateLerp);
  },
};
</script>

<style lang="scss">
#app {
}
</style>
