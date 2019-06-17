const fs = require('fs')
const path = require('path')
export default class SSHManager {
  constructor (options = {
    sshBasePath: '~/.ssh',
    sshConfigFileName: 'config',
    sshAuthFileName: 'authorized_keys'
  }) {
    this.options = options
  }
  async init () {
    await this.initSSHConfigFile(this.options.sshConfigFileName).then(created => {
      if (!created) {
        console.log(`Found SSH config file ${this.options.sshConfigFileName}`)
      } else {
        console.log(`Created SSH config file ${this.options.sshConfigFileName}`)
      }
    }).catch(err => {
      console.log(err)
    })
    await this.initSSHAuthFile(this.options.sshAuthFileName).then(created => {
      if (!created) {
        console.log(`Found auth file ${this.options.sshAuthFileName}`)
      } else {
        console.log(`Created auth file ${this.options.sshAuthFileName}`)
      }
    }).catch(err => {
      console.log(err)
    })
  }
  initSSHAuthFile (sshAuthFileName, createIfNotExist = true) {
    return new Promise((resolve, reject) => {
      const sshAuthFilePath = path.join(this.options.sshBasePath, sshAuthFileName)
      fs.readFile(sshAuthFilePath, 'utf8', (err, data) => {
        let created = false
        if (err) {
          console.log(`Trying to write auth file at ${sshAuthFilePath}`)
          if (createIfNotExist) {
            data = ''
            fs.writeFileSync(sshAuthFilePath, '')
            created = true
          }
        }
        this.sshAuthFileData = data
        resolve(created)
      })
    })
  }
  initSSHConfigFile (sshConfigFileName, createIfNotExist = true) {
    return new Promise((resolve, reject) => {
      const sshConfigFilePath = path.join(this.options.sshBasePath, sshConfigFileName)
      fs.readFile(sshConfigFilePath, 'utf8', (err, data) => {
        let created = false
        if (err) {
          console.log(`Trying to write config file at ${sshConfigFilePath}`)
          if (createIfNotExist) {
            data = ''
            fs.writeFileSync(sshConfigFilePath, data)
            created = true
          }
        }
        this.sshConfigFileData = data
        resolve(created)
      })
    })
  }
  getSSHConfigData () {
    let configObject = {}
    const sshConfigFileDataSplit = this.sshConfigFileData.split('\n')
    let tmpHost = null
    for (const line of sshConfigFileDataSplit) {
      if (tmpHost && line.trim().substr(0, 4) !== 'host') {
        const lineTrim = line.trim().split(' ')
        configObject[tmpHost][lineTrim[0].toLowerCase()] = lineTrim[1]
      }
      if (line.includes('host') && !line.includes('hostname')) {
        tmpHost = line.split('host')[1].trim()
        configObject[tmpHost] = {}
      }
    }
    for (const configKey of Object.keys(configObject)) {
      configObject[configKey].delete = () => {
      }
      configObject[configKey].edit = (editOptions = {
        host: configObject[configKey].host,
        hostname: configObject[configKey].hostname,
        identityFile: configObject[configKey].identityfile,
        port: configObject[configKey].port,
        user: configObject[configKey].user
      }) => {
        return this.editSSHConfigEntry(configObject[configKey].host, editOptions)
      }
    }
    return configObject
  }
  editSSHConfigEntry (host, editOptions = {}) {
    return new Promise((resolve, reject) => {

    })
  }
  addSSHConfigEntry (host, port, hostname, identityFile) {
    return new Promise((resolve, reject) => {

    })
  }
}
