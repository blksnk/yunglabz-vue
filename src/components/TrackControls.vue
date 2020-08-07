<template>
  <aside id="controls">
    <div id="buttons">
      <button>play</button>
      <span class="text_margin">/</span>
      <button>pause</button>
    </div>
    <div id="info">
      Currently playing
      <!-- <span class="text_margin">-</span> -->
      <span class="text_margin">/</span>
      <span id="track_title"> {{ currentTrack.title }}</span>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'TrackControls',
  computed: {
    currentTrack() {
      return this.$store.state.songs[
        this.$store.state.activeTrackIndex
      ];
    },
  },
};
</script>

<style lang="scss">
#controls {
  position: fixed;
  bottom: 2rem;
  left: 1rem;

  * {
    font-size: 1rem;
    color: $c-2;
    font-family: 'Compagnie';
    text-transform: uppercase;
  }

  .text_margin {
    margin: 0 1rem;
  }

  #track_title {
    color: $c-1;
  }

  #buttons {
    margin-bottom: 0.5rem;

    button {
      display: inline-block;
    }
  }
}
</style>
