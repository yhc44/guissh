const fs = require('fs')
const path = require('path')
const os = require('os')
export default class SSHManager {
  constructor (options = {
    sshBasePath: path.join(os.homedir(), '.ssh'),
    sshConfigFileName: 'config',
    sshAuthFileName: 'authorized_keys'
  }) {
    this.options = options
  }
  async init () {
    await this.initSSHFolder().then(created => {
      if (!created) {
        console.log(`Found SSH folder ${this.options.sshBasePath}`)
      } else {
        console.log(`Created SSH folder ${this.options.sshBasePath}`)
      }
    }).catch(err => {
      console.log(err)
    })
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
  initSSHFolder (createIfNotExist = true) {
    return new Promise((resolve, reject) => {
      fs.readdir(this.options.sshBasePath, (err, files) => {
        let created = false
        if (err) {
          if (createIfNotExist) {
            fs.mkdirSync(this.options.sshBasePath)
          }
          created = true
        }
        resolve(created)
      })
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
  reloadSSHConfigFile () {
    return this.initSSHConfigFile(this.options.sshConfigFileName)
  }
  getSSHConfigData () {
    let configObject = {}
    const sshConfigFileDataSplit = this.sshConfigFileData.split('\n')
    let tmpHost = null
    let hostDuplicate = {}
    const dupSeparator = '__DUP__'
    for (const line of sshConfigFileDataSplit) {
      if (tmpHost && line.trim().substr(0, 4) !== 'host') {
        const lineTrim = line.trim().split(' ')
        configObject[tmpHost][lineTrim[0].toLowerCase()] = lineTrim[1]
        if (hostDuplicate[tmpHost] === 0) {
          configObject[tmpHost][lineTrim[0].toLowerCase()] = lineTrim[1]
        } else {
          configObject[`${tmpHost}${dupSeparator}${hostDuplicate[tmpHost]}`][lineTrim[0].toLowerCase()] = lineTrim[1]
        }
      }
      if (line.includes('host') && !line.includes('hostname')) {
        tmpHost = line.split('host')[1].trim()
        if (configObject[tmpHost]) {
          console.log(tmpHost)
          // multiple host
          if (!hostDuplicate[tmpHost]) {
            hostDuplicate[tmpHost] = 1
          } else {
            hostDuplicate[tmpHost]++
          }
          configObject[`${tmpHost}${dupSeparator}${hostDuplicate[tmpHost]}`] = {}
        } else {
          hostDuplicate[tmpHost] = 0
        }
        configObject[tmpHost] = {}
      }
    }
    let configArray = []
    for (let configKey of Object.keys(configObject)) {
      let parsedConfigKey = configKey
      if (configKey.includes(dupSeparator)) {
        parsedConfigKey = configKey.split(dupSeparator)[0]
      }
      const parsedPort = parseInt(configObject[configKey].port)
      configArray.unshift({
        host: parsedConfigKey,
        hostname: configObject[configKey].hostname,
        identityFile: configObject[configKey].identityfile,
        port: Number.isNaN(parsedPort) ? undefined : parsedPort,
        user: configObject[configKey].user
      })
    }
    return configArray
  }
  editSSHConfigEntry (host, editOptions = {}) {
    return new Promise((resolve, reject) => {
      console.log(editOptions)
    })
  }
  addSSHConfigEntry (host, port, hostname, identityFileName, user) {
    return new Promise((resolve, reject) => {
      const sshConfigFilePath = path.join(this.options.sshBasePath, this.options.sshConfigFileName)
      let entry = `\nhost ${host}\n`
      if (port) {
        entry += `  Port ${port}\n`
      }
      if (hostname) {
        entry += `  HostName ${hostname}\n`
      }
      if (identityFileName) {
        entry += `  IdentityFile ${identityFileName}\n`
      }
      if (user) {
        entry += `  User ${user}`
      }
      fs.appendFile(sshConfigFilePath, entry, err => {
        if (err) return reject(err)
        resolve({
          host: host,
          hostname: hostname,
          identityFile: path.join(this.options.sshBasePath, identityFileName),
          port: port,
          user: user
        })
      })
    })
  }
}
