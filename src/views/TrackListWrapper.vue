<template>
  <main id="TrackListWrapper">
    <TrackList />
  </main>
</template>

<script>
import TrackList from '@/components/TrackList.vue';

export default {
  name: 'TrackListWrapper',
  components: {
    TrackList,
  },
};
</script>

<style lang="scss">
#TrackListWrapper {
  width: 100%;
  padding: 0.5rem 3rem 3rem 1rem;
}
</style>
