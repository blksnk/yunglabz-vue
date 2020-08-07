<template>
  <div id="cursor" :style="style"></div>
</template>

<script>
export default {
  name: 'CustomCursor',
  props: {
    mouse: {
      type: Object,
      default: () => ({
        x: 0,
        y: 0,
      }),
    },
  },
  computed: {
    style() {
      return {
        transform: `translate(${this.mouse.x - 8}px, ${this.mouse
          .y - 8}px)`,
      };
    },
  },
};
</script>

<style lang="scss">
#cursor {
  position: fixed;
  top: 0;
  left: 0;
  width: 1rem;
  height: 1rem;
  border-radius: 1rem;
  background-color: $c-1;
  pointer-events: none;
  user-select: none;
  z-index: 5000;
}
</style>
