import {sshManager} from '../init'
const {ipcMain} = require('electron')

ipcMain.on('get_ssh_config_data', async (event, args) => {
  const configData = sshManager.getSSHConfigData()
  event.sender.webContents.send('get_ssh_config_data', configData)
})
