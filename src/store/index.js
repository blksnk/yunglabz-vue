import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    activeTrackIndex: 0,
    hoverTrackIndex: 0,
    glLoaded: false,
    songs: [
      {
        title: 'lab coat',
        url: '/labcoat',
      },
      {
        title: 'meta',
        url: '/meta',
      },
      {
        title: 'overflow',
        url: '/overflow',
      },
      {
        title: 'untitled',
        url: '/untitled',
      },
      {
        title: 'glitchin',
        url: '/final',
      },
    ],
  },
  mutations: {
    setActiveTrackIndex(state, index) {
      state.activeTrackIndex = index;
    },
    setHoverTrackIndex(state, index) {
      state.hoverTrackIndex = index;
    },
    setGlLoaded(state, bool) {
      state.glLoaded = bool;
    },
  },
  actions: {},
  modules: {},
});
