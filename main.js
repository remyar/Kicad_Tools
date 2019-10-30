const electron = require('electron');
const { autoUpdater } = require("electron-updater");
let ipcMain = electron.ipcMain;
var pjson = require('./package.json');
var logger = require('electron-log');
const fs = require('fs');
const path = require('path');

logger.transports.file.level = 'info';
logger.transports.file.maxSize = 1048576;
logger.transports.file.clear();
autoUpdater.logger = logger;
// Module to control application life.
const app = electron.app

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

//require('electron-reload')(__dirname);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {

    autoUpdater.checkForUpdates();

    // Create the browser window.
    mainWindow = new BrowserWindow({width: 1024, height: 768 , webPreferences: {
        nodeIntegration: true
    } ,
        //toolbar: false,
        //skipTaskbar: true,
    })

    mainWindow.setMenu(null);
    
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

let eventTab =[];

autoUpdater.on('checking-for-update', () => {
    logger.info('Checking for update...');
});

autoUpdater.on('update-available', (info) => {
    logger.info('Update available.');
    logger.info(JSON.stringify(info));

    eventTab =[
        { percent : 0 , isSend : false },
        { percent : 25 , isSend : false },
        { percent : 50 , isSend : false },
        { percent : 75 , isSend : false },
        { percent : 100 , isSend : false },
    ];

    if ( mainWindow != undefined ){
        mainWindow.webContents.send('update-available', info);
    }
});

autoUpdater.on('update-not-available', (ev, info) => {
    logger.info('Update not available.');
});

autoUpdater.on('error', (err) => {
    logger.info('Error in auto-updater.');
    logger.info(JSON.stringify(err));

    if ( mainWindow != undefined ){
        mainWindow.webContents.send('update-error', err);
    }
});

autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    logger.info(log_message);

    if ( mainWindow != undefined ){

        let val = parseInt(progressObj.percent.toString());

        eventTab.map((e , idx)=>{
            if ( val >= e.percent && e.isSend == false ){
                mainWindow.webContents.send('download-progress', progressObj);
                eventTab[idx].isSend = true;
            }
        });
    }
});

autoUpdater.on('update-downloaded', (info) => {
    logger.info('Update downloaded; will install in 30 seconds');
    logger.info(JSON.stringify(info));

    if ( mainWindow != undefined ){
        mainWindow.webContents.send('update-downloaded', info);
        setTimeout(()=>{
            mainWindow.webContents.send('update-quitForApply', info);
        },2000);
    }
});

/*
ipcMain.on('get-settings', (event, arg) => {
    console.log(arg) // affiche "ping"
    event.returnValue = 'pong'
})


fs.readFile(path.resolve(__dirname , '../../kicadtools/settings.json') , 'utf-8' , (err , data )=>{

    let settings = {};
    if ( err ){
        logger.info("No Settings Found , apply default");
    }
    else{
        settings = JSON.parse(data);
    }
    
    mainWindow.webContents.send('init-settings', settings);

})
*/