import { makeIPCCall } from '../../controller/ipc'

export const sshManagerStore = {
  namespaced: true,
  state: {
    configData: {}
  },
  getters: {

  },
  mutations: {
    initConfigData: (state, payload) => {
      state.configData = payload
    }
  },
  actions: {
    initConfigData: async ({commit}, payload) => {
      await makeIPCCall('get_ssh_config_data').then(configData => {
        commit('initConfigData', configData)
      }).catch(err => {
        console.log(err)
      })
    },
    createSSHKeyPair: ({commit}, payload) => {
      return makeIPCCall('ssh_create_keypair', {
        bitLength: payload.bitLength,
        outputFileName: payload.outputFileName
      })
    }
  }
}
