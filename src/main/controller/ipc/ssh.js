import {sendHeavyLoad} from '../heavyload'
const {ipcMain} = require('electron')

const fs = require('fs')
const os = require('os')
const path = require('path')
ipcMain.on('ssh_create_keypair', async (event, args) => {
  if (!args.outputFileName) {
    event.sender.webContents.send('ipc_error')
  }
  sendHeavyLoad('ssh_create_keypair', args)
  ipcMain.once('heavyload_ssh_create_keypair', (e, keyPair) => {
    console.log(keyPair)
    const sshPath = path.join(os.homedir(), '.ssh')
    try {
      fs.writeFileSync(path.join(sshPath, args.outputFileName), keyPair.privateKey)
      fs.writeFileSync(path.join(sshPath, args.outputFileName) + '.pub', keyPair.publicKey)
      event.sender.webContents.send('ssh_create_keypair')
    } catch (e) {
      event.sender.webContents.send('ipc_error')
    }
  })
  // event.sender.webContents.send('ssh_create_keypair')
})
