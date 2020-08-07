<template>
  <ul id="list">
    <button
      v-for="(song, index) in $store.state.songs"
      :key="index"
      @click.prevent="() => onClick(index)"
      @mouseover="() => onHover(index)"
      :class="{
        link: true,
        active: $store.state.activeTrackIndex === index,
      }"
    >
      <h1 :data-content="song.title">{{ song.title }}</h1>
    </button>
  </ul>
</template>

<script>
export default {
  name: 'TrackList',
  methods: {
    onClick(index) {
      this.$store.commit('setActiveTrackIndex', index);
    },
    onHover(index) {
      this.$store.commit('setHoverTrackIndex', index);
    },
  },
};
</script>

<style lang="scss">
@mixin clip {
  @for $i from 1 through 8 {
    &:nth-child(#{$i}) {
      h1::after {
        clip-path: circle(
          8rem
            at
            calc(var(--mouse-x) - 1rem)
            calc(
              var(--mouse-y) -
                (100% * #{$i - 1}) +
                var(--scroll-y) -
                6.5rem
            )
        );
      }
    }
  }
}

#list {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(5, 10rem);
  grid-auto-flow: rows dense;
  width: 100%;

  .link {
    @include clip;
    text-align: right;
    align-self: start;

    z-index: 2;
    max-width: 100%;

    h1 {
      color: transparent;
      position: relative;
      -webkit-text-stroke: $c-1 2px;
      transition-duration: 0.2s;
      transition-timing-function: $bezier;
      width: 100%;

      &::after {
        position: absolute;
        content: attr(data-content);
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 3;
        color: $c-4;
      }
    }
    &.active h1 {
      transition-duration: 0.6s !important;
      color: $c-1;
      transform: skewX(-12deg) translateX(-1rem);
    }
  }
}
</style>
