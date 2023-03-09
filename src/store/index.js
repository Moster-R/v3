import { createStore } from 'vuex'

export default createStore({
  state: {
    breadcrumb: [], //面包屑信息
    tags: [] // 标签列表
  },
  getters: {
  },
  mutations: {
    // 更新breadcrumb
    setBreadcrumbList(state,list) {
      state.breadcrumb = list
    },
    // 增加tags
    addTags(state,item) {
      const res = state.tags.find(i => {
        return i.path === item.path
      })
      if(!res){
        state.tags.push(item)
      }
    },
    // 删除tags
    delTags(state,item) {
        state.tags = state.tags.filter(i => {
          return i.path !== item.path
        })
    }

  },
  actions: {
  },
  modules: {
  }
})
