const { app, ipcMain } = require('electron');
const database = require('./database');

let mainWindow = undefined;
let isDev = !app.isPackaged;

module.exports = {

    setMainWindows: async (_mainWindow) => {
        mainWindow = _mainWindow;
    },
    start: async () => {
        try {
            await database.setdbPath(isDev ? "./assets/database.zip" : path.join(process.resourcesPath, "database.zip"));

            ipcMain.handle('OPEN_DEV_TOOLS', (event, value) => {
                if (value) {
                    mainWindow.webContents.openDevTools();
                } else {
                    mainWindow.webContents.closeDevTools();
                }
            });

            Object.keys(database).forEach((key) => {
                ipcMain.handle('database.' + key, async (event, value) => {
                    return (await database[key](value));
                });
            });

        } catch (err) {
            console.error(err);
        }
    }
}