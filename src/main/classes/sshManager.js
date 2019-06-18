const fs = require('fs')
const path = require('path')
const os = require('os')
const changeCase = require('change-case')
const moment = require('moment')
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
    const sshConfigFileDataArray = this.sshConfigFileData.split('\n')
    let tmpHost = null
    let hostDuplicate = {}
    let hostNum = 0
    const dupSeparator = '__DUP__'
    for (const line of sshConfigFileDataArray) {
      if (tmpHost && line.trim().substr(0, 4) !== 'host') {
        const lineTrim = line.trim().split(' ')
        if (hostDuplicate[tmpHost] === 0) {
          configObject[tmpHost][lineTrim[0].toLowerCase()] = lineTrim[1]
        } else {
          configObject[`${tmpHost}${dupSeparator}${hostDuplicate[tmpHost]}`][lineTrim[0].toLowerCase()] = lineTrim[1]
        }
      }
      if (line.includes('host') && !line.includes('hostname')) {
        const initObj = {
          numInFile: hostNum++
        }
        tmpHost = line.split('host')[1].trim()
        if (configObject[tmpHost]) {
          // multiple host
          if (!hostDuplicate[tmpHost]) {
            hostDuplicate[tmpHost] = 1
          } else {
            hostDuplicate[tmpHost]++
          }
          configObject[`${tmpHost}${dupSeparator}${hostDuplicate[tmpHost]}`] = initObj
        } else {
          hostDuplicate[tmpHost] = 0
          configObject[tmpHost] = initObj
        }
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
        user: configObject[configKey].user,
        numInFile: configObject[configKey].numInFile
      })
    }
    return configArray
  }
  // numInFile for duplicates
  editSSHConfigEntry (host, editOptions = {}, numInFile = -1) {
    console.log(editOptions)
    return new Promise(async (resolve, reject) => {
      let data = this.sshConfigFileData.split('\n')
      let hasChange = false
      let resultData = []
      let editOn = false
      let hostNum = 0
      let index = 0
      const isNumVal = {
        'port': true
      }
      for (let line of data) {
        if (editOn) {
          const splitLine = line.trim().split(' ')
          const key = changeCase.camelCase(splitLine[0])
          let value = splitLine[1]
          if (key && value) {
            console.log(`key: ${key} value: ${value}`)
            if (editOptions[key]) {
              line = ` ${changeCase.pascalCase(key)} ${editOptions[key]}`
              if (isNumVal[key]) {
                value = parseInt(value)
                editOptions[key] = parseInt(editOptions[key])
              }
              if (value !== editOptions[key]) {
                console.log(`Changed ${value} for ${editOptions[key]} at key ${key}`)
                hasChange = true
              }
            }
          }
        }
        let nextLine = ''
        if (index < (data.length - 2)) {
          nextLine = data[index + 1]
        }
        if (nextLine.includes('host') && !nextLine.includes('hostname')) {
          editOn = false
        }
        if (line.includes('host') && !line.includes('hostname')) {
          if (line.trim().split(' ')[1] === host && (numInFile >= 0 && numInFile === hostNum)) {
            editOn = !editOn
            console.log(`Found host ${host}`)
          }
          hostNum++
        }
        resultData.push(line)
        index++
      }
      const sshConfigFilePath = path.join(this.options.sshBasePath, this.options.sshConfigFileName)
      const configData = resultData.join('\n')

      try {
        const resultConfigData = {
          host: host,
          hostname: editOptions.hostname,
          port: editOptions.port,
          user: editOptions.user,
          numInFile: numInFile,
          identityFile: path.join(this.options.sshBasePath, editOptions.identityFileName)
        }
        if (hasChange) {
          console.log(`Edit has change.`)
          await this.backupConfigData()
          fs.writeFile(sshConfigFilePath, configData, err => {
            if (err) return reject(err)
            this.sshConfigFileData = configData
            resolve(resultConfigData)
          })
        } else {
          console.log(`Edit has no change.`)
          resolve(resultConfigData)
        }
      } catch (e) {
        reject(e)
      }
    })
  }
  deleteSSHConfigEntry (host) {
    return new Promise((resolve, reject) => {
    })
  }
  backupConfigData () {
    return new Promise((resolve, reject) => {
      const guisshFolder = path.join(os.homedir(), '.guissh')
      const backupTime = moment().format('YYYY-MM-DD-HH-mm-ss')
      const sshConfigBackupFile = `config.bak.${backupTime}`
      const sshConfigBackupFilePath = path.join(guisshFolder, sshConfigBackupFile)
      fs.writeFile(sshConfigBackupFilePath, this.sshConfigFileData, err => {
        if (err) return reject(err)
        resolve(true)
      })
    })
  }
  addSSHConfigEntry (host, port, hostname, identityFileName, user) {
    return new Promise((resolve, reject) => {
      const sshConfigFilePath = path.join(this.options.sshBasePath, this.options.sshConfigFileName)
      let entry = `\nhost ${host}\n`
      if (port) {
        entry += ` Port ${port}\n`
      }
      if (hostname) {
        entry += ` HostName ${hostname}\n`
      }
      if (identityFileName) {
        entry += ` IdentityFile ${path.join(this.options.sshBasePath, identityFileName)}\n`
      }
      if (user) {
        entry += ` User ${user}`
      }
      this.backupConfigData().then(() => {
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
      }).catch(err => {
        reject(err)
      })
    })
  }
}
