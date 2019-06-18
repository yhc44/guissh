const {ipcRenderer} = require('electron')
export const makeIPCCall = (eventName, payload) => {
  return new Promise((resolve, reject) => {
    ipcRenderer.send(eventName, payload)
    let timeout = 600000 // ms
    let responseTimeout = setTimeout(() => {
      console.log(`IPCCAll timeout for event ${eventName}`)
      reject(new Error(`IPC Call timeout >= ${timeout}`))
    }, timeout)
    ipcRenderer.once(eventName, (event, arg) => {
      clearTimeout(responseTimeout)
      resolve(arg)
    })
    ipcRenderer.once('ipc_error', () => {
      reject(new Error(`IPC Call for event ${eventName} gave an error`))
    })
  })
}
