import {mapActions} from 'vuex'
import * as messageController from '../message'
const {dialog} = require('electron').remote
const path = require('path')
export default {
  data () {
    return {
    }
  },
  methods: {
    ...mapActions('sshManager', ['refreshConfigData', 'createSSHKeyPair', 'addSSHConfigEntry', 'editSSHConfigEntry', 'deleteSSHConfigEntry']),
    async createSSHKeyPairView (bitLength, outputFileName) {
      this.$wait.start('creating_keypair')
      console.log(`Create KeyPair with ${bitLength} bits`)
      this.createSSHKeyPair({
        outputFileName: outputFileName,
        bitLength: bitLength
      }).then(() => {
        this.$wait.end('creating_keypair')
        console.log(`Created KeyFile ${outputFileName}`)
        this.configEntryIdentityFileCreated = true
      }).catch(err => {
        this.$wait.end('creating_keypair')
        console.log(err)
      })
    },
    selectIdentityFile () {
      dialog.showOpenDialog({
        title: 'Select identity file',
        buttonLabel: 'Select',
        properties: ['openFile', 'showHiddenFiles', 'openDirectory'],
        // todo
        defaultPath: '/Users/yannheeser/.ssh'
      }, (filePaths) => {
        this.configEntryIdentityFilePath = filePaths[0]
      })
    },
    async addConfigEntryView () {
      const identityFileName = this.configEntryIdentityFileName !== '' ? this.configEntryIdentityFileName : path.basename(this.configEntryIdentityFilePath)
      this.$wait.start('adding_config_entry')
      await this.addSSHConfigEntry({
        host: this.configEntryHost,
        hostname: this.configEntryHostname,
        port: this.configEntryPort,
        identityFileName: identityFileName,
        user: this.configEntryUser
      }).then(() => {
        this.showAddConfigEntryDialog = false
        messageController.success('Successfully added config entry.')
      }).catch(err => {
        console.log(err)
        messageController.error('An error occurred while creating config entry.')
      })
      this.$wait.end('adding_config_entry')
    },
    async editConfigEntryView () {
      const identityFileName = this.configEntryIdentityFileName !== '' ? this.configEntryIdentityFileName : path.basename(this.configEntryIdentityFilePath)
      this.$wait.start('editing_config_entry')
      await this.editSSHConfigEntry({
        host: this.configEntryHost,
        hostname: this.configEntryHostname,
        port: parseInt(this.configEntryPort),
        identityFileName: identityFileName,
        user: this.configEntryUser,
        numInFile: this.configEntryNumInFile
      }).then(() => {
        messageController.success('Successfully edited config entry.')
        this.showAddConfigEntryDialog = false
        this.configEntryDialogEdit = false
      }).catch(err => {
        console.log(err)
        messageController.error('An error occurred while editing config entry.')
      })
      this.$wait.end('editing_config_entry')
    },
    async deleteConfigEntryView (configEntry) {
      this.$wait.start('deleting_config_entry')
      await this.deleteSSHConfigEntry(configEntry).then(() => {
        messageController.success('Successfully deleted config entry.')
      }).catch(err => {
        console.log(err)
        messageController.error('An error occurred while deleting config entry.')
      })
      this.$wait.start('deleting_config_entry')
    },
    selectConfigEntryIdentityFilePath () {
    }
  }
}
