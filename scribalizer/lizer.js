const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')

let mainWindow

function createWindow() {

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        // center: true,
        // frame: false,
        // resizable: false,
        // alwaysOnTop: true,
        useContentSize: true
    })

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'render', 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    mainWindow.webContents.openDevTools("undock")

    mainWindow.on('closed', function() {
        mainWindow = null
    })
}

app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function() {
    if (mainWindow === null) {
        createWindow()
    }
})
