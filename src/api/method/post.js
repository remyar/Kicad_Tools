import fetch from 'electron-fetch';

export default function post(url, data, config) {
    return new Promise(async (resolve, reject) => {
        try {

            const response = await fetch(url, {
                ...config,
                headers : config?.headers,
                method: 'POST', 
                body: data, 
                useElectronNet: false,
            });
            let r = await response.text();
            resolve(r);
        } catch (err) {
            reject(err);
        }
    });
}