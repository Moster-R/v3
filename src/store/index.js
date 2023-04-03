import { createStore } from 'vuex'

export default createStore({
  state: {
    breadcrumb: [], //面包屑信息
    tags: [], // 标签列表
    userInfo:{} //用户信息
  },
  getters: {
  },
  mutations: {
    /**
     * 存入用户信息
      * @param state
     * @param userInfo
     */
    addUserInfo(state, userInfo) {
      state.userInfo = userInfo
    },
    /**
     * 删除用户信息
     * @param state
     */
    deleteUserInfo(state) {
      state.userInfo = null
    },
    /**
     * 更新breadcrumb
     * @param state
     * @param list
     */
    setBreadcrumbList(state,list) {
      state.breadcrumb = list
    },
    /**
     * 新增标签
     * @param state
     * @param item
     */
    addTags(state,item) {
      const res = state.tags.find(i => {
        return i.path === item.path
      })
      if(!res){
        state.tags.push(item)
      }
    },
    /**
     * 删除标签
     * @param state
     * @param item
     */
    delTags(state,item) {
        state.tags = state.tags.filter(i => {
          return i.path !== item.path
        })
    }

  },
  actions: {
    setUserInfo({commit},data){
      commit('addUserInfo',data)
    }
  },
  modules: {
  }
})
