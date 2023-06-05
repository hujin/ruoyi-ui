import Cookies from 'js-cookie'
import { listDept } from "@/api/system/dept";
import { listUser } from "@/api/system/user";

const state = {
  sidebar: {
    opened:  true,
    withoutAnimation: false,
    hide: false
  },
  device: 'desktop',
  size: Cookies.get('size') || 'medium',
  system:'',
  deptList:[],
  userList:[],
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    if (state.sidebar.hide) {
      return false;
    }
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_SIZE: (state, size) => {
    state.size = size
    Cookies.set('size', size)
  },
  SET_SIDEBAR_HIDE: (state, status) => {
    state.sidebar.hide = status
  },
  SET_SYSTEM: (state, name) => {
    state.system = name
  },
  SET_DEPTLIST:(state, dept) => {
    state.deptList = dept
  },
  SET_USERLIST:(state, dept) => {
    state.userList = dept
  },

}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  },
  toggleSideBarHide({ commit }, status) {
    commit('SET_SIDEBAR_HIDE', status)
  },
  setSystem({commit}, name) {
    commit('SET_SYSTEM', name)
  },
  getDepartment({ commit }){
    return new Promise((resolve, reject) => {
      listDept().then((res) => {
        commit('SET_DEPTLIST', res.data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  getUserList({ commit }){
    return new Promise((resolve, reject) => {
      listUser().then((res) => {
        commit('SET_USERLIST', res.data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
