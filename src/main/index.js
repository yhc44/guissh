'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
import { initApp } from './controller/init'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
export let heavyLoadWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`
const heavyLoadWindowURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080/#/heavyload`
  : `file://${__dirname}/index.html#login`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 768,
    useContentSize: true,
    width: 1024,
    minWidth: 1024,
    minHeight: 768
  })
  heavyLoadWindow = new BrowserWindow({
    show: false
  })
  heavyLoadWindow.loadURL(heavyLoadWindowURL)
  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
  heavyLoadWindow.on('closed', () => {
    heavyLoadWindow = null
  })
}
ipcMain.on('main_window_rendered', () => {
  mainWindow.send('ipc_ready')
})
ipcMain.on('heavyload_window_rendered', () => {
  heavyLoadWindow.send('ipc_ready')
})
app.on('before-quit', () => {
  if (mainWindow) {
    mainWindow.destroy()
  }
  if (heavyLoadWindow) {
    heavyLoadWindow.destroy()
  }
})
app.on('quit', () => {
  app.quit()
})
app.on('ready', async () => {
  await initApp()
  createWindow()
  require('./controller/ipc/sshManager')
  require('./controller/ipc/ssh')
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
