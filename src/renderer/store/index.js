import Vue from 'vue'
import Vuex from 'vuex'

// import { createPersistedState, createSharedMutations } from 'vuex-electron'

import {sshManagerStore} from './modules/sshManager'
Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [
    // createPersistedState(),
    // createSharedMutations()
  ],
  modules: {
    'sshManager': sshManagerStore
  },
  strict: process.env.NODE_ENV !== 'production'
})
