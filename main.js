// Modules
const {app, BrowserWindow, ipcMain} = require("electron")
const windowStateKeepr = require("electron-window-state")
const readItem = require("./readItem")
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

//Listen on channel "new-item" for URL user entered, first arg is event 2nd arg is the URL being sent
ipcMain.on("new-item", (e, itemUrl) => {
  //Send URL and Screenshot back to renderer process for display.
  //First item is URL received from renderer, second argument is the callback object that we get from the readItem module
  readItem(itemUrl, (item) => {
    //First argument is channel we created to receive URL/ScreenShot, second arg is the data
    e.sender.send("new-item-success", item)
  })
})

// Create a new BrowserWindow when `app` is ready
createWindow = () => {  

  //Window state keeper
  let state = windowStateKeepr({
    defaultWidth: 500, defaultHeight: 650
  })

  mainWindow = new BrowserWindow({
    x: state.x, y: state.y,
    width: state.width, height: state.height,
    minWidth: 450, maxWidth: 650, minHeight: 300,
    webPreferences: { 
      nodeIntegration: true }
  })

  // Load index.html into the new BrowserWindow
  mainWindow.loadFile('renderer/main.html');

  //Manage new window state
  state.manage(mainWindow)    

  // Open DevTools - Remove for PRODUCTION!
  mainWindow.webContents.openDevTools();

  // Listen for window being closed
  mainWindow.on('closed',  () => {
    mainWindow = null
  })
  
}

// Electron `app` is ready
app.on('ready', createWindow)

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
  if (mainWindow === null) createWindow()
})