const electron = require('electron');
const { autoUpdater } = require("electron-updater");
var pjson = require('./package.json');
var logger = require('electron-log');
const fs = require('fs');
const path = require('path');
const http = require('http');
const axios = require('axios');
const isDev = require('electron-is-dev');

logger.transports.file.level = 'info';
logger.transports.file.maxSize = 1048576;
logger.transports.file.clear();
autoUpdater.logger = logger;

// Module to control application life.
const app = electron.app

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {

    autoUpdater.checkForUpdates();

    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1024, height: 768, webPreferences: {
            nodeIntegration: true
        },
        //toolbar: false,
        //skipTaskbar: true,
    })

    mainWindow.setMenu(null);

    mainWindow.maximize();

    // and load the index.html of the app.
    mainWindow.loadURL(isDev ? `http://localhost:3000` : `file://${__dirname}/build/index.html`)
    //mainWindow.loadURL(`http://localhost:3000`)

    // Open the DevTools.
    mainWindow.webContents.openDevTools()

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

let eventTab = [];

autoUpdater.on('checking-for-update', () => {
    logger.info('Checking for update...');
});

autoUpdater.on('update-available', (info) => {
    logger.info('Update available.');
    logger.info(JSON.stringify(info));

    eventTab = [
        { percent: 0, isSend: false },
        { percent: 25, isSend: false },
        { percent: 50, isSend: false },
        { percent: 75, isSend: false },
        { percent: 100, isSend: false },
    ];

    if (mainWindow != undefined) {
        mainWindow.webContents.send('update-available', info);
    }
});

autoUpdater.on('update-not-available', (ev, info) => {
    logger.info('Update not available.');
});

autoUpdater.on('error', (err) => {
    logger.info('Error in auto-updater.');
    logger.info(JSON.stringify(err));

    if (mainWindow != undefined) {
        mainWindow.webContents.send('update-error', err);
    }
});

autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    logger.info(log_message);

    if (mainWindow != undefined) {

        let val = parseInt(progressObj.percent.toString());

        eventTab.map((e, idx) => {
            if (val >= e.percent && e.isSend == false) {
                mainWindow.webContents.send('download-progress', progressObj);
                eventTab[idx].isSend = true;
            }
        });
    }
});

autoUpdater.on('update-downloaded', (info) => {
    logger.info('Update downloaded; will install in 30 seconds');
    logger.info(JSON.stringify(info));

    if (mainWindow != undefined) {
        mainWindow.webContents.send('update-downloaded', info);
        setTimeout(() => {
            mainWindow.webContents.send('update-quitForApply', info);
        }, 2000);
    }
});


async function _saveFile(p, filename, data) {
    if (fs.existsSync(p) == false) {
        fs.mkdirSync(p, { recursive: true });
    }

    if (fs.existsSync(p) == true) {
        fs.writeFileSync(path.resolve(p, filename.replace('\\', '_').replace('/', '_')), data);
    }

    return;
}

const requestListener = async function (req, res) {

    if (req.url.startsWith('/fetch/')) {
        let url = req.url.replace('/fetch/', '');
        try {
            let resp = await axios.get(url);
            res.writeHead(resp.status);
            if (typeof resp.data != 'string') {
                resp.data = JSON.stringify(resp.data);
            }
            res.write(resp.data);
            res.end();
        } catch (err) {
            res.writeHead(500);
            res.end();
        }
    } else if (req.url.startsWith('/getFilenameForSave')) {
        try {
            let resp = await electron.dialog.showSaveDialog(null, {
                title: "Save librarie file",
                defaultPath: "librarie",
                buttonLabel: "Save",

                filters: [
                    { name: 'lib', extensions: ['lib'] },
                ]
            });

            res.writeHead(200);
            res.write(JSON.stringify(resp));
            res.end();

        } catch (err) {
            res.writeHead(500);
            res.end();
        }
    } else if (req.url.startsWith('/writeFile')) {
        try {
            async function __waitBody() {
                return new Promise((resolve, reject) => {
                    let body = ''
                    req.on('data', function (data) {
                        body += data;
                    })
                    req.on('end', function () {

                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end('post received');
                        resolve(JSON.parse(body));
                    })
                });
            }

            let postData = await __waitBody();

            postData.filename = postData.filepath.replace(/^.*[\\\/]/, '');
            postData.filepath = postData.filepath.replace(postData.filename, '');
            await _saveFile(postData.filepath, postData.filename, postData.data);

            res.writeHead(200);
            res.end();

        } catch (err) {
            res.writeHead(500);
            res.end();
        }
    }
}

const server = http.createServer(requestListener);
server.listen(4000);