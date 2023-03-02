import { createStore } from 'vuex'

export default createStore({
  state: {
    tags: []
  },
  getters: {
  },
  mutations: {
    setBreadcrumbList(state,list) {
      state.tags = list
    }
  },
  actions: {
  },
  modules: {
  }
})
