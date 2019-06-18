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
    },
    editSSHConfigEntry: (state, configEntry) => {
      state.configData.find((configDataEntry, index) => {
        if (configDataEntry.numInFile === configEntry.numInFile) {
          state.configData[index] = configEntry
        }
      })
    },
    deleteSSHConfigEntry: (state, configEntry) => {
      console.log(configEntry.numInFile)
      state.configData.find((configDataEntry, index) => {
        if (configDataEntry.numInFile === configEntry.numInFile) {
          return state.configData.splice(index, 1)
        }
      })
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
    },
    editSSHConfigEntry: ({commit}, configEntry) => {
      return makeIPCCall('edit_ssh_config_entry', configEntry).then(configEntry => {
        commit('editSSHConfigEntry', configEntry)
      })
    },
    deleteSSHConfigEntry: ({commit}, configEntry) => {
      return makeIPCCall('delete_ssh_config_entry', configEntry).then(() => {
        commit('deleteSSHConfigEntry', configEntry)
      })
    }
  }
}
