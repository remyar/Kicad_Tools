const { app, ipcMain } = require('electron');
const myfetch = require('./fetch');

let mainWindow = undefined;

let isDev = !app.isPackaged;

module.exports = {

    setMainWindows: async (_mainWindow) => {
        mainWindow = _mainWindow;
    },
    start: async () => {
        try {
            ipcMain.handle('OPEN_DEV_TOOLS', (event, value) => {
                if (value) {
                    mainWindow.webContents.openDevTools();
                } else {
                    mainWindow.webContents.closeDevTools();
                }
            });

            Object.keys(myfetch).forEach((key) => {
                ipcMain.handle('fetch.' + key, async (event, value) => {
                    return (await myfetch[key](value));
                });
            });

        } catch (err) {
            console.error(err);
        }
    }
}