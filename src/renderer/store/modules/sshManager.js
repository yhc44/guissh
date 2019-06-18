import { makeIPCCall } from '../../controller/ipc'

export const sshManagerStore = {
  namespaced: true,
  state: {
    configData: []
  },
  getters: {

  },
  mutations: {
    initConfigData: (state, payload) => {
      state.configData = payload
    },
    addSSHConfigEntry: (state, configEntry) => {
      state.configData.unshift(configEntry)
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
    refreshConfigData: async ({commit}, payload) => {
      await makeIPCCall('refresh_ssh_config_data').then(configData => {
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
    },
    addSSHConfigEntry: ({commit}, configEntryData) => {
      return makeIPCCall('add_ssh_config_entry', configEntryData).then(configEntry => {
        commit('addSSHConfigEntry', configEntry)
      })
    }
  }
}
