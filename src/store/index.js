import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    nowSongId: 0,
    playOrStop: false,
    searchList: [],
    nowPlaylistId: [],
  },
  mutations: {
    setNowSongId(state, payload) {
      state.nowSongId = payload
    },
    setPlayOrStop(state, payload) {
      if (payload != undefined) {
        state.playOrStop = payload
      } else {
        state.playOrStop = !state.playOrStop
      }
    },
    setSearchList(state, payload) {
      state.searchList = payload
    },
    setNowPlaylistId(state, payload) {
      state.nowPlaylistId = [...new Set(payload)]
    },
  }
})

export default store