import fetch from 'electron-fetch';

export default function post(url, data , config) {
    return new Promise(async (resolve, reject) => {
        try {

            let _c = {
                method: 'POST',
                body: data,
                cache: "no-cache",
                useElectronNet: false,
            };

            if ( config.headers ){
                _c.headers = config.headers;
            }
            const response = await fetch(url, _c);
            let r = await response.text();
            resolve(r);
        } catch (err) {
            reject(err);
        }
    });
}