import fs from 'fs';
import path from 'path';
import electron from 'electron';
import _ from "lodash";

const { app, ipcMain, shell } = electron;

export default class Store {
    constructor(config) {
        this.path = app.getPath('userData');
        this.filename = config?.name || "config";
        this.fileExtension = config?.extension || ".json";
        this.useEncryption = config?.encryption || false;
        this.fullPath = path.resolve(this.path, this.filename + this.fileExtension);
        this.fileObj = {};

        if (fs.existsSync(this.fullPath) == false) {
            fs.writeFileSync(this.fullPath, JSON.stringify({}), "utf-8");
        }

        try {
            let str = fs.readFileSync(this.fullPath , "utf-8");
            this.fileObj = JSON.parse(str);
        } catch (err) {
            this.fileObj = {};
        }

        ipcMain.handle('electron-store-get-data', async (event, key) => {
            return this.get(key);
        });

        ipcMain.handle('electron-store-set-data', async (event, key, value) => {
            return this.set(key, value);
        });
    }

    set(key, value) {
        _.set(this.fileObj, key, value);
        try {
            let str = JSON.stringify(this.fileObj);

            fs.writeFileSync(this.fullPath, str, 'utf8');
            console.log('File written successfully!');;
        } catch (err) {
            console.error('Error writing file:', err);
        }

        return this.fileObj;
    }

    get(key, defaultValue) {
        let result = _.get(this.fileObj, key);
        if (result == undefined) {
            result = defaultValue;
        }
        return result;
    }

    static async get(key, defaultValue) {
        try {
            const appData = await electron.ipcRenderer.invoke('electron-store-get-data', key);
            return appData == undefined ? defaultValue : appData;
        } catch (err) {
            return defaultValue;
        }
    }

    static async set(key, value) {
        try {
            await electron.ipcRenderer.invoke('electron-store-set-data', key, value);
            return value;
        } catch (err) {
            return value;
        }
    }
};