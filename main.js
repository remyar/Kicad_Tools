const electron = require('electron');
const { autoUpdater } = require("electron-updater");
var pjson = require('./package.json');
var logger = require('electron-log');
const fs = require('fs');
const path = require('path');
const http = require('http');
const isDev = require('electron-is-dev');
require('@electron/remote/main').initialize()


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
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
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

    require("@electron/remote/main").enable(mainWindow.webContents);
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

let eventTab = [
    { percent: 0, isSend: false },
    { percent: 25, isSend: false },
    { percent: 50, isSend: false },
    { percent: 75, isSend: false },
    { percent: 100, isSend: false },
];


let updateAvailable = undefined;
let progressObjAvailable = undefined;

autoUpdater.on('checking-for-update', () => {
    logger.info('Checking for update...');
});

autoUpdater.on('update-available', (info) => {
    logger.info('Update available.');
    logger.info(JSON.stringify(info));

    if (mainWindow != undefined) {
        mainWindow.webContents.send('update-available', info);
    }
    updateAvailable = { ...info };
});

autoUpdater.on('update-not-available', (ev, info) => {
    logger.info('Update not available.');

    updateAvailable = undefined;
    progressObjAvailable = undefined;

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

    progressObjAvailable = { ...progressObj };

    if (mainWindow != undefined) {

        let val = parseInt(progressObj.percent.toString());

        eventTab.map((e, idx) => {
            if (val >= e.percent && e.isSend == false) {
                //mainWindow.webContents.send('download-progress', progressObj);
                eventTab[idx].isSend = true;
            }
        });
    }
});

autoUpdater.on('update-downloaded', (info) => {
    logger.info('Update downloaded; will install in 30 seconds');
    logger.info(JSON.stringify(info));

    updateAvailable = undefined;
    progressObjAvailable = undefined;

    if (mainWindow != undefined) {
        mainWindow.webContents.send('update-downloaded', info);
        setTimeout(() => {
            mainWindow.webContents.send('update-quitForApply', info);
        }, 2000);
    }
});



/*
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

    async function __waitBody() {
        return new Promise((resolve, reject) => {
            let body = ''
            req.on('data', function (data) {
                body += data;
            })
            req.on('end', function () {
                //res.writeHead(200, { 'Content-Type': 'text/html' });
                //res.end('post received');
                resolve(JSON.parse(body));
            })
        });
    }

    if (req.url.startsWith('/update-progress')) {
        let resp = JSON.stringify(progressObjAvailable ? progressObjAvailable : {});
        res.writeHead(200);
        res.write(resp);
        res.end();
    } else if (req.url.startsWith('/update-available')) {
        let resp = JSON.stringify(updateAvailable?.version ? updateAvailable : {});
        res.writeHead(200);
        res.write(resp);
        res.end();
    } else if (req.url.startsWith('/fetch/')) {
        let url = req.url.replace('/fetch/', '');
        try {
            let resp = await axios.get(url, req.params);
            if (typeof resp.data != 'string') {
                resp.data = JSON.stringify(resp.data);
            }

            res.writeHead(resp.status);
            res.write(resp.data);
            res.end();
        } catch (err) {
            res.writeHead(500);
            res.end();
        }
    } else if (req.url.startsWith('/getFilenameForOpen')) {
        try {
            let postData = await __waitBody();
            let filters = [];
            for (let _ext of postData?.extensions) {
                filters.push({
                    name: _ext.replace('.', ''),
                    extensions: [_ext.replace('.', '')]
                })
            }

            let resp = await electron.dialog.showOpenDialog(mainWindow, {
                properties: ['openFile'], filters: filters
            });

            res.writeHead(200);
            res.write(JSON.stringify(resp));
            res.end();

        } catch (err) {
            res.writeHead(500);
            res.end();
        }
    } else if (req.url.startsWith('/getFilenameForSave')) {
        try {
            let postData = await __waitBody();
            let filters = [];
            for (let _ext of postData?.extensions) {
                filters.push({
                    name: _ext.replace('.', ''),
                    extensions: [_ext.replace('.', '')]
                })
            }

            let resp = await electron.dialog.showSaveDialog(mainWindow, {
                title: "Save librarie file",
                defaultPath: "librarie",
                buttonLabel: "Save",

                filters: filters
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
    } else if (req.url.startsWith('/readFile')) {
        try {

            let postData = await __waitBody();
            let data = "";
            if (postData) {
                data = fs.readFileSync(postData.filepath, "utf-8");
            }
            res.writeHead(200);
            res.write(JSON.stringify({ data: data }));
            res.end();

        } catch (err) {
            res.writeHead(500);
            res.end();
        }
    }
}

const server = http.createServer(requestListener);
server.listen(4000);
*/