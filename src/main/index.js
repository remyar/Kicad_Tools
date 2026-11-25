import electron from 'electron';
import path from 'path';
import Store from './store';
import dotenv from 'dotenv';
import log from 'electron-log/main';
import api from './api';
import middleware from './middleware';
import _ from "lodash";

export default (() => {

    const app = electron.app
    const isDev = app.isPackaged == false;
    const envVar = isDev ? ".env" : path.resolve(__dirname, "..", "..", ".env");
    const store = new Store();

    dotenv.config({ path: envVar });

    log.initialize({ spyRendererConsole: true });
    log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] \t{text}';

    Object.assign(console, log.functions);

    app.commandLine.appendSwitch('disable-site-isolation-trials');

    // Module to create native browser window.
    const BrowserWindow = electron.BrowserWindow;

    // Keep a global reference of the window object, if you don't, the window will
    // be closed automatically when the JavaScript object is garbage collected.
    let mainWindow;
    let splash;

    async function createWindow() {
        // Create the browser window.
        mainWindow = new BrowserWindow({
            width: 1024,
            height: 768,
            show: false,
            webPreferences: {
                nodeIntegration: true,
                enableRemoteModule: true,
                contextIsolation: false,
                preload: path.resolve(__dirname, "..", "preload", 'index.js'),
            },
            //toolbar: false,
            //skipTaskbar: true,
        });

        splash = new BrowserWindow({ width: 400, height: 133, transparent: true, frame: false, alwaysOnTop: true, resizable: false });
        await splash.loadURL(isDev ? `http://localhost:5173/splash.html` : `file://${__dirname}/../../out/renderer/splash.html`);

        async function fadeOutSplash() {
            return new Promise((resolve) => {
                let opacity = 1
                const fade = setInterval(() => {
                    opacity -= 0.05
                    splash.setOpacity(opacity);
                    if (opacity <= 0) {
                        clearInterval(fade);
                        splash.hide();
                        resolve();
                    }
                }, 30);
            });
        }

        async function fadeInApp() {
            return new Promise((resolve) => {
                let opacity = 0;
                mainWindow.setOpacity(opacity);
                mainWindow.show();
                mainWindow.maximize();
                const fade = setInterval(() => {
                    opacity += 0.05
                    mainWindow.setOpacity(opacity);
                    if (opacity >= 1) {
                        clearInterval(fade);
                        resolve();
                    }
                }, 30);
            });
        }

        mainWindow.setMenu(null);

        // and load the index.html of the app.
        mainWindow.loadURL(isDev ? `http://localhost:5173` : `file://${__dirname}/../../out/renderer/index.html`);

        // Open the DevTools.
        // isDev && mainWindow.webContents.openDevTools();

        // Emitted when the window is closed.
        mainWindow.on('closed', function () {
            // Dereference the window object, usually you would store windows
            // in an array if your app supports multi windows, this is the time
            // when you should delete the corresponding element.
            mainWindow = null;
            splash.close();
        });

        require("@electron/remote/main").enable(mainWindow.webContents);

        function _LoadAPIFolder(_api, _path = "api") {
            Object.keys(_api).forEach((key) => {
                if (Object.keys(_api[key]).length > 0) {
                    _LoadAPIFolder(_api[key], _path + "." + key);
                } else {
                    electron.ipcMain.handle(_path + "." + key, async (event, value) => {
                        return await ((_.get({ api: api }, _path + "." + key))(value, mainWindow, middleware));
                    });
                }
            });
        }

        _LoadAPIFolder(api);

        electron.ipcMain.handle('application.started', async (event, value) => {
            await fadeOutSplash();
            await fadeInApp();
        });

        return isDev;
    }

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.on('ready', createWindow);

    // Quit when all windows are closed.
    app.on('window-all-closed', async function () {
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


})();