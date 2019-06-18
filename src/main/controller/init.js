import SSHManager from '../classes/sshManager'
export let sshManager = new SSHManager()
const os = require('os')
const path = require('path')
const fs = require('fs')
export const initApp = async () => {
  await initGUISSHFolder()
  await sshManager.init().then(_ => {
    console.log('SSHManager init successful')
  })
  const configData = await sshManager.getSSHConfigData()
  console.log(configData)
}
const initGUISSHFolder = () => {
  return new Promise((resolve, reject) => {
    const guisshFolder = path.join(os.homedir(), '.guissh')
    fs.readdir(guisshFolder, err => {
      if (err) {
        fs.mkdirSync(guisshFolder)
      }
      resolve(true)
    })
  })
}
