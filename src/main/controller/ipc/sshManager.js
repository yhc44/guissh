import {sshManager} from '../init'
const {ipcMain} = require('electron')

ipcMain.on('get_ssh_config_data', async (event, args) => {
  const configData = sshManager.getSSHConfigData()
  event.sender.webContents.send('get_ssh_config_data', configData)
})
ipcMain.on('refresh_ssh_config_data', async (event, args) => {
  try {
    await sshManager.reloadSSHConfigFile()
    const configData = sshManager.getSSHConfigData()
    event.sender.webContents.send('refresh_ssh_config_data', configData)
  } catch (e) {
    event.sender.webContents.send('ipc_error')
  }
})
ipcMain.on('add_ssh_config_entry', async (event, entry) => {
  try {
    const configEntry = await sshManager.addSSHConfigEntry(entry.host, entry.port, entry.hostname, entry.identityFileName, entry.user)
    event.sender.webContents.send('add_ssh_config_entry', configEntry)
  } catch (e) {
    event.sender.webContents.send('ipc_error')
  }
})
ipcMain.on('edit_ssh_config_entry', async (event, args) => {
  console.log(args)
  try {
    const configEntry = await sshManager.editSSHConfigEntry(args.host, args, args.numInFile)
    event.sender.webContents.send('edit_ssh_config_entry', configEntry)
  } catch (e) {
    event.sender.webContents.send('ipc_error')
  }
})
ipcMain.on('delete_ssh_config_entry', async (event, args) => {
})
