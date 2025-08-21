/*
 * @Author: wulongyun
 * @Date: 2022-10-31 18:03:34
 * @LastEditTime: 2022-11-19 19:02:41
 * @LastEditors: wulongyun
 * @Description:
 */
import { getCurrentUser } from '@/service/common'
import cookies from "js-cookie"

const getDefaultState = () => {
  return {
    // 绑定的客户信息
    userInfo: null
    // 经销商信息
  }
}

const state = getDefaultState()

const getters = {
  isDealerAccount (state) {
    return Object.keys(state.dealerInfo).length > 0
  }
}

const mutations = {
  SET_USER_INFO: (state, payload) => {
    state.userInfo = payload
  },
  CLEAR_USER_INFO: (state) => {
    state.userInfo = getDefaultState().userInfo
  }
}

const actions = {
  async login ({ commit }, payload) {
    console.log(cookies.get('ge_adminToken'))
    const response = await getCurrentUser()
    if (response && response.code == 0) {
      commit('SET_USER_INFO', response.data)
    }
  },
  clearUserInfo ({ commit }) {
    commit('CLEAR_USER_INFO')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
