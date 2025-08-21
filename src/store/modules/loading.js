const getDefaultState = () => {
  return {
    // 展示Loading图
    showed: false
  }
}

const state = getDefaultState()

const mutations = {
  SHOW_LOADING: (state) => {
    state.showed = true
  },
  CLOSE_LOADING: (state) => {
    state.showed = false
  }
}

const actions = {
  show ({ commit }) {
    commit('SHOW_LOADING')
  },
  close ({ commit }) {
    commit('CLOSE_LOADING')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
