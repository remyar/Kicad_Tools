const electron = require('electron');
//const fetch = require('electron-fetch').default;
const { autoUpdater } = require("electron-updater");
var pjson = require('./package.json');

// Module to control application life.
const app = electron.app

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

//require('electron-reload')(__dirname);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {

    autoUpdater.checkForUpdates();

    // Create the browser window.
    mainWindow = new BrowserWindow({width: 1024, height: 768 , webPreferences: {
        nodeIntegration: true
    }})

    mainWindow.maximize();

    // and load the index.html of the app.
    mainWindow.loadURL(`file://${__dirname}/dist/index.html`)

    // Open the DevTools.
    //  mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
        mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

//-- check update
//autoUpdater.checkForUpdatesAndNotify()
autoUpdater.currentVersion = pjson.version

autoUpdater.on('checking-for-update', () => {
    console.log('Checking for update...');
});

autoUpdater.on('update-available', (ev, info) => {
    console.log('Update available.');
});

autoUpdater.on('update-not-available', (ev, info) => {
    console.log('Update not available.');
});

autoUpdater.on('error', (ev, err) => {
    console.log('Error in auto-updater.');
});

autoUpdater.on('download-progress', (ev, progressObj) => {
    console.log('Download progress...');
});

autoUpdater.on('update-downloaded', (ev, info) => {
    console.log('Update downloaded; will install in 5 seconds');
});