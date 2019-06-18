import {createKeyPair} from './ssh'
const {ipcRenderer} = require('electron')
ipcRenderer.on('ssh_create_keypair', (event, args) => {
  createKeyPair(args.bitLength).then((keyPair) => {
    ipcRenderer.send('heavyload_ssh_create_keypair', keyPair)
  }).catch(err => {
    console.log(err)
    ipcRenderer.send('ipc_error')
  })
})
