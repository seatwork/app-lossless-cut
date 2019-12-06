/**
 * --------------------------------------------------------
 * Lossless Cut Main Process
 * Author: Aichen
 * Copyright (c) 2019 Cloudseat.net
 * --------------------------------------------------------
 */

// Modules to control application life and create native browser window
const electron = require('electron')
const path = require('path')
const { app, Menu, BrowserWindow } = electron

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
  // Hide the menu of application
  Menu.setApplicationMenu(null)

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 780, // Make sure the aspect ratio of video is 16:9
    height: 600,
    icon: path.join(__dirname, 'assets/logo.ico'),
    webPreferences: {
      nodeIntegration: true, // Make sure integrate node in renderer.js
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'))

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) { app.quit() } else {

  // Someone tried to run a second instance, we should focus our window.
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow)

  // Quit when all windows are closed.
  app.on('window-all-closed', function() {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit()
  })

  app.on('activate', function() {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) createWindow()
  })

}
