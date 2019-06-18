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
    ...mapActions('sshManager', ['refreshConfigData', 'createSSHKeyPair', 'addSSHConfigEntry']),
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
    selectConfigEntryIdentityFilePath () {
    }
  }
}
