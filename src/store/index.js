import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    activeTrackIndex: 0,
    hoverTrackIndex: 0,
    songs: [
      {
        title: 'lab coat',
        url: '/labcoat',
        img:
          'https://www.dravenstales.ch/wp-content/uploads/2018/10/neon-tunnel.gif',
      },
      {
        title: 'meta',
        url: '/meta',
        img:
          'https://i.pinimg.com/originals/53/68/f6/5368f6c036598c6e619eba2cede17d0c.gif',
      },
      {
        title: 'samplez',
        url: '/samplez',
        img:
          'https://33.media.tumblr.com/2a85f885b4436228816cd7ab352c7e79/tumblr_n7d487fT6u1r6xm5co1_500.gif',
      },
      {
        title: 'untitled',
        url: '/untitled',
        img: 'https://i.imgur.com/ZBS3rnG.gif',
      },
      {
        title: 'glitchin',
        url: '/final',
        img:
          'https://i.pinimg.com/originals/53/68/f6/5368f6c036598c6e619eba2cede17d0c.gif',
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
  },
  actions: {},
  modules: {},
});
