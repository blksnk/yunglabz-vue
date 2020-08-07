import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import TrackListWrapper from '../views/TrackListWrapper.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/track_list',
    name: 'TrackList',
    component: TrackListWrapper,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
