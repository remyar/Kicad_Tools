const axios = require('axios').default;

module.exports = async (url) => {
    return new Promise(async (resolve, reject) => {
        try {
            let resp = await axios.get(url);
           resolve(resp.data)
        } catch (err) {
            reject(err);
        }
    });
}