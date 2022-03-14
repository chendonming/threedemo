import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    group: null,
    focusColor: '#ae408c',
  },
  mutations: {
    setFocusColor(state, color) {
      state.focusColor = color;
    },
    setGroup(state, group) {
      state.group = group;
    },
  },
  actions: {
  },
  modules: {
  },
  getters: {
    group: (state) => state.group,
  },
});
