const fetch = require('electron-fetch').default;

async function get(options) {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await fetch(options.url, {
                method: 'GET',
                redirect: 'follow',
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0' }
            });
            if (response.status == 200) {
                let r = undefined;
                if (response.headers.get('content-type').includes("text/html")) {
                    r = await response.text();
                } else if (response.headers.get('content-type').includes("application/json")) {
                    r = await response.json();
                }
                resolve(r);
            } else if (response.status == 404) {
                resolve({ message: "Not found" });
            } else if (response.status == 204) {
                resolve({ message: "Unknow Vehicule" });
            } else if (response.status == 500) {
                resolve({ message: "Temporary unavailable" });
            } else {
                resolve({ message: "To many request" });
            }
        } catch (err) {
            resolve(err);
        }
    });
}

async function post(options) {
    return new Promise(async (resolve, reject) => {
        try {
            let headers = { ...options.headers, "Content-Type": "application/json" };
            let config = { ...options.config };

            let response = await fetch(options.url, {
                ...config,
                method: "POST",
                useElectronNet: false,
                credentials: "same-origin",
                body: JSON.stringify(options.data),
                headers: new Headers(headers)
            });

            console.log(response);

            if (response.status == 200) {
                let r = undefined;
                if (config && config.responseType && config.responseType == 'arraybuffer') {
                    r = await response.arrayBuffer();
                } else {
                    if (response.headers && response.headers.get('content-type').includes("text/html")) {
                        r = await response.text();
                    } else if (response.headers.get('content-type').includes("application/json")) {
                        r = await response.json();
                    } else {
                        r = await response.json();
                    }
                }
                resolve(r)
            } else if (response.status == 404) {
                resolve({ message: "Not found" });
            } else if (response.status == 204) {
                resolve({ message: "Unknow Vehicule" });
            } else if (response.status == 500) {
                resolve({ message: "Temporary unavailable" });
            } else {
                resolve({ message: "To many request" });
            }
        } catch (err) {
            resolve(err);
        }
    });
}

module.exports = {
    get,
    post
}